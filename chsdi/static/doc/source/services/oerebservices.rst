.. raw:: html

  <head>
    <link href="../_static/custom.css" rel="stylesheet" type="text/css" />
  </head>


.. _oereb_feature_service:

OEREB/RDPPF: Feature Service
============================

This service can be used to discover features at a specific location.
The returned format is Interlis (XML).

.. warning::
  This service is only available for the following layers:

  - ch.bazl.projektierungszonen-flughafenanlagen.oereb
  - ch.bazl.sicherheitszonenplan.oereb
  - ch.bav.kataster-belasteter-standorte-oev.oereb 

URL
***

http://api3.geo.admin.ch/rest/services/api/MapServer/identify

Input Parameters
****************

No more than 50 features can be retrieved per request.

+-----------------------------------+-------------------------------------------------------------------------------------------+
| Parameters                        | Description                                                                               |
+===================================+===========================================================================================+
| **geometry (required)**           | The geometry to identify on. The geometry is specified by the geometry type.              |
|                                   | One can use both, the simple syntax (comma separated list) and the complex one            |
|                                   | (`ESRI syntax for geometries                                                              |
|                                   | <http://help.arcgis.com/en/arcgisserver/10.0/apis/rest/geometry.html>`_).                 |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| **geometryType (required)**       | The type of geometry to identify on. Possible values are:                                 |
|                                   | esriGeometryPoint or esriGeometryPolyline or esriGeometryPolygon or esriGeometryEnvelope. |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| **layers (required)**             | The layer to perform the identify operation on. Only one layer can be requested at a time |
|                                   | (notation: **all:{layerName}**).                                                          |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| **mapExtent (required)**          | The extent of the map (minx, miny, maxx, maxy).                                           |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| **imageDisplay (required)**       | The screen image display parameters (width, height and dpi) of the map.                   |
|                                   | The mapExtent and the imageDisplay parameters are used by the server to calculate the     |
|                                   | distance on the map to search based on the tolerance in screen pixels.                    |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| **tolerance (required)**          | The tolerance in pixels around the specified geometry. This parameter is used to create   |
|                                   | a buffer around the geometry. Therefore, a tolerance of 0 deactivates the buffer          |
|                                   | creation.                                                                                 |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| **returnGeometry (optional)**     | This parameter defines whether the geometry is returned or not. Default to "true".        |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| **geometryFormat (optional)**     | Values: **interlis only for now!!**                                                       |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| **lang (optional)**               | The language (when available). Possible values: de (default), fr, it, rm, en.             |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| **callback (optional)**           | The name of the callback function.                                                        |
+-----------------------------------+-------------------------------------------------------------------------------------------+

Examples
********

- Look for all the features of ch.bazl.projektierungszonen-flughafenanlagen.oereb using a point: `https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometry=682414.31244,257059.38135&geometryType=esriGeometryPoint&layers=all:ch.bazl.projektierungszonen-flughafenanlagen.oereb&mapExtent=671164.31244,253770,690364.31244,259530&imageDisplay=1920,576,96&tolerance=5&geometryFormat=interlis <../../../rest/services/api/MapServer/identify?geometry=682414.31244,257059.38135&geometryType=esriGeometryPoint&layers=all:ch.bazl.projektierungszonen-flughafenanlagen.oereb&mapExtent=671164.31244,253770,690364.31244,259530&imageDisplay=1920,576,96&tolerance=5&geometryFormat=interlis>`_
- Look for all the features of ch.bazl.sicherheitszonenplan.oereb using a bounding box (envelope): `https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometry=680000,254000,690000,260000&geometryType=esriGeometryEnvelope&layers=all:ch.bazl.sicherheitszonenplan.oereb&mapExtent=671164.31244,253770,690364.31244,259530&imageDisplay=1920,576,96&tolerance=5&geometryFormat=interlis <../../../rest/services/api/MapServer/identify?geometry=680000,254000,690000,260000&geometryType=esriGeometryEnvelope&layers=all:ch.bazl.sicherheitszonenplan.oereb&mapExtent=671164.31244,253770,690364.31244,259530&imageDisplay=1920,576,96&tolerance=5&geometryFormat=interlis>`_
- Look for all the features of ch.bav.kataster-belasteter-standorte-oev.oereb using a polygon: `https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometry={"rings" : [[ [675000,245000], [670000,255000], [680000,260000], [690000,255000], [685000,240000], [675000,245000]]]}&geometryType=esriGeometryPolygon&layers=all:ch.bav.kataster-belasteter-standorte-oev.oereb&mapExtent=671164.31244,253770,690364.31244,259530&imageDisplay=1920,576,96&tolerance=5&geometryFormat=interlis <../../../rest/services/api/MapServer/identify?geometry={"rings" : [[ [675000,245000], [670000,255000], [680000,260000], [690000,255000], [685000,240000], [675000,245000]]]}&geometryType=esriGeometryPolygon&layers=all:ch.bav.kataster-belasteter-standorte-oev.oereb&mapExtent=671164.31244,253770,690364.31244,259530&imageDisplay=1920,576,96&tolerance=5&geometryFormat=interlis>`_

