#!/usr/bin/env python
"""
Simple script to copy the map.geo.admin.ch configuration files and update the pathes
to allow METEOSCHWEIZ to edit and test their custom GeoJSON styles.

This script is usually not runned directly, but with:

    make meteoconfigs/

For more information, see the METEOSCHWEIZ.md

"""
import os
import sys
import shutil
import json

config_dir = os.environ.get('CONFIG_DIR', 'configs')

METEO_TESTING_STYLE_BASEURL = os.environ.get('METEO_TESTING_STYLE_BASEURL')
if METEO_TESTING_STYLE_BASEURL is None:
    print("METEO_TESTING_STYLE_BASEURL is undefined. Exiting")
    sys.exit()

meteo_configs_dir = 'meteoconfigs'

METEO_TESTING_STYLE_URL_TPL = METEO_TESTING_STYLE_BASEURL + '/ch.meteoschweiz/styles/{}/testing/{}.json'

current_file = os.path.abspath(os.path.dirname(__file__))
parent_dir = os.path.join(current_file, '../')
os.chdir(parent_dir)


for root, dirs, files in os.walk(config_dir):
    for filename in files:
        file_path = os.path.join(root, filename)
        print(file_path)
        if file_path.endswith('layersConfig.json'):
            with open(file_path, 'r') as f:
                data = json.load(f)
                for lyr in data.keys():
                    if lyr.startswith('ch.meteo') and data[lyr]['type'] == 'geojson':
                        print(lyr)
                        data[lyr]['styleUrl'] = METEO_TESTING_STYLE_URL_TPL.format(lyr, lyr)
                with open(os.path.join(meteo_configs_dir, file_path), 'w') as f:
                    f.write(json.dumps(data, indent=4))
        else:
            dst_path = os.path.join(meteo_configs_dir, file_path)
            try:
                shutil.copy(file_path, dst_path)
            except IOError as io_err:
                os.makedirs(os.path.dirname(dst_path))
                shutil.copy(file_path, dst_path)
