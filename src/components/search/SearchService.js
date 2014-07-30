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
    '([\\d\\.\']+)[\\s,]+([\\d\\.\']+)');

  module.provider('gaGetCoordinate', function() {
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

  module.provider('gaSwisssearch', function() {
    this.$get = function($timeout, $rootScope) {

      var PermalinkSearch = function() {
        var active = false,
            hitCount = 0,
            totalResults = 0,
            clickEl = undefined,
            singleResult = false,
            maxRounds = 0;

       this.activate = function(numberOfResults) {
          active = true;
          hitCount = 0;
          totalResults = 0;
          clickEl = undefined;
          maxRounds = numberOfResults;
          $rootScope.$broadcast('gaSwisssearchActivated');
        };

        this.feed = function(el) {
          if (!active) {
            return;
          }
          el = el.find('.tt-suggestion');
          totalResults += el.length;
          if (el.length > 0) {
            clickEl = el[0];
          }
        };

        this.check = function() {
          if (active) {
            hitCount += 1;
            if (hitCount >= maxRounds) {
              active = false;
              if (totalResults == 1 &&
                  clickEl) {
                singleResult = true;
                clickEl.click();
              }
              $rootScope.$broadcast('gaSwisssearchDone');
            }
          }
        };

        this.singleResult = function() {
          return singleResult;
        };

      };

      return new PermalinkSearch();
    };
  });

})();

