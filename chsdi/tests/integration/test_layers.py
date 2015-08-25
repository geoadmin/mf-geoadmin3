# -*- coding: utf-8 -*-

import os
from webtest import TestApp
from pyramid.paster import get_app
from sqlalchemy import distinct
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.sql.expression import func

from chsdi.models.bod import LayersConfig
from chsdi.models import models_from_name


class LayersChecker(object):

    def __enter__(self):
        def num(s):
            if s.isdigit():
                return long(s)
            else:
                return s

        self.testapp = TestApp(get_app('development.ini'))
        self.session = scoped_session(sessionmaker())

        # configuration via environment. Default is None for all
        self.staging = os.environ.get('CHSDI_STAGING') if os.environ.get('CHSDI_STAGING') is not None else 'prod'
        self.onlylayer = os.environ.get('CHSDI_ONLY_LAYER')
        self.randomFeatures = os.environ.get('CHSDI_RANDOM_FEATURES') == 'True'
        self.nrOfFeatures = num(os.environ.get('CHSDI_NUM_FEATURES')) if os.environ.get('CHSDI_NUM_FEATURES') is not None else 1
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.session.close()
        del self.testapp
        return False

    def ilayers(self, queryable=None, hasLegend=None):
        valNone = None
        query = self.session.query(distinct(LayersConfig.layerBodId)) \
            .filter(LayersConfig.staging == self.staging) \
            .filter(LayersConfig.parentLayerId == valNone)
        if queryable is not None:
            query = query.filter(LayersConfig.queryable == queryable)
        if hasLegend is not None:
            query = query.filter(LayersConfig.hasLegend == hasLegend)
        for q in query:
            if self.onlylayer is None or q[0] == self.onlylayer:
                yield q[0]

    def ilayersWithFeatures(self):
        for layer in self.ilayers(queryable=True):
            models = models_from_name(layer)
            assert (models is not None and len(models) > 0), layer
            model = models[0]
            query = self.session.query(model.primary_key_column())
            # Depending on db size, random row is slow
            if self.randomFeatures:
                query = query.order_by(func.random())
            if isinstance(self.nrOfFeatures, (int, long)):
                query = query.limit(self.nrOfFeatures)
            hasExtended = model.__extended_info__ if hasattr(model, '__extended_info__') else False
            for q in query:
                yield (layer, str(q[0]), hasExtended)

    def checkHtmlPopup(self, layer, feature, extended):
        for lang in ('de', 'fr', 'it', 'rm', 'en'):
            link = '/rest/services/all/MapServer/' + layer + '/' + feature + '/htmlPopup?callback=cb&lang=' + lang
            resp = self.testapp.get(link)
            assert resp.status_int == 200, link
            if extended:
                link = link.replace('htmlPopup', 'extendedHtmlPopup')
                resp = self.testapp.get(link)
                assert resp.status_int == 200, link

    def checkLegend(self, layer):
        for lang in ('de', 'fr', 'it', 'rm', 'en'):
            link = '/rest/services/all/MapServer/' + layer + '/legend?callback=cb&lang=' + lang
            resp = self.testapp.get(link)
            assert resp.status_int == 200, link

    def checkLegendImage(self, layer, legendImages):
        for lang in ('de', 'fr', 'it', 'rm', 'en'):
            assert ((layer + '_' + lang) in legendImages), layer + lang


def test_all_htmlpopups():
    with LayersChecker() as lc:
        for layer, feature, extended in lc.ilayersWithFeatures():
            yield lc.checkHtmlPopup, layer, feature, extended


def test_all_legends():
    with LayersChecker() as lc:
        for layer in lc.ilayers(hasLegend=True):
            yield lc.checkLegend, layer


def test_all_legends_images():
    # Get list of layers from existing legend images
    legendsPath = os.getcwd() + '/chsdi/static/images/legends/'
    legendNames = os.listdir(legendsPath)
    parseLegendNames = lambda x: x[:-4] if 'big' not in x else x[:-8]
    legendImages = list(set(map(parseLegendNames, legendNames)))

    with LayersChecker() as lc:
        for layer in lc.ilayers(hasLegend=True):
            yield lc.checkLegendImage, layer, legendImages
