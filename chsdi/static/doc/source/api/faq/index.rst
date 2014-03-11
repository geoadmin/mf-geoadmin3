API FAQ
=======

.. contents::

General Information
~~~~~~~~~~~~~~~~~~~

What is the GeoAdmin API ?
--------------------------

The GeoAdmin API allows the integration in web pages of geospatial information provided by the Swiss Confederation and Cantons.

The GeoAdmin API provides also :ref:`rest_services`

Who can use the GeoAdmin API ?
------------------------------

The GeoAdmin API terms of use are accessible here: http://www.geo.admin.ch/internet/geoportal/de/home/services/geoservices/display_services/api_services/order_form.html

What is the license of the GeoAdmin API ?
-----------------------------------------

The GeoAdmin JavaScript API has a BSD license.

Are the GeoAdmin services running ?
-----------------------------------

The status of all GeoAdmin services and applications is available here: http://status.geo.admin.ch 

What are the technical restrictions of the GeoAdmin API ?
---------------------------------------------------------

The GeoAdmin API has been tested in the two last versions of the following browsers:  Firefox, Internet Explorer, Chrome, Safari.

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
        $.getJSON( "../../rest/services/api-notfree/MapServer/layersConfig", function( data ) {
           var myInnerHtml_notfree =  "<br><table border=\"0\">";
           var layers_notfree = data;
           var counterNotFree = 1;
           for (var layer in layers_notfree) {
              if (!layers_notfree[layer].parentLayerId) {
                  myInnerHtml_notfree += '<tr><td>' + counterNotFree + '</td><td><a href="http://map3.geo.admin.ch/?layers=' +
                    layer + '" target="new"> ' + layer + '</a>&nbsp('+layers_notfree[layer].label+')</td></tr>';
                  counterNotFree++;
              }
           }
           document.getElementById("notfree").innerHTML=myInnerHtml_notfree;
        });
        $.getJSON( "../../rest/services/api-free/MapServer/layersConfig", function( data ) {
           var myInnerHtml_free =  "<br><table border=\"0\">";
           var layers_free = data;
           var counterFree = 1;
           for (var layer in layers_free) {
              if (!layers_free[layer].parentLayerId) {
                  myInnerHtml_free += '<tr><td>' + counterFree + '</td><td><a href="http://map3.geo.admin.ch/?layers=' +
                    layer + '" target="new"> ' + layer + '</a>&nbsp('+layers_free[layer].label+')</td></tr>';
                  counterFree++;
              }
           }
           document.getElementById("free").innerHTML=myInnerHtml_free;
        });
        $.getJSON( "../../rest/services/api/MapServer/layersConfig", function( data ) {
          var myInnerHtml_queryable = "<br><table border=\"0\">";
          var myInnerHtml_searchable =  "<br><table border=\"0\">";
          var layers_api = data;
          var counterQueryable = 1;
          var counterSearchable = 1;
          for (var layer in layers_api) {
            if (!layers_api[layer].parentLayerId) {
              if (layers_api[layer].queryable) {
                myInnerHtml_queryable += '<tr><td>' + counterQueryable + '</td><td><a href="http://map3.geo.admin.ch/?layers=' +
                  layer + '" target="new"> ' + layer + '</a>&nbsp('+layers_api[layer].label+')</td></tr>';
                counterQueryable++;
              }
              if (layers_api[layer].searchable) {
                myInnerHtml_searchable += '<tr><td>' + counterSearchable + '</td><td><a href="http://map3.geo.admin.ch/?layers=' +
                  layer + '" target="new"> ' + layer + '</a>&nbsp('+layers_api[layer].label+')</td></tr>';
                counterSearchable++;
              }
            }
          }
          document.getElementById("queryable").innerHTML=myInnerHtml_queryable;
          document.getElementById("searchable").innerHTML=myInnerHtml_searchable;
        });

   }

   </script>

   <body onload="init();">
   </body>

.. _querybale_layers:

Which layers have a tooltip?
----------------------------

Not all the layers have a tooltip. Here is a complete list of all the layers that have a tooltip:

.. raw:: html

  <body>
    <div id="queryable" style="margin-left:10px;"></div>
  </bod>

.. _searchable_layers:

Which layers are searchable?
----------------------------

We define a layer as searchable when its features can be searched. Here is a list of all searchable layers:

.. raw:: html

  <body>
    <div id="searchable" style="margin-left:10px;"></div>
  </bod>

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

I have difficulty to use map.geo.admin.ch, where can I get more help ?
----------------------------------------------------------------------

The help pages of http://map.geo.admin.ch is accessible here: http://help.geo.admin.ch/

Can I use http://localhost to test my developments ?
----------------------------------------------------

Yes, localhost can be used to test the developments. In all cases, you have to follow the terms of use: http://www.geo.admin.ch/internet/geoportal/de/home/services/geoservices/display_services/api_services/order_form.html

