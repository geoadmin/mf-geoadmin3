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
    __minresolution__ = 10.05
    __maxresolution__ = 500005
    __timeInstant__ = 'years'
    __label__ = 'release_year'
    id = Column('bgdi_id', Text, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    kbbez = Column('kbbez', Text)
    produkt = Column('produkt', Text)
    kbnum = Column('kbnum', Text)
    release_year = Column('release_year', Integer)
    years = Column('years', Integer)
    bv_nummer = Column('bv_nummer', Text)
    bgdi_order = Column('bgdi_order', Integer)


class Zeitreihen_20(Base, Vector):
    __tablename__ = 'tooltip_20'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/zeitreihen.mako'
    __bodId__ = 'ch.swisstopo.zeitreihen'
    __minresolution__ = 5.05
    __maxresolution__ = 10.05
    __timeInstant__ = 'years'
    __label__ = 'release_year'
    id = Column('bgdi_id', Text, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    kbbez = Column('kbbez', Text)
    produkt = Column('produkt', Text)
    kbnum = Column('kbnum', Text)
    release_year = Column('release_year', Integer)
    years = Column('years', Integer)
    bv_nummer = Column('bv_nummer', Text)
    bgdi_order = Column('bgdi_order', Integer)


class Zeitreihen_21(Base, Vector):
    __tablename__ = 'tooltip_21'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/zeitreihen.mako'
    __bodId__ = 'ch.swisstopo.zeitreihen'
    __minresolution__ = 2.55
    __maxresolution__ = 5.05
    __timeInstant__ = 'years'
    __label__ = 'release_year'
    id = Column('bgdi_id', Text, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    kbbez = Column('kbbez', Text)
    produkt = Column('produkt', Text)
    kbnum = Column('kbnum', Text)
    release_year = Column('release_year', Integer)
    years = Column('years', Integer)
    bv_nummer = Column('bv_nummer', Text)
    bgdi_order = Column('bgdi_order', Integer)


class Zeitreihen_22(Base, Vector):
    __tablename__ = 'tooltip_22'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/zeitreihen.mako'
    __bodId__ = 'ch.swisstopo.zeitreihen'
    __minresolution__ = 0
    __maxresolution__ = 2.55
    __timeInstant__ = 'years'
    __label__ = 'release_year'
    id = Column('bgdi_id', Text, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    kbbez = Column('kbbez', Text)
    produkt = Column('produkt', Text)
    kbnum = Column('kbnum', Text)
    release_year = Column('release_year', Integer)
    years = Column('years', Integer)
    bv_nummer = Column('bv_nummer', Text)
    bgdi_order = Column('bgdi_order', Integer)


class DufourErst(Base, Vector):
    __tablename__ = 'view_dufour_erstausgabe'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/dufour_erst.mako'
    __bodId__ = 'ch.swisstopo.hiks-dufour'
    __label__ = 'datenstand'
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
    __label__ = 'datenstand'
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


class Zeitreihen_Metadata_15(Base, Vector):
    # view in a schema
    __tablename__ = 'meta_15'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __minresolution__ = 10.05
    __maxresolution__ = 500005
    __bodId__ = 'ch.swisstopo.zeitreihen_meta'

    id = Column('gid', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    release_year = Column('release_year', Integer)
    bgdi_order = Column('bgdi_order', Integer)


class Zeitreihen_Metadata_20(Base, Vector):
    # view in a schema
    __tablename__ = 'meta_20'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __minresolution__ = 5.05
    __maxresolution__ = 10.05
    __bodId__ = 'ch.swisstopo.zeitreihen_meta'

    id = Column('gid', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    release_year = Column('release_year', Integer)
    bgdi_order = Column('bgdi_order', Integer)


class Zeitreihen_Metadata_21(Base, Vector):
    # view in a schema
    __tablename__ = 'meta_21'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __minresolution__ = 2.55
    __maxresolution__ = 5.05
    __bodId__ = 'ch.swisstopo.zeitreihen_meta'

    id = Column('gid', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    release_year = Column('release_year', Integer)
    bgdi_order = Column('bgdi_order', Integer)


class Zeitreihen_Metadata_22(Base, Vector):
    # view in a schema
    __tablename__ = 'meta_22'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __minresolution__ = 0
    __maxresolution__ = 2.55
    __bodId__ = 'ch.swisstopo.zeitreihen_meta'

    id = Column('gid', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    release_year = Column('release_year', Integer)
    bgdi_order = Column('bgdi_order', Integer)

register('ch.swisstopo.zeitreihen_meta', Zeitreihen_Metadata_15)
register('ch.swisstopo.zeitreihen_meta', Zeitreihen_Metadata_20)
register('ch.swisstopo.zeitreihen_meta', Zeitreihen_Metadata_21)
register('ch.swisstopo.zeitreihen_meta', Zeitreihen_Metadata_22)
