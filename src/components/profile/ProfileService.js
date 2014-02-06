(function() {
  goog.provide('ga_profile_service');

  goog.require('ga_draggable_directive');

  var module = angular.module('ga_profile_service', [
    'ga_draggable_directive',
    'ga_popup'
  ]);

  module.provider('gaProfileService', function() {

    function ProfileChart($timeout, options, lazyLoadCB) {
      var marginHoriz = options.margin.left + options.margin.right;
      var marginVert = options.margin.top + options.margin.bottom;
      var elevationModel = options.elevationModel || 'DTM25';
      var width = options.width - marginHoriz;
      var height = options.height - marginVert;
      var versionPath = options.version || '';
      var d3, x, y;

      var onD3Loaded = function() {
        d3 = window.d3;
        x = d3.scale.linear().range([0, width]);
        y = d3.scale.linear().range([height, 0]);
        lazyLoadCB();
      };

      if (!window.d3) {
        $.getScript(versionPath + 'lib/d3-3.3.1.min.js', onD3Loaded);
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
        this.data = this.formatData(data);

        this.domain = getXYDomains(that.data);
        var axis = createAxis(this.domain);
        var element = document.createElement('DIV');
        element.className = 'profile-inner';

        var svg = d3.select(element).append('svg')
            .attr('width', width + marginHoriz)
            .attr('height', height + marginVert)
            .attr('class', 'profile-svg');

        var group = svg
          .append('g')
            .attr('class', 'profile-group')
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
            .attr('class', 'profile-grid-x')
            .attr('transform', 'translate(0, ' + height + ')')
            .call(axis.X
                .tickSize(-height, 0, 0)
                .tickFormat('')
            );

        group.append('g')
            .attr('class', 'profile-grid-y')
            .call(axis.Y
                .tickSize(-width, 0, 0)
                .tickFormat('')
            );

        group.append('path')
            .datum(that.data)
            .attr('class', 'profile-area')
            .attr('d', area);

        this.group = group;

        var legend = group.append('g')
            .attr('class', 'profile-legend')
            .attr('x', width - 65)
            .attr('y', 10)
            .attr('width', 100)
            .attr('height', 100);

        legend.append('text')
            .attr('x', width - 113)
            .attr('y', 11)
            .attr('width', 100)
            .attr('height', 30)
            .text('swissALTI3D/DHM25');

        group.append('text')
            .attr('class', 'profile-label profile-label-x')
            .attr('x', width / 2)
            .attr('y', height + options.margin.bottom - 2)
            .style('text-anchor', 'middle')
            .text('{{"' + options.xLabel + '" | translate}} [{{unitX}}]');

        group.append('text')
            .attr('class', 'profile-label profile-label-y')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - options.margin.left)
            .attr('x', 0 - height / 2)
            .attr('dy', '1em')
            .text('{{"' + options.yLabel + '" | translate}} [m]');

         return element;
      };

      this.update = function(data) {
        var that = this;
        this.data = this.formatData(data);

        this.domain = getXYDomains(that.data);
        var axis = createAxis(this.domain);
        var area = createArea(this.domain, 'cardinal');
        var path = this.group.select('.profile-area');
        path.datum(that.data)
          .transition().duration(1500)
            .attr('class', 'profile-area')
            .attr('d', area);

        this.group.select('g.x')
          .transition().duration(1500)
            .call(axis.X);
        this.group.select('g.y')
          .transition().duration(1500)
            .call(axis.Y);
        this.group.select('g.profile-grid-x')
          .transition().duration(1500)
            .call(axis.X
                .tickSize(-height, 0, 0)
                .tickFormat('')
            );
        this.group.select('g.profile-grid-y')
          .transition().duration(1500)
            .call(axis.Y
                .tickSize(-width, 0, 0)
                .tickFormat('')
            );
      };
    }

    this.$get = function($timeout, gaGlobalOptions) {
      return function(options, lazyLoadCB) {
        options.version = gaGlobalOptions.version;
        var chart = new ProfileChart($timeout, options, lazyLoadCB);
        return chart;
      };
    };
  });
})();
