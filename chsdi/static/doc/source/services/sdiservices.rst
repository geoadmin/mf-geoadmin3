.. _rest_services:

REST Services
=============

Most services are implementing or are heavily inspired by `ESRI GeoServices REST Specification <http://www.esri.com/industries/landing-pages/geoservices/geoservices>`_
or by the `Open Geospatial Consortium (OGC) <http://opengeospatial.org>`_.


.. _metadata_description:

Layers Metadata
---------------

This service provides metadata for the available layers in the GeoAdmin API.

URL
^^^

::

  https://api3.geo.admin.ch/rest/services/api/MapServer

Input Parameters
^^^^^^^^^^^^^^^^

RESTFul interface is available.

+-----------------------------------+-------------------------------------------------------------------------------------------+
| Parameters                        | Description                                                                               |
+===================================+===========================================================================================+
| searchText (optional)             | The text to search for in the layer description.                                          |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| lang (optional)                   | The language metadata. Possible values: de (default), fr, it, rm, en.                     |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| callback (optional)               | The name of the callback function.                                                        |
+-----------------------------------+-------------------------------------------------------------------------------------------+

Examples
^^^^^^^^

- List all the layers available in the GeoAdmin API: `https://api3.geo.admin.ch/rest/services/api/MapServer <../../../rest/services/api/MapServer>`_
- List all the layers available in the GeoAdmin API where the word "wasser" is found in their description: `https://api3.geo.admin.ch/rest/services/api/MapServer?searchText=wasser <../../../rest/services/api/MapServer?searchText=wasser>`_
- Find a layer by `geocat ID <http://www.geocat.ch/geonetwork/srv/eng/geocat>`_: `https://api3.geo.admin.ch/rest/services/api/MapServer?searchText=f198f6f6-8efa-4235-a55f-99767ea0206c  <../../../rest/services/api/MapServer?searchText=f198f6f6-8efa-4235-a55f-99767ea0206c>`_

.. _layer_attributes_description:

Layer Attributes
----------------

This service is used to expose the attributes names that are specific to a layer. This service is especially useful when combined wit
h the find service

URL
^^^

::

  https://api3.geo.admin.ch/rest/services/api/MapServer/{layerId}

Input Parameters
^^^^^^^^^^^^^^^^

RESTFul interface is available.

+-----------------------------------+-------------------------------------------------------------------------------------------+
| Parameters                        | Description                                                                               |
+===================================+===========================================================================================+
| callback (optional)               | The name of the callback function.                                                        |
+-----------------------------------+-------------------------------------------------------------------------------------------+

Example
^^^^^^^

Get the all the available attributes names of the municipal boundaries: `https://api3.geo.admin.ch/rest/services/api/MapServer/ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill <../../../rest/services/api/MapServer/ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill>`_

.. _legend_description:

Legend Resource
---------------

With a layer ID (or technical name), this service can be used to retrieve a legend.

URL
^^^

::

  https://api3.geo.admin.ch/rest/services/api/MapServer/{layerID}/legend

Input Parameters
^^^^^^^^^^^^^^^^

No css styling is provided per default so that you can use your own.

+-----------------------------------+-------------------------------------------------------------------------------------------+
| Parameters                        | Description                                                                               |
+===================================+===========================================================================================+
| lang (optional)                   | The language metadata. Possible values: de (default), fr, it, rm, en.                     |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| callback (optional)               | The name of the callback function.                                                        |
+-----------------------------------+-------------------------------------------------------------------------------------------+

Example
^^^^^^^

- Get the legend for ch.bafu.bundesinventare-bln: `https://api3.geo.admin.ch/rest/services/api/MapServer/ch.bafu.bundesinventare-bln/legend <../../../rest/services/api/MapServer/ch.bafu.bundesinventare-bln/legend>`_
- Get the same legend using JSONP: `https://api3.geo.admin.ch/rest/services/api/MapServer/ch.bafu.bundesinventare-bln/legend?callback=cb <../../../rest/services/api/MapServer/ch.bafu.bundesinventare-bln/legend?callback=cb>`_

.. _identify_description:

Identify Features
-----------------

This service can be used to discover features at a specific location. Here is a `complete list of layers <../../../api/faq/index.html#which-layers-have-a-tooltip>`_ for which this service is available.

URL
^^^

::

  https://api3.geo.admin.ch/rest/services/api/MapServer/identify

Input Parameters
^^^^^^^^^^^^^^^^

No more than 50 features can be retrieved per request.

+-----------------------------------+-------------------------------------------------------------------------------------------+
| Parameters                        | Description                                                                               |
+===================================+===========================================================================================+
| geometry (required)               | The geometry to identify on. The geometry is specified by the geometry type.              |
|                                   | This parameter is specified as a separated list of coordinates.                           |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| geometryType (required)           | The type of geometry to identify on. Possible values are:                                 |
|                                   | esriGeometryPoint or esriGeometryPolyline or esriGeometryPolygon or esriGeometryEnvelope. |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| layers (optional)                 | The layers to perform the identify operation on. Per default query all the layers in the  |
|                                   | GeoAdmin API. Notation: all:"comma separated list of techincal layer names".              |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| mapExtent (required)              | The extent of the map. (minx, miny, maxx, maxy).                                          |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| imageDisplay (required)           | The screen image display parameters (width, height, and dpi) of the map.                  |
|                                   | The mapExtent and the imageDisplay parameters are used by the server to calculate the     |
|                                   | the distance on the map to search based on the tolerance in screen pixels.                |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| tolerance (required)              | The tolerance in pixels around the specified geometry. This parameter is used to create   |
|                                   | a buffer around the geometry. Therefore, a tolerance of 0 deactivatees the buffer         |
|                                   | creation.                                                                                 |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| returnGeometry (optional)         | This parameter defines whether the geometry is returned or not. Default to "true".        |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| geometryFormat (optional)         | Default to ESRI geometry format. Possible values are: "esrijson" or "geojson".            |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| lang (optional)                   | The language (when available). Possible values: de (default), fr, it, rm, en.             |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| callback (optional)               | The name of the callback function.                                                        |
+-----------------------------------+-------------------------------------------------------------------------------------------+

Examples
^^^^^^^^

- Identify all the features belonging to ch.bafu.bundesinventare-bln using a tolerance of 5 pixels around a point: `https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryPoint&geometry=653246,173129&imageDisplay=500,600,96&mapExtent=548945.5,147956,549402,148103.5&tolerance=5&layers=all:ch.bafu.bundesinventare-bln <../../../rest/services/api/MapServer/identify?geometryType=esriGeometryPoint&geometry=653246,173129&imageDisplay=500,600,96&mapExtent=548945.5,147956,549402,148103.5&tolerance=5&layers=all:ch.bafu.bundesinventare-bln>`_
- Identify all the features belonging to ch.bfs.arealstatistik-1985 intersecting an enveloppe (or bounding box): `https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryEnvelope&geometry=548945.5,147956,549402,148103.5&imageDisplay=500,600,96&mapExtent=548945.5,147956,549402,148103.5&tolerance=1&layers=all:ch.bfs.arealstatistik-1985 <../../../rest/services/api/MapServer/identify?geometryType=esriGeometryEnvelope&geometry=548945.5,147956,549402,148103.5&imageDisplay=500,600,96&mapExtent=548945.5,147956,549402,148103.5&tolerance=1&layers=all:ch.bfs.arealstatistik-1985>`_
- Same request than above but returned geometry format is GeoJSON: `https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryEnvelope&geometry=548945.5,147956,549402,148103.5&imageDisplay=500,600,96&mapExtent=548945.5,147956,549402,148103.5&tolerance=1&layers=all:ch.bfs.arealstatistik-1985&geometryFormat=geojson <../../../rest/services/api/MapServer/identify?geometryType=esriGeometryEnvelope&geometry=548945.5,147956,549402,148103.5&imageDisplay=500,600,96&mapExtent=548945.5,147956,549402,148103.5&tolerance=1&layers=all:ch.bfs.arealstatistik-1985&geometryFormat=geojson>`_
- Same request than above but geometry is not returned: `https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryEnvelope&geometry=548945.5,147956,549402,148103.5&imageDisplay=500,600,96&mapExtent=548945.5,147956,549402,148103.5&tolerance=1&layers=all:ch.bfs.arealstatistik-1985&returnGeometry=false <../../../rest/services/api/MapServer/identify?geometryType=esriGeometryEnvelope&geometry=548945.5,147956,549402,148103.5&imageDisplay=500,600,96&mapExtent=548945.5,147956,549402,148103.5&tolerance=1&layers=all:ch.bfs.arealstatistik-1985&returnGeometry=false>`_

Examples of Reverse Geocoding
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The service identify can be used for Reverse Geocoding operations. Here is a `list of all the available layers <../../../api/faq/index.html#which-layers-are-available>`_.

- Perform an identify request to find the districts intersecting a given enveloppe geometry (no buffer): `https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryEnvelope&geometry=548945.5,147956,549402,148103.5&imageDisplay=0,0,0&mapExtent=0,0,0,0&tolerance=0&layers=all:ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill&returnGeometry=false  <../../../rest/services/api/MapServer/identify?geometryType=esriGeometryEnvelope&geometry=548945.5,147956,549402,148103.5&imageDisplay=0,0,0&mapExtent=0,0,0,0&tolerance=0&layers=all:ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill&returnGeometry=false>`_
- Perform an identify request to find the municipal boundaries and ZIP (PLZ or NPA) intersecting with a point (no buffer): `https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryPoint&geometry=548945.5,147956&imageDisplay=0,0,0&mapExtent=0,0,0,0&tolerance=0&layers=all:ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill,ch.swisstopo-vd.ortschaftenverzeichnis_plz&returnGeometry=false <../../../rest/services/api/MapServer/identify?geometryType=esriGeometryPoint&geometry=548945.5,147956&imageDisplay=0,0,0&mapExtent=0,0,0,0&tolerance=0&layers=all:ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill,ch.swisstopo-vd.ortschaftenverzeichnis_plz&returnGeometry=false>`_


Simulate a search radius
^^^^^^^^^^^^^^^^^^^^^^^^

Equation:

.. math::
  SearchRadius = Max(MapWidthInMeters / ScreenWidthInPx, MapHeightInMeters / ScreenHeightInPx) * toleranceInPx

For instance if one wants a radius of 5 meters:

.. math::

  Max(100 / 100, 100 / 100) * 5 = 5


So you would set mapExtent=0,0,100,100&imageDisplay=100,100,100&tolerance=5&geometryType=esriGeometryPoint&geometry=548945,147956 to perform an identify request with a search radius of 5 meters around a given point.

.. _find_description:

Find
----

This service is used to search the attributes of features. Each result include a feature ID, a layer ID, a layer name, a geometry (optionally) and attributes in the form of name-value pair.
Here is a `complete list of layers <../../../api/faq/index.html#which-layers-have-a-tooltip>`_ for which this service is available.

URL
^^^

::

  https://api3.geo.admin.ch/rest/services/api/MapServer/find

Input Parameters
^^^^^^^^^^^^^^^^

One layer, one search text and one attribute.

+-----------------------------------+-------------------------------------------------------------------------------------------+
| Parameters                        | Description                                                                               |
+===================================+===========================================================================================+
| layer (required)                  | A layer ID (only one layer at a time can be specified).                                   |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| searchText (required)             | The text to search for (one can use numerical values as well).                            |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| searchField (required)            | The name of the field to search (only one search field can be searched at a time).        |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| lang (optional)                   | The language metadata. Possible values: de (default), fr, it, rm, en.                     |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| geometryFormat (optional)         | Default to ESRI geometry format. Possible values are: "esrijson" or "geojson".            |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| returnGeometry (optional)         | This parameter defines whether the geometry is returned or not. Default to "true".        |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| callback (optional)               | The name of the callback function.                                                        |
+-----------------------------------+-------------------------------------------------------------------------------------------+

Examples
^^^^^^^^

- Search for “Lavaux” in the field “bln_name” of the layer “ch.bafu.bundesinventare-bln”: `https://api3.geo.admin.ch/rest/services/api/MapServer/find?layer=ch.bafu.bundesinventare-bln&searchText=Lavaux&searchField=bln_name&returnGeometry=false  <../../../rest/services/api/MapServer/find?layer=ch.bafu.bundesinventare-bln&searchText=Lavaux&searchField=bln_name&returnGeometry=false>`_
- Search for “1231641” in the field “egid” of the layer “ch.bfs.gebaeude_wohnungs_register”: `https://api3.geo.admin.ch/rest/services/api/MapServer/find?layer=ch.bfs.gebaeude_wohnungs_register&searchText=1231641&searchField=egid&returnGeometry=false <../../../rest/services/api/MapServer/find?layer=ch.bfs.gebaeude_wohnungs_register&searchText=1231641&searchField=egid&returnGeometry=false>`_

.. _featureresource_description:

Feature Resource
----------------

With an ID (or several in a comma separated list) and a layer ID (technical name), this service can be used to retrieve a feature resource.
Here is a `complete list of layers <../../../api/faq/index.html#which-layers-have-a-tooltip>`_ for which this service is available.

URL
^^^

::

  https://api3.geo.admin.ch/rest/services/api/MapServer/{layerID}/{featureID},{featureID}

Input Parameters
^^^^^^^^^^^^^^^^

RESTFul interface is available.

+-----------------------------------+-------------------------------------------------------------------------------------------+
| Parameters                        | Description                                                                               |
+===================================+===========================================================================================+
| lang (optional)                   | The language metadata. Possible values: de (default), fr, it, rm, en.                     |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| geometryFormat (optional)         | Default to ESRI geometry format. Possible values are: "esrijson" or "geojson".            |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| returnGeometry (optional)         | This parameter defines whether the geometry is returned or not. Default to "true".        |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| callback (optional)               | The name of the callback function.                                                        |
+-----------------------------------+-------------------------------------------------------------------------------------------+

Example
^^^^^^^

- Get the feature with the ID 342 belonging to ch.bafu.bundesinventare-bln: `https://api3.geo.admin.ch/rest/services/api/MapServer/ch.bafu.bundesinventare-bln/362 <../../../rest/services/api/MapServer/ch.bafu.bundesinventare-bln/362>`_
- Get several features with IDs 342 and 341 belonging to ch.bafu.bundesinventar-bln: `https://api3.geo.admin.ch/rest/services/api/MapServer/ch.bafu.bundesinventare-bln/362,363 <../../../rest/services/api/MapServer/ch.bafu.bundesinventare-bln/362,363>`_

.. _htmlpopup_description:

Htmlpopup Resource
------------------

With an ID and a layer ID (technical name), this service can be used to retrieve an html popup. An html popup is an html formatted representation of the textual information about the feature.
Here is a `complete list of layers <../../../api/faq/index.html#which-layers-have-a-tooltip>`_ for which this service is available.

URL
^^^

::

  https://api3.geo.admin.ch/rest/services/api/MapServer/{layerID}/{featureID}/htmlPopup

Input Parameters
^^^^^^^^^^^^^^^^

No css styling is provided per default so that you can use your own.

+-----------------------------------+-------------------------------------------------------------------------------------------+
| Parameters                        | Description                                                                               |
+===================================+===========================================================================================+
| lang (optional)                   | The language. Possible values: de (default), fr, it, rm, en.                              |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| callback (optional)               | The name of the callback function.                                                        |
+-----------------------------------+-------------------------------------------------------------------------------------------+

Example
^^^^^^^

- Get the html popup with the feature ID 342 belonging to layer ch.bafu.bundesinventare-bln: `https://api3.geo.admin.ch/rest/services/api/MapServer/ch.bafu.bundesinventare-bln/362/htmlPopup <../../../rest/services/api/MapServer/ch.bafu.bundesinventare-bln/362/htmlPopup>`_

.. _search_description:

Search
------

The search service can be used to search for locations, layers or features.

URL
^^^

::

  https://api3.geo.admin.ch/rest/services/api/SearchServer

Description
^^^^^^^^^^^

The search service is separated in 3 different categories or types:

* The **location search** which is composed of the following geocoded locations:

  * Cantons, Cities and communes
  * All names as printed on the national map (`SwissNames <http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/landscape/toponymy.html>`_)
  * The districts
  * The ZIP codes
  * The addresses (!! the swiss cantons only allow websites of the federal governement to use the addresses search service !!)
  * The cadastral parcels
  * And optionally features belonging to a specified layer. The search is here performed within the attribute information of a layer using a search text.
  * **IMPORTANT** : if you want to search only in one or serveral fields described above, please use the feature search service.
* The **layer search** wich enables the search of layers belonging to the GeoAdmin API.
* The **feature search** which is used to search through features descriptions. Note: you can also specify a bounding box to filter the features. (`Searchable layer <../../../api/faq/index.html#which-layers-are-searchable>`_)
* The **feature identify** which is designed to efficiently discover the features of a layer based on a geographic extent. (`Complete list <../../../api/faq/index.html#which-layers-have-a-tooltip>`_)

Input parameters
^^^^^^^^^^^^^^^^

Only RESTFul interface is available.

**Location Search**

+-----------------------------------+-------------------------------------------------------------------------------------------+
| Parameters                        | Description                                                                               |
+===================================+===========================================================================================+
| searchText (required)             | The text to search for.                                                                   |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| type (required)                   | The type of performed search. Specify “locations” to perform a location search.           |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| features (optional)               | A comma separated list of technical layer names.                                          |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| bbox (optional)                   | A comma separated list of 4 coordinates representing the bounding box on which features   |
|                                   | should be filtered (SRID: 21781).                                                         |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| returnGeometry (optional)         | This parameter defines whether the geometry is returned or not. Default to "true".        |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| callback (optional)               | The name of the callback function.                                                        |
+-----------------------------------+-------------------------------------------------------------------------------------------+

**Layer Search**

+-----------------------------------+-------------------------------------------------------------------------------------------+
| Parameters                        | Description                                                                               |
+===================================+===========================================================================================+
| searchText (required)             | The text to search for.                                                                   |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| type (required)                   | The type of performed search.  Specify “layers” to perform a layer search.                |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| lang (optional)                   | The language metadata. Possible values: de (default), fr, it, rm, en.                     |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| callback (optional)               | The name of the callback function.                                                        |
+-----------------------------------+-------------------------------------------------------------------------------------------+

**Feature Search**

+-----------------------------------+-------------------------------------------------------------------------------------------+
| Parameters                        | Description                                                                               |
+===================================+===========================================================================================+
| searchText (required)             | The text to search for (in features detail field).                                        |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| type (required)                   | The type of performed search. Specify “featuresearch” to perform a feature search.        |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| bbox (optional)                   | A comma separated list of 4 coordinates representing the bounding box according to which  |
|                                   | features should be ordered (SRID: 21781).                                                 |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| features (required)               | A comma separated list of technical layer names.                                          |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| callback (optional)               | The name of the callback function.                                                        |
+-----------------------------------+-------------------------------------------------------------------------------------------+

**Feature Identify**

+-----------------------------------+-------------------------------------------------------------------------------------------+
| Parameters                        | Description                                                                               |
+===================================+===========================================================================================+
| type (required)                   | The type of performed search. Specify “featureidentify” to perform a feature search.      |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| bbox (optional)                   | A comma separated list of 4 coordinates representing the bounding box on which features   |
|                                   | should be filtered (SRID: 21781).                                                         |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| features (optional)               | A comma separated list of technical layer names.                                          |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| callback (optional)               | The name of the callback function.                                                        |
+-----------------------------------+-------------------------------------------------------------------------------------------+

Response syntax
^^^^^^^^^^^^^^^

The results are presented as a list of object literals.

.. code-block:: html
  :linenos:

  {

    "id": 161506,
    "weight": 4,
    "attrs": {
        "origin": "sn25",
        "detail": "wabern _be_",
        "rank": 5,
        "geom_st_box2d": "BOX(600714.875 197675.296875,600714.9375 197675.3125)",
        "num": 1,
        "label": "<b>Wabern</b> (BE) - Köniz"
    }
  }

The attribute "origin" refers to the type of data an entry stands for. A different "rank" is associated to each origin. Results are always ordered in ascending ranks.
Here is a list of possible origins and in ascending ranking order:

- zipcode (ch.swisstopo-vd.ortschaftenverzeichnis_plz)
- gg25 (ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill)
- district (ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill)
- kantone (ch.swisstopo.swissboundaries3d-kanton-flaeche.fill)
- sn25 (ch.swisstopo.vec200-names-namedlocation)
- address (ch.bfs.gebaeude_wohnungs_register with EGID or use prefix 'addresse', 'adresse', 'indirizzo', 'address' without EGID)
- parcel (use prefix "parcel", "parzelle", "parcelle" or "parcella" in your requests to filter out other origins)

The attribute "geom_st_box2d" is in CH1903 / LV03 (EPSG:21781) reference system and represents the bounding box of the associated geometry.
The weight is dynamically computed according to the search text that is provided.


Examples
^^^^^^^^

- Search for locations matching the word “wabern”: `https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=wabern&type=locations <../../../rest/services/api/SearchServer?searchText=wabern&type=locations>`_
- Search for locations and features matching the word “vd 446” (only features are filtered within the bbox are returned): `https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=vd%20446&features=ch.astra.ivs-reg_loc&type=locations&bbox=551306.5625,167918.328125,551754.125,168514.625 <../../../rest/services/api/SearchServer?searchText=vd%20446&features=ch.astra.ivs-reg_loc&type=locations&bbox=551306.5625,167918.328125,551754.125,168514.625>`_
- Search for layers in French matching the word “géoïde” in their description: `https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=géoïde&type=layers&lang=fr <../../../rest/services/api/SearchServer?searchText=géoïde&type=layers&lang=fr>`_ 
- Search for features matching word "433" in their description: `https://api3.geo.admin.ch/rest/services/api/SearchServer?features=ch.bafu.hydrologie-gewaesserzustandsmessstationen&type=featuresearch&searchText=433 <../../../rest/services/api/SearchServer?features=ch.bafu.hydrologie-gewaesserzustandsmessstationen&type=featuresearch&searchText=433>`_
- Search only for features belonging to the layer “ch.astra.ivs-reg_loc” (only using a bbox, no search text): `https://api3.geo.admin.ch/rest/services/api/SearchServer?features=ch.astra.ivs-reg_loc&type=featureidentify&bbox=551306.5625,167918.328125,551754.125,168514.625 <../../../rest/services/api/SearchServer?features=ch.astra.ivs-reg_loc&type=featureidentify&bbox=551306.5625,167918.328125,551754.125,168514.625>`_

Example of feature search usage with other services
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

- First: search for addresses using the feature search service: `https://api3.geo.admin.ch/rest/services/api/SearchServer?features=ch.bfs.gebaeude_wohnungs_register&type=featuresearch&searchText=isabelle <../../../rest/services/api/SearchServer?features=ch.bfs.gebaeude_wohnungs_register&type=featuresearch&searchText=isabelle>`_
- Then: use "feature_id" found in "attrs" to get detailed information about a feature: `https://api3.geo.admin.ch/rest/services/api/MapServer/ch.bfs.gebaeude_wohnungs_register/880711_0?returnGeometry=false <../../../rest/services/api/MapServer/ch.bfs.gebaeude_wohnungs_register/880711_0?returnGeometry=false>`_


.. _height_description:

Height
------

This service allows to obtain elevation information for a point. **Note: this service is not freely accessible (fee required).** `Please Contact us <mailto:geodata@swisstopo.ch>`_
See `Height models <http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/height.html>`_ for more details about data used by this service.

URL
^^^

::

  https://api3.geo.admin.ch/rest/services/height

Input Parameters
^^^^^^^^^^^^^^^^

RESTFul interface is available.

+-----------------------------------+-------------------------------------------------------------------------------------------+
| Parameters                        | Description                                                                               |
+===================================+===========================================================================================+
| easting (required)                | The Y position in CH1903 coordinate system (SRID: 21781).                                 |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| northing (required)               | The X position in CH1903 coordinate system (SRID: 21781).                                 |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| elevation_model (optional)        | The elevation model. Three elevation models are available DTM25, DTM2 (swissALTI3D)       |
|                                   | and COMB (a combination of DTM25 and DTM2). Default to "DTM25".                           |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| callback (optional)               | The name of the callback function.                                                        |
+-----------------------------------+-------------------------------------------------------------------------------------------+

Examples
^^^^^^^^

- `https://api3.geo.admin.ch/rest/services/height?easting=600000&northing=200000 <../../../rest/services/height?easting=600000&northing=200000>`_

.. _profile_description:

Profile
-------

This service allows to obtain elevation information for a polyline in CSV format. **Note: this service is not freely accessible (fee required).** `Please Contact us <mailto:geodata@swisstopo.ch>`_
See `Height models <http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/height.html>`_ for more details about data used by this service.

URL
^^^

::

  https://api3.geo.admin.ch/rest/services/profile.json (for json format)
  https://api3.geo.admin.ch/rest/services/profile.csv  (for a csv)

Input Parameters
^^^^^^^^^^^^^^^^

RESTFul interface is available.

+-----------------------------------+-------------------------------------------------------------------------------------------+
| Parameters                        | Description                                                                               |
+===================================+===========================================================================================+
| geom (required)                   | A GeoJSON representation of a polyline (type = LineString).                               |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| elevation_models (optional)       | A comma separated list of elevation models. Three elevation models are available DTM25,   |
|                                   | DTM2 (swissALTI3D) and COMB (a combination of DTM25 and DTM2).  Default to "DTM25".       |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| nb_points (optional)              | The number of points used for the polyline segmentation. Default "200".                   |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| offset (optional)                 | The offset value (INTEGER) in order to use the `exponential moving algorithm              |
|                                   | <http://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average>`_ . For a given  |
|                                   | value the offset value specify the number of values before and after used to calculate    | 
|                                   | the average.                                                                              |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| callback (optional)               | Only available for **profile.json**. The name of the callback function.                   |
+-----------------------------------+-------------------------------------------------------------------------------------------+

Example
^^^^^^^

- A profile in JSON: `https://api3.geo.admin.ch/rest/services/profile.json?geom={"type"%3A"LineString"%2C"coordinates"%3A[[550050%2C206550]%2C[556950%2C204150]%2C[561050%2C207950]]} <../../../rest/services/profile.json?geom={"type"%3A"LineString"%2C"coordinates"%3A[[550050%2C206550]%2C[556950%2C204150]%2C[561050%2C207950]]}>`_
- A profile in CSV: `https://api3.geo.admin.ch/rest/services/profile.csv?geom={"type"%3A"LineString"%2C"coordinates"%3A[[550050%2C206550]%2C[556950%2C204150]%2C[561050%2C207950]]} <../../../rest/services/profile.csv?geom={"type"%3A"LineString"%2C"coordinates"%3A[[550050%2C206550]%2C[556950%2C204150]%2C[561050%2C207950]]}>`_

.. _wmts_description:

WMTS
----

A RESTFul implementation of the `WMTS <http://www.opengeospatial.org/standards/wmts>`_ `OGC <http://www.opengeospatial.org/>`_ standard.
For detailed information, see `WMTS OGC standard <http://www.opengeospatial.org/standards/wmts>`_
In order to have access to the WMTS, you require a `swisstopo web access - WMTS documentation <http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/services/web_services/webaccess.html>`_, 
despite the fact that most layers are free to use. See :ref:`available_layers` for a list of all available layers.

URL
^^^

- http://wmts.geo.admin.ch or  https://wmts.geo.admin.ch
- http://wmts0.geo.admin.ch or https://wmts0.geo.admin.ch
- http://wmts1.geo.admin.ch or https://wmts1.geo.admin.ch
- http://wmts2.geo.admin.ch or https://wmts2.geo.admin.ch
- http://wmts3.geo.admin.ch or https://wmts3.geo.admin.ch
- http://wmts4.geo.admin.ch or https://wmts4.geo.admin.ch

GetCapabilities
^^^^^^^^^^^^^^^

The GetCapabilites document provides informations about the service, along with layer description, both in german and french.

http://api3.geo.admin.ch/rest/services/api/1.0.0/WMTSCapabilities.xml

http://api3.geo.admin.ch/rest/services/api/1.0.0/WMTSCapabilities.xml?lang=fr

Parameters
^^^^^^^^^^

Only the RESTFul interface ist implemented. No KVP and SOAP. You *have* to provide a value for the `timestamp` parameter, the keywords `current` or 
`default` are not supported for now.

A request is in the form:

    ``<protocol>://<ServerName>/<ProtocoleVersion>/<LayerName>/<Stylename>/<Time>/<TileMatrixSet>/<TileSetId>/<TileRow>/<TileCol>.<FormatExtension>``

with the following parameters:

===================    =============================   ==========================================================================
Parameter              Example                         Explanation
===================    =============================   ==========================================================================
Protocol               http ou https                   
ServerName             wmts[0-4].geo.admin.ch
Version                1.0.0                           WMTS protocol version
Layername              ch.bfs.arealstatistik-1997      See the WMTS `GetCapabilities <//wmts.geo.admin.ch/1.0.0/WMTSCapabilities.xml>`_ document.
StyleName              default                         mostly constant
Time                   2010, 2010-01                   Date of tile generation in (ISO-8601). Some dataset will be updated quite often.
TileMatrixSet          21781 (constant)                EPSG code for LV03/CH1903
TileSetId              22                              Zoom level (see below)
TileRow                236
TileCol                284
FormatExtension        png                             Mostly png, except for some raster layer (pixelkarte and swissimage)
===================    =============================   ==========================================================================


The *<TileMatrixSet>* **21781** is as follow defined::

  MinX              420000
  MaxX              900000
  MinY               30000
  MaxY              350000
  TileWidth            256

With the *<tileOrigin>* in the top left corner of the bounding box.

===============  ========= ========= ============ ======== ======== =============== ================
Resolution [m]   Zoomlevel Map zoom  Tile width m Tiles X  Tiles Y    Tiles          Scale at 96 dpi
===============  ========= ========= ============ ======== ======== =============== ================
      4000            0                  1024000        1        1               1
      3750            1                   960000        1        1               1
      3500            2                   896000        1        1               1
      3250            3                   832000        1        1               1
      3000            4                   768000        1        1               1
      2750            5                   704000        1        1               1
      2500            6                   640000        1        1               1
      2250            7                   576000        1        1               1
      2000            8                   512000        1        1               1
      1750            9                   448000        2        1               2
      1500           10                   384000        2        1               2
      1250           11                   320000        2        1               2
      1000           12                   256000        2        2               4
       750           13                   192000        3        2               6
       650           14        0          166400        3        2               6    1 : 2'456'694
       500           15        1          128000        4        3              12    1 : 1'889'765
       250           16        2           64000        8        5              40    1 : 944'882
       100           17        3           25600       19       13             247    1 : 377'953
        50           18        4           12800       38       25             950    1 : 188'976
        20           19        5            5120       94       63           5'922    1 : 75'591
        10           20        6            2560      188      125          23'500    1 : 37'795
         5           21        7            1280      375      250          93'750    1 : 18'898
       2.5           22        8             640      750      500         375'000    1 : 9'449
         2           23        9             512      938      625         586'250    1 : 7'559
       1.5           24                      384     1250      834       1'042'500             
         1           25       10             256     1875     1250       2'343'750    1 : 3'780
       0.5           26       11             128     3750     2500       9'375'000    1 : 1'890
       0.25          27       12              64     7500     5000      37'500'000    1 : 945
       0.1           28       13            25.6    18750    12500     234'375'000    1 : 378
===============  ========= ========= ============ ======== ======== =============== ================



**Notes**

#. The zoom level 24 (resolution 1.5m) has been generated, but is not currently used in the API.
#. The zoom levels 27 and 28 (resolution 0.25m and 0.1m) are only available for a few layers, e.g. swissimage or cadastral web map. For the others layers it is only a client zoom (tiles are stretched).
#. You **have** to use the `<ResourceURL>` to construct the `GetTile` request. 

Result
^^^^^^

A tile.

http://wmts1.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20110401/21781/20/58/70.jpeg or https://wmts1.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20110401/21781/20/58/70.jpeg 



OWSChecker: check conformity with ech-0056
------------------------------------------

This service check the conformity of various OGC services with the swiss ech-0056 profile.
See the :doc:`OWSChecker Documentation <owschecker/index>` and the :doc:`OWSChecker User Guide <owschecker/user_guide>` for more details.

URL
^^^

::

  https://api3.geo.admin.ch/owschecker/bykvp OR
  https://api3.geo.admin.ch/owschecker/form

Input parameters
^^^^^^^^^^^^^^^^

+-----------------------------------+-------------------------------------------------------------------------------------------+
| Parameters                        | Description                                                                               |
+===================================+===========================================================================================+
| base_url (required)               | The URL of the service to test                                                            |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| service (required)                | type of service to test, one of WMS, WFS, WMTS, WCS or CSW                                |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| ssurl (optional)                  | server setting url                                                                        |
+-----------------------------------+-------------------------------------------------------------------------------------------+
| restful (optional)                | restful-only service                                                                      |
+-----------------------------------+-------------------------------------------------------------------------------------------+

Result
^^^^^^

A JSON file containing all the tests and their status OR an html page.

Example
^^^^^^^

- Check WMS with swiss ech-0056 profile (xml): `https://api3.geo.admin.ch/owschecker/bykvp?base_url=http%3A%2F%2Fwms.zh.ch%2Fupwms&service=WMS <../../../owschecker/bykvp?base_url=http%3A%2F%2Fwms.zh.ch%2Fupwms&service=WMS>`_ 
- Check WMS with swiss ech-0056 profile (html): `https://api3.geo.admin.ch/owschecker/form?base_url=http%3A%2F%2Fwms.zh.ch%2Fupwms&service=WMS <../../../owschecker/form?base_url=http%3A%2F%2Fwms.zh.ch%2Fupwms&service=WMS>`_
- Check WMTS with swiss ech-0056 profile (xml): `https://api3.geo.admin.ch/owschecker/bykvp?base_url=http%3A%2F%2Ftile1-sitn.ne.ch%2Fmapproxy%2Fservice&service=WMTS <../../../owschecker/bykvp?base_url=http%3A%2F%2Ftile1-sitn.ne.ch%2Fmapproxy%2Fservice&service=WMTS>`_
- Check WMTS with swiss ech-0056 profile (html): `https://api3.geo.admin.ch/owschecker/form?base_url=http%3A%2F%2Ftile1-sitn.ne.ch%2Fmapproxy%2Fservice&service=WMTS <../../../owschecker/form?base_url=http%3A%2F%2Ftile1-sitn.ne.ch%2Fmapproxy%2Fservice&service=WMTS>`_
