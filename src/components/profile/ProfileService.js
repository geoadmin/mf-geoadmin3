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
      if (!angular.isNumber(minutes) || !isFinite(minutes)) {
        return '-';
      }
      if (minutes >= 0) {
        if (minutes >= 60) {
          var hours = Math.floor(minutes / 60);
          minutes = minutes - hours * 60;
        }
        if (hours) {
          return hours + 'h ' + minutes + 'min';
        } else {
          return minutes + 'min';
        }
      } else {
        return '-';
      }
    }
  });

  module.provider('gaProfile', function() {
    var d3;

    // Utils functions
    var createArea = function(domain, height, elevationModel) {
      return d3.svg.area().x(function(d) {
        return domain.X(d.dist);
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

    var getXYDomains = function(x, y, elevationModel, data) {
      x.domain(d3.extent(data, function(d) {
        return d.dist || 0;
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

      function ProfileChart(options) {
        var marginHoriz = options.margin.left + options.margin.right;
        var marginVert = options.margin.top + options.margin.bottom;
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
          if (data.length != 0) {
            var maxX = data[data.length - 1].dist;
            var denom = maxX >= 10000 ? 1000 : 1;
            this.unitX = maxX >= 10000 ? ' km' : ' m';
            $.map(data, function(val) {
              val.dist = val.dist / denom;
              val.alts[elevationModel] = val.alts[elevationModel] || 0;
              return val;
            });
          }
          return data;
        };

        //total elevation difference
        this.elevDiff = function(data) {
          if (data.length != 0) {
            var maxElev = data[data.length - 1].alts[elevationModel] || 0;
            var minElev = data[0].alts[elevationModel] || 0;
            var diffel = maxElev - minElev;
            return diffel;
          }
        };

        //total positive elevation & total negative elevation
        this.twoElevDiff = function(data) {
          if (data.length != 0) {
            var sumDown = 0;
            var sumUp = 0;
            for (var i = 0; i < data.length - 1; i++) {
              var h1 = data[i].alts[elevationModel] || 0;
              var h2 = data[i + 1].alts[elevationModel] || 0;
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
        this.slopeDistance = function(data) {
          if (data.length != 0) {
            var sumSlopeDist = 0;
            for (var i = 0; i < data.length - 1; i++) {
              var h1 = data[i].alts[elevationModel] || 0;
              var h2 = data[i + 1].alts[elevationModel] || 0;
              var s1 = data[i].dist || 0;
              var s2 = data[i + 1].dist || 0;
              var dh = h2 - h1;
              var ds = s2 - s1;
              //Pythagorean theorem (hypotenuse: the slope/surface distance)
              sumSlopeDist += Math.sqrt(Math.pow(dh, 2) + Math.pow(ds, 2));
            }
            return sumSlopeDist;
          }
        };

        //Highest & lowest elevation points
        this.elPoints = function(data) {
          if (data.length != 0) {
            var elArray = [];
            for (var i = 0; i < data.length; i++) {
              elArray.push(data[i].alts[elevationModel]);
            }
            var highPoi = d3.max(elArray) || 0;
            var lowPoi = d3.min(elArray) || 0;
            return [highPoi, lowPoi];
          }
        };

        //Distance
        this.distance = function(data) {
          if (data.length != 0) {
            return data[data.length - 1].dist;
          }
        };

        //Hiking time
        //Official formula as agreed with the cantons
        //ASTRA wander.ch FALV CODE
        this.hikingTime = function(data) {
          var wayTime = 0;
          if (data.length != 0) {
            for (var i = 1; i < data.length; i++) {
              //for (data.length - 1) line segments the time is calculated
              //Horizontal distance (Projection) between two points
              var distance = (data[i].dist - data[i - 1].dist) || 0;
              if (distance != 0) {
                //Height difference between two points
                var dH = (data[i].alts[elevationModel] -
                    data[i - 1].alts[elevationModel]) || 0;

                //Constants of the formula
                var arrConstants = [
                  14.271, 0.36992, 0.025922, -0.0014384,
                  0.000032105, 8.1542e-06, -9.0261e-08, -2.0757e-08,
                  1.0192e-10, 2.8588e-11, -5.7466e-14, -2.1842e-14,
                  1.5176e-17, 8.6894e-18, -1.3584e-21, -1.4026e-21
                ];

                //Slope between two points
                var s = (dH * 100.0) / distance;

                //If we have a slope > 40%, the algorithm can't calculate it
                //So we force this value to 40% (the limit value) in order
                //to be able to calculate it
                //(seen with EPL the 18/03/2014 and 10/04/2014)
                if (s < -40) {
                  s = -40;
                } else if (s > 40) {
                  s = 40;
                }

                var minutesPerKilometer = 0.0;
                for (var j = 0; j <= 15; j++) {
                  minutesPerKilometer += arrConstants[j] * Math.pow(s, j);
                }
                wayTime += (distance * minutesPerKilometer / 1000);
              }
            }
          }
          return Math.round(wayTime);
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
            if (data.length == 0) {
              data = [{alts: {}, dist: 0}];
              data[0].alts[elevationModel] = 0;
            }
            return data;
          }, function(response) {
            // If request is canceled, statuscode is 0 and we don't announce
            // it
            if (response.status !== 0) {
              // Display an empty profile
              var data = [{alts: {}, dist: 0}];
              data[0].alts[elevationModel] = 0;
              return data;
            }
          });
        };

        this.create = function(data) {
          var that = this;
          var x = d3.scale.linear().range([0, width]);
          var y = d3.scale.linear().range([height, 0]);

          //for the total elevation diff of the path
          this.diff = this.elevDiff(data);
          //for the total elevation up & total elevation down
          var twoDiff = this.twoElevDiff(data);
          //for the highest and the lowest elevation points
          var elPoi = this.elPoints(data);
          //for the distance
          this.dist = this.distance(data);
          //for the sum of the slope/surface distances
          this.slopeDist = this.slopeDistance(data);
          //for the hiking time
          this.hikTime = this.hikingTime(data);

          this.data = this.formatData(data);

          this.domain = getXYDomains(x, y, elevationModel, that.data);
          var axis = createAxis(this.domain);
          var element = document.createElement('DIV');
          element.className = 'ga-profile-inner';

          this.svg = d3.select(element).append('svg')
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
              .datum(that.data)
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
              .attr('y', height + options.margin.bottom - 18)
              .style('text-anchor', 'middle')
              .attr('font-size', '0.95em')
              .text($translate.instant(options.xLabel) + ' [' +
                  $translate.instant(that.unitX) + ']');

          group.append('text')
              .attr('class', 'ga-profile-label ga-profile-label-y')
              .attr('transform', 'rotate(-90)')
              .attr('y', 0 - options.margin.left)
              .attr('x', 0 - height / 2 - 30)
              .attr('dy', '1em')
              .attr('font-size', '0.95em')
              .text($translate.instant(options.yLabel) + ' [m]');

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
              .style('text-anchor', 'start')
              .text(measureFilter(twoDiff[0],
                    'distance', 'm', 2, true));

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
              .style('text-anchor', 'start')
              .text(measureFilter(twoDiff[1], 'distance',
                    'm', 2, true));

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
              .style('text-anchor', 'start')
              .text(measureFilter(elPoi[0], 'distance',
                    'm', 2, true));

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
              .style('text-anchor', 'start')
              .text(measureFilter(elPoi[1], 'distance',
                    'm', 2, true));

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
              .style('text-anchor', 'start')
              .text(measureFilter(this.dist, 'distance',
                    ['km', 'm'], 2, true));

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
              .style('text-anchor', 'start')
              .text(measureFilter(this.slopeDist, 'distance',
                    ['km', 'm'], 2, true));

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
              .style('text-anchor', 'start')
              .text(gaTimeFormatFilter(this.hikTime));

          return element;
        };

        this.updateElevationLabels = function(name, number) {
          this.group.select(name)
              .text(measureFilter(number, 'distance', 'm', 2, true));
        };

        this.updateDistanceLabels = function(name, number) {
          this.group.select(name)
              .text(measureFilter(number, 'distance', ['km', 'm'], 2, true));
        };

        this.updateLabels = function() {
          var that = this;
          this.group.select('text.ga-profile-label-x')
              .text($translate.instant(options.xLabel) + ' [' +
                  $translate.instant(that.unitX) + ']');
          this.group.select('text.ga-profile-label-y')
              .text($translate.instant(options.yLabel) + ' [m]');

          this.updateElevationLabels('text.ga-profile-elevation-difference',
              this.diff);
          this.updateElevationLabels('text.ga-profile-elevation-up',
              this.twoDiff[0]);
          this.updateElevationLabels('text.ga-profile-elevation-down',
              this.twoDiff[1]);
          this.updateElevationLabels('text.ga-profile-poi-up',
              this.elPoi[0]);
          this.updateElevationLabels('text.ga-profile-poi-down',
              this.elPoi[1]);
          this.updateDistanceLabels('text.ga-profile-distance',
              this.dist);
          this.updateDistanceLabels('text.ga-profile-slopeDist',
              this.slopeDist);

          this.group.select('text.ga-profile-hikTime')
              .text(gaTimeFormatFilter(this.hikTime));
        };

        this.update = function(data, size) {
          var that = this;
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
          } else {
            this.diff = this.elevDiff(data);
            this.twoDiff = this.twoElevDiff(data);
            this.elPoi = this.elPoints(data);
            this.dist = this.distance(data);
            this.slopeDist = this.slopeDistance(data);
            this.hikTime = this.hikingTime(data);

            this.data = this.formatData(data);
          }
          var x = d3.scale.linear().range([0, width]);
          var y = d3.scale.linear().range([height, 0]);
          this.domain = getXYDomains(x, y, elevationModel, that.data);
          var axis = createAxis(this.domain);
          var area = createArea(this.domain, height, elevationModel);
          var path = this.group.select('.ga-profile-area');
          path.datum(that.data)
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
        };
      }
      return function(options) {
        var deferred = $q.defer();
        var profile = new ProfileChart(options);
        // Lazy load of D3 library
        var onD3Loaded = function() {
          d3 = $window.d3;
          deferred.resolve(new ProfileChart(options));
        };
        if (!$window.d3) {
          $.getScript(d3LibUrl).then(onD3Loaded);
        } else {
          onD3Loaded();
        }
        return deferred.promise;
      };
    };
  });
})();
