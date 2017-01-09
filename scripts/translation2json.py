#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

"""
translation2js.py
This script is used to create the {lang}.json files from the csv.

Usage: ./env/bin/python translation2js.py -h
"""

import argparse
import csv
import json
import os
from os.path import join
import sys

try:
    from StringIO import StringIO
except ImportError:
    from io import StringIO

try:
    from urllib.parse import urlparse
    from urllib.request import urlopen
except ImportError:
    from urlparse import urlparse
    from urllib2 import urlopen


NON_LANGUAGE_KEYS = ('key', '')
PY3 = sys.version_info[0] == 3


def main(args, delimiter=',', quotechar='"'):
    translations = {}
    if args.files is not None:
        empty_json = _get_empty_json(args.empty_json)
        _process_files(
            args.files,
            translations,
            empty_json,
            delimiter=delimiter,
            quotechar=quotechar)

    _save_translations(translations, args.output_folder, args.languages)


def _get_empty_json(empty_json_file_name):
    if os.path.exists(empty_json_file_name):
        with open(empty_json_file_name, 'r') as empty_json_file:
            return json.load(empty_json_file)
    elif _is_url(empty_json_file_name):
        json_content = urlopen(empty_json_file_name).read()
        if PY3:
            json_content = json_content.decode('utf-8')
        return json.loads(json_content)


def _is_url(path):
    return urlparse(path).scheme in ('http', 'https')


def _process_files(files, translations, empty_json, delimiter=',', quotechar='"'):
    for filename in files:
        csv_file, is_url = _open_csv_file(filename)
        # file may not exists. In this case, csv_file is None
        if csv_file is None:
            continue

        csv_reader = csv.DictReader(
            csv_file,
            delimiter=delimiter,
            quotechar=quotechar)
        _process_csv_file(csv_reader, translations, empty_json)
        _close_csv_file(csv_file, is_url)


def _open_csv_file(filename):
    if _is_url(filename):
        try:
            content = urlopen(filename).read()
            if PY3:
                content = content.decode('utf-8')
            csv_file = StringIO(content)
        except:
            print('Could not open {}'.format(filename))
            csv_file = None
    else:
        try:
            csv_file = open(filename, 'r')
        except OSError:
            print('Could not open {}'.format(filename))
            csv_file = None

    return csv_file, _is_url(filename)


def _process_csv_file(csv_reader, translations, empty_json):
    if not translations:
        init_translations = _init_translations(csv_reader.fieldnames)
        translations.update(init_translations)
    for row in csv_reader:
        json_key = row.get('key', None) or \
            row.get('', None) or \
            row.get('msgid', None)
        if empty_json is None or json_key in empty_json:
            langs_translations = [(key.lower(), value)
                                  for key, value in row.items()
                                  if _is_language_key(key)]
            # Test if an ngeo msg id is provided
            if empty_json[json_key] != '':
                json_key = empty_json[json_key]
            for lang, traduction in langs_translations:
                translations[lang][json_key] = traduction


def _is_language_key(key):
    return key.lower() not in NON_LANGUAGE_KEYS


def _init_translations(fieldnames):
    return {lang.lower(): {} for lang in fieldnames if _is_language_key(lang)}


def _close_csv_file(csv_file, is_url):
    if not is_url:
        csv_file.close()


def _save_translations(translations, output_folder, languages_to_save):
    if languages_to_save is None:
        languages_to_save = translations.keys()
    elif _languages_passed_as_json(languages_to_save):
        languages_to_save = json.loads(languages_to_save[0][1:-1])
    for lang in languages_to_save:
        json_file = join(output_folder, lang.lower() + '.json')
        with open(json_file, 'w') as json_file:
            # "separators=(',', ': ')" is required to avoid a trailing
            # whitespace in python < 3.4
            json.dump(
                translations[lang],
                json_file,
                sort_keys=True,
                indent=0,
                ensure_ascii=False,
                separators=(',', ': '))


def _languages_passed_as_json(languages):
    try:
        json.loads(languages[0][1:-1])
        is_json = True
    except ValueError:
        is_json = False
    return len(languages) == 1 and is_json


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Update translations. Files will be parsed in the '
        'order you pass them.')
    parser.add_argument(
        '-f',
        '--files',
        help='List of CSV file to parse. Can be either a path or a URL.',
        dest='files',
        nargs='*')
    parser.add_argument(
        '-l',
        '--languages',
        help='List of languages for which to generate the translations.',
        dest='languages',
        nargs='*')
    parser.add_argument(
        '-e',
        '--empty-json-file',
        help='Use only keys present in this file to generate the translations',
        dest='empty_json',
        default='')
    parser.add_argument(
        '-o',
        '--output-folder',
        help='Folder in which to save the translations files',
        dest='output_folder',
        default='.')
    main(parser.parse_args())
