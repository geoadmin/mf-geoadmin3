(function() {
  goog.provide('ga_search_service');

  var module = angular.module('ga_search_service', [
  ]);

  var DMSDegree = '[0-9]{1,2}[°|º]\\s*';
  var DMSMinute = '[0-9]{1,2}[\'|′]';
  var DMSSecond = '(?:\\b[0-9]+(?:\\.[0-9]*)?|\\.' +
    '[0-9]+\\b)("|\'\'|′′|″)';
  var DMSNorth = '[N]';
  var DMSEast = '[E]';
  var regexpDMSN = new RegExp(DMSDegree +
    '(' + DMSMinute + ')?\\s*' +
    '(' + DMSSecond + ')?\\s*' +
    DMSNorth, 'g');
  var regexpDMSE = new RegExp(DMSDegree +
    '(' + DMSMinute + ')?\\s*' +
    '(' + DMSSecond + ')?\\s*' +
    DMSEast, 'g');
  var regexpDMSDegree = new RegExp(DMSDegree, 'g');
  var regexpCoordinate = new RegExp(
    '([\\d\\.\']+)[\\s,]+([\\d\\.\']+)' +
    '([\\s,]+([\\d\\.\']+)[\\s,]+([\\d\\.\']+))?');

  module.provider('gaSearchGetCoordinate', function() {
    this.$get = function() {
      return function(extent, query) {
        var position;
        var valid = false;

        var matchDMSN = query.match(regexpDMSN);
        var matchDMSE = query.match(regexpDMSE);
        if (matchDMSN && matchDMSN.length == 1 &&
            matchDMSE && matchDMSE.length == 1) {
          var northing = parseFloat(matchDMSN[0].
            match(regexpDMSDegree)[0].
            replace('°' , '').replace('º' , ''));
          var easting = parseFloat(matchDMSE[0].
            match(regexpDMSDegree)[0].
            replace('°' , '').replace('º' , ''));
          var minuteN = matchDMSN[0].match(DMSMinute) ?
            matchDMSN[0].match(DMSMinute)[0] : '0';
          northing = northing +
            parseFloat(minuteN.replace('\'' , '').
              replace('′' , '')) / 60;
          var minuteE = matchDMSE[0].match(DMSMinute) ?
            matchDMSE[0].match(DMSMinute)[0] : '0';
          easting = easting +
            parseFloat(minuteE.replace('\'' , '').
              replace('′' , '')) / 60;
          var secondN =
            matchDMSN[0].match(DMSSecond) ?
            matchDMSN[0].match(DMSSecond)[0] : '0';
          northing = northing + parseFloat(secondN.replace('"' , '')
            .replace('\'\'' , '').replace('′′' , '')
            .replace('″' , '')) / 3600;
          var secondE = matchDMSE[0].match(DMSSecond) ?
            matchDMSE[0].match(DMSSecond)[0] : '0';
          easting = easting + parseFloat(secondE.replace('"' , '')
            .replace('\'\'' , '').replace('′′' , '')
            .replace('″' , '')) / 3600;
          position = ol.proj.transform([easting, northing],
                'EPSG:4326', 'EPSG:21781');
          if (ol.extent.containsCoordinate(
            extent, position)) {
              valid = true;
          }
        }

        var match = query.match(regexpCoordinate);
        if (match && !valid) {
          var left = parseFloat(match[1].replace('\'', ''));
          var right = parseFloat(match[2].replace('\'', ''));
          //Old school entries like '600 000 200 000'
          if (match[3] != null) {
            left = parseFloat(match[1].replace('\'', '') +
                              match[2].replace('\'', ''));
            right = parseFloat(match[4].replace('\'', '') +
                               match[5].replace('\'', ''));
          }

          var position =
            [left > right ? left : right,
              right < left ? right : left];
          if (ol.extent.containsCoordinate(
              extent, position)) {
            valid = true;
          } else {
            position = ol.proj.transform(position,
              'EPSG:2056', 'EPSG:21781');
            if (ol.extent.containsCoordinate(
                extent, position)) {
              valid = true;
            } else {
              position =
                [left < right ? left : right,
                  right > left ? right : left];
              position = ol.proj.transform(position,
                'EPSG:4326', 'EPSG:21781');
              if (ol.extent.containsCoordinate(
                extent, position)) {
                valid = true;
              }
            }
          }
        }
        return valid ?
          [Math.round(position[0] * 1000) / 1000,
          Math.round(position[1] * 1000) / 1000] : undefined;
      };
    };
  });

  module.provider('gaSearchLabels', function() {

    var preHighlight = '<span class="ga-search-highlight">';
    var postHighlight = '</span>';
    var ignoreTags = ['<b>', '</b>', preHighlight, postHighlight];

    var escapeRegExp = function(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    };

    var getIndicesToIgnore = function(strIn) {
      var ignoreIndices = [];
      for (var i = 0; i < ignoreTags.length; i++) {
        var tag = ignoreTags[i];
        var regex = new RegExp(escapeRegExp(tag), 'gi');
        var result;
        while (result = regex.exec(strIn)) {
          ignoreIndices.push([result.index, result.index + tag.length]);
        }
      }
      return ignoreIndices;
    };

    var ignore = function(indices, start, end) {
      for (var i = 0; i < indices.length; i++) {
        var ind = indices[i];
        if ((start >= ind[0] && start <= ind[1]) ||
            (end >= ind[0] && end <= ind[1])) {
          return true;
        }
      }
      return false;
    };

    var highlightWord = function(strIn, word) {
      if (!(!!word.length)) {
        return strIn;
      }
      var ignoreIndices = getIndicesToIgnore(strIn);
      var splits = strIn.split(new RegExp(escapeRegExp(word), 'gi'));
      var res = '';
      var i = 0;
      var olen = 0;
      var wlen = word.length;
      var skip = false;
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
          return str.replace(/(<b>|<\/b>)/gi, '');
        }
      };
    };
  });



})();

