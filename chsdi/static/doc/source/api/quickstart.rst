Quick start
===========

Put a map on a page
~~~~~~~~~~~~~~~~~~~

Below you'll find a complete working example. Create a new file, copy in the contents below, and open in a browser:

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
      <script src="http://api3.geo.admin.ch/loader.js?lang=en" type="text/javascript"></script>
      <title>GeoAdmin API example</title>
    </head>
    <body>
      <h2>My first GeoAdmin map</h2>
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
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To include a map in a web page you will need 3 things:

#. Include the GeoAdmin JavaScript API
#. <div> map container
#. JavaScript to create a simple map with a layer

Include the GeoAdmin JavaScript API
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: html

  <script src="http://api3.geo.admin.ch/loader.js?lang=en" type="text/javascript"></script>

The first part is to include the GeoAdmin API library. This loader will load all necessary JavaScript and CSS code. You can force the language (en, de, fr, it, rm) or let the navigator language be used.

<div> to contain the map
~~~~~~~~~~~~~~~~~~~~~~~~

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

  

  









