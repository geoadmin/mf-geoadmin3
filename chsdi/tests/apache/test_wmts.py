#-*- coding: utf-8 -*-

import requests

from pyramid.paster import get_app

app = get_app('development.ini')


try:
    api_url = "http:" + app.registry.settings['api_url']
except KeyError as e:
    api_url = 'http://api3.geo.admin.ch'


def get_getcap_de():
    resp = requests.get(api_url + '/1.0.0/WMTSCapabilities.EPSG.4326.xml?lang=de')

    words = ['Alpenkonvention', 'Schweiz', 'Verkehrswege ', 'Flachmoor']
    for w in words:
        assert w in resp.body


def get_getcap_fr():
    resp = requests.get(api_url + '/1.0.0/WMTSCapabilities.EPSG.4326.xml?lang=fr')

    words = ['Convention', 'Suisse', 'Voies', 'marécage']
    for w in words:
        assert w in resp.body
