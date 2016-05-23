goog.provide('ga_measure_filter');

(function() {

  var module = angular.module('ga_measure_filter', []);

  module.filter('measure', function() {

    // Transform 12.00 to 12
    var cleanAfterComma = function(measure) {
      if (parseInt(measure) == measure) {
          measure = parseInt(measure);
      }
      return measure;
    };

    return function(floatInMeter, type, units, precision, thousandSeparator) {
      // if the float is not a number, we display a '-'
      if (!angular.isNumber(floatInMeter) || !isFinite(floatInMeter)) {
        return '-';
      }

      // In the case we pass only one unit value, we can pass it as a String
      if (angular.isString(units)) {
        units = [units];
      }
      // Type could be: volume, area or distance
      var factor = 1000;
      floatInMeter = floatInMeter || 0;
      var measure = floatInMeter.toFixed(precision || 2);

      switch (type) {
        case 'volume': units = units || [' km&sup3', ' m&sup3'];
                       factor = Math.pow(factor, 3);
                       break;
        case 'area': units = units || [' km&sup2', ' m&sup2'];
                     factor = Math.pow(factor, 2);
                     break;
        case 'angle': units = units || ['&deg'];
                      break;
        case 'distance':
        default: units = units || [' km', ' m'];
                 break;
      }

      // Having only one unit means we don't want to transform the measure.
      if (units.length == 1) {
        if (thousandSeparator) {
        // Number formatting: we add 1000 indicator (eg. 20'000)
          var minus = '';
          if (measure < 0) {
            measure = Math.abs(measure);
            minus = '-';
          }
          if (measure >= factor) {
            var km = parseInt(measure / factor);
            var m = Math.round(measure - km * factor);
            var sep; //the separator
            if (m >= 100) {
              sep = '\'';
            } else if (m >= 10) {
              sep = '\'0';
            } else if (m >= 0) {
              sep = '\'00';
            }
            return minus + km + sep + m + units[0];
          } else {
            return minus + measure + units[0];
          }
        } else {
          return cleanAfterComma(measure) + units[0];
        }
      }

      var km = Math.floor(measure / factor);
      if (km <= 0) {
        return cleanAfterComma(measure) + units[1];
      }
      var str = '' + km;
      var m = Math.floor(Math.floor(measure) % factor * 100 / factor);

      if (m > 0) {
        str += '.';
        if (m < 10) {
          str += '0';
        }
        str += m;
      }
      str += units[0];
      return str;
    };
  });
})();
