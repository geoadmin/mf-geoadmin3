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

var HOSTNAME = 'http://map.geo.admin.ch';
var LANGUAGES = ['de', 'fr', 'it', 'rm', 'en'];

var getAllLanguageUrls = function(templates, pre, post) {
  var ret = [],
      prefix = pre || '',
      postfix = post || '';
  LANGUAGES.forEach(function(lan) {
    templates.forEach(function(template) {
      ret.push({url: template + prefix + 'lang=' + lan + postfix});
    });
  });
  return ret;
};

var getFullPath = function(name) {
  return 'src/' + name + '.xml';
};


//Creates a sitemap for the base URL (all languages)
var createBaseSM = function(origin) {
  try {
    var sitemap = sm.createSitemap({
      hostname: HOSTNAME,
      urls: getAllLanguageUrls(['/?'])
    });
    fs.writeFile(getFullPath(origin.name), sitemap.toString());
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
          urls: getAllLanguageUrls(topicPathTemplates, '&')
        });
        fs.writeFile(getFullPath(origin.name), sitemap.toString());
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

  toJson(request('http://api3.geo.admin.ch/rest/services/' + topic + '/MapServer/layersconfig'), function(err, json) {
    if (err) {
      console.log('Layers for topic ' + topic + ' could not be loaded. SKIPPED!');
      deferred.resolve(ret);
    } else {
      var ret = [];
      Object.keys(json).forEach(function(layer) {
        ret.push('/?topic=' + topic + '&layers=' + layer);
      });
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
            urls: getAllLanguageUrls(templates, '&')
          });
          fs.writeFile(getFullPath(origin.name), sitemap.toString());
          deferred.resolve({result: true, origin: origin});
        } catch(err) {
          deferred.resolve({result: false, origin: origin});
        }
      });
    }
  });
  
  return deferred.promise;
};

var smList = [
  { name: 'base', fn: createBaseSM },
  { name: 'topics', fn: createTopicsSM },
  { name: 'layers', fn: createLayersSM }
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
  var indexRoot = xml.element({ _attr: {xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'}});
  var xmlstream = xml({ sitemapindex: indexRoot}, { stream: true, indent: '  ', declaration: {encoding: 'UTF-8'}});
  var file = fs.createWriteStream(getFullPath('sitemap'));
  xmlstream.on('data', function (chunk) {
    file.write(chunk + '\n');
  });
  
  results.forEach(function(res) {
    if (res.value.result) {
      indexRoot.push({ sitemap: [{ loc: HOSTNAME + '/' + res.value.origin.name + '.xml'}] });
    } else {
      console.log('An Error occured during the creation of the ' +  res.value.origin.name + ' sitemap. ------> SKIPPED!');
    }
  });

  indexRoot.close();
  console.log('Creation done');
});

