(function() {
  goog.provide('ga_importwms_directive');

//  goog.require('ga_browsersniffer_service');

  var module = angular.module('ga_importwms_directive', [
  //  'ga_browsersniffer_service',
    'pascalprecht.translate'
  ]);

  module.controller('GaImportWmsDirectiveController',
      ['$scope', '$http', '$q', '$log', '$translate',
       function($scope, $http, $q, $log, $translate) {

       }]
  );

  module.directive('gaImportWms',
      ['$http', '$log', '$translate',
       function($http, $log, $translate) {
         return {
           retsrict: 'A',
           templateUrl: 'components/importwms/partials/importwms.html',
           scope: {
             map: '=gaImportWmsMap',
             options: '=gaImportWmsOptions'
           },
           controller: 'GaImportWmsDirectiveController',
           link: function(scope, elt, attrs, controller) {
             
             var taElt = elt.find('input[type=text]').keydown(function(evt) {
               // Remove keyboard pan navigation when the focus is in the input
               // text
               if (evt.keyCode >= 37 && evt.keyCode <= 40)  {
                 evt.preventDefault();
                 evt.stopPropagation();
               }

             }).typeahead({
               local: scope.options.defaultWMSList,
               limit: 500
             
             }).on('typeahead:initialized typeahead:selected', function() {
               var taView =  $(this).data('ttView');
               var dataset = taView.datasets[0];
               dataset.getSuggestions("http", function(suggestions) {
                 taView.dropdownView.renderSuggestions(dataset, suggestions);
               });
             });
             


             elt.find(".open-wms-list").on("click", function() {
               elt.find(".tt-dropdown-menu").toggle();
             });
           }
         };
       }]
  );
})();

