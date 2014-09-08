.. raw:: html

  <head>
    <link href="../_static/custom.css" rel="stylesheet" type="text/css" />
  </head>

API Quick start
===============

.. note::

  The GeoAdmin API and all GeoAdmin services can be used in both HTTP and HTTPS contexts. Though most layers are freely accessible, a `swisstopo web access <http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/services/web_services/webaccess.html>`_ is required for some of them. For a list of all available layers and their accessibility please refer to the `FAQ <faq/index.html#which-layers-are-available>`_.

.. raw:: html

    </div>

Put a map on a page
-------------------

Below you'll find a complete working example. Create a new file, copy/paste the content below, and open it a browser:

.. code-block:: html

  <!doctype html>
  <html lang="en">
    <head>
      <style>
        .map {
          height: 400px;
          width: 100%;
        }
      </style>
      <title>GeoAdmin API example</title>
    </head>
    <body>
      <h2>My first GeoAdmin map</h2>
      <script src="http://api3.geo.admin.ch/loader.js?lang=en" type="text/javascript"></script>
      <div id="map" class="map"></div>
      <script type="text/javascript">
        var layer = ga.layer.create('ch.swisstopo.pixelkarte-farbe');
        var map = new ga.Map({
          target: 'map',
          layers: [layer],
          view: new ol.View2D({
            resolution: 500,
            center: [670000, 160000]
          })
        });
      </script>
    </body>
  </html>
  
Understanding what is going on
------------------------------

To include a map in a web page you will need 3 things:

#. Include the GeoAdmin JavaScript API
#. <div> map container
#. JavaScript to create a simple map with a layer

Include the GeoAdmin JavaScript API
-----------------------------------

.. code-block:: html

  <script src="http://api3.geo.admin.ch/loader.js?lang=en" type="text/javascript"></script>

The first part is to include the GeoAdmin API library. This loader will load all necessary JavaScript and CSS code. You can force the language (en, de, fr, it, rm) or let the navigator language be used.

<div> to contain the map
------------------------

.. code-block:: html

  <div id="map" class="map"></div>
  
The map in the application is contained in a <div> HTML element. Through this <div> the map properties like width, height and border can be controlled through CSS. Here's the CSS element used to make the map 400 pixels high and as wide as the browser window.

.. code-block:: html

  <style>
    .map {
      height: 400px;
      width: 100%;
    }
  </style>
  
JavaScript to create a simple map with a layer
----------------------------------------------

.. code-block:: javascript

  var layer = ga.layer.create('ch.swisstopo.pixelkarte-farbe');
    var map = new ga.Map({
      target: 'map',
      layers: [layer],
      view: new ol.View2D({
        resolution: 500,
        center: [670000, 160000]
      })
    });
    
With this JavaScript code, a map object is created with a GeoAdmin layer (full list available `here <http://api3.geo.admin.ch/api/faq/index.html#which-layers-are-available>`_ ). Let's break this down:

The following line creates a GeoAdmin layer:

.. code-block:: javascript

  var layer = ga.layer.create('ch.swisstopo.pixelkarte-farbe');
  
The following line creates an OpenLayers Map object. It is preconfigured with the Swiss coordinate system.

.. code-block:: javascript

  var map = new ga.Map({ ... });
  
To attach the map object to the <div>, the map object takes a target into arguments. The value is the id of the <div>:

.. code-block:: javascript

  target: 'map',
  
The layers: [ ... ] array is used to define the list of layers available in the map.

.. code-block:: javascript

  layers: [layer],

The next part of the Map object is the View. The view allow to specify the center, resolution, and rotation of the map. Right now, only View2D is supported, but other views should be available at some point. The simplest way to define a view is to define a center point and a resolution. The GeoAdmin API supports the following resolution: 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5, 0.25, 0.1 but intermediate resolutions can be used without problems. The resolution corresponds to the real size (on the earth) of one pixel. 

.. code-block:: javascript

  view: new ol.View2D({
    resolution: 500,
    center: [670000, 160000]
  })
  
You will notice that the center specified is in Swiss coordinate system (EPSG:21781). 

(Quickstart adapted of the `OpenLayers 3 Quickstart <http://ol3js.org/en/master/doc/quickstart.html>`_)

