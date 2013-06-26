<!DOCTYPE html>
<html ng-app="ga">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
    <link href="css/app.css" rel="stylesheet" media="screen">
  </head>
  <body ng-controller="GaMapController">
    <div class="wrapper">
      <div class="header navbar navbar-fixed-top">
        <form class="navbar-form pull-right"
              ng-controller="GaBackgroundLayerSelectorController">
          <div x-ga-background-layer-selector
               x-ga-background-layer-selector-map="map"
               x-ga-background-layer-selector-wmts-url="wmtsUrl"
               x-ga-background-layer-selector-wmts-layers="wmtsLayers"></div>
        </form>
      </div>
      <div class="map" x-ga-map="map" x-ga-map-resolutions="resolutions"></div>
      <div class="footer navbar navbar-fixed-bottom">
        <div class="scaleline pull-left" x-ga-scale-line x-ga-scale-line-map="map"></div>
        <div class="attribution pull-left" x-ga-attribution x-ga-attribution-map="map"></div>
        <div class="mouseposition pull-left" ng-controller="GaMousePositionController">
          <select class="mouseposition-select"
            ng-model="mousePositionProjection"
            ng-options="p.label for p in mousePositionProjections">
          </select>
          <div class="mouseposition-value"
             x-ga-mouse-position
             x-ga-mouse-position-map="map"
             x-ga-mouse-position-projection="mousePositionProjection"></div>
        </div>
      </div>
    </div>

    <div class="pulldown">
      <div class="content collapse in">
        <div class="accordion-group">
          <div class="accordion-heading">
            <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent=".pulldown .content" data-target=".pulldown .content .print" href="#">
              Print
            </a>
            <div class="print collapse">
              <div class="accordion-inner">
                <%include file="src/print/partials/form.html"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center">
        <button type="button" data-toggle="collapse" data-target=".pulldown .content" class="toggle btn btn-default">
          <span class="pulldown-close">close</span>
          <span class="pulldown-open">open</span>
        </button>
      </div>
    </div>
% if mode == "prod":
    <script src="lib/angular-1.1.5.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/proj4js/1.1.0/proj4js-compressed.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/proj4js/1.1.0/defs/EPSG21781.js"></script>
    <script src="lib/jquery-2.0.2.min.js"></script>
    <script src="lib/bootstrap-3.0.0.min.js"></script>
    <script src="lib/ol.js"></script>
    <script src="src/app.js"></script>
% else:
    <script src="lib/angular-1.1.5.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/proj4js/1.1.0/proj4js-compressed.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/proj4js/1.1.0/defs/EPSG21781.js"></script>
    <script src="lib/jquery-2.0.2.min.js"></script>
    <script src="lib/bootstrap-3.0.0.js"></script>

    <!-- Use Closure to load the application scripts -->
    <script>
      window.CLOSURE_NO_DEPS = true;
      window.CLOSURE_BASE_PATH = "src/";
    </script>

    <!-- ol-whitespace.js includes Closure's base.js code, so we don't
         need to load base.js ourselves. We keep Closure's base.js file
         around in case we need to test with ol.js or ol-simple.js. -->
    <script src="lib/ol-whitespace.js"></script>
    <!--<script src="lib/closure/base.js"></script>-->
    <script src="src/deps.js"></script>

    <script>
      goog.require('ga');
    </script>
%endif

  </body>
</html>
