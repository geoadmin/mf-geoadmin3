#!/usr/bin/env python3
"""
translation2js.py
This script is used to create the {lang}.json files from the csv.

Usage: ./env/bin/python translation2js.py [CSV_FILE [JSON_FOLDER]]
default: CSV_FILE: src/locales/translations.csv, JSON_FOLDER: src/locales/
"""

import argparse
import csv
import json
import gspread
import sys
import os

from os.path import join
from oauth2client.client import SignedJwtAssertionCredentials
try:
    from StringIO import StringIO
except ImportError:
    from io import StringIO


def main(args, delimiter=',', quotechar='"'):
    translations = {}
    if args.gspreads is not None:
        for key in args.gspreads:
            csv_reader = _get_csv_reader_from_gspread(
                key,
                args.key_file,
                delimiter=delimiter,
                quotechar=quotechar
            )
            translations = _process_csv_file(csv_reader, translations)

    if args.files is not None:
        for filename in args.files:
            with open(filename, 'r') as csv_file:
                csv_reader = csv.DictReader(csv_file, delimiter=delimiter, quotechar=quotechar)
                translations = _process_csv_file(csv_reader, translations)

    _save_translations(translations, args.output_folder)


def _get_csv_reader_from_gspread(key, key_file, delimiter=',', quotechar='"', **kwargs):
    if 'DRIVE_USER' in os.environ.keys() and 'DRIVE_PWD' in os.environ.keys():
        gc = gspread.login(os.environ['DRIVE_USER'], os.environ['DRIVE_PWD'])
    elif key_file is not None:
        json_key = json.load(open(key_file))
        scope = ['https://spreadsheets.google.com/feeds']
        credentials = SignedJwtAssertionCredentials(
            json_key['client_email'],
            json_key['private_key'].encode('utf-8'),
            scope
        )
        gc = gspread.authorize(credentials)
    else:
        print "DRIVE_USER and DRIVE_PWD are not set."
        sys.exit(1)
    wks = gc.open_by_key(key).sheet1
    resp = wks.export()
    if resp.status == 200:
        if sys.version_info[0] == 2:
            content = resp.read()
        else:
            content = resp.read().decode('utf-8')
        csv_content = StringIO(content)
        return csv.DictReader(csv_content, delimiter=delimiter, quotechar=quotechar, **kwargs)
    else:
        print('Unable to open gspread: {}.'.format(key))


def _process_csv_file(csv_reader, translations):
    if not translations:
        translations = _init_translations(csv_reader.fieldnames)
    for row in csv_reader:
        json_key = row['key']
        for lang, traduction in [(key, value) for key, value in row.items() if key != 'key']:
            translations[lang][json_key] = traduction

    return translations


def _init_translations(fieldnames):
    return {lang: {} for lang in fieldnames if lang != 'key'}


def _save_translations(translations, output_folder):
    for lang in translations:
        with open(join(output_folder, lang.lower() + '.json'), 'w') as json_file:
            # "separators=(',', ': ')" is required to avoid a trailing whitespace in python < 3.4
            json.dump(translations[lang], json_file, sort_keys=True, indent=4, ensure_ascii=False,
                      separators=(',', ': '))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Update translations. Files will be parsed in the '
                                     'order you pass them. gspread will be parsed before CSV files. '
                                     'The fist file or spreadsheet will be used to define the '
                                     'available languages.')
    parser.add_argument('-g', '--gspread', help='List of gspread to parse', dest='gspreads', nargs='*')
    parser.add_argument('-f', '--files', help='List of CSV file to parse', dest='files', nargs='*')
    parser.add_argument('-k', '--key', help='OAuth 2 json key file to use', dest='key_file')
    parser.add_argument(
        '-o',
        '--output-folder',
        help='Folder in which to save the translations files',
        dest='output_folder',
        default='src/locales'
    )
    main(parser.parse_args())
