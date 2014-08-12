.. GeoAdmin API documentation master file, created by
   sphinx-quickstart on Wed Jul 21 07:44:14 2010.      
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

.. raw:: html

  <head>
    <link href="_static/custom.css" rel="stylesheet" type="text/css" />
  </head>


.. raw:: html

  <img src="_static/bg_header_logo.jpg" alt="bg_header_logo">

--------------------

Welcome to GeoAdmin API's documentation!
========================================

.. meta::
   :google-site-verification: b6J0Gs_QtsxWzW6PY5Uie1UkQC5SYA40k1kP6fcgFJ4

The GeoAdmin API allows the integration in web pages of geospatial information provided by the Swiss Confederation.

These pages are dedicated to developer interested in using the API.

Use the GeoAdmin API Forum to ask questions: http://groups.google.com/group/geoadmin-api

.. raw:: html

  <style>
    #map {
      width: 100%;
      height: 400px;
      border: 1px;
      border-style: solid;
      border-color: #efefef;
    }
  </style>
  <body>
    <div id="map"></div>
    <script type="text/javascript" src="uncached_loader.js"></script>
    <script type="text/javascript">
      var layer = ga.layer.create('ch.swisstopo.pixelkarte-farbe');
      var map = new ga.Map({
        target: 'map',
        layers: [layer],
        view: new ol.View2D({
          resolution: 750,
          center: [670000, 180000]
        })
      });
    </script>
  </body>
  
`Do you want to see the code? <api/quickstart.html>`_

.. warning::
    The GeoAdmin API and all GeoAdmin services can be used in both HTTP and HTTPS contexts. Though most layers are freely accessible, a `swisstopo web access <http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/services/web_services/webaccess.html>`_ is required for some of them. For a list of all available layers and their accessibility please refer to the `FAQ <api/faq/index.html#which-layers-are-available>`_.


API
===

.. toctree::
   :maxdepth: 1

   api/quickstart
   api/examples
   api/doc
   services/sdiservices
   api/faq/index
   api/migration
   
Release notes
=============

.. toctree::
   :maxdepth: 1 
 
   releasenotes/index

Terms of use
============

.. toctree::
   :maxdepth: 1
   :hidden:

   _static/terms_of_use

.. note::
    The GeoAdmin API terms of use are accessible here: `Terms of Use <http://www.geo.admin.ch/internet/geoportal/de/home/services/geoservices/display_services/api_services/order_form.html>`_

