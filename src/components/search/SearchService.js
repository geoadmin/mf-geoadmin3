goog.provide('ga_search_service');

goog.require('ga_reframe_service');
(function() {

  var module = angular.module('ga_search_service', [
    'ga_reframe_service'
  ]);

  // Match MGRS coordinates
  var MGRS = '^[0123456]?[0-9][\\sa-z]{3}[\\s\\d]*';

  // Match metric coordinates
  // ex: 720000 90000 (LV03)
  //     2600000 1200000 (LV95)
  //     900000 5800000 (UTM, Webmercator)
  var coordinate = '([\\d .\']{5,})([\\t ,./]+)([\\d .,\']{5,})'

  var regexpCoordinate = new RegExp(coordinate);
  var regexMGRS = new RegExp(MGRS, 'gi');

  // Grid zone designation for Switzerland + two 100km letters + two digits
  // It's a limitiation of proj4 and a sensible default (precision is 10km)
  var MGRSMinimalPrecision = 7;

  var roundCoordinates = function(coords) {
    return [
      Math.round(coords[0] * 1000) / 1000,
      Math.round(coords[1] * 1000) / 1000
    ];
  };

  var sanitizeCoordinate = function(str) {
    return parseFloat(str.replace(/[ \s' ]/g, ''));
  }

  /* Assume use want's to be in Switzerland */
  var isSwiss = function(c, b) {
    if (c == null) return c;
    var minx = b[0], miny = b[1], maxx = b[2], maxy = b[3];
    var x = c[0], y = c[1];
    if (x >= minx && x <= maxx && y >= miny && y <= maxy) {
      return [y, x]
    } else if (y >= minx && y <= maxx && x >= miny && x <= maxy) {
      return [x, y]
    } else {
      return c
    }
  }

  var isGeographic = function(coord) {
    var lat = coord[0];
    var lng = coord[1];
    if ((lat >= -90) && (lat <= 90) &&
        (lng >= -180) && (lng <= 180)) {
      return true;
    } else {
      return false;
    }
  }

  /* Functions pair, search and swapdims are slightly adapted from the
   * `mapbox@sexagesimal` module  */

  function search(x, dims, r) {
    if (!dims) dims = 'NOSEW';
    if (typeof x !== 'string') return { val: null, regex: r };
    // eslint-disable-next-line
    const regex = /[\s\,\/]*([NOSEW])?\s*([\-|\—|\―]?[0-9.]+)\s*[°|º]?\s*(?:([0-9.]+)['’′‘′]\s*)?(?:([0-9.]+)(?:''|″|"|″|”|″|′′)\s*)?([NOSEW])?/gi;

    r = r || regex;

    var m = r.exec(x);
    if (!m) return { val: null, regex: r };
    var dim = m[1] || m[5];
    if (dim && dims.indexOf(dim) === -1) return { val: null, regex: r };
    if (m[2] && parseFloat(m[2] > 180.0)) return { val: null, regex: r };

    return {
      val:
        ((m[2] ? parseFloat(m[2]) : 0) +
          (m[3] ? parseFloat(m[3]) / 60 : 0) +
          (m[4] ? parseFloat(m[4]) / 3600 : 0)) *
        (dim === 'S' || dim === 'W' || dim === 'O' ? -1 : 1),
      regex: r,
      raw: m[0],
      dim: dim
    };
  }

  function pair(y, dims) {
    var coord;
    var x = y.trim();
    var one = search(x, dims);
    if (one.val === null) return null;
    var two = search(x, dims, one.regex);
    if (two.val === null) return null;
    // null if one/two are not contiguous.
    // if (one.raw + two.raw !== y) return null;
    if ((one.raw + two.raw).length - y.length > 1) return null;
    if (one.dim) {
      coord = swapdim(one.val, two.val, one.dim);
    } else {
      coord = [one.val, two.val];
    }
    if (isGeographic(coord)) {
      return coord
    }
  }

  function swapdim(a, b, dim) {
    if (dim === 'N' || dim === 'S') return [a, b];
    if (dim === 'W' || dim === 'E' || dim === 'O') return [b, a];
  }

  module.provider('gaSearchGetCoordinate', function() {
    this.$get = function($window, $q, gaReframe, gaGlobalOptions) {

      // extent is the ol.View extent, where lat/long coordinates
      // are valid. swissExtent is the area where LV03/LV95 are also
      // valid.
      // With Web Mercator these both extent may be quite different
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
        // Parse Degrees Minutes Seconds
        coord = pair(query);
        var swissExtentWgs84 = ol.proj.transformExtent(
            gaGlobalOptions.swissExtent,
            gaGlobalOptions.defaultEpsg, 'EPSG:4326');
        coord = isSwiss(coord, swissExtentWgs84);
        if (coord) {

          position = ol.proj.transform([coord[1], coord[0]],
              'EPSG:4326', gaGlobalOptions.defaultEpsg);
          if (ol.extent.containsCoordinate(extent, position)) {
            return $q.when(roundCoordinates(position));
          }
        }

        // Coordinates in meters are assumed to be swiss coordinates
        // We won't use coordinates in EPSG:3857
        var match = query.match(regexpCoordinate);
        // Matches new school entries like '2 600 000 1 200 000'
        // and old school entries like '600 000 200 000'
        if (match && match.length === 4) {
          left = sanitizeCoordinate(match[1]);
          right = sanitizeCoordinate(match[3]);
          position = [
            left > right ? left : right,
            right < left ? right : left
          ];

          var pos95 = ol.proj.transform(position, 'EPSG:2056',
              gaGlobalOptions.defaultEpsg);
          // Match LV95
          if (ol.extent.containsCoordinate(gaGlobalOptions.swissExtent,
              pos95)) {
            return $q.when(roundCoordinates(pos95));
          }

          var pos03 = ol.proj.transform(position, 'EPSG:21781',
              gaGlobalOptions.defaultEpsg);
          // Match LV03 coordinates
          if (ol.extent.containsCoordinate(gaGlobalOptions.swissExtent,
              pos03)) {
            return $q.when(roundCoordinates(pos03));
          }
        }
        return $q.when();
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
