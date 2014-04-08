.. GeoAdmin API documentation master file, created by
   sphinx-quickstart on Wed Jul 21 07:44:14 2010.      
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to GeoAdmin API's documentation!
========================================

The GeoAdmin API allows the integration in web pages of geospatial information provided by the Swiss Confederation.

These pages are dedicated to developer interested in using the API.

Use the GeoAdmin API Forum to ask questions: http://groups.google.com/group/geoadmin-api

.. raw:: html

  <style>
    #map {
      width: 600px;
      height: 400px;
      border: 1px solid black;
    }
  </style>
  <body>
    <div id="map"></div>
    <script type="text/javascript" src="../../../loader.js"></script>
    <script type="text/javascript">
      var layer = ga.layer.create('ch.swisstopo.pixelkarte-farbe');
      var map = new ga.Map({
        target: 'map',
        layers: [layer],
        view: new ol.View2D({
          resolution: 750,
          center: [660000, 170000]
        })
      });
    </script>
  </body>
  
`Do you want to see the code? <api/quickstart.html>`_

.. raw:: html 

    <div class="warning"i style="background-color: #ffffff; padding: 5px; border: 1px solid black;">
    <img src="_static/warning.png" style="float: left; margin: 10px;" />

The GeoAdmin API and all GeoAdmin services can be used in both HTTP and HTTPS contexts. Though most layers are freely accessible, a `swisstopo web access <http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/services/web_services/webaccess.html>`_ is required for some of them. For a list of all available layers and their accessibility please refer to the `FAQ <api/faq/index.html#which-layers-are-available>`_.

.. raw:: html

    </div>


API
***

JavaScript API
--------------

.. toctree::
   :maxdepth: 1

   api/quickstart
   api/doc
   api/faq/index
   api/examples
   api/migration
   
Services API
------------

.. toctree::
   :maxdepth: 1

   services/sdiservices

Terms of use
************

The GeoAdmin API terms of use are accessible here: http://www.geo.admin.ch/internet/geoportal/de/home/services/geoservices/display_services/api_services/order_form.html

Release Notes
*************

.. toctree::
   :maxdepth: 1

   releasenotes/index
   
Indices and tables
==================

* :ref:`genindex`
* :ref:`search`

