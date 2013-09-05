(function() {
    goog.provide('ga_print_directive');

    var module = angular.module('ga_print_directive',
        ['pascalprecht.translate']);

    module.controller('GaPrintDirectiveController',
        ['$scope', '$http', '$translate', 'gaLayers',
        function($scope, $http, $translate, gaLayers) {
        var printPath = $scope.options.printPath;
        var http = $http.get(printPath +
            '/info.json?url=' + encodeURIComponent(printPath));
        http.success(function(data, status, header, config) {
            $scope.capabilities = data;

            // default values:
            $scope.layout = data.layouts[0];
            $scope.dpi = data.dpis[0];

            $scope.scales = data.scales; // FIXME
        });


        $scope.encodeLayer = function(layer, proj) {
            var src = layer.getSource();
            var ext = proj.getExtent();

            var encLayer;

            // FIXME add other source type
            if (src.constructor == ol.source.WMTS) {
                encLayer = $scope.encoders.layers['WMTS'].call(this, layer);
            }
            return encLayer;

        };

        $scope.encoders = {
            'layers': {
                'WMTS': function(layer) {
                      var enc = {
                          type: 'WMTS',
                          layer: layer.get('id'),
                          opacity: 1,
                          baseURL: 'http://wmts.geo.admin.ch',
                          maxExtent: [420000, 30000, 900000, 350000],
                          tileOrigin: [420000, 350000],
                          tileSize: [256, 256],
                          style: 'default',
                          resolutions: [4000,
                                        3750,
                                        3500,
                                        3250,
                                        3000,
                                        2750,
                                        2500,
                                        2250,
                                        2000,
                                        1750,
                                        1500,
                                        1250,
                                        1000,
                                         750,
                                         650,
                                         500,
                                         250,
                                         100,
                                          50,
                                          20,
                                          10,
                                           5,
                                         2.5,
                                           2,
                                         1.5,
                                           1,
                                         0.5],
                          zoomOffset: 0,
                          version: '1.0.0',
                          requestEncoding: 'REST',
                          formatSuffix: 'jpeg',
                          style: 'default',
                          dimensions: ['TIME'],
                          params: {'TIME': '20130213'},
                          matrixSet: '21781'
                    };
                    return enc;
                }
            }
        };

        $scope.getNearestScale = function(target, scales) {

            var nearest = null;

            angular.forEach(scales, function(scale) {
                if (nearest == null ||
                    Math.abs(scale - target) < Math.abs(nearest - target)) {
                        nearest = scale;
                }
             });
            return nearest;
        };

        $scope.downloadUrl = function(url) {
            window.location.href = url;
        };

        $scope.submit = function() {
            // http://mapfish.org/doc/print/protocol.html#print-pdf
            //debugger;
            var view = this.map.getView();
            var proj = view.getProjection();
            var lang = $translate.uses();
            var configLang = 'lang' + lang;
            var defaultPage = {};
            defaultPage['lang' + lang] = true;

            var encLayers = [];

            var layers = this.map.getLayers();
            angular.forEach(layers, function(layer) {
                var enc = $scope.encodeLayer(layer, proj);
                encLayers.push(enc);
            });
            // scale = resolution * inches per map unit (m) * dpi
            var scale = parseInt(view.getResolution() * 39.37 * 254);
            var scales = this.scales.map(function(scale) {
                return parseInt(scale.value);
            });
            var spec = {
                layout: this.layout.name,
                srs: proj.getCode(),
                units: proj.getUnits(),
                rotation: view.getRotation(),
                app: 'config',
                //topic name
                lang: $translate.uses(),
                dpi: this.dpi.value,
                layers: encLayers,
                pages: [
                angular.extend({
                    center: view.getCenter(),
                    // scale has to one of the advertise by the print server
                    scale: $scope.getNearestScale(scale, scales),
                    mapTitle: '',
                    mapFooter: '',
                    dataOwner: '',
                    customLogo: false
                }, defaultPage)]
            };
            var http = $http.post(this.capabilities.createURL +
                         '?url=' + encodeURIComponent($scope.options.printPath +
                                                       '/create.json'), spec);
            http.success(function(data) {
                $scope.downloadUrl(data.getURL);
            });
        };
    }]);

    module.directive('gaPrint',
            ['$http', '$log', '$translate', function($http, $log, $translate) {
        return {
            restrict: 'A',
            templateUrl: 'components/print/partials/print.html',
            controller: 'GaPrintDirectiveController',
            link: function(scope, elt, attrs, controller) {

            }
        };
    }]);
})();
