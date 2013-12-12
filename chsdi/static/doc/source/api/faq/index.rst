API FAQ
=======

.. contents::

General Information
~~~~~~~~~~~~~~~~~~~

What is the GeoAdmin API ?
--------------------------

The GeoAdmin API allows the integration in web pages of geospatial information provided by the Swiss Confederation.

The GeoAdmin API provides also some REST web services like :doc:`../../services/sdiservices`

Who can use the GeoAdmin API ?
------------------------------

The GeoAdmin API terms of use are accessible here: http://www.geo.admin.ch/internet/geoportal/de/home/services/geoservices/display_services/api_services/order_form.html

What is the license of the GeoAdmin API ?
-----------------------------------------

The GeoAdmin API has a BSD license.

What are the technical restrictions of the GeoAdmin API ?
---------------------------------------------------------

The GeoAdmin API has been tested in the two last version of the following browsers:  Firefox, Internet Explorer, Chrome, Safari.

The GeoAdmin API does support mobile devices.

Is there a forum or a mailing list ?
------------------------------------

Yes, under http://groups.google.com/group/geoadmin-api
Feel free to use it and ask all the questions you want.

.. _available_layers:

Which layers are available ?
----------------------------

Some layers can’t be freely used. These layers are accessible by the way of `swisstopo web access - WMTS documentation <http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/services/web_services/webaccess.html>`_

Here is a list of the layers that requires a swisstopo web acesss:

.. raw:: html

   <body>
      <div id="notfree" style="margin-left:10px;"></div>
   </body>

Here is a list of all the freely accessible layers:

.. raw:: html

   <body>
      <div id="free" style="margin-left:10px;"></div>
   </body>

.. raw:: html

   <script type="text/javascript">

    function init() {
        var myInnerHtml_free, myInnerHtml_notfree, layerArray_free, layerArray_notfree, layers;
        myInnerHtml_free = "<br><table border=\"0\">";
        myInnerHtml_notfree =  "<br><table border=\"0\">";
        layerArray_free = [];
        layerArray_notfree = [];
        layers = getConfig();
        var counterFree = 1;
        for (var layer in layers) {
          if (!layers[layer]['parentLayerId']) {
            myInnerHtml_free = myInnerHtml_free + '<tr><td>' + counterFree + '</td><td><a href="http://map3.geo.admin.ch/?layers=' +
                                      layer + '" target="new"> ' + layer + '</a>&nbsp('+layers[layer]['label']+')</td></tr>';
            counterFree++;
          }
        }
        document.getElementById("free").innerHTML=myInnerHtml_free;
        
   }

   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../loader.js?lang=en"></script>
   </body>

What mean the permalink parameters ?
------------------------------------

The permalink parameters are used in map.geo.admin.ch. The JavaScript API doesn't support the pemalink parameters.

===================            ==========================================================    =========================================================
Parameter                      Description                                                    Example
===================            ==========================================================    =========================================================
lang                           Language of the interface: de, fr, it, rm or en               http://map.geo.admin.ch?lang=rm
zoom                           Zoom level, from 0 to 13                                      http://map.geo.admin.ch?zoom=12
Y                              easting value (from 450'000 to                                http://map.geo.admin.ch?Y=600000
                               900'000)
X                              northing value, ranging from 50'000 to                        http://map.geo.admin.ch?X=150000
                               350'000 (always smaller than Y)
bgLayer                        Base layer: one of `ch.swisstopo.pixelkarte-farbe`,           http://map.geo.admin.ch?bgLayer=voidLayer
                               `ch.swisstopo.pixelkarte-farbe` or `voidLayer`
layers                         Layer to display, see :ref:`available_layers`                 `http://map.geo.admin.ch/?layers=WMS%7C%7CGeothermie%7C%7C
                               for a complete list                                           http%3A%2F%2Fwms.geo.admin.ch%2F%3F%7C%7Cch.swisstopo.geo
                               KML layers are supported with a || separated list with:       logie-geophysik-geothermie,ch.ensi.zonenplan-notfallschut
                               KML||kml url                                                  z-kernanlagen,KML%7C%7Chttp%3A%2F%2Fwww.meteoschweiz.admi
                               WMS layers are supported with a || separated list with:       n.ch%2Fweb%2Fde%2Fklima%2Fmesssysteme%2Fboden%2Fgoogle_ea
                               WMS||layer title||wms url||layer name                         rth.Par.0007.DownloadFile.ext.tmp%2Fobs.kml <http://map.geo.admin.ch/?layers=WMS%7C%7CGeothermie%7C%7Chttp%3A%2F%2Fwms.geo.admin.ch%2F%3F%7C%7Cch.swisstopo.geologie-geophysik-geothermie,ch.ensi.zonenplan-notfallschutz-kernanlagen,KML%7C%7Chttp%3A%2F%2Fwww.meteoschweiz.admin.ch%2Fweb%2Fde%2Fklima%2Fmesssysteme%2Fboden%2Fgoogle_earth.Par.0007.DownloadFile.ext.tmp%2Fobs.kml>`_
layers_opacity                 Layers opaciy, should match number of layers (0-1.0)          http://map.geo.admin.ch?layers=ch.swisstopo.hiks-dufour&layers_opacity=0.5
layers_visibility              Toggle the visibility of layers present in the tree           `http://map.geo.admin.ch?layers=ch.swisstopo.hiks-dufour&l
                                                                                             ayers_visibility=False <http://map.geo.admin.ch?layers=ch.swisstopo.hiks-dufour&layers_visibility=False>`_
selectedNode                   Selected node in INSPIRE Catalog tree                         http://map.geo.admin.ch/?selectedNode=LT2_3
<layer bod id>                 Layer bod id (:ref:`available_layers`) from which             http://map.geo.admin.ch/?ch.bafu.bundesinventare-moorlandschaften=212,213
                               to highlight feature(s) with id                               
crosshair                      crosshair=<type>, possible type: cross, circle, bowl and      http://map.geo.admin.ch/?Y=538700&X=165890&zoom=6&crosshair=circle
                               point                                                         
===================            ==========================================================    =========================================================


How can I accessed the tiles ?
------------------------------

The tiles used in the GeoAdmin API are generated by `TileCache <http://www.tilecache.org>`_ and are stored according to
a RESTful OGC `Web Map Tile Service <http://www.opengeospatial.org/standards/wmts>`_ Implementation Standard schema.

The parameters for the tiles are the following:

 * **Resolution** (meters): 4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5,0.25,0.1

 * **Maximum extent bounding box**: 420000,30000,900000,350000

 * **Coordinate system**: EPSG:21781

For practical information on how to use the tiles, see our description of the :ref:`wmts_description` service.

Where is the source code ?
--------------------------

The source code of the GeoAdmin API project can be found here: https://github.com/geoadmin/ol3


Can I use http://localhost to test my developments ?
----------------------------------------------------

Yes, localhost can be used to test the developments. In all cases, you have to follow the terms of use: http://www.geo.admin.ch/internet/geoportal/de/home/services/geoservices/display_services/api_services/order_form.html

