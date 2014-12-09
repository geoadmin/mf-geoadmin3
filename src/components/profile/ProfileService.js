(function() {
  goog.provide('ga_profile_service');

  var module = angular.module('ga_profile_service', [
    'pascalprecht.translate'
  ]);

  module.provider('gaProfileService', function() {

    this.$get = function($timeout, $translate, $window) {

      function ProfileChart(options, lazyLoadCB, d3LibUrl) {
        var marginHoriz = options.margin.left + options.margin.right;
        var marginVert = options.margin.top + options.margin.bottom;
        var elevationModel = options.elevationModel || 'DTM25';
        var width = options.width - marginHoriz;
        var height = options.height - marginVert;
        var d3, x, y;

        var onD3Loaded = function() {
          d3 = $window.d3;
          lazyLoadCB();
        };

        if (!$window.d3) {
          $.getScript(d3LibUrl, onD3Loaded);
        } else {
          $timeout(onD3Loaded, 0);
        }

        var createArea = function(domain) {
          var x = domain.X;
          var y = domain.Y;
          var area = d3.svg.area()
              .x(function(d) {
                return x(d.dist);
              })
              .y0(height)
              .y1(function(d) {
                return y(d.alts[elevationModel]);
              });
          return area;
        };

        var createAxis = function(domain) {
          var xAxis = d3.svg.axis()
              .scale(domain.X)
              .orient('bottom');
          var yAxis = d3.svg.axis()
              .scale(domain.Y)
              .orient('left');
          return {
            X: xAxis,
            Y: yAxis
          };
        };

        var getXYDomains = function(data) {
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

        this.create = function(data) {
          var that = this;

          x = d3.scale.linear().range([0, width]);
          y = d3.scale.linear().range([height, 0]);

          this.data = this.formatData(data);
          this.domain = getXYDomains(that.data);
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

          var area = createArea(this.domain);

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
            x = d3.scale.linear().range([0, width]);
            y = d3.scale.linear().range([height, 0]);
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
          this.domain = getXYDomains(that.data);
          var axis = createAxis(this.domain);
          var area = createArea(this.domain, 'cardinal');
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

      var d3LibUrl = this.d3libUrl;
      return function(options, lazyLoadCB) {
        return new ProfileChart(options, lazyLoadCB, d3LibUrl);
      };
    };
  });
})();
