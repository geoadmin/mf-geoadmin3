describe('ga_map_directive', function() {

  var map, element, scope;

  beforeEach(inject(function($rootScope, $compile) {
    $rootScope.options = {
      resolutions: [2, 1]
    };
    element = angular.element(
      '<div ga-map ga-map-options="options"' +
      '</div>');
    $compile(element)($rootScope);
  }));

  it('gives the map a target', inject(function(gaMap) {
    expect(gaMap.map.getTarget()).to.be(element[0]);
  }));

});
