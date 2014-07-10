Migration from API 2.0 guide
============================

Introduction
~~~~~~~~~~~~

The new version of the JavaScript GeoAdmin API is based on `Openlayers 3 <http://ol3js.org/>`_ only. The previous version was based on OpenLayers 2 and ExtJS 3. The new JavaScript API aims to support the mapping part and doesn't provide any UI elements except the one provided by OpenLayers 3.
You are therefore free to choose the JavaScript framework you want to use for the creation of UI elements.

The new service GeoAdmin API is implemented according to the `GeoServices REST API specification <http://www.opengeospatial.org/standards/requests/89>`_

Feature equivalence
~~~~~~~~~~~~~~~~~~~

GeoAdmin JavaScript API 3.0 has feature equivalence with GeoAdmin Light API 2.0.

GeoAdmin Service API 3.0 is migrated and has feature equivalence with GeoAdmin Service API 2.0.

Due to fact that OpenLayers 3 is the base library, the GeoAdmin JavaScript API 3.0 focuses on the map functions only:

- Map 
- Map navigation tools (pan/zoom) 
- Access to 200+ layers 
- Supporting standard formats (GeoJSON, KML, GPX etc) 
- Map feature request (tooltip) 
- All OpenLayers3 functions 

For building advanced map applications which require more functions, access to the source code of map.geo.admin.ch is provided in in https://github.com/geoadmin/mf-geoadmin3 

API Loader
~~~~~~~~~~

As in previous version, the `API loader <http://api3.geo.admin.ch/loader.js>`_ loads all necessary CSS and JavaScript ressources. The loader is language dependent (?lang=fr parameter can be used, for example).

API Services
~~~~~~~~~~~~

This guide references the correspondances between the old and new API. You'll find the documentation for our new services at `this page <../../services/sdiservices.html>`_.

+-----------------------------------------------------------------------------------------+-------------------------------------------------------------------------------------------------------------------+
| **Old API**                                                                             | **New API**                                                                                                       |
+=========================================================================================+===================================================================================================================+
| **SwissSearch Geocoding**                                                               | `Search <../../services/sdiservices.html#search>`_                                                                |  
|                                                                                         |                                                                                                                   |
| **URL:** *swisssearch/geocoding?query=maisonnex*                                        | **URL:** *rest/services/api/SearchServer?searchText=maisonnex&type=locations*                                     |
+-----------------------------------------------------------------------------------------+-------------------------------------------------------------------------------------------------------------------+
| **SwissSearch Reversegeocoding**                                                        | `Identify <../../services/sdiservices.html#examples-of-reverse-geocoding>`_                                       |
|                                                                                         |                                                                                                                   |
| **URL:** *swissearch/reversegoecoding?easting=606163&northing=199965*                   | Please refer to the examples above.                                                                               |
+-----------------------------------------------------------------------------------------+-------------------------------------------------------------------------------------------------------------------+
| **Feature: [id]**                                                                       | `Feature Resource <../../services/sdiservices.html#feature-resource>`_                                            |
|                                                                                         |                                                                                                                   |
| **URL:** *feature/6644?layer=ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill*      | **URL:** *rest/services/api/MapServer/ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill/6644*                  |
|                                                                                         | *?geometryFormat=geojson*                                                                                         |
+-----------------------------------------------------------------------------------------+-------------------------------------------------------------------------------------------------------------------+
| **Feature: bbox**                                                                       | `Feature Resource <../../services/sdiservices.html#feature-resource>`_                                            |
|                                                                                         |                                                                                                                   |
| **URL:** *feature/bbox?layer=ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill*      | **URL:** *rest/services/api/MapServer/ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill/6644*                  | 
| *&ids=6644*                                                                             | *?returnGeometry=false*                                                                                           |
+-----------------------------------------------------------------------------------------+-------------------------------------------------------------------------------------------------------------------+    
| **Feature: geometry**                                                                   | `Feature Resource <../../services/sdiservices.html#feature-resource>`_                                            |
|                                                                                         |                                                                                                                   |
| **URL:** *feature/geoemetry?layer=ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill* | **URL:** *rest/services/api/MapServer/ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill/6644*                  |
| *?ids=6644*                                                                             | *?geometryFormat=geojson*                                                                                         |
+-----------------------------------------------------------------------------------------+-------------------------------------------------------------------------------------------------------------------+
| **Feature: search**                                                                     | `Identify Features <../../services/sdiservices.html#identify-description>`_                                       |
|                                                                                         |                                                                                                                   |
| **URL:** *feature/search?lang=en&layers=*                                               | **URL:** *rest/services/api/MapServer/identify?geometryType=esriGeometryEnvelope&geometry=592725,209304.998016,*  |
| *ch.swisstopo.swissboundaries3d-kanton-flaeche.fill&*                                   | *595975,212554.998016&imageDisplay=500,600,96&mapExtent=548945.5,147956,549402,148103.5&tolerance=5&*             |
| *&bbox=592725,209304.998016,595975,212554.998016*                                       | *layers=all:ch.swisstopo.swissboundaries3d-kanton-flaeche.fill*                                                   |
|                                                                                         |                                                                                                                   |
|                                                                                         | HTML content is accessible via `Hmlpopup Resource <../../services/sdiservices.html#htmlpopup-resource>`_          |
+-----------------------------------------------------------------------------------------+-------------------------------------------------------------------------------------------------------------------+
| **Layers (search)**                                                                     | `Search <../../services/sdiservices.html#search>`_                                                                |
|                                                                                         |                                                                                                                   |
| **URL:** *layers?query=wasser&properties=volltextsuche*                                 | **URL:** *rest/services/api/SearchServer?searchText=wasser&type=layers*                                           |
+-----------------------------------------------------------------------------------------+-------------------------------------------------------------------------------------------------------------------+
| **Layers**                                                                              | `Layers Metadata <../../services/sdiservices.html>`_                                                              |
|                                                                                         |                                                                                                                   |
| **URL:** *layers*                                                                       | **URL:** *rest/services/api/MapServer*                                                                            |
+-----------------------------------------------------------------------------------------+-------------------------------------------------------------------------------------------------------------------+
| **Layers (legend)**                                                                     | `Legend Resource <../../services/sdiservices.html#legend-resource>`_                                              |
|                                                                                         |                                                                                                                   |
| **URL:** *layers/ch.swisstopo.vec200-hydrography?mode=legend*                           | **URL:** *rest/services/api/MapServer/ch.swisstopo.vec200-hydrography/legend*                                     |
+-----------------------------------------------------------------------------------------+-------------------------------------------------------------------------------------------------------------------+
| **Height**                                                                              | `Height <../../services/sdiservices.html#height>`_                                                                |
|                                                                                         |                                                                                                                   |
| **URL:** *height?easting=600000&northing=200000*                                        | **URL:** *rest/services/height?easting=600000&northing=200000*                                                    |
+-----------------------------------------------------------------------------------------+-------------------------------------------------------------------------------------------------------------------+
| **Profile.json and Profile.csv**                                                        | `Profile <../../services/sdiservices.html#profile>`_                                                              |
|                                                                                         |                                                                                                                   |
| **URL:** *profile.json?geom={“type”%3A”LineString”%2C”coordinates”%3A[[550050%2C206550* | **URL:** *rest/services/profile.json?geom={“type”%3A”LineString”%2C”coordinates”%3A[[550050%2C206550]%2C*         |
| *]%2C[556950%2C204150]%2C[561050%2C207950]]}*                                           | *[556950%2C204150]%2C[561050%2C207950]]}*                                                                         |
+-----------------------------------------------------------------------------------------+-------------------------------------------------------------------------------------------------------------------+
| **WMTS**                                                                                | `WMTS <../../services/sdiservices.html#wmts>`_                                                                    |
|                                                                                         |                                                                                                                   |
| **URL:** *http://wmts.geo.admin.ch/1.0.0/WMTSCapabilities.xml*                          | **URL:** *http://api3.geo.admin.ch/rest/services/api/1.0.0/WMTSCapabilities.xml*                                  |
+-----------------------------------------------------------------------------------------+-------------------------------------------------------------------------------------------------------------------+

The API 3 also provide new features such as the `Find service <../../services/sdiservices.html#find>`_ or the `Feature search service <../../services/sdiservices.html#description>`_.
