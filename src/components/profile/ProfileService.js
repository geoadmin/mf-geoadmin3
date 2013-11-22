(function() {
  goog.provide('ga_profile_service');

  goog.require('ga_draggable_directive');
  goog.require('ga_popup');

  var module = angular.module('ga_profile_service', [
    'ga_draggable_directive',
    'ga_popup',
    'pascalprecht.translate'
  ]);

  module.provider('gaProfileService', function() {

    function ProfileChart(options) {
      var marginHoriz = options.margin.left + options.margin.right;
      var marginVert = options.margin.top + options.margin.bottom;

      var width = options.width - marginHoriz;
      var height = options.height - marginVert;

      var createArea = function(domain, interpolationMethod) {
        var x = domain.X;
        var y = domain.Y;
        var area = d3.svg.area()
            .interpolate(interpolationMethod)
            .x(function(d) { return x(d.dist); })
            .y0(height)
            .y1(function(d) { return y(d.alts.DTM25); });
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

      var x = d3.scale.linear().range([0, width]);
      var y = d3.scale.linear().range([height, 0]);

      var getXYDomains = function(data) {
        x.domain(d3.extent(data, function(d) { return d.dist; }));
        y.domain([0, d3.max(data, function(d) { return d.alts.DTM25; })]);
        return {
          X: x,
          Y: y
        };
      };

      this.create = function(data) {
        this.domain = getXYDomains(data);
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

        var area = createArea(this.domain, 'cardinal');
        group.append('path')
            .datum(data)
            .attr('class', 'profile-area')
            .attr('d', area)
            .style('opacity', 0.9);

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

        var legend = group.append('g')
            .attr('class', 'profile-legend')
            .attr('x', width - 65)
            .attr('y', 10)
            .attr('width', 100)
            .attr('height', 100);

        legend.append('rect')
            .attr('class', 'profile-legend-rect')
            .attr('x', width - 65)
            .attr('y', 10)
            .attr('width', 10)
            .attr('height', 10);

        legend.append('text')
            .attr('x', width - 50)
            .attr('y', 19)
            .attr('width', 100)
            .attr('height', 30)
            .text('DTM 25');

        group.append('text')
            .attr('class', 'profile-label')
            .attr('x', width / 2)
            .attr('y', height + options.margin.bottom)
            .style('text-anchor', 'middle')
            .text(options.xLabel);

        group.append('text')
            .attr('class', 'profile-label')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - options.margin.left)
            .attr('x', 0 - height / 2)
            .attr('dy', '1em')
            .text(options.yLabel);

         return element;
      };

      this.update = function(data, element) {
        this.domain = getXYDomains(data);
        var axis = createAxis(this.domain);
        element = d3.select(element[0]);
        var path = element.select('.profile-area');
        var area = createArea(this.domain, 'cardinal');
        path.datum(data)
          .transition().duration(1500)
            .attr('class', 'profile-area')
            .attr('d', area)
            .style('opacity', 0.9);

        element.select('g.x').call(axis.X);
        element.select('g.y').call(axis.Y);
        element.select('g.profile-grid-x')
            .call(axis.X
                .tickSize(-height, 0, 0)
                .tickFormat('')
            );
        element.select('g.profile-grid-y')
            .call(axis.Y
                .tickSize(-width, 0, 0)
                .tickFormat('')
            );
      };
    }

    this.$get = function($translate) {
      return function(options) {
        var chart = new ProfileChart(options);
        return chart;
      };
    };
  });
})();
