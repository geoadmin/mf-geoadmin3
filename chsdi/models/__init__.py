# -*- coding: utf-8 -*-

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import engine_from_config

from geoalchemy2.types import Geometry

dbs = ['bod', 'bafu', 'uvek', 'search', 'stopo', 'evd', 'edi', 'are', 'dritte', 'kogis', 'zeitreihen', 'vbs', 'bak', 'lubis']

engines = {}
bases = {}
bodmap = {}
oerebmap = {}

for db in dbs:
    bases[db] = declarative_base()


def initialize_sql(settings):
    for db in dbs:
        engine = engine_from_config(
            settings,
            'sqlalchemy.%s.' % db,
            pool_recycle=20,
            pool_size=20,
            max_overflow=-1
        )
        engines[db] = engine
        bases[db].metadata.bind = engine


def register(name, klass):
    name = unicode(name)
    bodmap.setdefault(name, []).append(klass)


def register_oereb(name, klass):
    name = unicode(name)
    oerebmap.setdefault(name, []).append(klass)


def models_from_bodid(bodId):
    if bodId in bodmap:
        return bodmap[bodId]
    else:
        return None


def oereb_models_from_bodid(bodId):
    if bodId in oerebmap:
        return oerebmap[bodId]
    else:
        return None


def models_from_name(name):
    models = models_from_bodid(name)
    if models is not None:
        return models
    else:
        return None
