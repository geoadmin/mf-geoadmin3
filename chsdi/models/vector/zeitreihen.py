# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from sqlalchemy.types import Numeric
from geoalchemy import GeometryColumn, Geometry

from chsdi.models import *
from chsdi.models.vector import Vector

Base = bases['zeitreihen']


class Zeitreihen_15(Base, Vector):
    __tablename__ = 'tooltip_15'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/zeitreihen.mako'
    __bodId__ = 'ch.swisstopo.zeitreihen'
    __minscale__ = 100005
    __maxscale__ = 500000005
    id = Column('bgdi_id', Text, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    kbbez = Column('kbbez', Text)
    produkt = Column('produkt', Text)
    kbnum = Column('kbnum', Text)
    release_year = Column('release_year', Integer)
    bv_nummer = Column('bv_nummer', Text)


class Zeitreihen_20(Base, Vector):
    __tablename__ = 'tooltip_20'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/zeitreihen.mako'
    __bodId__ = 'ch.swisstopo.zeitreihen'
    __minscale__ = 50005
    __maxscale__ = 100005
    id = Column('bgdi_id', Text, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    kbbez = Column('kbbez', Text)
    produkt = Column('produkt', Text)
    kbnum = Column('kbnum', Text)
    release_year = Column('release_year', Integer)
    bv_nummer = Column('bv_nummer', Text)


class Zeitreihen_21(Base, Vector):
    __tablename__ = 'tooltip_21'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/zeitreihen.mako'
    __bodId__ = 'ch.swisstopo.zeitreihen'
    __minscale__ = 25005
    __maxscale__ = 50005
    id = Column('bgdi_id', Text, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    kbbez = Column('kbbez', Text)
    produkt = Column('produkt', Text)
    kbnum = Column('kbnum', Text)
    release_year = Column('release_year', Integer)
    bv_nummer = Column('bv_nummer', Text)


class Zeitreihen_22(Base, Vector):
    __tablename__ = 'tooltip_22'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/zeitreihen.mako'
    __bodId__ = 'ch.swisstopo.zeitreihen'
    __minscale__ = 24995
    __maxscale__ = 25005
    id = Column('bgdi_id', Text, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    kbbez = Column('kbbez', Text)
    produkt = Column('produkt', Text)
    kbnum = Column('kbnum', Text)
    release_year = Column('release_year', Integer)
    bv_nummer = Column('bv_nummer', Text)

register('ch.swisstopo.zeitreihen', Zeitreihen_15)
register('ch.swisstopo.zeitreihen', Zeitreihen_20)
register('ch.swisstopo.zeitreihen', Zeitreihen_21)
register('ch.swisstopo.zeitreihen', Zeitreihen_22)
