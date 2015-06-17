goog.provide('ga_help_directive');

goog.require('ga_help_service');
(function() {

  var module = angular.module('ga_help_directive', [
    'ga_help_service'
  ]);

  /* Help Directive
   *
   * This directives places a help button into the html.
   * When clicked, the help is displayed in a popup
   *
   * The directive has one attribute for configuration:
   * ga-help="your-help-id". This help id is used to get
   * the corresponding html snippet from the help service.
   * You need to add your id to the help service
   *
   * Sample html:
   * <div ga-help="11"></div>
   * Multiple id's can be specified, separated by commas and
   * they will appear in the same window
   * <span ga-help="12,13,14"></div>
  */
  module.directive('gaHelp',
      function($rootScope, $sce, gaHelpService, gaPopup) {
        var popupContent = '<div class="ga-help-content" ' +
                                'ng-repeat="res in options.results">' +
                             '<h2 ng-bind-html="res[0]"></h2>' +
                             '<div ng-bind-html="res[1]"></div>' +
                             '<br>' +
                             '<img ng-src="{{res[2]}}" ' +
                                  'draggable="false"/>' +
                           '</div>';

        return {
          restrict: 'A',
          scope: {
            helpIds: '@gaHelp',
            optionsFunc: '&gaHelpOptions'
          },
          replace: true,
          templateUrl: 'components/help/partials/help.html',
          link: function(scope, element, attrs) {
            var popup;
            var results = [];
            var shown = false;
            scope.options = scope.optionsFunc();
            if (scope.options && scope.options.showOnHover) {
              $(element).parent()
                  .on('mouseover', function(evt) {
                    element.css('visibility', 'visible');
                  })
                  .on('mouseout', function(evt) {
                    element.css('visibility', 'hidden');
                  });
            }

            scope.displayHelp = function(evt) {
              if (evt) {
                evt.preventDefault();
                evt.stopPropagation();
              }

              if (angular.isDefined(popup)) {
                if (shown) {
                  popup.close();
                } else {
                  popup.open();
                  shown = true;
                }
              } else {
                var ids = scope.helpIds.split(',');

                //Create the popup
                popup = gaPopup.create({
                  className: 'ga-help-popup',
                  destroyOnClose: false,
                  title: 'help_label',
                  content: popupContent, //contains data-binding to results
                  results: results,
                  showPrint: true,
                  onCloseCallback: function() {
                    shown = false;
                  }
                });

                var updateContent = function(doOpen) {
                  var resCount = 0,
                      len = ids.length,
                      i;

                  var resultReceived = function() {
                    if (resCount === 0 &&
                        doOpen) {
                      popup.open();
                      shown = true;
                    }

                    resCount++;
                  };
                  for (i = 0; i < len; i++) {
                    gaHelpService.get(ids[i]).then(function(res) {
                      results.push([
                        $sce.trustAsHtml(res.rows[0][1]),
                        $sce.trustAsHtml(res.rows[0][2]),
                        res.rows[0][4]
                      ]);
                      resultReceived();
                    }, function() {
                      resultReceived();
                      //FIXME: better error handling
                      var msg = 'No help found for id ' + ids[i];
                      alert(msg);
                    });
                  }
                };

                updateContent(true);

                //react on language change
                $rootScope.$on('$translateChangeEnd', function() {
                  //Remove old content _without destroying the array_
                  //The below is used because it's fastest and is
                  //best supported across browsers
                  while (results.length > 0) {
                    results.pop();
                  }
                  updateContent(false);
                });
              }
            };
          }
        };
      });
})();

