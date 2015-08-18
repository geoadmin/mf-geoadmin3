#-*- coding: utf-8 -*-

import requests
import random
from nose.tools import with_setup

from chsdi.tests.mapproxy import MapProxyTestsBase

# Official URLS we support
WMTS_URLS = [
    'wmts.geo.admin.ch',
    'wmts5.geo.admin.ch',
    'wmts6.geo.admin.ch',
    'wmts7.geo.admin.ch',
    'wmts8.geo.admin.ch',
    'wmts9.geo.admin.ch'
]

MAPPROXY_URLS = [
    'wmts10.geo.admin.ch',
    'wmts11.geo.admin.ch',
    'wmts12.geo.admin.ch',
    'wmts13.geo.admin.ch',
    'wmts14.geo.admin.ch',
]


def rotateUrl(url):
    return url.replace(WMTS_URLS[0], WMTS_URLS[random.randint(0, len(WMTS_URLS) - 1)]).replace(MAPPROXY_URLS[0], MAPPROXY_URLS[random.randint(0, len(MAPPROXY_URLS) - 1)])

HEADER_RESULTS = [{
    # NOTE Varnish transforms all non 200 status code into 204 (even 404)!
    'Results': [200, 204, 304],
    'Header': {'User-Agent': 'WMTS Unit Tester v0.0.1', 'Referer': 'http://unittest.geo.admin.ch'}
}, {
    'Results': [403],
    'Header': {'User-Agent': 'WMTS Unit Tester v0.0.1', 'Referer': None}
}, {
    'Results': [403],
    'Header': {'User-Agent': 'WMTS Unit Tester v0.0.1', 'Referer': 'http://foonogood.ch'}
}
]


def get_header():
    return HEADER_RESULTS[random.randint(0, len(HEADER_RESULTS) - 1)]


class TileChecker(MapProxyTestsBase):

    def __init__(self):
        super(TileChecker, self).setUp()
        self.session = requests.Session()
        self.session.mount("http://", requests.adapters.HTTPAdapter(max_retries=5))

    def check_status_code(self, path):
        if not path.startswith('http'):
            url = self.mapproxy_url + path
        else:
            url = path.replace('http://wmts10.geo.admin.ch', self.mapproxy_url)
        url = rotateUrl(url)
        h = get_header()
        self.session.headers.update(h['Header'])
        resp = self.session.get(url)
        checkcode = resp.status_code in h['Results']
        assert checkcode, url

    def itiles(self, epsg=21781):
        from urlparse import urlparse, urlunparse
        import xml.etree.ElementTree as etree

        # TODO: ideally we should only check tiles which have content for sure.
        tiles = {3857: [(7, 67, 45)],
                 21781: [(17, 5, 6)],
                 2056: [(17, 5, 6)],
                 4326: [(15, 2, 2)],
                 4258: [(15, 2, 2)]
                 }

        if epsg in tiles.keys():
            capabilities_name = "WMTSCapabilities.EPSG.%d.xml" % epsg if epsg != 21781 else "WMTSCapabilities.xml"
            resp = requests.get(self.mapproxy_url + '/1.0.0/%s' % capabilities_name, params={'_id': self.hash()},
                                headers=HEADER_RESULTS[0]['Header'])

            root = etree.fromstring(resp.content)
            layers = root.findall('.//{http://www.opengis.net/wmts/1.0}Layer')
            for layer in layers:
                resourceurls = layer.findall('.//{http://www.opengis.net/wmts/1.0}ResourceURL')
                for resourceurl in resourceurls:
                    tpl = resourceurl.attrib['template']
                    tpl_parsed = urlparse(tpl)
                    pth = tpl_parsed.path

                    dim = layer.find('.//{http://www.opengis.net/wmts/1.0}Dimension')
                    times = dim.findall('./{http://www.opengis.net/wmts/1.0}Value')

                    tiles_proj = tiles[epsg]

                    for tile in tiles_proj:
                        zoom, col, row = tile
                        for time in times:
                            t = time.text
                            try:
                                pth2 = pth.replace('{TileCol}', str(col)).replace('{TileRow}', str(row)).replace('{TileMatrix}', str(zoom)).replace('{Time}', str(t))
                            except:
                                print 'Cannot replace in template %s' % pth
                            yield urlunparse((tpl_parsed.scheme, tpl_parsed.netloc, pth2, '', '', ''))


tc = None


def setup():
    global tc
    tc = TileChecker()


def teardown():
    tc.tearDown()


@with_setup(setup, teardown)
def test_epsg21781():
    for tile in tc.itiles():
        yield tc.check_status_code, tile


@with_setup(setup, teardown)
def test_epsg3857():
    for tile in tc.itiles(epsg=3857):
        yield tc.check_status_code, tile


@with_setup(setup, teardown)
def test_epsg2056():
    for tile in tc.itiles(epsg=2056):
        yield tc.check_status_code, tile


@with_setup(setup, teardown)
def test_epsg4326():
    for tile in tc.itiles(epsg=4326):
        yield tc.check_status_code, tile


@with_setup(setup, teardown)
def test_epsg4258():
    for tile in tc.itiles(epsg=4258):
        yield tc.check_status_code, tile
