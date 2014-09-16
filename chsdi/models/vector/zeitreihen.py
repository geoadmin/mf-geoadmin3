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
    __maxscale__ = 5000000005
    __timeInstant__ = 'years'
    id = Column('bgdi_id', Text, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    kbbez = Column('kbbez', Text)
    produkt = Column('produkt', Text)
    kbnum = Column('kbnum', Text)
    release_year = Column('release_year', Integer)
    years = Column('years', Integer)
    bv_nummer = Column('bv_nummer', Text)


class Zeitreihen_20(Base, Vector):
    __tablename__ = 'tooltip_20'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/zeitreihen.mako'
    __bodId__ = 'ch.swisstopo.zeitreihen'
    __minscale__ = 50005
    __maxscale__ = 100005
    __timeInstant__ = 'years'
    id = Column('bgdi_id', Text, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    kbbez = Column('kbbez', Text)
    produkt = Column('produkt', Text)
    kbnum = Column('kbnum', Text)
    release_year = Column('release_year', Integer)
    years = Column('years', Integer)
    bv_nummer = Column('bv_nummer', Text)


class Zeitreihen_21(Base, Vector):
    __tablename__ = 'tooltip_21'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/zeitreihen.mako'
    __bodId__ = 'ch.swisstopo.zeitreihen'
    __minscale__ = 25005
    __maxscale__ = 50005
    __timeInstant__ = 'years'
    id = Column('bgdi_id', Text, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    kbbez = Column('kbbez', Text)
    produkt = Column('produkt', Text)
    kbnum = Column('kbnum', Text)
    release_year = Column('release_year', Integer)
    years = Column('years', Integer)
    bv_nummer = Column('bv_nummer', Text)


class Zeitreihen_22(Base, Vector):
    __tablename__ = 'tooltip_22'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/zeitreihen.mako'
    __bodId__ = 'ch.swisstopo.zeitreihen'
    __minscale__ = 0
    __maxscale__ = 25005
    __timeInstant__ = 'years'
    id = Column('bgdi_id', Text, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    kbbez = Column('kbbez', Text)
    produkt = Column('produkt', Text)
    kbnum = Column('kbnum', Text)
    release_year = Column('release_year', Integer)
    years = Column('years', Integer)
    bv_nummer = Column('bv_nummer', Text)


class DufourErst(Base, Vector):
    __tablename__ = 'view_dufour_erstausgabe'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/dufour_erst.mako'
    __bodId__ = 'ch.swisstopo.hiks-dufour'
    id = Column('tilenumber', Text, primary_key=True)
    kbbez = Column('kbbez', Text)
    datenstand = Column('datenstand', Integer)
    bv_nummer = Column('bv_nummer', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))


class SiegfriedErst(Base, Vector):
    __tablename__ = 'view_siegfried_erstausgabe'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/siegfried_erst.mako'
    __bodId__ = 'ch.swisstopo.hiks-siegfried'
    id = Column('tilenumber', Text, primary_key=True)
    kbbez = Column('kbbez', Text)
    datenstand = Column('datenstand', Numeric)
    bv_nummer = Column('bv_nummer', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))


register('ch.swisstopo.hiks-siegfried', SiegfriedErst)
register('ch.swisstopo.hiks-dufour', DufourErst)
register('ch.swisstopo.zeitreihen', Zeitreihen_15)
register('ch.swisstopo.zeitreihen', Zeitreihen_20)
register('ch.swisstopo.zeitreihen', Zeitreihen_21)
register('ch.swisstopo.zeitreihen', Zeitreihen_22)
