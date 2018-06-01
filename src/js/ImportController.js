goog.provide('ga_import_controller');

goog.require('ga_browsersniffer_service');
goog.require('ga_file_service');
goog.require('ga_maputils_service');
goog.require('ga_previewlayers_service');
goog.require('ga_translation_service');
goog.require('ga_urlutils_service');
goog.require('ga_vector_service');
goog.require('ga_wmts_service');

(function() {

  var module = angular.module('ga_import_controller', [
    'ga_file_service',
    'ga_browsersniffer_service',
    'ga_maputils_service',
    'ga_urlutils_service',
    'ga_previewlayers_service',
    'ga_translation_service',
    'ga_vector_service'
  ]);

  module.controller('GaImportController', function($scope, $q, $document,
      $window, $timeout, gaFile, gaBrowserSniffer, gaWms, gaUrlUtils,
      gaLang, gaPreviewLayers, gaMapUtils, gaWmts, gaVector) {

    var servers = [
      'https://wms.geo.admin.ch/?lang=',
      'http://owsproxy.lgl-bw.de/owsproxy/ows/WMS_Maps4BW',
      'https://www.ogd.stadt-zuerich.ch/mapproxy/wmts/1.0.0/WMTSCapabilities.xml',
      'https://wms.geo.gl.ch/',
      'https://ge.ch/sitgags1/services/VECTOR/SITG_OPENDATA_02/MapServer/WMSServer',
      'https://ge.ch/sitgags1/services/VECTOR/SITG_OPENDATA_03/MapServer/WMSServer',
      'https://ge.ch/sitgags1/services/VECTOR/SITG_OPENDATA_04/MapServer/WMSServer',
      'https://ge.ch/sitgags1/services/VECTOR/SITG_GEOSERVICEDATA/MapServer/WMSServer',
      'https://ge.ch/sitgags2/services/RASTER/ORTHOPHOTOS_2016/MapServer/WMSServer',
      'http://wms.geo.gr.ch/wms/admineinteilung',
      'http://wms.geo.gr.ch/wms/belastetestandorte',
      'http://wms.geo.gr.ch/wms/beweidbareflaechen',
      'http://wms.geo.gr.ch/wms/gewaesserschutz',
      'http://wms.geo.gr.ch/wms/grundwasser',
      'http://wms.geo.gr.ch/wms/historischekarten',
      'http://wms.geo.gr.ch/wms/naturgefahren_erfassungsbereiche',
      'http://wms.geo.gr.ch/wms/naturschutz',
      'http://wms.geo.gr.ch/wms/regionen',
      'http://wms.geo.gr.ch/wms/seilbahnen',
      'http://wms.geo.gr.ch/wms/amtlichevermessung_stand',
      'http://wms.geo.gr.ch/wms/wildruhezonen',
      'http://wms.geo.gr.ch/wms/wildschutzgebiete',
      'http://www.sogis1.so.ch/wms/avwms',
      'http://www.sogis1.so.ch/wms/grundbuchplan',
      'http://www.sogis1.so.ch/wms/wms_lidar',
      'http://wms.vd.ch/public/services/wmsVD/Mapserver/Wmsserver',
      'http://wms.geo.bs.ch/wmsBS?',
      'http://vogis.cnv.at/mapserver/mapserv?map=i_flaechenwidmung_v_wms.map',
      'http://vogis.cnv.at/mapserver/mapserv?map=i_luftbilder_r_wms.map',
      'http://vogis.cnv.at/mapserver/mapserv?map=i_relief_r_wms.map',
      'http://vogis.cnv.at/mapserver/mapserv?map=i_historischekarten_r_wms.map',
      'http://vogis.cnv.at/mapserver/mapserv?map=i_naturschutz_v_wms.map',
      'http://vogis.cnv.at/mapserver/mapserv?map=i_topographie_r_wms.map',
      'http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/raster/IGM_100000.map',
      'http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/raster/IGM_25000.map',
      'http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/raster/IGM_250000.map',
      'http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/raster/DTM_20M.map',
      'http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/Vettoriali/Rete_ferroviaria.map',
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
      'http://www.geoservice.apps.be.ch/geoservice2/services/a42geo/a42geo_basiswms_d_fk/MapServer/WMSServer',
      'http://www.geoservice.apps.be.ch/geoservice2/services/a42geo/a42geo_grenzenwms_d_fk/MapServer/WMSServer',
      'http://www.geoservice.apps.be.ch/geoservice2/services/a42geo/a42geo_planungwms_d_fk/MapServer/WMSServer',
      'http://www.geoservice.apps.be.ch/geoservice2/services/a42geo/a42geo_umweltwms_d_fk/MapServer/WMSServer',
      'http://www.geoservice.apps.be.ch/geoservice2/services/a42geo/a42geo_geologiewms_d_fk/MapServer/WMSServer',
      'http://www.geoservice.apps.be.ch/geoservice2/services/a42geo/a42geo_gewaesserwms_d_fk/MapServer/WMSServer',
      'http://www.geoservice.apps.be.ch/geoservice2/services/a42geo/a42geo_transportwms_d_fk/MapServer/WMSServer',
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
      'https://map.geo.tg.ch/proxy/geofy_chsdi3/gefaehrdung_wasser?access_key=YoW2syIQ4xe0ccJA',
      'https://map.geo.tg.ch/proxy/geofy_chsdi3/grundwasserkarte-fassung?access_key=YoW2syIQ4xe0ccJA',
      'https://map.geo.tg.ch/proxy/geofy_chsdi3/gewaesserschutzkarte-gewaesserschutzbereiche?access_key=YoW2syIQ4xe0ccJA',
      'https://map.geo.tg.ch/proxy/geofy_chsdi3/luftbelastung-stickstoff?access_key=YoW2syIQ4xe0ccJA',
      'https://map.geo.tg.ch/proxy/geofy_chsdi3/emissionen-stickoxide?access_key=YoW2syIQ4xe0ccJA',
      'https://map.geo.tg.ch/proxy/geofy_chsdi3/av_wms_mbsf?access_key=YoW2syIQ4xe0ccJA',
      'https://map.geo.tg.ch/proxy/geofy_chsdi3/orthofotos?access_key=YoW2syIQ4xe0ccJA',
      'https://map.geo.tg.ch/proxy/geofy_chsdi3/basisplanf?access_key=YoW2syIQ4xe0ccJA',
      'https://map.geo.tg.ch/proxy/geofy_chsdi3/hintergrundplan?access_key=YoW2syIQ4xe0ccJA',
      'https://map.geo.tg.ch/proxy/geofy_chsdi3/basisplansw?access_key=YoW2syIQ4xe0ccJA',
      'https://map.geo.tg.ch/proxy/geofy_chsdi3/erdwaerme_erdwaermesonden?access_key=YoW2syIQ4xe0ccJA',
      'https://map.geo.tg.ch/proxy/geofy_chsdi3/neophyten-pflanzenart?access_key=YoW2syIQ4xe0ccJA',
      'https://map.geo.tg.ch/proxy/geofy_chsdi3/biomasse-oberflaeche?access_key=YoW2syIQ4xe0ccJA',
      'https://map.geo.tg.ch/proxy/geofy_chsdi3/hochwasserlinie_untersee?access_key=YoW2syIQ4xe0ccJA',
      'https://map.geo.tg.ch/proxy/geofy_chsdi3/gefahrenhinweiskarte_allgemeine_gefahrengebiete?access_key=YoW2syIQ4xe0ccJA',
      'https://map.geo.tg.ch/proxy/geofy_chsdi3/hkb_weitere?access_key=YoW2syIQ4xe0ccJA',
      'https://map.geo.tg.ch/proxy/geofy_chsdi3/bodenuebersicht-regionen?access_key=YoW2syIQ4xe0ccJA',
      'http://webdienste.zugmap.ch/basisplan_sw/service.svc/get',
      'http://webdienste.zugmap.ch/basisplan_farbig/service.svc/get',
      'http://webdienste.zugmap.ch/Landwirtschaft_Naturschutz/service.svc/get',
      'http://service.lisag.ch/wms',
      'http://wms.geoportal.ch:8080/geoserver/AVAI/wms',
      'https://geodienste.ch/db/av/deu',
      'https://geodienste.ch/db/av/fra',
      'https://geodienste.ch/db/kantonale_ausnahmetransportrouten/deu',
      'https://geodienste.ch/db/kantonale_ausnahmetransportrouten/fra',
      'https://geodienste.ch/db/kantonale_ausnahmetransportrouten/ita',
      'https://geodienste.ch/db/kantonale_ausnahmetransportrouten/eng',
      'https://geodienste.ch/db/kataster_belasteter_standorte/deu',
      'https://geodienste.ch/db/lwb_bewirtschaftungseinheit/deu',
      'https://geodienste.ch/db/lwb_bewirtschaftungseinheit/fra',
      'https://geodienste.ch/db/lwb_bewirtschaftungseinheit/ita',
      'https://geodienste.ch/db/lwb_biodiversitaetsfoerderflaechen/deu',
      'https://geodienste.ch/db/lwb_biodiversitaetsfoerderflaechen/fra',
      'https://geodienste.ch/db/lwb_biodiversitaetsfoerderflaechen/ita',
      'https://geodienste.ch/db/lwb_nutzungsflaechen/deu',
      'https://geodienste.ch/db/lwb_nutzungsflaechen/fra',
      'https://geodienste.ch/db/lwb_nutzungsflaechen/ita',
      'https://geodienste.ch/db/lwb_perimeter_ln_sf/deu',
      'https://geodienste.ch/db/lwb_perimeter_ln_sf/fra',
      'https://geodienste.ch/db/lwb_perimeter_ln_sf/ita',
      'https://geodienste.ch/db/lwb_perimeter_terrassenreben/deu',
      'https://geodienste.ch/db/lwb_perimeter_terrassenreben/fra',
      'https://geodienste.ch/db/lwb_perimeter_terrassenreben/ita',
      'https://geodienste.ch/db/lwb_rebbaukataster/deu',
      'https://geodienste.ch/db/lwb_rebbaukataster/fra',
      'https://geodienste.ch/db/lwb_rebbaukataster/ita',
      'https://geodienste.ch/db/npl_laermempfindlichkeitsstufen/deu',
      'https://geodienste.ch/db/npl_nutzungsplanung/deu',
      'https://geodienste.ch/db/planerischer_gewaesserschutz/deu',
      'https://geodienste.ch/db/planerischer_gewaesserschutz/fra',
      'https://geodienste.ch/db/npl_waldgrenzen/deu',
      // non-SwissProjected test urls
      'http://wms.ga.admin.ch/1GE',
      'http://wms.ga.admin.ch/LG_DE_Geologie_und_Tektonik/wms',
      'http://bio.discomap.eea.europa.eu/arcgis/services/Ecosystem/Ecosystems/MapServer/WMSServer',
      'http://copernicus.discomap.eea.europa.eu/arcgis/services/Corine/CLC2012_WM/MapServer/WMSServer',
      'https://image.discomap.eea.europa.eu/arcgis/services/GioLandPublic/DEM/MapServer/WMSServer',
      'https://image.discomap.eea.europa.eu/arcgis/services/Elevation/Hillshade/MapServer/WMSServer',
      'http://eumetview.eumetsat.int/geoserver/wms',
      'http://osm.omniscale.net/proxy/service',
      'https://ows.terrestris.de/osm/service',
      'https://ows.terrestris.de/osm-gray/service',
      'https://owsproxy.lgl-bw.de/owsproxy/ows/WMS_Maps4BW?request=GetCapabilities&service=WMS&Version=1.3.0',
      'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000017900001/MapServer/WMSServer',
      'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000017400001/MapServer/WMSServer',
      'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000016900001/MapServer/WMSServer',
      'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000013500001/MapServer/WMSServer',
      'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000013300001/MapServer/WMSServer',
      'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000013400001/MapServer/WMSServer',
      'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000013600001/MapServer/WMSServer',
      'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000013100001/MapServer/WMSServer',
      'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000001500003/MapServer/WMSServer',
      'http://rips-gdi.lubw.baden-wuerttemberg.de/arcgis/services/wms/UIS_0100000004200001/MapServer/WMSServer',
      // WMTS servers
      'https://tiles.arcgis.com/tiles/oPre3pOfRfefL8y0/arcgis/rest/services/Topographic_Map_Switzerland/MapServer/WMTS/1.0.0/WMTSCapabilities.xml',
      'https://www.gis.stadt-zuerich.ch/wmts/wmts-zh-stzh-ogd.xml',
      'http://www.basemap.at/wmts/1.0.0/WMTSCapabilities.xml',
      'https://wxs.ign.fr/bvl2gp6za3srtz6yblo9fx8o/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities',
      'http://cidportal.jrc.ec.europa.eu/copernicus/services/tile/wmts/1.0.0/WMTSCapabilities.xml',
      'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/WMTS/1.0.0/WMTSCapabilities.xml',
      'https://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer/WMTS/1.0.0/WMTSCapabilities.xml',
      'https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/WMTS/1.0.0/WMTSCapabilities.xml',
      'https://services.arcgisonline.com/arcgis/rest/services/World_Shaded_Relief/MapServer/WMTS/1.0.0/WMTSCapabilities.xml',
      'https://services.arcgisonline.com/arcgis/rest/services/ESRI_StreetMap_World_2D/MapServer/WMTS/1.0.0/WMTSCapabilities.xml',
      'https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Transportation/MapServer/WMTS/1.0.0/WMTSCapabilities.xml',
      'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/WMTS/1.0.0/WMTSCapabilities.xml',
      'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/WMTS/1.0.0/WMTSCapabilities.xml'
    ];

    // Typeahead manages a list of objects with a url property, so we
    // transform the servers which are defined only by a url into object.
    servers.forEach(function(server, idx) {
      if (angular.isString(server)) {
        servers[idx] = {
          'url': server
        }
      }
    });

    $scope.supportDnd = !gaBrowserSniffer.msie || gaBrowserSniffer.msie > 9;
    $scope.options = {};
    $scope.options.servers = servers;
    $scope.options.isValidUrl = gaUrlUtils.isValid;
    $scope.options.getOlLayerFromGetCapLayer = function(layer) {
      if (layer.wmsUrl) {
        return gaWms.getOlLayerFromGetCapLayer(layer);
      } else if (layer.capabilitiesUrl) {
        return gaWmts.getOlLayerFromGetCap($scope.map, $scope.wmtsGetCap,
            layer.Identifier, {
              capabilitiesUrl: layer.capabilitiesUrl
            });
      }
    };
    $scope.options.addPreviewLayer = function(map, getCapLayer) {

      gaPreviewLayers.addGetCapLayer(map, $scope.wmtsGetCap ||
          $scope.wmsGetCap, getCapLayer);
    };
    $scope.options.removePreviewLayer = gaPreviewLayers.removeAll;
    $scope.options.transformExtent = gaMapUtils.intersectWithDefaultExtent;

    // Transform the url before loading it.
    $scope.options.transformUrl = function(url) {
      // If the url has no file extension or a map parameter,
      // try to load a WMS/WMTS GetCapabilities.
      if ((!/\.(kml|kmz|xml|txt)/i.test(url) &&
          !/\w+\/\w+\.[a-zA-Z]+$/i.test(url)) ||
          /map=/i.test(url)) {
        // Append WMS GetCapabilities default parameters
        url = gaUrlUtils.append(url, /wmts/i.test(url) ?
          'SERVICE=WMTS&REQUEST=GetCapabilities&VERSION=1.0.0' :
          'SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0');

        // Use lang param only for admin.ch servers
        if (/admin\.ch/.test(url)) {
          url = gaUrlUtils.append(url, 'lang=' + gaLang.get());
        }
        // Replace the subdomain template if exists
        url = url.replace(/{s}/, '');
      }
      // Save the good url for the import component.
      $scope.getCapUrl = url;
      return gaUrlUtils.proxifyUrl(url);
    };

    // Manage data depending on the content
    // @param data<String> Content of the file.
    // @param file<Object> Informations of the file (if available).
    $scope.options.handleFileContent = function(data, file) {
      var defer = $q.defer();
      $scope.wmsGetCap = null;
      $scope.options.wmsGetCapUrl = null;
      $scope.wmtsGetCap = null;
      file = file || {};

      if (gaFile.isWmsGetCap(data)) {
        $scope.wmsGetCap = data;
        $scope.options.wmsGetCapUrl = file.url;
        defer.resolve({
          message: 'upload_succeeded'
        });

      } else if (gaFile.isGpx(data) || gaFile.isKml(data)) {

        gaVector.addToMap($scope.map, data, {
          url: file.url || URL.createObjectURL(file),
          useImageVector: gaVector.useImageVector(file.size),
          zoomToExtent: true

        }).then(function() {
          defer.resolve({
            message: 'parse_succeeded'
          });

        }, function(reason) {
          $window.console.error('Vector data parsing failed: ', reason);
          defer.reject({
            message: 'parse_failed',
            reason: reason
          });
        });

      } else if (gaFile.isWmtsGetCap(data)) {
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

      return defer.promise;
    };
  });
})();
