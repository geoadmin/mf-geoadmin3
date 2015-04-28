#!/usr/bin/env python3
"""
translation2js.py
This script is used to create the {lang}.json files from the csv.

Usage: ./env/bin/python translation2js.py [CSV_FILE [JSON_FOLDER]]
default: CSV_FILE: src/locales/translations.csv, JSON_FOLDER: src/locales/
"""

import sys
import csv
import json

from os.path import join


def main():
    if len(sys.argv) > 1:
        csv_filename = sys.argv[1]
        if len(sys.argv) > 2:
            json_folder = sys.argv[2]
    else:
        csv_filename = 'src/locales/translations.csv'
        json_folder = 'src/locales/'

    with open(csv_filename, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file, delimiter=',', quotechar='"')
        translations = {lang: {} for lang in csv_reader.fieldnames if lang != 'key'}
        for row in csv_reader:
            json_key = row['key']
            for lang, traduction in [(key, value) for key, value in row.items() if key != 'key']:
                translations[lang][json_key] = traduction
    for lang in translations:
        with open(join(json_folder, lang + '.json'), 'w') as json_file:
            # "separators=(',', ': ')" is required to avoid a trailing whitespace in python < 3.4
            json.dump(translations[lang], json_file, sort_keys=True, indent=4, ensure_ascii=False,
                        separators=(',', ': '))


if __name__ == '__main__':
    main()
