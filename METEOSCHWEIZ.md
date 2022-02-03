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

or using an alternative target

API_URL=https://mf-chsdi3.dev.bgdi.ch make meteoconfigs/


This will copy the standards files from `configs/` into a directory `meteoconfigs/` and modify the 
`jsonStyleUrl` of MeteoSchweiz's layers using the script `scripts/meteoStyleUrl.py`

The server hosting the style is defined by `METEO_TESTING_STYLE_BASEURL` and is currently _data.geo.admin.ch_

Copy the content of the `configs` directory in a suitable directory accessible
with a domain ending in `bgdi.ch`, `swisstopo.cloud` or `geo.admin.ch`. Or simply with

    make s3uploadmeteoconfigs

The custom meteoconfigs will be uploaded to an AWS S3 Bucket _s3://mf-geoadmin3-dev-dublin/meteoconfigs_ and the files 
will be accessible with _https://mf-geoadmin3.dev.bgdi.ch/meteoconfigs_

Point your browser to:

    https://map.geo.admin.ch?config_url=//mf-geoadmin3.dev.bgdi.ch/meteoconfigs



