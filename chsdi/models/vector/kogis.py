# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from geoalchemy import GeometryColumn, Geometry
from sqlalchemy.types import Numeric

from chsdi.models import *
from chsdi.models.vector import Vector


Base = bases['kogis']


class Gebaeuderegister(Base, Vector):
    __tablename__ = 'adr'
    __table_args__ = ({'schema': 'bfs', 'autoload': False})
    __template__ = 'templates/htmlpopup/gebaeuderegister.mako'
    __bodId__ = 'ch.bfs.gebaeude_wohnungs_register'
    # __minscale__ = 5001
    # due to https://redmine.bgdi.admin.ch/issues/3146 ltmoc  __maxscale__ = 25000
    # Composite labels
    __label__ = 'strname1'
    id = Column('egid_edid', Text, primary_key=True)
    egid = Column('egid', Integer)
    strname1 = Column('strname1', Text)
    deinr = Column('deinr', Text)
    plz4 = Column('plz4', Integer)
    plzname = Column('plzname', Text)
    gdename = Column('gdename', Text)
    gdekt = Column('gdekt', Text)
    dstrid = Column('dstrid', Integer)
    gkplaus = Column('gkplaus', Integer)
    gstat = Column('gstat', Integer)
    gdenr = Column('gdenr', Integer)
    ggbkr = Column('ggbkr', Text)
    bgdi_created = Column('bgdi_created', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bfs.gebaeude_wohnungs_register', Gebaeuderegister)


class AGNES(Base, Vector):
    __tablename__ = 'agnes'
    __table_args__ = ({'schema': 'fpds', 'autoload': False})
    __template__ = 'templates/htmlpopup/agnes.mako'
    __bodId__ = 'ch.swisstopo.fixpunkte-agnes'
    __label__ = 'id'
    id = Column('no', Text, primary_key=True)
    url = Column('url', Text)
    bgdi_id = Column('bgdi_id', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.fixpunkte-agnes', AGNES)


class FIXPUNKTE_LFP1(Base, Vector):
    __tablename__ = 'punkt_lage_lfp1'
    __table_args__ = ({'schema': 'fpds', 'autoload': False})
    __template__ = 'templates/htmlpopup/fixpunkte.mako'
    #__queryable_attributes__ = ['pointid', 'nummer']
    __bodId__ = 'ch.swisstopo.fixpunkte-lfp1'
    __label__ = 'id'
    id = Column('pointid', Text, primary_key=True)
    punktname = Column('punktname', Text)
    nummer = Column('nummer', Text)
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
    bgdi_created = Column('bgdi_created', Text)

register('ch.swisstopo.fixpunkte-lfp1', FIXPUNKTE_LFP1)


class FIXPUNKTE_LFP2(Base, Vector):
    __tablename__ = 'punkt_lage_lfp2'
    __table_args__ = ({'schema': 'fpds', 'autoload': False})
    __template__ = 'templates/htmlpopup/fixpunkte.mako'
    #__queryable_attributes__ = ['pointid', 'nummer']
    __bodId__ = 'ch.swisstopo.fixpunkte-lfp2'
    __label__ = 'id'
    id = Column('pointid', Text, primary_key=True)
    nbident = Column('nbident', Text)
    punktname = Column('punktname', Text)
    status = Column('status', Text)
    nummer = Column('nummer', Text)
    x03 = Column('x03', Numeric)
    y03 = Column('y03', Numeric)
    n95 = Column('n95', Numeric)
    e95 = Column('e95', Numeric)
    h02 = Column('h02', Numeric)
    zugang = Column('zugang', Text)
    url = Column('url', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    bgdi_created = Column('bgdi_created', Text)

register('ch.swisstopo.fixpunkte-lfp2', FIXPUNKTE_LFP2)


class FIXPUNKTE_HFP1(Base, Vector):
    __tablename__ = 'punkt_hoehe_hfp1'
    __table_args__ = ({'schema': 'fpds', 'autoload': True})
    __template__ = 'templates/htmlpopup/fixpunkte.mako'
    #__queryable_attributes__ = ['pointid', 'nummer', 'bgdi_label']
    __bodId__ = 'ch.swisstopo.fixpunkte-hfp1'
    __label__ = 'id'
    id = Column('pointid', Text, primary_key=True)
    nbident = Column('nbident', Text)
    punktname = Column('punktname', Text)
    status = Column('status', Text)
    nummer = Column('nummer', Text)
    x03 = Column('x03', Numeric)
    y03 = Column('y03', Numeric)
    n95 = Column('n95', Numeric)
    e95 = Column('e95', Numeric)
    h02 = Column('h02', Numeric)
    zugang = Column('zugang', Text)
    url = Column('url', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    bgdi_created = Column('bgdi_created', Text)

register('ch.swisstopo.fixpunkte-hfp1', FIXPUNKTE_HFP1)


class FIXPUNKTE_HFP2(Base, Vector):
    __tablename__ = 'punkt_hoehe_hfp2'
    __table_args__ = ({'schema': 'fpds', 'autoload': True})
    __template__ = 'templates/htmlpopup/fixpunkte.mako'
    #__queryable_attributes__ = ['pointid', 'nummer']
    __bodId__ = 'ch.swisstopo.fixpunkte-hfp2'
    __label__ = 'id'
    id = Column('pointid', Text, primary_key=True)
    nbident = Column('nbident', Text)
    punktname = Column('punktname', Text)
    status = Column('status', Text)
    nummer = Column('nummer', Text)
    x03 = Column('x03', Numeric)
    y03 = Column('y03', Numeric)
    n95 = Column('n95', Numeric)
    e95 = Column('e95', Numeric)
    h02 = Column('h02', Numeric)
    zugang = Column('zugang', Text)
    url = Column('url', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    bgdi_created = Column('bgdi_created', Text)

register('ch.swisstopo.fixpunkte-hfp2', FIXPUNKTE_HFP2)


# This address model is just used in the sitemap service
# It contains different attributes than the standard
# Gebaeuderegister model for the layer 'ch.bfs.gebaeude_wohnungs_register'
# This model is not registered
class SitemapGebaeuderegister(Gebaeuderegister):
    X = Column('gkody', Numeric)
    Y = Column('gkodx', Numeric)
