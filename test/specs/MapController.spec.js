
describe('GaMapController', function () {
  'use strict';
  
  var scope = null;
  var mc = null;

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    mc = $controller('GaMapController', { $scope: scope });
  }));

  describe('creation', function () {
    it('contains map instance', function () {
      expect(scope).not.to.be(null);
      expect(scope.map).not.to.be(null);
      expect(scope.map instanceof ol.Map).to.be(true);
    });
  });

  describe('projection', function () {
    it('is swiss projection', function () {
      expect(scope.map.getView().getProjection().getCode()).to.be('EPSG:21781');
    });
  });

  describe('resolution', function () {
    it('has default resolution', function () {
      expect(scope.map.getView().getResolution()).to.be(500);
    });
  });


});

