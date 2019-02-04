goog.provide('ga_profile_service');

goog.require('ga_geomutils_service');
goog.require('ga_maputils_service');
goog.require('ga_urlutils_service');
(function() {

  var module = angular.module('ga_profile_service', [
    'ga_urlutils_service',
    'pascalprecht.translate',
    'ga_geomutils_service',
    'ga_maputils_service'
  ]);

  module.filter('gaTimeFormat', function() {
    return function(minutes) {
      // if the float is not a number, we display a '-'
      if (!angular.isNumber(minutes) || !isFinite(minutes) || minutes < 0) {
        return '-';
      }
      var str = '', hours;
      if (minutes >= 60) {
        hours = Math.floor(minutes / 60);
        minutes = minutes - hours * 60;
      }
      if (hours) {
        str += hours + 'h';
      }
      if (!hours || (hours && minutes > 0)) {
        if (hours) {
          str += ' ';
        }
        str += minutes + 'min';
      }
      return str;
    }
  });

  module.provider('gaProfile', function() {
    var d3;
    var emptyData = [{alts: {}, dist: 0, domainDist: 0}];
    emptyData[0].alts['COMB'] = 0;

    // Utils functions
    var createArea = function(domain, height, elevationModel) {
      return d3.area().x(function(d) {
        return domain.X(d.domainDist);
      }).y0(height).y1(function(d) {
        return domain.Y(d.alts[elevationModel]);
      });
    };

    var createAxis = function(domain) {
      return {
        X: d3.axisBottom(domain.X),
        Y: d3.axisLeft(domain.Y).ticks(5)
      };
    };

    var getXYDomains = function(width, height, elevationModel, data) {
      var x = d3.scaleLinear().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);
      x.domain(d3.extent(data, function(d) {
        return d.domainDist || 0;
      }));
      var yMin = d3.min(data, function(d) {
        return d.alts[elevationModel];
      });
      var yMax = d3.max(data, function(d) {
        return d.alts[elevationModel];
      });
      var decile = (yMax - yMin) / 10;
      yMin = yMin - decile > 0 ? yMin - decile : 0;
      y.domain([yMin, yMax + decile]);
      return {
        X: x,
        Y: y
      };
    };

    this.$get = function($q, $http, $translate, $window,
        gaGlobalOptions, gaGeomUtils, gaMapUtils) {

      var d3LibUrl = this.d3libUrl;
      var profileUrl = this.profileUrl;

      var ProfileChart = function(options) {
        options = options || {};
        options.margin = options.margin || {};
        var marginHoriz = (options.margin.left + options.margin.right) || 0;
        var marginVert = (options.margin.top + options.margin.bottom) || 0;
        var elevationModel = options.elevationModel ||
            gaGlobalOptions.defaultElevationModel;
        var width = options.width - marginHoriz;
        var height = options.height - marginVert;

        // Cancel requests stuff
        var canceler;
        var cancel = function() {
          if (canceler !== undefined) {
            canceler.resolve();
            canceler = undefined;
          }
        };

        this.findMapCoordinates = function(searchDist) {
          var ratio = searchDist / this.data[this.data.length - 1].domainDist;
          if (ratio < 0) {
            ratio = 0;
          } else if (ratio > 1) {
            ratio = 1;
          }
          return gaMapUtils.transformBack(new ol.geom.Point(
              this.lineString.getCoordinateAt(ratio)
          )).getCoordinates();
        };

        this.formatData = function(data) {
          if (data.length) {
            var coords = [];
            var maxX = data[data.length - 1].dist;
            var denom = maxX >= 10000 ? 1000 : 1;
            this.unitX = maxX >= 10000 ? ' km' : ' m';
            $.map(data, function(val) {
              coords.push([val.easting, val.northing]);
              val.domainDist = val.dist / denom;
              val.alts[elevationModel] = val.alts[elevationModel] || 0;
              return val;
            });
            this.lineString = new ol.geom.LineString(coords);
          }
          return data;
        };

        // total elevation difference
        this.elevDiff = function() {
          if (this.data.length) {
            var max = this.data[this.data.length - 1].alts[elevationModel] || 0;
            var min = this.data[0].alts[elevationModel] || 0;
            return max - min;
          }
        };

        // total positive elevation & total negative elevation
        this.twoElevDiff = function() {
          if (this.data.length) {
            var sumDown = 0;
            var sumUp = 0;
            for (var i = 0; i < this.data.length - 1; i++) {
              var h1 = this.data[i].alts[elevationModel] || 0;
              var h2 = this.data[i + 1].alts[elevationModel] || 0;
              var dh = h2 - h1;
              if (dh < 0) {
                sumDown += dh;
              } else if (dh >= 0) {
                sumUp += dh;
              }
            }
            return [sumUp, Math.abs(sumDown)];
          }
        };

        // Sum of slope/surface distances (distance on the ground)
        this.slopeDistance = function() {
          if (this.data.length) {
            var sumSlopeDist = 0;
            for (var i = 0; i < this.data.length - 1; i++) {
              var h1 = this.data[i].alts[elevationModel] || 0;
              var h2 = this.data[i + 1].alts[elevationModel] || 0;
              var s1 = this.data[i].dist || 0;
              var s2 = this.data[i + 1].dist || 0;
              var dh = h2 - h1;
              var ds = s2 - s1;
              // Pythagorean theorem (hypotenuse: the slope/surface distance)
              sumSlopeDist += Math.sqrt(Math.pow(dh, 2) + Math.pow(ds, 2));
            }
            return sumSlopeDist;
          }
        };

        // Highest & lowest elevation points
        this.elPoints = function() {
          if (this.data.length) {
            var elArray = [];
            for (var i = 0; i < this.data.length; i++) {
              elArray.push(this.data[i].alts[elevationModel]);
            }
            var highPoi = d3.max(elArray) || 0;
            var lowPoi = d3.min(elArray) || 0;
            return [highPoi, lowPoi];
          }
        };

        // Distance
        this.distance = function() {
          if (this.data.length) {
            return this.data[this.data.length - 1].dist;
          }
        };

        // Hiking time
        // Official formula: http://www.wandern.ch/download.php?id=4574_62003b89
        // Reference link: http://www.wandern.ch
        // But we use a slightly modified version from schweizmobil
        this.hikingTime = function() {
          var wayTime = 0;

          // Constants of the formula (schweizmobil)
          var arrConstants = [
            14.271, 3.6991, 2.5922, -1.4384,
            0.32105, 0.81542, -0.090261, -0.20757,
            0.010192, 0.028588, -0.00057466, -0.0021842,
            1.5176e-5, 8.6894e-5, -1.3584e-7, -1.4026e-6
          ];

          if (this.data.length) {
            for (var i = 1; i < this.data.length; i++) {
              var data = this.data[i];
              var dataBefore = this.data[i - 1];

              // Distance betwen 2 points
              var distance = data.dist - dataBefore.dist;

              if (!distance) {
                continue;
              }

              // Difference of elevation between 2 points
              var elevDiff = data.alts[elevationModel] -
                  dataBefore.alts[elevationModel];

              // Slope value between the 2 points
              // 10ths (schweizmobil formula) instead of % (official formula)
              var s = (elevDiff * 10.0) / distance;

              // The swiss hiking formula is used between -25% and +25%
              // but schweiz mobil use -40% and +40%
              var minutesPerKilometer = 0;
              if (s > -4 && s < 4) {
                for (var j = 0; j < arrConstants.length; j++) {
                  minutesPerKilometer += arrConstants[j] * Math.pow(s, j);
                }
              // outside the -40% to +40% range, we use a linear formula
              } else if (s > 0) {
                minutesPerKilometer = (17 * s);
              } else {
                minutesPerKilometer = (-9 * s);
              }
              wayTime += distance * minutesPerKilometer / 1000;
            }
            return Math.round(wayTime);
          }
        };

        var coordinatesToString = function(coordinates) {
          var res = '[';
          for (var i = 0; i < coordinates.length; i++) {
            var coord = coordinates[i];
            if (i !== 0) {
              res += ',';
            }
            res += '[';
            res += coord[0].toFixed(1) + ',' + coord[1].toFixed(1);
            res += ']';
          }
          res += ']';
          return res;
        };

        this.get = function(feature) {
          var geom = (feature || new ol.Feature()).getGeometry();
          geom = gaGeomUtils.multiGeomToSingleGeom(geom);
          if (!feature || !geom ||
              (!(geom instanceof ol.geom.Polygon) &&
              !(geom instanceof ol.geom.LinearRing) &&
              !(geom instanceof ol.geom.LineString))) {
            var defer = $q.defer();
            defer.resolve(emptyData);
            return defer.promise;
          }
          // Avoid hudge request by simplifying the line string with Douglas
          // Peucker if there is more than 1000 coordinates.
          geom = gaGeomUtils.simplify(geom, 1000);
          var coordinates = gaMapUtils.transform(geom).getCoordinates();

          // TODO: manage all kind of geometry
          if (geom instanceof ol.geom.Polygon ||
              geom instanceof ol.geom.LinearRing) {
            coordinates = coordinates[0];
          }
          var wkt = '{"type":"LineString","coordinates":' +
                    coordinatesToString(coordinates) + '}';

          // cancel old request
          cancel();
          canceler = $q.defer();

          // We don't use FormData because it makes the validity of data
          // untestable. FormData is always an ampty object in tests.
          var data = $.param({
            geom: wkt,
            elevation_models: elevationModel,
            offset: 1
          });

          var config = {
            cache: true,
            timeout: canceler.promise,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          };

          return $http.post(profileUrl, data, config).then(function(resp) {
            // When all the geometry is outside switzerland
            if (!resp.data.length) {
              return emptyData;
            }
            return resp.data;
          }, function(response) {
            // If request is canceled, statuscode is 0 and we don't announce it
            if (response.status !== 0) {
              // Display an empty profile
              return emptyData;
            }
          });
        };

        this.create = function(data) {
          this.updateProperties(data);
          this.element = document.createElement('DIV');
          this.element.className = 'ga-profile-inner';
          this.domain = getXYDomains(width, height, elevationModel, this.data);
          var axis = createAxis(this.domain);

          this.svg = d3.select(this.element).append('svg').
              attr('width', width + marginHoriz).
              attr('height', height + marginVert).
              attr('class', 'ga-profile-svg');

          var group = this.svg.
              append('g').
              attr('class', 'ga-profile-group').
              attr('transform', 'translate(' + options.margin.left +
                  ', ' + options.margin.top + ')');

          var area = createArea(this.domain, height, elevationModel);

          group.append('g').
              attr('class', 'x axis').
              attr('transform', 'translate(0, ' + height + ')').
              call(axis.X);

          group.append('g').
              attr('class', 'y axis').
              call(axis.Y).
              append('text').
              attr('transform', 'rotate(-90)').
              attr('y', 6).
              attr('dy', '.71em').
              style('text-anchor', 'end');

          group.append('g').
              attr('class', 'ga-profile-grid-x').
              attr('transform', 'translate(0, ' + height + ')').
              call(axis.X.
                  tickSize(-height, 0, 0).
                  tickFormat('')
              );

          group.append('g').
              attr('class', 'ga-profile-grid-y').
              call(axis.Y.
                  tickSize(-width, 0, 0).
                  tickFormat('')
              );

          group.append('path').
              datum(this.data).
              attr('class', 'ga-profile-area').
              attr('d', area);

          this.group = group;

          group.append('text').
              attr('class', 'ga-profile-legend').
              attr('x', width - 118).
              attr('y', 11).
              attr('width', 100).
              attr('height', 30).
              text('swissALTI3D/DHM25');

          group.append('text').
              attr('class', 'ga-profile-label ga-profile-label-x').
              attr('x', width / 2).
              attr('y', height + options.margin.bottom - 5).
              style('text-anchor', 'middle').
              attr('font-size', '0.95em');

          group.append('text').
              attr('class', 'ga-profile-label ga-profile-label-y').
              attr('transform', 'rotate(-90)').
              attr('y', 0 - options.margin.left).
              attr('x', 0 - height / 2 - 30).
              attr('dy', '1em').
              attr('font-size', '0.95em');

          this.updateLabels();
        };

        this.updateLabels = function() {
          this.group.select('text.ga-profile-label-x').
              text($translate.instant(options.xLabel) + ' [' +
                  $translate.instant(this.unitX) + ']');
          this.group.select('text.ga-profile-label-y').
              text($translate.instant(options.yLabel) + ' [m]');
        };

        this.updateProperties = function(data) {
          this.data = this.formatData(data);
          // for the total elevation diff of the path
          this.diff = this.elevDiff();
          // for the total elevation up & total elevation down
          this.twoDiff = this.twoElevDiff();
          // for the highest and the lowest elevation points
          this.elPoi = this.elPoints();
          // for the distance
          this.dist = this.distance();
          // for the sum of the slope/surface distances
          this.slopeDist = this.slopeDistance();
          // for the hiking time
          this.hikTime = this.hikingTime();
        };

        this.update = function(data, size) {
          var transitionTime = 1500;
          if (size) {
            transitionTime = 250;
            width = size[0] - marginHoriz;
            height = size[1] - marginVert;
            this.svg.transition().duration(transitionTime).
                attr('width', width + marginHoriz).
                attr('height', height + marginVert).
                attr('class', 'ga-profile-svg');
            this.group.select('text.ga-profile-label-x').
                transition().duration(transitionTime).
                attr('x', width / 2).
                attr('y', height + options.margin.bottom - 5).
                style('text-anchor', 'middle');
            this.group.select('text.ga-profile-legend').
                transition().duration(transitionTime).
                attr('x', width - 118).
                attr('y', 11).
                text('swissALTI3D/DHM25');
          }
          if (data) {
            this.updateProperties(data);
          }

          this.domain = getXYDomains(width, height, elevationModel, this.data);
          var axis = createAxis(this.domain);
          var area = createArea(this.domain, height, elevationModel);

          this.group.select('.ga-profile-area').datum(this.data).
              transition().duration(transitionTime).
              attr('class', 'ga-profile-area').
              attr('d', area);
          this.group.select('g.x').
              transition().duration(transitionTime).
              call(axis.X);
          this.group.select('g.y').
              transition().duration(transitionTime).
              call(axis.Y);
          this.group.select('g.ga-profile-grid-x').
              transition().duration(transitionTime).
              call(axis.X.
                  tickSize(-height, 0, 0).
                  tickFormat('')
              );
          this.group.select('g.ga-profile-grid-y').
              transition().duration(transitionTime).
              call(axis.Y.
                  tickSize(-width, 0, 0).
                  tickFormat('')
              );
          this.updateLabels();
        };
      };

      // Lazy load of D3 library
      var onD3Loaded = function(feature, options) {
        d3 = $window.d3;
        var profile = new ProfileChart(options);
        return profile.get(feature).then(function(data) {
          if (d3 && data) {
            profile.create(data);
          }
          return profile;
        });
      };

      var Profile = function() {

        // Create a ProfileChart object
        this.create = function(feature, options) {
          if (!$window.d3) {
            var defer = $q.defer();
            $.getScript(d3LibUrl).then(function() {
              defer.resolve(onD3Loaded(feature, options));
            });
            return defer.promise;
          }
          return onD3Loaded(feature, options);
        };

        // Update a ProfileChart object
        this.update = function(profile, feature) {
          if (!profile || !feature) {
            var defer = $q.defer();
            defer.reject();
            return defer.promise;
          }
          return profile.get(feature).then(function(data) {
            profile.update(data);
            return profile;
          });
        };
      };

      return new Profile();
    };
  });
})();
