(function() {
  goog.provide('ga_importwms_controller');

  var module = angular.module('ga_importwms_controller', []);

  module.controller('GaImportWmsController',
    ['$scope', 'gaGlobalOptions',
     function($scope, gaGlobalOptions) {
       $scope.options = {  
         proxyUrl: gaGlobalOptions.baseUrlPath + '/ogcproxy?url=',
         defaultWMSList: [
           'http://wms.geo.admin.ch/',
           'http://ogc.heig-vd.ch/mapserver/wms?',
           'http://www.wms.stadt-zuerich.ch/WMS-ZH-STZH-OGD/MapServer/WMSServer?',
           'http://geo.gl.ch/wms/Public?',
           'http://mapserver1.gr.ch/wms/admineinteilung?',
           'http://mapserver1.gr.ch/wms/belastetestandorte?',
           'http://mapserver1.gr.ch/wms/beweidbareflaechen?',
           'http://mapserver1.gr.ch/wms/generellererschliessungsplan?',
           'http://mapserver1.gr.ch/wms/generellergestaltungsplan?',
           'http://mapserver1.gr.ch/wms/gewaesserschutz?',
           'http://mapserver1.gr.ch/wms/grundlagen_richtplanung?',
           'http://mapserver1.gr.ch/wms/grundwasser?',
           'http://mapserver1.gr.ch/wms/historischekarten?',
           'http://mapserver1.gr.ch/cgi-bin/wms/landwirtschaft?',
           'http://mapserver1.gr.ch/wms/naturgefahren_erfassungsbereiche?',
           'http://mapserver1.gr.ch/wms/naturschutz?',
           'http://mapserver1.gr.ch/wms/regionen?',
           'http://mapserver1.gr.ch/wms/seilbahnen?',
           'http://mapserver1.gr.ch/wms/amtlichevermessung_stand?',
           'http://mapserver1.gr.ch/wms/wildruhezonen?'         
         ]
       };
     }]);
})();
