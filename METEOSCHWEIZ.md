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

    make configs/

or using an alternative target

API_URL=https://mf-chsdi3.dev.bgdi.ch make configs/

Copy the content of the `configs` directory in a suitable directory accessible
with a domain ending in `bgdi.ch`, `swisstopo.cloud` or `geo.admin.ch`

Point your browser to:

    https://map.geo.admin.ch?config_url=//{random hostname}.bgdi.ch/new_configs






