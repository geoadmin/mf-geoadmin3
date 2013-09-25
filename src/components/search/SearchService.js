(function() {
  goog.provide('ga_search_service');

  var module = angular.module('ga_search_service', [
  ]);

  var DMS_Degree = '[0-9]{1,2}[°|º]\\s*';
  var DMS_Minute = '[0-9]{1,2}[\'|′]';
  var DMS_Second = '(?:\\b[0-9]+(?:\\.[0-9]*)?|\\.' +
    '[0-9]+\\b)("|\'\'|′′|″)';
  var DMS_North = '[N]';
  var DMS_East = '[E]';
  var regexpDMS_N = new RegExp(DMS_Degree +
    '(' + DMS_Minute + ')?\\s*' +
    '(' + DMS_Second + ')?\\s*' +
    DMS_North, 'g');
  var regexpDMS_E = new RegExp(DMS_Degree +
    '(' + DMS_Minute + ')?\\s*' +
    '(' + DMS_Second + ')?\\s*' +
    DMS_East, 'g');
  var regexpDMS_Degree = new RegExp(DMS_Degree, 'g');
  var regexpCoordinate = new RegExp(
    '([\\d\\.\']+)[\\s,]+([\\d\\.\']+)');

  module.provider('gaGetCoordinate', function() {
    this.$get = function() {
      return function(extent, query) {
        var position;
        var valid = false;

        var matchDMS_N = query.match(regexpDMS_N);
        var matchDMS_E = query.match(regexpDMS_E);
        if (matchDMS_N && matchDMS_N.length == 1 &&
            matchDMS_E && matchDMS_E.length == 1) {
          var northing = parseFloat(matchDMS_N[0].
            match(regexpDMS_Degree)[0].
            replace('°' , '').replace('º' , ''));
          var easting = parseFloat(matchDMS_E[0].
            match(regexpDMS_Degree)[0].
            replace('°' , '').replace('º' , ''));
          var minuteN = matchDMS_N[0].match(DMS_Minute) ?
            matchDMS_N[0].match(DMS_Minute)[0] : '0';
          northing = northing +
            parseFloat(minuteN.replace('\'' , '').
              replace('′' , '')) / 60;
          var minuteE = matchDMS_E[0].match(DMS_Minute) ?
            matchDMS_E[0].match(DMS_Minute)[0] : '0';
          easting = easting +
            parseFloat(minuteE.replace('\'' , '').
              replace('′' , '')) / 60;
          var secondN =
            matchDMS_N[0].match(DMS_Second) ?
            matchDMS_N[0].match(DMS_Second)[0] : '0';
          northing = northing + parseFloat(secondN.replace('"' , '')
            .replace('\'\'' , '').replace('′′' , '')
            .replace('″' , '')) / 3600;
          var secondE = matchDMS_E[0].match(DMS_Second) ?
            matchDMS_E[0].match(DMS_Second)[0] : '0';
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

        var match =
          query.match(regexpCoordinate);
        if (match && !valid) {
          var left = parseFloat(match[1].replace('\'', ''));
          var right = parseFloat(match[2].replace('\'', ''));
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
})();

