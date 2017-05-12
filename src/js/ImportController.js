goog.provide('ga_import_controller');

goog.require('ga_kml_service');
goog.require('ngeo.fileService');

(function() {

  var module = angular.module('ga_import_controller', [
    'ga_kml_service',
    'ngeo.fileService'
  ]);

  module.controller('GaImportController', function($scope, $q, $document,
      $window, $timeout, ngeoFile, gaKml, gaBrowserSniffer, gaWms, gaUrlUtils,
      gaLang, gaPreviewLayers, gaMapUtils, gaWmts) {

    $scope.supportDnd = !gaBrowserSniffer.msie || gaBrowserSniffer.msie > 9;
    $scope.options = {
      urls: [
        'http://www.basemap.at/wmts/1.0.0/WMTSCapabilities.xml',
        'http://cidportal.jrc.ec.europa.eu/copernicus/services/tile/wmts/1.0.0/WMTSCapabilities.xml',
        'https://wms.geo.admin.ch/?lang=',
        'http://ogc.heig-vd.ch/mapserver/wms',
        'http://owsproxy.lgl-bw.de/owsproxy/ows/WMS_Maps4BW',
        'https://www.gis.stadt-zuerich.ch/maps/services/wms/WMS-ZH-STZH-OGD/MapServer/WMSServer',
        'https://wms.geo.gl.ch/',
        'https://ge.ch/sitgags1/services/VECTOR/SITG_OPENDATA_02/MapServer/WMSServer',
        'https://ge.ch/sitgags1/services/VECTOR/SITG_OPENDATA_03/MapServer/WMSServer',
        'https://ge.ch/sitgags1/services/VECTOR/SITG_OPENDATA_04/MapServer/WMSServer',
        'https://ge.ch/sitgags1/services/VECTOR/SITG_GEOSERVICEDATA/MapServer/WMSServer',
        'https://ge.ch/sitgags2/services/RASTER/ORTHOPHOTOS_2016/MapServer/WMSServer',
        'http://wms.geo.gr.ch/wms/admineinteilung',
        'http://wms.geo.gr.ch/wms/belastetestandorte',
        'http://wms.geo.gr.ch/wms/beweidbareflaechen',
        'http://wms.geo.gr.ch/wms/generellererschliessungsplan',
        'http://wms.geo.gr.ch/wms/generellergestaltungsplan',
        'http://wms.geo.gr.ch/wms/gewaesserschutz',
        'http://wms.geo.gr.ch/wms/grundlagen_richtplanung',
        'http://wms.geo.gr.ch/wms/grundwasser',
        'http://wms.geo.gr.ch/wms/historischekarten',
        'http://wms.geo.gr.ch/wms/naturgefahren_erfassungsbereiche',
        'http://wms.geo.gr.ch/wms/naturschutz',
        'http://wms.geo.gr.ch/wms/regionen',
        'http://wms.geo.gr.ch/wms/seilbahnen',
        'http://wms.geo.gr.ch/wms/amtlichevermessung_stand',
        'http://wms.geo.gr.ch/wms/wildruhezonen',
        'http://wms.geo.gr.ch/wms/wildschutzgebiete',
        'http://wms.geo.gr.ch/wms/zonenplan',
        'http://www.sogis1.so.ch/wms/avwms',
        'http://www.sogis1.so.ch/wms/grundbuchplan',
        'http://www.sogis1.so.ch/wms/wms_lidar',
        'http://wms.vd.ch/public/services/wmsVD/Mapserver/Wmsserver',
        'https://wms.geo.bs.ch/wmsBS',
        'http://vogis.cnv.at/mapserver/mapserv?map=i_flaechenwidmung_v_wms.map',
        'http://vogis.cnv.at/mapserver/mapserv?map=i_luftbilder_r_wms.map',
        'http://vogis.cnv.at/mapserver/mapserv?map=i_hoehen_und_gelaende_r_wms.map',
        'http://vogis.cnv.at/mapserver/mapserv?map=i_relief_r_wms.map',
        'http://vogis.cnv.at/mapserver/mapserv?map=i_historischekarten_r_wms.map',
        'http://vogis.cnv.at/mapserver/mapserv?map=i_naturschutz_v_wms.map',
        'http://vogis.cnv.at/mapserver/mapserv?map=i_topographie_r_wms.map',
        'http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/raster/IGM_100000.map',
        'http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/raster/IGM_25000.map',
        'http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/raster/IGM_250000.map',
        'http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/raster/DTM_20M.map',
        'http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/Vettoriali/Rete_ferroviaria.map',
        'http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/Vettoriali/Rete_stradale.map',
        'http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/raster/ortofoto_colore_06.map',
        'https://wms.zh.ch/ArchWMS',
        'https://wms.zh.ch/TBA9ZHWMS',
        'https://wms.zh.ch/TbaBaustellenZHWMS',
        'https://wms.zh.ch/TBAAnlagenZHWMS',
        'https://wms.zh.ch/DenkmalschutzWMS',
        'https://wms.zh.ch/HaltestellenZHWMS',
        'https://wms.zh.ch/WaldWNBZHWMS',
        'https://wms.zh.ch/OrtsbildschutzZHWMS',
        'https://wms.zh.ch/FnsLRKZHWMS',
        'https://wms.zh.ch/WaldSWZHWMS',
        'https://wms.zh.ch/TBAStr3ZHWMS',
        'https://wms.zh.ch/TBAStr2ZHWMS',
        'https://wms.zh.ch/TBAStr1ZHWMS',
        'https://wms.zh.ch/ZVVZHWMS',
        'https://wms.zh.ch/AFVTempo30ZHWMS',
        'https://wms.zh.ch/WaldVKWMS',
        'https://wms.zh.ch/VeloinfrastrukturZHWMS',
        'https://wms.zh.ch/VelonetzZHWMS',
        'https://wms.zh.ch/VeloparkieranlagenZHWMS',
        'https://wms.zh.ch/TBAVMSZHWMS',
        'https://wms.zh.ch/WaldarealZHWMS',
        'https://wms.zh.ch/WildkarteZHWMS',
        'https://wms.zh.ch/FnsLWZHWMS',
        'https://wms.zh.ch/FNSOEQVZHWMS',
        'https://wms.zh.ch/FNSLRPZHWMS',
        'https://wms.zh.ch/FnsSVOZHWMS',
        'https://wms.zh.ch/FnsInvZHWMS',
        'https://wms.zh.ch/kkgeo_gws_zh',
        'http://www.geoservice.apps.be.ch/geoservice2/services/a42geo/a42geo_basiswms_d_fk/MapServer/WMSServer?',
        'http://www.geoservice.apps.be.ch/geoservice2/services/a42geo/a42geo_grenzenwms_d_fk/MapServer/WMSServer?',
        'http://www.geoservice.apps.be.ch/geoservice2/services/a42geo/a42geo_planungwms_d_fk/MapServer/WMSServer?',
        'http://www.geoservice.apps.be.ch/geoservice2/services/a42geo/a42geo_umweltwms_d_fk/MapServer/WMSServer?',
        'http://www.geoservice.apps.be.ch/geoservice2/services/a42geo/a42geo_geologiewms_d_fk/MapServer/WMSServer?',
        'http://www.geoservice.apps.be.ch/geoservice2/services/a42geo/a42geo_gewaesserwms_d_fk/MapServer/WMSServer?',
        'http://www.geoservice.apps.be.ch/geoservice2/services/a42geo/a42geo_transportwms_d_fk/MapServer/WMSServer?',
        'https://wms.geo.gr.ch/admineinteilung',
        'https://wms.geo.gr.ch/bauzonen_graubuenden',
        'https://wms.geo.gr.ch/belastetestandorte',
        'https://wms.geo.gr.ch/beweidbareflaechen',
        'https://wms.geo.gr.ch/generellererschliessungsplan',
        'https://wms.geo.gr.ch/generellergestaltungsplan',
        'https://wms.geo.gr.ch/gewaesserschutz',
        'https://wms.geo.gr.ch/grundwasser',
        'https://wms.geo.gr.ch/historischekarten',
        'https://wms.geo.gr.ch/landwirtschaft',
        'https://wms.geo.gr.ch/naturgefahren_erfassungsbereiche',
        'https://wms.geo.gr.ch/naturschutz',
        'https://wms.geo.gr.ch/rrip_bregaglia',
        'https://wms.geo.gr.ch/rrip_davos',
        'https://wms.geo.gr.ch/rrip_mesolcina',
        'https://wms.geo.gr.ch/rrip_mittelbuenden',
        'https://wms.geo.gr.ch/rrip_nordbuenden',
        'https://wms.geo.gr.ch/rrip_oberengadin',
        'https://wms.geo.gr.ch/rrip_praettigau',
        'https://wms.geo.gr.ch/rrip_unterengadin',
        'https://wms.geo.gr.ch/rrip_regioviamala',
        'https://wms.geo.gr.ch/regionen',
        'https://wms.geo.gr.ch/schutzwald',
        'https://wms.geo.gr.ch/seilbahnen',
        'https://wms.geo.gr.ch/amtlichevermessung_stand',
        'https://wms.geo.gr.ch/waldentwicklungsplan',
        'https://wms.geo.gr.ch/wildruhezonen',
        'https://wms.geo.gr.ch/wildschutzgebiete',
        'https://wms.geo.gr.ch/zonenplan',
        'https://wms.geo.gr.ch/richtplan',
        'https://wms.geo.gr.ch/uebersichtsplan',
        'http://webdienste.zugmap.ch/basisplan_sw/service.svc/get',
        'http://webdienste.zugmap.ch/basisplan_farbig/service.svc/get',
        'http://webdienste.zugmap.ch/kkgeo_gws_zg/service.svc/get',
        'http://webdienste.zugmap.ch/Landwirtschaft_Naturschutz/service.svc/get',
        'http://webdienste.zugmap.ch/luftbild2011/service.svc/get',
        'http://webdienste.zugmap.ch/Zonenplan_WMS/service.svc/get',
        'http://service.lisag.ch/wms',
        'http://wms.geoportal.ch:8080/geoserver/AVAI/wms',
         // non-SwissProjected test urls
        'http://wms.ga.admin.ch/1GE',
        'http://wms.ga.admin.ch/LG_DE_Geologie_und_Tektonik/wms',
        'http://discomap.eea.europa.eu/arcgis/services/Land/CLC2000_Dyna_WM/MapServer/WMSServer',
        'http://eumetview.eumetsat.int/geoserver/wms',
        'http://osm.omniscale.net/proxy/service',
        'https://ows.terrestris.de/osm/service',
        'https://ows.terrestris.de/osm-gray/service',
        'http://www.webatlasde.de/arcgis/services/Maps4BW/MapServer/WMSServer',
        'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000017900001/MapServer/WMSServer',
        'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000017400001/MapServer/WMSServer',
        'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000016900001/MapServer/WMSServer',
        'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000013500001/MapServer/WMSServer',
        'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000013300001/MapServer/WMSServer',
        'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000017100001/MapServer/WMSServer',
        'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000013400001/MapServer/WMSServer',
        'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000013600001/MapServer/WMSServer',
        'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000013100001/MapServer/WMSServer',
        'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000001500003/MapServer/WMSServer',
        'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000004200001/MapServer/WMSServer'
     ]
    };

    $scope.options.isValidUrl = gaUrlUtils.isValid;
    $scope.options.getOlLayerFromGetCapLayer = function(layer) {
      if (layer.wmsUrl) {
        return gaWms.getOlLayerFromGetCapLayer(layer);
      } else if (layer.capabilitiesUrl) {
        return gaWmts.getOlLayerFromGetCapLayer(layer);
      }
    };
    $scope.options.addPreviewLayer = function(map, layer) {
      gaPreviewLayers.addGetCapLayer(map, layer);
    };
    $scope.options.removePreviewLayer = gaPreviewLayers.removeAll;
    $scope.options.transformExtent = gaMapUtils.intersectWithDefaultExtent;



    // Transform the url before loading it.
    $scope.options.transformUrl = function(url) {
      if (/(wms|service\.svc|osm|ows)/i.test(url)) {
        // Append WMS GetCapabilities default parameters
        url = gaUrlUtils.append(url,
            'SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0');

        // Use lang param only for admin.ch servers
        if (/admin\.ch/.test(url)) {
          url = gaUrlUtils.append(url, 'lang=' + gaLang.get());
        }
      }
      return gaUrlUtils.proxifyUrl(url);
    };

    // Manage data depending on the content
    // @param data<String> Content of the file.
    // @param file<Object> Informations of the file (if available).
    $scope.options.handleFileContent = function(data, file) {
      var defer = $q.defer();
      $scope.gpxContent = null;
      $scope.kmlContent = null;
      $scope.wmsGetCap = null;
      $scope.wmtsGetCap = null;
      file = file || {};

      if (ngeoFile.isWmsGetCap(data)) {
        $scope.wmsGetCap = data;
        defer.resolve({
          message: 'upload_succeeded'
        });

      } else if (ngeoFile.isKml(data)) {

        gaKml.addKmlToMap($scope.map, data, {
          url: file.url || URL.createObjectURL(file),
          useImageVector: gaKml.useImageVector(file.size),
          zoomToExtent: true

        }).then(function() {
          defer.resolve({
            message: 'parse_succeeded'
          });

        }, function(reason) {
          $window.console.error('KML parsing failed: ', reason);
          defer.reject({
            message: 'parse_failed',
            reason: reason
          });

        }, function(evt) {
          defer.notify(evt);
        });

      } else if (ngeoFile.isWmtsGetCap(data)) {
        $scope.wmtsGetCap = data;
        defer.resolve({
          message: 'upload_succeeded'
        });
      } else {

        $window.console.error('Unparseable content: ', data);
        defer.reject({
          message: 'parse_failed',
          reason: 'format_not_supported'
        });
      }
      // GPX

      return defer.promise;
    };

    // Move the typeahead menu list to the body and automatically setting css.
    /*var executeTaMenuHack = function() {
      var imp = $document.find('[ngeo-import-online]');
      // Append the suggestions list to the body
      var taMenu = imp.find('.tt-dropdown-menu');
      if (!taMenu.length) {
        return;
      }
      $($document[0].body).append(taMenu);
      var taElt = imp.find('input[name=url]');
      var applyCssToMenu = function() {
        var pos = taElt.offset();
        var width = taElt.width();
        taMenu.css({
          top: pos.top + 30, // + input height
          left: pos.left,
          width: width + 30, // + padding
          zIndex: taElt.parents('div[ga-popup]').css('zIndex')
        });

      };
      taElt.on('focus', function() {
        applyCssToMenu();
      });
      // Destroy the mnu if the scope is destroyed
      imp.isolateScope().$on('$destroy',
          function() {
        if (!taMenu.length) {
          return;
        }
        taMenu.remove();
      });
    };*/
  });
})();
