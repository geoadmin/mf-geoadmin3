describe('ga_mouseposition_directive', function() {

  var map,
      element,
      controller,
      scope;

  beforeEach(inject(function($injector, $rootScope, $compile) {
    map = new ol.Map({});
    map.setSize([600,300]);
    map.getView().getView2D().fitExtent([-20000000, -20000000, 20000000, 20000000],
        map.getSize());

    element = angular.element('<div id="mouseposition" ' +
        'ng-controller="GaMousePositionController">' +
        '<select ng-model="options.projection" ' +
                'ng-options="p.label for p in mousePositionProjections">' +
        '</select>' +
        '<div ga-mouse-position ' +
             'ga-mouse-position-map="map" ' +
             'ga-mouse-position-options="options"></div></div>');

    $rootScope.map = map;

    $compile(element)($rootScope);
    scope = element.scope();
    scope.$digest();
  }));

  it('has the right elements', function() {
    expect(element.find('select option').size() == scope.mousePositionProjections.length).to.be(true);
    expect(angular.isDefined(element.find('ol-mouse-position'))).to.be(true);
  });

  it('changes the coordinate system correctly', function() {
    var mousepositionControl;
    var controls = scope.map.getControls();
    controls.forEach(function(c, i) {
      if (c instanceof ol.control.MousePosition) {
        mousepositionControl = c;
      }
    });
    expect(mousepositionControl.getProjection().getCode() == scope.mousePositionProjections[0].value);
    // Change the mouseposition projection
    element.find('select').val(1)
    scope.$digest();
    expect(mousepositionControl.getProjection().getCode() == scope.mousePositionProjections[1].value); 
    element.find('select').val(3);
    scope.$digest();
    expect(mousepositionControl.getProjection().getCode() == scope.mousePositionProjections[3].value);
  });
});
