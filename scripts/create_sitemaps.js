/*
 * NodeJS based script to automatically create
 * the sitemaps of map.geo.admin.ch
 */
var fs = require('fs'),
    toJson = require('stream-to-json');
    request = require('request'),
    Q = require('q'),
    xml = require('xml'),
    sm = require('sitemap');
    pg = require('pg');
    gzip = require('gzipme');

var HOSTNAME = 'http://map.geo.admin.ch';
var LANGUAGES = ['de', 'fr', 'it', 'rm', 'en'];

var getAllLanguageUrls = function(templates, prio, pre, post) {
  var ret = [],
      priority = prio || 0.5,
      prefix = pre || '',
      postfix = post || '';
  LANGUAGES.forEach(function(lan) {
    templates.forEach(function(template) {
      ret.push({url: template + prefix + 'lang=' + lan + postfix,
                priority: priority
               });
    });
  });
  return ret;
};

var getFullPath = function(name) {
  return 'src/sitemap_' + name + '.xml';
};


//Creates a sitemap for the base URL (all languages)
var createBaseSM = function(origin) {
  try {
    var sitemap = sm.createSitemap({
      hostname: HOSTNAME,
      urls: getAllLanguageUrls(['/?'], 1.0)
    });
    fs.writeFile(getFullPath(origin.name), (sitemap.toString() + '\n\n'));
  } catch(err) {
    return [Q.delay({result: false, origin: origin}, 0)];
  }
  return [Q.delay({result: true, origin: origin}, 0)];
};

//Creates a sitemap for all topics available at api3.geo.admin.ch (all languages)
var createTopicsSM = function(origin) {
  var deferred = Q.defer();
  toJson(request('http://api3.geo.admin.ch/rest/services'), function(err, json) {
    if (err) {
      deferred.resolve({result: false, origin: origin});
    } else {
      try {
        var topicPathTemplates = [];
        json.topics.forEach(function(topic) {
          topicPathTemplates.push('/?topic=' + topic.id);
        });
        
        var sitemap = sm.createSitemap({
          hostname: HOSTNAME,
          urls: getAllLanguageUrls(topicPathTemplates, 0.8, '&')
        });
        fs.writeFile(getFullPath(origin.name), sitemap.toString() + '\n\n');
        deferred.resolve({result: true, origin: origin});
      } catch(err) {
        deferred.resolve({result: false, origin: origin});
      }
    }
  });
  return [deferred.promise];
};

var getUrlPathsForLayers = function(topic) {
  var deferred = Q.defer(),
      ret = [];

  function visitTree(node, layerFn) {
    var i, len;
    if (node.category == 'layer') {
      layerFn(node);
    } else {
      if (node.children) {
        len = node.children.length;
        for (i = 0; i < len; ++i) {
          visitTree(node.children[i], layerFn);
        }
      }
    }
  }

  //we are using layers that are in the catalog
  toJson(request('http://api3.geo.admin.ch/rest/services/' + topic + '/CatalogServer'), function(err, json) {
    if (err) {
      console.log('Layers for topic ' + topic + ' could not be loaded. SKIPPED!');
      deferred.resolve(ret);
    } else {
      var ret = [];
      if (json.results && json.results.root) {
        visitTree(json.results.root, function(layer) {
          ret.push('/?topic=' + topic + '&layers=' + layer.layerBodId);
        });
      }
      deferred.resolve(ret);
    }
  });

  return deferred.promise;
};

//Creates a sitemap for topic 'ech' and all it's layers (all languages)
//One entry per layer
var createLayersSM = function(origin) {
  var deferred = Q.defer(),
      topicPromises = [];

  toJson(request('http://api3.geo.admin.ch/rest/services'), function(err, json) {
    if (err) {
      deferred.resolve({result: false, origin: origin});
    } else {
      json.topics.forEach(function(topic) {
        topicPromises.push(getUrlPathsForLayers(topic.id));
      });
        
      Q.allSettled(topicPromises).then(function(tPromises) {
        try {
          var templates = [];
          tPromises.forEach(function(tPro) {
            templates = templates.concat(tPro.value);
          });
          var sitemap = sm.createSitemap({
            hostname: HOSTNAME,
            urls: getAllLanguageUrls(templates, 0.6, '&')
          });
          fs.writeFile(getFullPath(origin.name), sitemap.toString() + '\n\n');
          deferred.resolve({result: true, origin: origin});
        } catch(err) {
          deferred.resolve({result: false, origin: origin});
        }
      });
    }
  });
  
  return deferred.promise;
};

//Creates sitemaps with all addresses
var createAddressesSM = function(origin) {
  var deferred = Q.defer();

  if (process.env.PGUSER == undefined ||
      process.env.PGPASS == undefined) {
    console.log('Error creating addresses: Please specify PGUSER and PGPASS as env variables');
    deferred.resolve();
    return deferred.promise;
  }
  var conString = 'postgres://' + process.env.PGUSER + ':' + process.env.PGPASS +
                  '@pgcluster0t.bgdi.admin.ch:5432/kogis';
  var client = new pg.Client(conString);
  //Max URLs per file: https://support.google.com/webmasters/answer/183668
  var RESULTS_PER_FILE = 50000;
  var QUERY_TEMPLATE = 'SELECT egid_edid, gkodx, gkody FROM bfs.adr ORDER BY id LIMIT ' +
                       RESULTS_PER_FILE + ' OFFSET {offset}';
  var query = QUERY_TEMPLATE;
  console.log('Creating address indices. This might take a while...');

  var exportSubset = function(offset, counter) {
    var def = Q.defer();
    query = QUERY_TEMPLATE.replace('{offset}', offset + '');
    client.query(query, function(err, result) {
      if(err) {
        console.error('Error running query', err, query);
        def.resolve({result: undefined});
        return;
      }
      var templates = [];
      result.rows.forEach(function(row) {
        templates.push({
          url: '/?ch.bfs.gebaeude_wohnungs_register=' + row.egid_edid +
               '&X=' + row.gkody + '&Y=' + row.gkodx + '&zoom=9',
          priority: 0.9
        });
      });

      var sitemap = sm.createSitemap({
        hostname: HOSTNAME,
        urls: templates
      });
      var fileName = getFullPath(origin.name + '_' + counter);
      fs.writeFileSync(fileName, sitemap.toString() + '\n\n');
      gzip(fileName, false, 'best');
      fs.unlink(fileName);

      def.resolve({result: result});
    });
    return def.promise;
  };

  client.connect(function(err) {
    if(err) {
      console.error('Could not connect to postgres to create address sitemaps)', err);
      deferred.resolve({result: false, origin: origin});
      return;
    }
    //First we get total available records
    client.query('SELECT COUNT(*) FROM bfs.adr', function(err, result) {
      if (err) {
        console.error('Could not count records to create address sitemaps)', err);
        deferred.resolve({result: false, origin: origin});
        client.end();
        return;
      }
      var COUNT = parseInt(result.rows[0].count, 10);
      var subPromises = [];
      var counter = 0;
      for (var i = 0; i <= COUNT; i += RESULTS_PER_FILE) {
        subPromises.push(exportSubset(i + '', counter));
        counter++;
      }

      Q.allSettled(subPromises).then(function(sProm) {
        var file = fs.createWriteStream(getFullPath(origin.name));
        var endMarker = '</sitemapindex>';
        file.on('open', function(fd) {
          var count = 0;
          var indexRoot = xml.element({ _attr: {xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'}});
          var xmlstream = xml({ sitemapindex: indexRoot}, { stream: true, indent: '  ', declaration: {encoding: 'UTF-8'}});
          xmlstream.on('data', function (chunk) {
            file.write(chunk + '\n');
            if (chunk == endMarker) {
              file.write('\n');
            }
          });
          sProm.forEach(function(prom) {
            if (prom.value.result !== undefined) {
              indexRoot.push({ sitemap: [{ loc: HOSTNAME + '/sitemap_' + origin.name + '_' + count + '.xml.gz'}] });
              count += 1;
            } else {
              console.log('promise returned false');
            }
          });
          client.end();
          indexRoot.close();
          deferred.resolve({result: true, origin: origin});
        });
      });
    });
  });

  return deferred.promise;
};

var smList = [
  { name: 'base', fn: createBaseSM },
  { name: 'topics', fn: createTopicsSM },
  { name: 'layers', fn: createLayersSM },
  { name: 'addresses', fn: createAddressesSM }
];

var indexPromises = [];

//Create all defined sitemaps
smList.forEach(function(sm) {
  indexPromises = indexPromises.concat(sm.fn(sm));
});

//Create the index based on the created sitemaps
Q.allSettled(indexPromises)
.then(function(results) {
  //Create index sitemap
  var file = fs.createWriteStream(getFullPath('index'));
  var endMarker = '</sitemapindex>';
  file.on('open', function(fd) {
    var indexRoot = xml.element({ _attr: {xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'}});
    var xmlstream = xml({ sitemapindex: indexRoot}, { stream: true, indent: '  ', declaration: {encoding: 'UTF-8'}});
    xmlstream.on('data', function (chunk) {
      file.write(chunk + '\n');
      if (chunk == endMarker) {
        file.write('\n');
      }
    });

    results.forEach(function(res) {
      if (res.value.result) {
        indexRoot.push({ sitemap: [{ loc: HOSTNAME + '/sitemap_' + res.value.origin.name + '.xml'}] });
      } else {
        console.log('An Error occured during the creation of the ' +  res.value.origin.name + ' sitemap. ------> SKIPPED!');
      }
    });

    indexRoot.close();
    console.log('Creation done');
  });
});

