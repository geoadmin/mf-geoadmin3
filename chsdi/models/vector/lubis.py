# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer, Boolean, Numeric
from geoalchemy import GeometryColumn, Geometry

from chsdi.models import *
from chsdi.models.vector import Vector

Base = bases['lubis']


class luftbilder_swisstopo(Base, Vector):
    __tablename__ = 'luftbilder_swisstopo'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/lubis_luftbilder_quickview.mako'
    __bodId__ = 'ch.swisstopo.lubis-luftbilder'
    __returnedGeometry__ = 'the_geom_footprint'
    __timeInstant__ = 'bgdi_flugjahr'
    __extended_info__ = True
    id = Column('ebkey', Text, primary_key=True)
    the_geom = GeometryColumn('the_geom', Geometry(dimensions=2, srid=21781))
    the_geom_footprint = GeometryColumn('the_geom_footprint', Geometry(dimensions=2, srid=21781))
    filename = Column('filename', Text)
    bildnummer = Column('bildnummer', Integer)
    flugdatum = Column('flugdatum', Text)
    firma = Column('firma', Text)
    filmart = Column('filmart', Text)
    bgdi_flugjahr = Column('bgdi_flugjahr', Integer)
    orientierung = Column('orientierung', Boolean)
    originalsize = Column('originalsize', Text)
    x = Column('x', Integer)
    y = Column('y', Integer)
    ort = Column('ort', Text)
    massstab = Column('massstab', Integer)
    bgdi_imagemode = Column('bgdi_imagemode', Text)

register('ch.swisstopo.lubis-luftbilder', luftbilder_swisstopo)


class luftbilder_dritte_firmen(Base, Vector):
    __tablename__ = 'luftbilder_dritte_firmen'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/lubis_luftbilder.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.lubis-luftbilder-dritte-firmen'
    __returnedGeometry__ = 'the_geom_footprint'
    __timeInstant__ = 'bgdi_flugjahr'
    id = Column('ebkey', Text, primary_key=True)
    the_geom = GeometryColumn('the_geom', Geometry(dimensions=2, srid=21781))
    the_geom_footprint = GeometryColumn('the_geom_footprint', Geometry(dimensions=2, srid=21781))
    filename = Column('filename', Text)
    bildnummer = Column('bildnummer', Integer)
    flugdatum = Column('flugdatum', Text)
    firma = Column('firma', Text)
    filmart = Column('filmart', Text)
    bgdi_flugjahr = Column('bgdi_flugjahr', Integer)
    orientierung = Column('orientierung', Boolean)
    originalsize = Column('originalsize', Text)
    x = Column('x', Integer)
    y = Column('y', Integer)
    ort = Column('ort', Text)
    bgdi_imagemode = Column('bgdi_imagemode', Text)

register('ch.swisstopo.lubis-luftbilder-dritte-firmen', luftbilder_dritte_firmen)


class luftbilder_dritte_kantone(Base, Vector):
    __tablename__ = 'luftbilder_dritte_kantone'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/lubis_luftbilder.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.lubis-luftbilder-dritte-kantone'
    __returnedGeometry__ = 'the_geom_footprint'
    __timeInstant__ = 'bgdi_flugjahr'
    id = Column('ebkey', Text, primary_key=True)
    the_geom = GeometryColumn('the_geom', Geometry(dimensions=2, srid=21781))
    the_geom_footprint = GeometryColumn('the_geom_footprint', Geometry(dimensions=2, srid=21781))
    filename = Column('filename', Text)
    bildnummer = Column('bildnummer', Integer)
    flugdatum = Column('flugdatum', Text)
    firma = Column('firma', Text)
    filmart = Column('filmart', Text)
    bgdi_flugjahr = Column('bgdi_flugjahr', Integer)
    orientierung = Column('orientierung', Boolean)
    originalsize = Column('originalsize', Text)
    x = Column('x', Integer)
    y = Column('y', Integer)
    ort = Column('ort', Text)
    bgdi_imagemode = Column('bgdi_imagemode', Text)

register('ch.swisstopo.lubis-luftbilder-dritte-kantone', luftbilder_dritte_kantone)


class bildstreifen(Base, Vector):
    __tablename__ = 'view_bildstreifen'
    __table_args__ = ({'schema': 'ads40', 'autoload': False})
    __template__ = 'templates/htmlpopup/lubis_bildstreifen.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.lubis-bildstreifen'
    __returnedGeometry__ = 'the_geom_footprint'
    __timeInstant__ = 'bgdi_flugjahr'
    id = Column('bildstreifen_nr', Text, primary_key=True)
    the_geom = GeometryColumn('the_geom', Geometry(dimensions=2, srid=21781))
    the_geom_footprint = GeometryColumn('the_geom_footprint', Geometry(dimensions=2, srid=21781))
    flugdatum = Column('flugdatum', Text)
    firma = Column('firma', Text)
    filmart = Column('filmart', Text)
    bgdi_flugjahr = Column('bgdi_flugjahr', Integer)
    resolution = Column('resolution', Text)
    objectid = Column('objectid', Text)
    area = Column('area', Text)
    toposhop_length = Column('toposhop_length', Numeric)
    toposhop_start_x = Column('toposhop_start_x', Integer)
    toposhop_start_y = Column('toposhop_start_y', Integer)
    toposhop_end_x = Column('toposhop_end_x', Integer)
    toposhop_end_y = Column('toposhop_end_y', Integer)
    toposhop_date = Column('toposhop_date', Text)
register('ch.swisstopo.lubis-bildstreifen', bildstreifen)
