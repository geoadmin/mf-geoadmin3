# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from geoalchemy import GeometryColumn, Geometry

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
