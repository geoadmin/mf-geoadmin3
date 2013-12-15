Migration from API 2.0 guide
============================

Introduction
~~~~~~~~~~~~

The new version of the JavaScript GeoAdmin API is based on `Openlayers 3 <http://ol3js.org/>`_ only. The previous version was based on OpenLayers 2 and ExtJS 3. The new JavaScript API aims to support the mapping part and doesn't provide any UI elements except the one provided by OpenLayers 3.
You are therefore free to choose the JavaScript framework you want to use for the creation of UI elements.

The new service GeoAdmin API is implemented according to the `GeoServices REST API specification <http://www.opengeospatial.org/standards/requests/89>`_

GeoAdmin JavaScript API 3.0 functions has feature equivalence with GeoAdmin Light API 2.0

GeoAdmin Service API 3.0 are migrated and have feature equivalence with GeoAdmin Service API 2.0 v2

Due to fact that OpenLayers 3 is the base library, the GeoAdmin JavaScript API 3.0 focuses to the map functions only:
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


