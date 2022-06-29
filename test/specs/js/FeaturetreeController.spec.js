/* eslint-disable max-len */
describe('ga_featuretree_controller', function() {

  describe('GaFeaturetreeController', function() {

    var elt, scope, parentScope, $compile, $rootScope, $timeout, $httpBackend,
      gaGlobalOptions;

    var loadController = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ng-controller="GaFeaturetreeController"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.scope();
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
      gaGlobalOptions = $injector.get('gaGlobalOptions');
    };

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      try {
        $timeout.verifyNoPendingTasks();
      } catch (e) {
        $timeout.flush();
      }
    });

    describe('on modern browser', function() {

      beforeEach(function() {
        inject(function($injector) {
          injectServices($injector);
        });
        loadController();
      });

      afterEach(function() {
        $timeout.flush();
      });

      it('set scope values', function() {
        expect(scope.options.msUrl).to.be(gaGlobalOptions.apiUrl + '/rest/services/all/MapServer');
        expect(scope.options.featuresShown).to.be(false);
        expect(scope.options.hasMoreResults).to.be(false);
        expect(scope.options.nbFeatures).to.be(0);
        expect(scope.options.max).to.be(200);
        expect(scope.getItemText).to.be.a(Function);

        // Print stuff
        expect(scope.printInProgress).to.be(false);
        expect(scope.printProgressPercentage).to.be(0);
        expect(scope.print).to.be.a(Function);
      });

      describe('on gaQueryResultsUpdated event', function() {

        it('set new scope values then broadcasts gaNewFeatureTree event', function() {
          var featByLayer = [{
            hasMoreResults: true,
            features: [
              new ol.Feature()
            ]
          }];
          var spy = sinon.spy(scope, '$broadcast').withArgs('gaNewFeatureTree', featByLayer);
          scope.$emit('gaQueryResultsUpdated', featByLayer);
          expect(scope.options.featuresShown).to.be(true);
          expect(scope.options.hasMoreResults).to.be(true);
          expect(scope.options.nbFeatures).to.be(1);
          expect(spy.callCount).to.be(1);
        });
      });

      describe('on gaGetMoreFeatureTree event', function() {

        it('set new scope values then broadcasts gaNewFeatureTree event', function() {
          var layer = {
            bodId: 'bodId',
            offset: 2
          };
          var spy = sinon.spy(scope, '$broadcast').withArgs('gaQueryMore', layer.bodId, 202);
          scope.$emit('gaGetMoreFeatureTree', layer);
          expect(spy.callCount).to.be(1);
        });
      });
    });
  });
});
