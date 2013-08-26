(function() {
  goog.provide('ga_profile_service');

  goog.require('ga_popup_service');

  var module = angular.module('ga_profile_service', [
    'ga_popup_service'
  ]);

  module.provider('gaProfileService', function() {

    function createGraph(data, options) {
      var marginHoriz = options.margin.left + options.margin.right;
      var marginVert = options.margin.top + options.margin.bottom;

      var width = options.width - marginHoriz;
      var height = options.height - marginVert;

      var x = d3.scale.linear().range([0, width]);
      var y = d3.scale.linear().range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom');
      var yAxis = d3.svg.axis()
          .scale(y)
          .orient('left');

      var area = d3.svg.area()
          .x(function(d) { return x(d.dist); })
          .y0(height)
          .y1(function(d) { return y(d.alts.DTM25); });

      var svg = d3.select('.profile').append('svg')
          .attr('width', width + marginHoriz)
          .attr('height', height + marginVert)
        .append('g')
          .attr('transform', 'translate(' + options.margin.left +
              ' ,' + options.margin.top + ')');

      x.domain(d3.extent(data, function(d) { return d.dist; }));
      y.domain([0, d3.max(data, function(d) { return d.alts.DTM25})]);

      svg.append('path')
          .datum(data)
          .attr('class', 'area')
          .attr('d', area);

      svg.append('g')
          .attr('class', 'x-axis')
          .attr('transform', 'translate(0, ' + height + ')')
          .call(xAxis);

      svg.append('g')
          .attr('class', 'y-axis')
          .call(yAxis)
        .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text('Elevation');
    }

    this.$get = ['gaPopup',
      function(gaPopup) {
        return function(data, options) {
          createGraph(data, options);
        };
      }
    ];
  });
})();
