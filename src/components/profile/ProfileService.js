goog.provide('ga_profile_service');

goog.require('ga_urlutils_service');
(function() {

  var module = angular.module('ga_profile_service', [
    'ga_urlutils_service',
    'pascalprecht.translate'
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
      return d3.svg.area().x(function(d) {
        return domain.X(d.domainDist);
      }).y0(height).y1(function(d) {
        return domain.Y(d.alts[elevationModel]);
      });
    };

    var createAxis = function(domain) {
      return {
        X: d3.svg.axis().scale(domain.X).orient('bottom'),
        Y: d3.svg.axis().scale(domain.Y).ticks(5).orient('left')
      };
    };

    var getXYDomains = function(width, height, elevationModel, data) {
      var x = d3.scale.linear().range([0, width]);
      var y = d3.scale.linear().range([height, 0]);
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

    this.$get = function($q, $http, $timeout, $translate, measureFilter,
        gaTimeFormatFilter, $window, gaUrlUtils, gaBrowserSniffer,
        gaGlobalOptions) {

      var d3LibUrl = this.d3libUrl;
      var profileUrl = this.profileUrl;
      var isIE = gaBrowserSniffer.msie ? true : false;

      var elevationFilter = function(number) {
        return measureFilter(number, 'distance', 'm', 2, true);
      };

      var distanceFilter = function(number) {
        return measureFilter(number, 'distance', ['km', 'm'], 2, true);
      };

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
          var currentIdx, previousIdx, currentDist;
          var i = 0;
          var j = this.data.length - 1;
          while (i < j) {
            currentIdx = (i + j) / 2 | 0;
            currentDist = this.data[currentIdx].dist;
            if (currentDist < searchDist) {
              i = currentIdx + 1;
            } else if (currentDist > searchDist) {
              j = currentIdx - 1;
            } else {
              return [this.data[currentIdx].easting,
                  this.data[currentIdx].northing];
            }
          }
          return [this.data[currentIdx].easting,
              this.data[currentIdx].northing];
        };

        this.formatData = function(data) {
          if (data.length) {
            var maxX = data[data.length - 1].dist;
            var denom = maxX >= 10000 ? 1000 : 1;
            this.unitX = maxX >= 10000 ? ' km' : ' m';
            $.map(data, function(val) {
              val.domainDist = val.dist / denom;
              val.alts[elevationModel] = val.alts[elevationModel] || 0;
              return val;
            });
          }
          return data;
        };

        //total elevation difference
        this.elevDiff = function() {
          if (this.data.length) {
            var max = this.data[this.data.length - 1].alts[elevationModel] || 0;
            var min = this.data[0].alts[elevationModel] || 0;
            return max - min;
          }
        };

        //total positive elevation & total negative elevation
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

        //Sum of slope/surface distances (distance on the ground)
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
              //Pythagorean theorem (hypotenuse: the slope/surface distance)
              sumSlopeDist += Math.sqrt(Math.pow(dh, 2) + Math.pow(ds, 2));
            }
            return sumSlopeDist;
          }
        };

        //Highest & lowest elevation points
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

        //Distance
        this.distance = function() {
          if (this.data.length) {
            return this.data[this.data.length - 1].dist;
          }
        };

        //Hiking time
        //Official formula: http://www.wandern.ch/download.php?id=4574_62003b89
        //Reference link: http://www.wandern.ch
        this.hikingTime = function() {
          var wayTime = 0;
          if (this.data.length) {
            for (var i = 1; i < this.data.length; i++) {
              //for (data.length - 1) line segments the time is calculated
              var distance = (this.data[i].dist - this.data[i - 1].dist) || 0;
              if (distance != 0) {
                var dH = (this.data[i].alts[elevationModel] -
                    this.data[i - 1].alts[elevationModel]) || 0;

                //Constants of the formula
                var arrConstants = [
                  14.271, 3.6992, 2.5922, -1.4384,
                   0.32105, 0.81542, -0.090261, -0.20757,
                   0.010192, 0.028588, -0.00057466, -0.0021842,
                   1.5176e-5, 8.6894e-5, -1.3584e-7, 1.4026e-6
                ];

                //10ths instead of %
                var s = (dH * 10.0) / distance;

                //The swiss hiking formula is used between -25% and +25%
                //(used to be -40% to +40%, which leads to a strange behaviour)
                if (s > -2.5 && s < 2.5) {
                  var minutesPerKilometer = 0.0;
                  for (var j = 0; j < 15; j++) {
                    minutesPerKilometer += arrConstants[j] * Math.pow(s, j);
                  }
                } else {
                  //outside the -25% to +25% range, we use a linear formula
                  if (s > 0) {
                    minutesPerKilometer = (17 * s);
                  } else {
                    minutesPerKilometer = (-9 * s);
                  }
                }
              }
              wayTime += (distance * minutesPerKilometer / 1000);
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
          if (!feature || !feature.getGeometry()) {
            var defer = $q.defer();
            defer.resolve(emptyData);
            return defer.promise;
          }
          var coordinates = feature.getGeometry().getCoordinates();

          // TODO: manage all kind of geometry
          if (feature.getGeometry() instanceof ol.geom.Polygon ||
              feature.getGeometry() instanceof ol.geom.LinearRing) {
            coordinates = coordinates[0];
          }
          var wkt = '{"type":"LineString","coordinates":' +
                    coordinatesToString(coordinates) + '}';

          //cancel old request
          cancel();
          canceler = $q.defer();

          var formData;
          if (!isIE || gaBrowserSniffer.msie > 9) {
            formData = new FormData();
            formData.append('geom', wkt);
            formData.append('elevation_models', elevationModel);
          } else {
            formData = {
              geom: wkt,
              elevation_models: elevationModel
            };
            formData = $.param(formData);
          }

          var params = {
            method: 'POST',
            url: profileUrl,
            data: formData,
            cache: true,
            timeout: canceler.promise
          };

          if (!isIE || gaBrowserSniffer.msie > 9) {
            params.transformRequest = angular.identity;
            params.headers = {'Content-Type': undefined};
          } else {
            params.headers = {'Content-Type':
                'application/x-www-form-urlencoded'};
          }

          return $http(params).then(function(response) {
            var data = response.data;
            // When all the geometry is outside switzerland
            if (!data.length) {
              data = emptyData;
            }
            return data;
          }, function(response) {
            // If request is canceled, statuscode is 0 and we don't announce
            // it
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

          this.svg = d3.select(this.element).append('svg')
              .attr('width', width + marginHoriz)
              .attr('height', height + marginVert)
              .attr('class', 'ga-profile-svg');

          var group = this.svg
            .append('g')
              .attr('class', 'ga-profile-group')
              .attr('transform', 'translate(' + options.margin.left +
                  ', ' + options.margin.top + ')');

          var area = createArea(this.domain, height, elevationModel);

          group.append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0, ' + height + ')')
              .call(axis.X);

          group.append('g')
              .attr('class', 'y axis')
              .call(axis.Y)
            .append('text')
              .attr('transform', 'rotate(-90)')
              .attr('y', 6)
              .attr('dy', '.71em')
              .style('text-anchor', 'end');

          group.append('g')
              .attr('class', 'ga-profile-grid-x')
              .attr('transform', 'translate(0, ' + height + ')')
              .call(axis.X
                  .tickSize(-height, 0, 0)
                  .tickFormat('')
              );

          group.append('g')
              .attr('class', 'ga-profile-grid-y')
              .call(axis.Y
                  .tickSize(-width, 0, 0)
                  .tickFormat('')
              );

          group.append('path')
              .datum(this.data)
              .attr('class', 'ga-profile-area')
              .attr('d', area);

          this.group = group;

          group.append('text')
              .attr('class', 'ga-profile-legend')
              .attr('x', width - 118)
              .attr('y', 11)
              .attr('width', 100)
              .attr('height', 30)
              .text('swissALTI3D/DHM25');

          group.append('text')
              .attr('class', 'ga-profile-label ga-profile-label-x')
              .attr('x', width / 2)
              .attr('y', height + options.margin.bottom - 16)
              .style('text-anchor', 'middle')
              .attr('font-size', '0.95em');

          group.append('text')
              .attr('class', 'ga-profile-label ga-profile-label-y')
              .attr('transform', 'rotate(-90)')
              .attr('y', 0 - options.margin.left)
              .attr('x', 0 - height / 2 - 30)
              .attr('dy', '1em')
              .attr('font-size', '0.95em');

          //For having one pixel space below the elevation labels
          var elevLabelY = height + options.margin.bottom - 1;

          //Total Elevation Difference
          // Using Unicode for the icons inside a normal text element
          // by setting the font-family to 'FontAwesome'
          // http://fortawesome.github.io/Font-Awesome/3.2.1/cheatsheet/
          //Icon for total elevation diff
          group.append('text')
              .attr('class', 'ga-profile-icon')
              .attr('x', 0)
              .attr('y', elevLabelY)
              .attr('text-anchor', 'start')
              .text(' \uf218 ');

          //Number for total elevation diff
          group.append('text')
              .attr('class', 'ga-profile-elevation-difference')
              .attr('font-size', '0.9em')
              .attr('x', 12)
              .attr('y', elevLabelY)
              .style('text-anchor', 'start')
              .text(measureFilter(this.diff,
                    'distance', 'm', 2, true));

          //Icon for elevation up
          group.append('text')
              .attr('class', 'ga-profile-icon-updown')
              .attr('x', 80)
              .attr('y', elevLabelY + 4)
              .attr('text-anchor', 'start')
              .text(' \uf213 ');

          //Number for elevation Up
          group.append('text')
              .attr('class', 'ga-profile-elevation-up')
              .attr('font-size', '0.9em')
              .attr('x', 102)
              .attr('y', elevLabelY)
              .style('text-anchor', 'start');

          //Icon for elevation down
          group.append('text')
              .attr('class', 'ga-profile-icon-updown')
              .attr('x', 160)
              .attr('y', elevLabelY + 4)
              .attr('text-anchor', 'start')
              .text(' \uf212 ');

          //Number for elevation Down
          group.append('text')
              .attr('class', 'ga-profile-elevation-down')
              .attr('font-size', '0.9em')
              .attr('x', 182)
              .attr('y', elevLabelY)
              .style('text-anchor', 'start');

          //Icon for the highest point
          group.append('text')
              .attr('class', 'ga-profile-icon')
              .attr('x', 240)
              .attr('y', elevLabelY)
              .attr('text-anchor', 'start')
              .text(' \uf217');

          //Number for highest point
          group.append('text')
              .attr('class', 'ga-profile-poi-up')
              .attr('font-size', '0.9em')
              .attr('x', 258)
              .attr('y', elevLabelY)
              .style('text-anchor', 'start');

          //Icon for the lowest point
          group.append('text')
              .attr('class', 'ga-profile-icon')
              .attr('x', 320)
              .attr('y', elevLabelY)
              .attr('text-anchor', 'start')
              .text(' \uf214');

          //Number for the lowest point
          group.append('text')
              .attr('class', 'ga-profile-poi-down')
              .attr('font-size', '0.9em')
              .attr('x', 338)
              .attr('y', elevLabelY)
              .style('text-anchor', 'start');

          //Icon for the distance
          group.append('text')
              .attr('class', 'ga-profile-dist')
              .attr('x', 400)
              .attr('y', elevLabelY + 2)
              .attr('text-anchor', 'start')
              .text(' \uf22e');

          group.append('text')
              .attr('class', 'ga-profile-dist')
              .attr('x', 415)
              .attr('y', elevLabelY + 2)
              .attr('text-anchor', 'start')
              .text(' \uf220');

          //Number for the distance
          group.append('text')
              .attr('class', 'ga-profile-distance')
              .attr('font-size', '0.9em')
              .attr('x', 430)
              .attr('y', elevLabelY)
              .style('text-anchor', 'start');

          //Icons for the sum of the slope/surface distances
          group.append('text')
              .attr('class', 'ga-profile-dist')
              .attr('x', 490)
              .attr('y', elevLabelY + 2)
              .attr('text-anchor', 'start')
              .text(' \uf220');

          //Number for the sum of the slope/surface distances
          group.append('text')
              .attr('class', 'ga-profile-slopeDist')
              .attr('font-size', '0.9em')
              .attr('x', 505)
              .attr('y', elevLabelY)
              .style('text-anchor', 'start');

          //Icon for the hiking time
          group.append('text')
              .attr('class', 'ga-profile-icon')
              .attr('x', 570)
              .attr('y', elevLabelY + 1)
              .attr('text-anchor', 'start')
              .text(' \uf219');

          //Number for the hiking time
          group.append('text')
              .attr('class', 'ga-profile-hikTime')
              .attr('font-size', '0.9em')
              .attr('x', 585)
              .attr('y', elevLabelY)
              .style('text-anchor', 'start');

          this.updateLabels();
        };

        this.updateLabels = function() {
          this.group.select('text.ga-profile-label-x')
              .text($translate.instant(options.xLabel) + ' [' +
                  $translate.instant(this.unitX) + ']');
          this.group.select('text.ga-profile-label-y')
              .text($translate.instant(options.yLabel) + ' [m]');

          this.group.select('text.ga-profile-elevation-difference')
              .text(elevationFilter(this.diff));
          this.group.select('text.ga-profile-elevation-up')
              .text(elevationFilter(this.twoDiff[0]));
          this.group.select('text.ga-profile-elevation-down')
              .text(elevationFilter(this.twoDiff[1]));
          this.group.select('text.ga-profile-poi-up')
              .text(elevationFilter(this.elPoi[0]));
          this.group.select('text.ga-profile-poi-down')
              .text(elevationFilter(this.elPoi[1]));
          this.group.select('text.ga-profile-distance')
              .text(distanceFilter(this.dist));
          this.group.select('text.ga-profile-slopeDist')
              .text(distanceFilter(this.slopeDist));

          this.group.select('text.ga-profile-hikTime')
              .text(gaTimeFormatFilter(this.hikTime));
        };

        this.updateProperties = function(data) {
          this.data = this.formatData(data);
          //for the total elevation diff of the path
          this.diff = this.elevDiff();
          //for the total elevation up & total elevation down
          this.twoDiff = this.twoElevDiff();
          //for the highest and the lowest elevation points
          this.elPoi = this.elPoints();
          //for the distance
          this.dist = this.distance();
          //for the sum of the slope/surface distances
          this.slopeDist = this.slopeDistance();
          //for the hiking time
          this.hikTime = this.hikingTime();
        };

        this.update = function(data, size) {
          var transitionTime = 1500;
          if (size) {
            transitionTime = 250;
            width = size[0] - marginHoriz;
            height = size[1] - marginVert;
            this.svg.transition().duration(transitionTime)
              .attr('width', width + marginHoriz)
              .attr('height', height + marginVert)
              .attr('class', 'ga-profile-svg');
            this.group.select('text.ga-profile-label-x')
              .transition().duration(transitionTime)
                .attr('x', width / 2)
                .attr('y', height + options.margin.bottom - 18)
                .style('text-anchor', 'middle');
            this.group.select('text.ga-profile-legend')
              .transition().duration(transitionTime)
                .attr('x', width - 118)
                .attr('y', 11)
                .text('swissALTI3D/DHM25');
          }
          if (data) {
            this.updateProperties(data);
          }

          this.domain = getXYDomains(width, height, elevationModel, this.data);
          var axis = createAxis(this.domain);
          var area = createArea(this.domain, height, elevationModel);

          this.group.select('.ga-profile-area').datum(this.data)
            .transition().duration(transitionTime)
              .attr('class', 'ga-profile-area')
              .attr('d', area);
          this.group.select('g.x')
            .transition().duration(transitionTime)
              .call(axis.X);
          this.group.select('g.y')
            .transition().duration(transitionTime)
              .call(axis.Y);
          this.group.select('g.ga-profile-grid-x')
            .transition().duration(transitionTime)
              .call(axis.X
                  .tickSize(-height, 0, 0)
                  .tickFormat('')
              );
          this.group.select('g.ga-profile-grid-y')
            .transition().duration(transitionTime)
              .call(axis.Y
                  .tickSize(-width, 0, 0)
                  .tickFormat('')
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
