goog.provide('ga_search_service');

goog.require('ga_reframe_service');
(function() {

  var module = angular.module('ga_search_service', [
    'ga_reframe_service'
  ]);

  var DDDegree = '([\\d.,]{2,})[°\\sNSWEO]*[ ,/]+([\\d.,]{3,})[\\s°NSWEO]*';
  var DMDegree = '([\\d]{1,2})[°\\s]*([\\d.,]+)[\\s\',NSEWO/]*';

  var DMSDegree = '\\b[0-9]{1,2}\\s*[°|º]\\s*';
  var DMSMinute = '[0-9]{1,2}\\s*[\'|′]';
  var DMSSecond = '(?:[0-9]+(?:\\.[0-9]*)?|\\.' +
    '[0-9]+)("|\'\'|′′|″)';
  var DMSQuadrant = '[NOSWE]?';

  var MGRS = '^3[123][\\sa-z]{3}[\\s\\d]*';

  var regexpDDegree = new RegExp(DDDegree, 'i');
  var regexpDMDegree = new RegExp(DMDegree + DMDegree, 'i');

  var regexpDMS = new RegExp(DMSDegree +
    '(' + DMSMinute + ')?\\s*' +
    '(' + DMSSecond + ')?\\s*' +
    DMSQuadrant, 'gi');
  var regexpDMSDegree = new RegExp(DMSDegree, 'g');

  var regexpCoordinate = new RegExp(
      '([\\d .\']{6,})([\\t ,./]+)([\\d .,\'/]{6,})'
  );
  var regexMGRS = new RegExp(MGRS, 'gi');
  // Grid zone designation for Switzerland + two 100km letters + two digits
  // It's a limitiation of proj4 and a sensible default (precision is 10km)
  var MGRSMinimalPrecision = 7;

  var roundCoordinates = function(coords) {
    return [Math.round(coords[0] * 1000) / 1000,
      Math.round(coords[1] * 1000) / 1000];
  };

  var sanitizeCoordinate = function(str) {
    return parseFloat(str.replace(/[ \t' ]/g, ''));
  }
  // For EPSG 2056, 21781, 3857 and 4326, in CH always northing > eastings
  var sortCoordinates = function(left, right) {
    var northing, easting;
    try {
      left = parseFloat(left);
      right = parseFloat(right);
    } catch (e) {
      return [0, 0];
    }
    if (left > right) {
      northing = left;
      easting = right;
    } else {
      northing = right;
      easting = left;
    }
    return [easting, northing];
  }

  var parseDMS = function(stringDMS) {
    var coord = null;
    try {
      coord = parseFloat(stringDMS.
          match(regexpDMSDegree)[0].
          replace(/[°º]/g, ''));
      var minutes = stringDMS.match(DMSMinute) ?
        stringDMS.match(DMSMinute)[0] : '0';
      coord = coord +
          parseFloat(minutes.replace(/['′]/g, '')) / 60;
      var seconds =
         stringDMS.match(DMSSecond) ?
           stringDMS.match(DMSSecond)[0] : '0';
      coord = coord + parseFloat(seconds.replace(/["'″′]/g, '')) / 3600;

      return coord;
    } catch (e) {
      return coord
    }
  }

  module.provider('gaSearchGetCoordinate', function() {
    this.$get = function($window, $q, gaReframe, gaGlobalOptions) {

      return function(extent, query) {
        var position, coord;
        var left, right;

        // Parse MGRS notation
        var matchMGRS = query.match(regexMGRS);
        if (matchMGRS && matchMGRS.length === 1) {
          var mgrsStr = matchMGRS[0].split(' ').join('');
          if ((mgrsStr.length - MGRSMinimalPrecision) % 2 === 0) {
            var wgs84 = $window.proj4.mgrs.toPoint(mgrsStr);
            position = ol.proj.transform(wgs84, 'EPSG:4326',
                gaGlobalOptions.defaultEpsg);
            if (ol.extent.containsCoordinate(extent, position)) {
              return $q.when(roundCoordinates(position));
            }
          }
        }

        var matchDMS = query.match(regexpDMS);
        // Should match most character in query, if not,
        // try another rule (e.g. DM or DD)
        if (matchDMS && matchDMS.length === 2 &&
           (query.length * 0.7) <=
           (matchDMS[0].length + matchDMS[1].length)) {

          left = parseDMS(matchDMS[0]);
          right = parseDMS(matchDMS[1]);
          if ((right != null) && (left != null)) {
            coord = sortCoordinates(left, right);
            position = ol.proj.transform(coord,
                'EPSG:4326', gaGlobalOptions.defaultEpsg);
            if (ol.extent.containsCoordinate(extent, position)) {
              return $q.when(roundCoordinates(position));
            }
          }
        }

        // Parse degree EPSG:4326 notation
        var matchDDegree = query.match(regexpDDegree);
        if (matchDDegree && matchDDegree.length === 3) {
          // we only care about coordinates in Switzerland
          left = parseFloat(matchDDegree[1]);
          right = parseFloat(matchDDegree[2]);

          coord = sortCoordinates(left, right);
          position = ol.proj.transform(coord,
              'EPSG:4326', gaGlobalOptions.defaultEpsg);
          if (ol.extent.containsCoordinate(extent, position)) {
            return $q.when(roundCoordinates(position));
          }
        }

        var matchDMDegree = query.match(regexpDMDegree);
        if (matchDMDegree && matchDMDegree.length === 5) {
          left = parseInt(matchDMDegree[1]) +
              parseFloat(matchDMDegree[2]) / 60.0;
          right = parseInt(matchDMDegree[3]) +
              parseFloat(matchDMDegree[4]) / 60.0;
          coord = sortCoordinates(left, right);
          position = ol.proj.transform(coord,
              'EPSG:4326', gaGlobalOptions.defaultEpsg);
          if (ol.extent.containsCoordinate(extent, position)) {
            return $q.when(roundCoordinates(position));
          }
        }

        var match = query.match(regexpCoordinate);
        // Matches new school entries like '2 600 000 1 200 000'
        // and old school entries like '600 000 200 000'
        if (match && match.length === 4) {
          left = sanitizeCoordinate(match[1]);
          right = sanitizeCoordinate(match[3]);
          position = [left > right ? left : right,
            right < left ? right : left];
          // Match LV95
          if (ol.extent.containsCoordinate(extent, position)) {
            return $q.when(roundCoordinates(position));
          }
          // Match decimal notation EPSG:4326
          if (left <= 180 && left >= -180 &&
              right <= 180 && right >= -180) {
            position = [left > right ? right : left,
              right < left ? left : right
            ];
            position = ol.proj.transform(position, 'EPSG:4326',
                gaGlobalOptions.defaultEpsg);
            if (ol.extent.containsCoordinate(extent, position)) {
              return $q.when(roundCoordinates(position));
            }
          }

          // Match LV03 coordinates
          return gaReframe.get03To95(position).then(function(position) {
            if (ol.extent.containsCoordinate(extent, position)) {
              return roundCoordinates(position);
            }
          });
        }
        return $q.when(undefined);
      };
    };
  });

  module.provider('gaSearchLabels', function() {

    var preHighlight = '<span class="ga-search-highlight">';
    var postHighlight = '</span>';
    var ignoreTags = ['<b>', '</b>', preHighlight, postHighlight];

    var escapeRegExp = function(str) {
      return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
    };

    var getIndicesToIgnore = function(strIn) {
      var ignoreIndices = [];
      for (var i = 0; i < ignoreTags.length; i++) {
        var tag = ignoreTags[i];
        var regex = new RegExp(escapeRegExp(tag), 'gi');
        var result;
        while ((result = regex.exec(strIn))) {
          ignoreIndices.push([result.index, result.index + tag.length]);
        }
      }
      return ignoreIndices;
    };

    var ignore = function(indices, start, end) {
      for (var i = 0; i < indices.length; i++) {
        var ind = indices[i];
        if ((start >= ind[0] && start < ind[1]) ||
            (end > ind[0] && end <= ind[1])) {
          return true;
        }
      }
      return false;
    };

    var highlightWord = function(strIn, word) {
      if (!word.length) {
        return strIn;
      }
      var ignoreIndices = getIndicesToIgnore(strIn);
      var splits = strIn.split(new RegExp(escapeRegExp(word), 'gi'));
      var res = '';
      var i = 0;
      var olen = 0;
      var wlen = word.length;
      for (; i < splits.length - 1; i++) {
        res += splits[i];
        olen += splits[i].length;
        var skip = ignore(ignoreIndices, olen, olen + wlen);
        if (!skip) {
          res += preHighlight;
        }
        res += strIn.substring(olen, olen + wlen);
        if (!skip) {
          res += postHighlight;
        }
        olen += wlen;
      }
      res += splits[i];
      return res;
    };

    this.$get = function() {
      return {
        highlight: function(str, wordstring) {
          var words = wordstring.split(' ');
          var res = str;
          angular.forEach(words, function(w) {
            res = highlightWord(res, w);
          });
          return res;
        },
        cleanLabel: function(str) {
          return str.replace(/(<b>|<\/b>|<i>|<\/i>)/gi, '');
        }
      };
    };
  });

  module.provider('gaSearchTokenAnalyser', function() {

    var tokenlist = ['limit', 'origins'];
    var regs = {};

    for (var i = 0; i < tokenlist.length; i++) {
      var tk = tokenlist[i];
      regs[tk] = {
        tk: tk,
        list: new RegExp('(^ *' + tk + ': *\\w+|\\s+' + tk + ': *\\w+)', 'i'),
        value: new RegExp(tk + ': *(\\w+)', 'i')
      };
    }

    var apply = function(input, regs) {
      var res = regs.list.exec(input.query);
      if (res && res.length) {
        var value = regs.value.exec(res[0]);
        if (value && value.length >= 2) {
          input.parameters.push(regs.tk + '=' + value[1]);
        }
        // Strip token and value from query
        input.query = input.query.replace(res[0], '');
      }
    };

    this.$get = function() {

      return {
        run: function(q) {
          var res = {
            query: q,
            parameters: []
          };
          for (var reg in regs) {
            apply(res, regs[reg]);
          }
          return res;
        }
      };
    };
  });
})();
