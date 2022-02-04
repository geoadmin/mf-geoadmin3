METEOSCHWEIZ
============

In `map.geo.admin.ch`, GeoJSON layers consist in one data layer (geojson) and another style layer (json).
The GeoJSON layer are hosted in an AWS S3 bucket (`data.geo.admin.ch`) and the style are embeded in `mf-chsdi3` (https://api3.geo.admin.ch).

`Meteoschweiz` needs a way to edit and test new GeoJSON styles.


Background information
======================

Most of the `map.geo.admin.ch` layers, topics and catalog configurations are hold in a few 
configuration files. Theses files are statified services in `map.geo.admin.ch` deployment to
the `int` and `prod` environment, but real services on `dev`

The location of these files may be controlled by the parameter `config_url`.

See https://github.com/geoadmin/mf-geoadmin3/pull/4764 poru discussions and implementation


Generating a custom configuration
=================================

In the `mf-geoadmin3` directory:

    make meteoconfigs/

or if integrating new layers, use the `dev` service

    API_URL=https://mf-chsdi3.dev.bgdi.ch make meteoconfigs/


This will copy the standards files from `configs/` into a directory `meteoconfigs/` and modify the 
`jsonStyleUrl` of MeteoSchweiz's layers using the script `scripts/meteoStyleUrl.py`

The server hosting the style is defined by `METEO_TESTING_STYLE_BASEURL` and is currently _cms.geo.admin.ch_

Copy the content of the `configs` directory in a suitable directory accessible
with a domain ending in `bgdi.ch`, `swisstopo.cloud` or `geo.admin.ch`. Or simply with

    make s3uploadmeteoconfig

The custom meteoconfigs will be uploaded to an AWS S3 Bucket _s3://mf-geoadmin3-dev-dublin/meteoconfigs_ and the files 
will be accessible with _https://mf-geoadmin3.dev.bgdi.ch/meteoconfigs_

Point your browser to:

    https://map.geo.admin.ch?config_url=//mf-geoadmin3.dev.bgdi.ch/meteoconfigs


Style and resources for testing
===============================

Testing styles for GeoJson are to be on the location defined in the above mentionned _meteoconfigs_ files, 
currently:

    _https://cms.geo.admin.ch/ch.meteoschweiz/{bodLayerId}/testing/{bodLayerId}.json

Custom resource for testing are to be hosted on

    _https://cms.geo.admin.ch/ch.meteoschweiz/images/_


AWS S3 Buckets and URLS
=======================


**GeoJson data** (unchangend)

bucket _s3://data.geo.admin.ch_
Url _https://data.geo.admin.ch/ch.meteoschweiz.*_

**Config to custom meteoconfigs** (new)

Use the param: _config_url_ 
S3 bucket: _s3://mf-geoadmin3-dev-dublin/meteoconfigs/_
URL : _https://mf-geoadmin3.dev.bgdi.ch/meteoconfigs/_

**Testing style** (moved)

old _s3://data.geo.admin.ch_
new _s3://cms.geo.admin.ch/ch.meteoschweiz_
url: _https://cms.geo.admin.ch/ch.meteoschweiz/_

**Image for testing** (moved)
old _s3://data.geo.admin.ch/ch.meteoschweiz_
new _s3://cms.geo.admin.ch/ch.meteoschweiz_
URL: _https://data.geo.admin.ch/ch.meteoschweiz_

:warning:  For the integrators, you'll have to copy the images and json files back to _data.geo.admin.ch_, and update the path in the style json, if needed.


**Testing**

https://map.geo.admin.ch/?config_url=//mf-geoadmin3.dev.bgdi.ch/meteoconfigs/

or with a custom meteoschweiz layer:

https://map.geo.admin.ch/?config_url=%2F%2Fmf-geoadmin3.dev.bgdi.ch%2Fmeteoconfigs%2F&lang=fr&topic=meteoschweiz&bgLayer=voidLayer&layers=ch.bafu.gefahren-basiskarte,ch.meteoschweiz.messwerte-wind-boeenspitze-kmh-6h&layers_opacity=0.7,1&catalogNodes=15046,15055,15126,15138,15052

Verify that the Style file and the various images are hosted on _https://cms.geo.admin.ch_
