# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from sqlalchemy.types import Numeric
from geoalchemy import GeometryColumn, Geometry

from chsdi.models import *
from chsdi.models.vector import Vector


Base = bases['dritte']

class FEUERSTELLEN(Base, Vector):
    # view in a schema
    __tablename__ = 'feuerstellen'
    __table_args__ = ({'schema': 'tamedia', 'autoload': False})
    __template__ = 'templates/htmlpopup/swissmap_online_feuerstellen.mako'
    __esriId__ = 3000
    __bodId__ = 'ch.tamedia.schweizerfamilie-feuerstellen'
    __displayFieldName__ = 'gemeinde'
    id = Column('nr', Integer, primary_key=True)
    gemeinde = Column('gemeinde', Text)
    ort = Column('ort', Text)
    kanton = Column('kanton', Text)
    karte = Column('karte', Text)
    url = Column('url', Text)
    koordinate_lv03 = Column('koordinate_lv03', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.tamedia.schweizerfamilie-feuerstellen', FEUERSTELLEN)

class NOTFALLSCHUTZ(Base, Vector):
    # view in a schema
    __tablename__ = 'zonenplan_kernanlagen'
    __table_args__ = ({'schema': 'ensi', 'autoload': False})
    __template__ = 'templates/htmlpopup/zonenplan_kernanlagen.mako'
    __esriId__ = 3000
    __bodId__ = 'ch.ensi.zonenplan-notfallschutz-kernanlagen'
    __displayFieldName__ = 'name'
    id = Column('nr', Integer, primary_key=True)
    name = Column('name', Text)
    zone = Column('zone', Text)
    sektor = Column('sektor', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.ensi.zonenplan-notfallschutz-kernanlagen', NOTFALLSCHUTZ)
