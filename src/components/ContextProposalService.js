(function() {
  goog.provide('ga_context_proposal_service');

  var module = angular.module('ga_context_proposal_service', []);

  module.provider('gaContextProposalService', function() {
    this.$get = function($q, $timeout) {

      var defaultLayers = [
        'ch.swisstopo.swisstlm3d-wanderwege',
        'ch.swisstopo.swisstlm3d-karte-farbe',
        'ch.swisstopo.swissboundaries3d-land-flaeche.fill',
        'ch.swisstopo.swissboundaries3d-kanton-flaeche.fill',
        'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill',
        'ch.swisstopo.zeitreihen',
        'ch.swisstopo.pixelkarte-farbe-pk25.noscale',
        'ch.bafu.wrz-wildruhezonen_portal',
        'ch.swisstopo.vec25-strassennetz',
        'ch.swisstopo-vd.ortschaftenverzeichnis_plz'
      ];

      var ContextProposal = function() {

        /*
         * Returns a list of layersID's representing
         * the top n layers for the given topic
         * Right now, the list is hardcoded, but
         * it could easily be replaced by a service
         * from the back-end
         */
        this.topLayersForTopic = function(topic, N) {
          var def = $q.defer();

          if (N > defaultLayers.length) {
            N = defaultLayers.length;
          } else if (N < 1) {
            N = 1;
          }
          // This timeout is used to 'simulate' the
          // future when we probably will use a
          // service for this.
          $timeout(function() {
            def.resolve(defaultLayers.slice(0, N));
          }, 100);

          return def.promise;
        };
      };
      return new ContextProposal();
    };
  });
})();
