(function() {
  goog.provide('ga_profile_service');

  goog.require('ga_urlutils_service');

  var module = angular.module('ga_profile_service', [
    'ga_urlutils_service',
    'pascalprecht.translate'
  ]);

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
        Y: d3.svg.axis().scale(domain.Y).orient('left')
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

    this.$get = function($q, $http, $timeout, $translate, $window, gaUrlUtils,
                         gaBrowserSniffer) {

      var d3LibUrl = this.d3libUrl;
      var profileUrl = this.profileUrl;
      var isIE = gaBrowserSniffer.msie ? true : false;

      function ProfileChart(options) {
        var marginHoriz = options.margin.left + options.margin.right;
        var marginVert = options.margin.top + options.margin.bottom;
        var elevationModel = options.elevationModel || 'DTM25';
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
            this.unitX = maxX >= 10000 ? 'km' : 'm';
            $.map(data, function(val) {
              val.dist = val.dist / denom;
              val.alts[elevationModel] = val.alts[elevationModel] || 0;
              return val;
            });
          }
          return data;
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

        this.get = function(feature, callback) {
          var coordinates = feature.getGeometry().getCoordinates();
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

          $http(params).success(callback)
            .error(function(data, status) {
              // If request is canceled, statuscode is 0 and we don't announce
              // it
              if (status !== 0) {
                // Display an empty profile
                callback([{alts: {COMB: 0}, dist: 0}], status);
              }
            });
        };

        this.create = function(data) {
          var that = this;
          var x = d3.scale.linear().range([0, width]);
          var y = d3.scale.linear().range([height, 0]);

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
              .attr('x', width - 113)
              .attr('y', 11)
              .attr('width', 100)
              .attr('height', 30)
              .text('swissALTI3D/DHM25');

          group.append('text')
              .attr('class', 'ga-profile-label ga-profile-label-x')
              .attr('x', width / 2)
              .attr('y', height + options.margin.bottom - 2)
              .style('text-anchor', 'middle')
              .text($translate.instant(options.xLabel) + ' [' +
                  $translate.instant(that.unitX) + ']');

          group.append('text')
              .attr('class', 'ga-profile-label ga-profile-label-y')
              .attr('transform', 'rotate(-90)')
              .attr('y', 0 - options.margin.left)
              .attr('x', 0 - height / 2 - 20)
              .attr('dy', '1em')
              .text($translate.instant(options.yLabel) + ' [m]');

           return element;
        };

        this.updateLabels = function() {
          var that = this;
          this.group.select('text.ga-profile-label-x')
              .text($translate.instant(options.xLabel) + ' [' +
                  $translate.instant(that.unitX) + ']');
          this.group.select('text.ga-profile-label-y')
              .text($translate.instant(options.yLabel) + ' [m]');
        };

        this.update = function(data, size) {
          var that = this;
          var transitionTime = 1500;
          if (size) {
            transitionTime = 250;
            width = size[0] - marginHoriz;
            height = size[1] - marginVert;
            this.svg.transition().duration(transitionTime)
              .attr('width', width + marginHoriz + 0)
              .attr('height', height + marginVert)
              .attr('class', 'ga-profile-svg');
            this.group.select('text.ga-profile-label-x')
              .transition().duration(transitionTime)
                .attr('x', width / 2)
                .attr('y', height + options.margin.bottom - 2)
                .style('text-anchor', 'middle');
            this.group.select('text.ga-profile-legend')
              .transition().duration(transitionTime)
                .attr('x', width - 113)
                .attr('y', 11)
                .text('swissALTI3D/DHM25');
          } else {
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
      return function(options, lazyLoadCB) {
        // Lazy load of D3 library
        var onD3Loaded = function() {
          d3 = $window.d3;
          lazyLoadCB();
        };
        if (!$window.d3) {
          $.getScript(d3LibUrl, onD3Loaded);
        } else {
          $timeout(onD3Loaded, 0);
        }
        return new ProfileChart(options);
      };
    };
  });
})();
