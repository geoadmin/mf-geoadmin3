# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from geoalchemy import GeometryColumn, Geometry
from sqlalchemy.types import Numeric

from chsdi.models import *
from chsdi.models.vector import Vector


Base = bases['kogis']

class Gebaeuderegister(Base, Vector):
    # view in a schema
    __tablename__ = 'adr'
    __table_args__ = ({'schema': 'bfs', 'autoload': False})
    __template__ = 'templates/htmlpopup/gebaeuderegister.mako'
    __esriId__ = 3000
    __bodId__ = 'ch.bfs.gebaeude_wohnungs_register'
    __displayFieldName__ = 'strname1'
    # __minscale__ = 5001
    # due to https://redmine.bgdi.admin.ch/issues/3146 ltmoc  __maxscale__ = 25000
    id = Column('egid_edid', Text, primary_key=True)
    egid = Column('egid', Integer)
    strname1 = Column('strname1', Text)
    deinr = Column('deinr', Text)
    plz4 = Column('plz4', Integer)
    plzname = Column('plzname', Text)
    gdename = Column('gdename', Text)
    gdenr = Column('gdenr', Integer)
    bgdi_created = Column('bgdi_created', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bfs.gebaeude_wohnungs_register', Gebaeuderegister)

class AGNES(Base, Vector):
    # view in a schema
    __tablename__ = 'agnes'
    __table_args__ = ({'schema': 'fpds', 'autoload': False})
    __template__ = 'templates/htmlpopup/agnes.mako'
    __esriId__ = 3000
    __bodId__ = 'ch.swisstopo.fixpunkte-agnes'
    __displayFieldName__ = 'bgdi_id'
    id = Column('no', Text, primary_key=True)
    url = Column('url', Text)
    bgdi_id = Column('bgdi_id', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.fixpunkte-agnes', AGNES)

class FIXPUNKTE_LFP1(Base, Vector):
    # view in a schema
    __tablename__ = 'punkt_lage_lfp1'
    __table_args__ = ({'schema': 'fpds', 'autoload': False})
    __template__ = 'templates/htmlpopup/fixpunkte.mako'
    __queryable_attributes__ = ['pointid','nummer']
    __esriId__ = 3000
    __bodId__ = 'ch.swisstopo.fixpunkte-lfp1'
    __displayFieldName__ = 'nbident'
    id = Column('pointid', Text, primary_key=True)
    punktname = Column('punktname', Text)
    status = Column('status', Text)
    nbident = Column('nbident', Text)
    x03 = Column('x03', Numeric)
    y03 = Column('y03', Numeric)
    n95 = Column('n95', Numeric)
    e95 = Column('e95', Numeric)
    h02 = Column('h02', Numeric)
    zugang = Column('zugang', Text)
    url = Column('url', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.fixpunkte-lfp1', FIXPUNKTE_LFP1)
