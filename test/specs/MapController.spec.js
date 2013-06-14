
describe('GaMapController', function () {
  'use strict';
  
  var scope = null;
  var mc = null;

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    mc = $controller('GaMapController', { $scope: scope });
  }));

  describe('creationg', function () {
    it('contains map instance', function () {
      expect(scope).not.to.be(null);
      expect(scope.map).not.to.be(null);
      expect(scope.map instanceof ol.Map).to.be(true);
    });
  });
});

