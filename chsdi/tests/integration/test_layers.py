# -*- coding: utf-8 -*-

from webtest import TestApp
from pyramid.paster import get_app
from sqlalchemy import distinct
from sqlalchemy.orm import scoped_session, sessionmaker

from chsdi.models.bod import LayersConfig
from chsdi.models import models_from_name


class LayersChecker(object):

    def __enter__(self):
        self.testapp = TestApp(get_app('development.ini'))
        self.session = scoped_session(sessionmaker())
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.session.close()
        del self.testapp
        return False

    def ilayers(self, queryable=None, hasLegend=None):
        valNone = None
        query = self.session.query(distinct(LayersConfig.layerBodId)) \
            .filter(LayersConfig.staging == 'prod') \
            .filter(LayersConfig.parentLayerId == valNone)
        if queryable is not None:
            query = query.filter(LayersConfig.queryable == queryable)
        if hasLegend is not None:
            query = query.filter(LayersConfig.hasLegend == hasLegend)
        for q in query:
            yield q[0]

    def ilayersWithFeatures(self):
        for layer in self.ilayers(queryable=True):
            models = models_from_name(layer)
            assert (models is not None and len(models) > 0), layer
            model = models[0]
            query = self.session.query(model.primary_key_column()).limit(1)
            hasExtended = model.__extended_info__ if hasattr(model, '__extended_info__') else False
            ID = [q[0] for q in query]
            if ID:
                yield (layer, str(ID[0]), hasExtended)

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
    import os
    # Get list of layers from existing legend images
    legendsPath = os.getcwd() + '/chsdi/static/images/legends/'
    legendNames = os.listdir(legendsPath)
    parseLegendNames = lambda x: x[:-4] if 'big' not in x else x[:-8]
    legendImages = list(set(map(parseLegendNames, legendNames)))

    with LayersChecker() as lc:
        for layer in lc.ilayers(hasLegend=True):
            yield lc.checkLegendImage, layer, legendImages
