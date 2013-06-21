<!DOCTYPE html>
<html ng-app="ga">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
    <link href="${version}/css/app.css" rel="stylesheet" media="screen">
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
      <div class="map" x-ga-map="map"></div>
      <div class=" footer navbar navbar-fixed-bottom"
           ng-controller="GaMousePositionController">
        <form class="navbar-form pull-left">
          <select
            ng-model="mousePositionProjection"
            ng-options="p.value as p.label for p in mousePositionProjections">
          </select>
        </form>
        <p class="navbar-text">{{mousePositionValue | coordXY:2}}</p>
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
                <%include file="app/print/partials/form.html"/>
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
    <script src="${version}/lib/angular-1.1.5.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/proj4js/1.1.0/proj4js-compressed.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/proj4js/1.1.0/defs/EPSG21781.js"></script>
    <script src="${version}/lib/jquery-2.0.2.min.js"></script>
    <script src="${version}/lib/bootstrap-3.0.0.js"></script>
    <script src="${version}/lib/ol.js"></script>
    <script src="${version}/build/app.js"></script>
% else:
    <script src="${version}/lib/angular-1.1.5.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/proj4js/1.1.0/proj4js-compressed.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/proj4js/1.1.0/defs/EPSG21781.js"></script>
    <script src="${version}/lib/jquery-2.0.2.min.js"></script>
    <script src="${version}/lib/bootstrap-3.0.0.js"></script>
    <script src="${version}/lib/ol-whitespace.js"></script>

    <!-- Use Closure's base.js script to load the application scripts -->
    <script>
      window.CLOSURE_NO_DEPS = true;
    </script>
    <script src="${version}/lib/closure/base.js"></script>
    <script src="${version}/build/deps.js"></script>
    <script>
      goog.require('ga');
    </script>
%endif

  </body>
</html>
