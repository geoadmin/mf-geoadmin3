describe('ga_tabs_directive', function() {
  var elt, scope, parentScope, $rootScope, $compile;

  var loadDirective = function() {
    parentScope = $rootScope.$new();
    var tpl = '<div ga-tabs>' +
        '<div ga-tab ga-tab-title="Tab1">' +
          '<p id="contentTab1"></p>' +
        '</div>' +
        '<div ga-tab ga-tab-title="Tab2">' +
          '<p id="contentTab2"></p>' +
        '</div>' +
      '</div>';
    elt = $compile(tpl)(parentScope);
    $rootScope.$digest();
    scope = elt.isolateScope();
  };

  beforeEach(function() {

    module(function($provide) {
      $provide.value('gaTopic', {});
      $provide.value('gaLang', {
        get: function() {
          return 'somelang';
        },
        getNoRm: function() {
          return 'somelang';
        }
      });
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
    });
  });

  it('creates html elements', function() {
    loadDirective();
    var resultHtml = '<div ga-tabs="" class="ng-scope ng-isolate-scope tabbable">' +
        '<div><ul class="nav nav-tabs"><!-- ngRepeat: tab in tabs -->' +
          '<li ng-repeat="tab in tabs" ng-class="{active: tab.active}" class="ng-scope active"><a ng-click="activeTab(tab)" translate="" class="ng-scope ng-binding">Tab1</a></li><!-- end ngRepeat: tab in tabs -->' +
          '<li ng-repeat="tab in tabs" ng-class="{active: tab.active}" class="ng-scope"><a ng-click="activeTab(tab)" translate="" class="ng-scope ng-binding">Tab2</a></li><!-- end ngRepeat: tab in tabs -->' +
        '</ul></div>' +
        '<div class="tab-content"><div ng-transclude="">' +
          '<div ga-tab="" ga-tab-title="Tab1" class="ng-scope ng-isolate-scope tab-pane"><div ng-show="active" ng-transclude=""><p id="contentTab1" class="ng-scope"></p></div></div>' +
          '<div ga-tab="" ga-tab-title="Tab2" class="ng-scope ng-isolate-scope tab-pane"><div ng-show="active" ng-transclude="" class="ng-hide"><p id="contentTab2" class="ng-scope"></p></div>' +
        '</div></div>' +
      '</div></div>';
    expect(elt[0].outerHTML).to.be(resultHtml);
  });

  it('has good scope values', function() {
    loadDirective();
    expect(scope.tabs).to.be.an(Array);
    expect(scope.tabs.length).to.be(2);
    expect(scope.activeTab).to.be.a(Function);
  });

  it('active a tab', function() {
    loadDirective();
    expect(scope.tabs[0].active).to.be(true);
    expect(scope.tabs[1].active).to.be(false);
    scope.activeTab(scope.tabs[1]);
    expect(scope.tabs[0].active).to.be(false);
    expect(scope.tabs[1].active).to.be(true);
  });
});
