.. raw:: html

  <head>
    <link href="../_static/custom.css" rel="stylesheet" type="text/css" />
  </head>

API Integrate CMS 
=================

Result:
-------

.. image:: image/result.jpg

Procedure:
----------
#. Open the web page you want to modify using the CMS.(Example insted of: http://cmsr.*.admin.ch)
#. Enter you keyword and username 
#. We can modify the map as follows:(Tip: It'better to save our old code in a text editor of your choice in case the new code doesn't work)

Modify the map 
--------------

.. image:: image/properties.jpg

- About this example (Standortmarkierung mit Info-Box) we fill in the „Header Code“ the Code as follows: 

.. code-block:: html

 <meta charset="utf-8">
 <meta http-equiv="X-UA-Compatible" content="chrome=1">
 <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
 <script src="//code.jquery.com/jquery-1.10.1.min.js"></script>
 <script type="text/javascript" src="http://api3.geo.admin.ch/loader.js?mode=debug"></script>


- At this point the map doesn't exist yet. We must fill in the Javascript-Part. To do so, we have two possibilities: 
#. First possibility: Generate a new paragraph 
#. Open the side like: http://cmsr.*.admin.ch
#. Possibly: Fill in the keyword and the username
#. Show the picture below: 

.. image:: image/new_site.jpg
   
4.1 Open the generated file 

.. image:: image/open_new_file.jpg

4.2 The window is generated as follows 

.. image:: image/generated_page.jpg

4.3 This window appears (see below). Insert the HTML code (Javascript) and save it. Now, we can’t see the map, we must do the point 3.1 (show above) in this script. 

.. image:: image/fill_in_html.jpg

5. Second possibility: We have already a map put in the old API generated. Now, we try this follows steps: 

.. image:: image/new_code_in_html.jpg

5.1 The Code in our example (Waffenplatz Frauenfeld) is: 

.. code-block:: html

 <div id="map"></div>
 <style type="text/css">
      #map {
        width:100%;
        height:350px;
      }
      .element {
        background-color: white;
        padding-left: 8px;
        padding-bottom: 8px;
        padding-top: 8px;
        width: 220px;
        color: #555;
        font: 11px tahoma,arial,verdana,sans-serif;:wq
      }
      .title {
        margin-top: -4px;
        font-weight: bold;
      }
      .undertitle {
        font-style: normal;
        margin-bottom: -3px;
        margin-top: -5px;
      }
      .middle {
        margin-top: -9px;
        }
      .close {
        cursor: pointer;
        text-decoration: none;
        position: absolute;
        top: 2px;
        right: 8px;
        font-size: larger;
        font-weight: bold;
      }
 </style>
 <!--load api3 and set language-->
 <script type="text/javascript">
 <!--//Create a GeoAdmin Map-->
 var map = new ga.Map({
 <!--// Define the div where the map is placed-->
  target: 'map', 
 <!--// Create a 2D view-->
    view: new ol.View2D({
 <!--// 10 means that one pixel is 10m width and height-->
 <!--// List of resolution of the WMTS layers:-->
 <!--// 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5, 0.25, 0.1-->
    resolution: 5,
 <!--// Define a coordinate CH1903 (EPSG:21781) for the center of the view-->
    center: [709136, 270186]
  })
 });
 <!--// Create a background layer-->
 var lyr1 = ga.layer.create('ch.swisstopo.pixelkarte-farbe');
 var iconFeature = new ol.Feature({
  geometry: new ol.geom.Point([709136, 270186]),
  name: 'Null Island',
  population: 4000,
  rainfall: 500
 });
 var iconStyle = new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 0.5],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oLCAwhG8L1qXwAAAJ1SURBVDjLTZPBThRBEIa/6uleYtDVA8QHUGIw4ehVb3Ii+AK+guGid696Ud/AN4BAiFw9ePUAbmK4SIAo7OxuZtnZmZ7umfLQED1U0of6qur/q1oA9PgYWVlBBwNHCGt4v8Ws3GRa9BmPoSimDIc7jEYfqOtD+fw56MYGsruL6GCAPH6Mqjq+f9+jbZ9T1zArYVoo4zFMJsJoBMMh5PkBT55syNu3QZ89QwD07MxxcjJBZJEQFGME7+H8HC4vIc+5LqSMRsJsVuDcsnz7Fozu7zuOjvYoy0WKqeKccP8+3LkDvoHJJEVRwHQqVJVydXWXP392dXXVWcpyjbZ9DiggGIGmgdNTOPkFFxc3MMxmUJaCb5TQrBPCmmU43AKg64QQElhVMBrDZJzgsryBoaohBiFGEHllyfNNOoW2BV9DNU8G3gBlCfM51HWCQ4BOQQxo98Ly+3cfa5UQJCVVCZjP07uuUzQNhAhdB5kBI4qau5Y8hyxLlb3/B3gPtU9gDBDbZJPNQIRr2Viqaor3fWJMyU2T3G8aaGOS1ikYAZOBMSlAiLGwVNUOV1cvaVuIMU0S22uwTbvJDFgLCwsJjhFUQXXbEOMHQoC6VrxPBdr4H5wl8N49WFqC27eh11NcD5z7ZFjoHaJ6QIhCjErbpe4qSa+zcOsWLC4mCaqKdYK1X/D1YTrlN68de/s51byPqoIImUnde700Qa8HoIgIIRT8OFqWeRWMrq8j794HHj1YQuQA1XSNxkCWKSJK26YVqgqdfuHnz2WZV0EfPrz+TE+fIl+/oqurDu/XMGYLkU2c62MtwJQs28aYj1TVoQwGQVdWkONj/gL3ho+XUT2DTgAAAABJRU5ErkJggg=='
  })
 });
 iconFeature.setStyle(iconStyle);
 var vectorSource = new ol.source.Vector({
  features: [iconFeature]
 });
 var vectorLayer = new ol.layer.Vector({
  source: vectorSource
 });
 <!--//Create an overlay layer-->
 var element = $('<div class="element" >' +
    '<div class="title"<h3>Kdo FU Waffenplätze</h3></div>' +
    '<div class="undertitle">' +
      '<br>Kaserne Auenfeld<br>' +
      '<div class="middle">' +
        '<br>8500 Frauenfeld<br>' +
      '</div>' +
    '</div>' +
    '<div class="close">' +
      '<div type="button" onclick="window.toggle()"<span aria-hidden="true">X</span></div>' +
    '</div>' +
 '</div>'
 );
 var popup = new ol.Overlay({
  position: map.getView().getCenter(),
  positioning:'centre-center',
  element: element,
 });
           function toggle() {
  element.toggle();
 }
 <!--// Add the layers in the map-->
 map.addLayer(lyr1);
 map.addLayer(vectorLayer);
 map.addOverlay(popup);
 </script>


6. Is everything alright? Publish the new map in production.  

