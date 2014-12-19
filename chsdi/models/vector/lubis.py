# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer, Boolean, Numeric
from geoalchemy import GeometryColumn, Geometry

from chsdi.models import *
from chsdi.models.vector import Vector

Base = bases['lubis']


class luftbilder_swisstopo_farbe(Base, Vector):
    __tablename__ = 'luftbilder_swisstopo_color'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/lubis.mako'
    __bodId__ = 'ch.swisstopo.lubis-luftbilder_farbe'
    __returnedGeometry__ = 'the_geom_footprint'
    __timeInstant__ = 'bgdi_flugjahr'
    __extended_info__ = True
    # Composite labels
    __label__ = 'flugdatum'
    id = Column('ebkey', Text, primary_key=True)
    the_geom = GeometryColumn('the_geom', Geometry(dimensions=2, srid=21781))
    the_geom_footprint = GeometryColumn('the_geom_footprint', Geometry(dimensions=2, srid=21781))
    filename = Column('filename', Text)
    inventarnummer = Column('inventarnummer', Integer)
    bildnummer = Column('bildnummer', Integer)
    flugdatum = Column('flugdatum', Text)
    firma = Column('firma', Text)
    filmart = Column('filmart', Text)
    bgdi_flugjahr = Column('bgdi_flugjahr', Integer)
    orientierung = Column('orientierung', Boolean)
    rotation = Column('rotation', Integer)
    originalsize = Column('originalsize', Text)
    x = Column('x', Integer)
    y = Column('y', Integer)
    flughoehe = Column('flughoehe', Integer)
    ort = Column('ort', Text)
    massstab = Column('massstab', Integer)
    filesize_mb = Column('filesize_mb', Text)
    bgdi_imagemode = Column('bgdi_imagemode', Text)
    image_height = Column('image_height', Integer)
    image_width = Column('image_width', Integer)

register('ch.swisstopo.lubis-luftbilder_farbe', luftbilder_swisstopo_farbe)


class luftbilder_swisstopo_ir(Base, Vector):
    __tablename__ = 'luftbilder_swisstopo_ir'
    __table_args__ = ({'schema': 'public', 'autoload': False, 'extend_existing': True})
    __template__ = 'templates/htmlpopup/lubis.mako'
    __bodId__ = 'ch.swisstopo.lubis-luftbilder_infrarot'
    __returnedGeometry__ = 'the_geom_footprint'
    __timeInstant__ = 'bgdi_flugjahr'
    __extended_info__ = True
    # Composite labels
    __label__ = 'flugdatum'
    id = Column('ebkey', Text, primary_key=True)
    the_geom = GeometryColumn('the_geom', Geometry(dimensions=2, srid=21781))
    the_geom_footprint = GeometryColumn('the_geom_footprint', Geometry(dimensions=2, srid=21781))
    filename = Column('filename', Text)
    inventarnummer = Column('inventarnummer', Integer)
    bildnummer = Column('bildnummer', Integer)
    flugdatum = Column('flugdatum', Text)
    firma = Column('firma', Text)
    filmart = Column('filmart', Text)
    bgdi_flugjahr = Column('bgdi_flugjahr', Integer)
    orientierung = Column('orientierung', Boolean)
    rotation = Column('rotation', Integer)
    originalsize = Column('originalsize', Text)
    x = Column('x', Integer)
    y = Column('y', Integer)
    flughoehe = Column('flughoehe', Integer)
    ort = Column('ort', Text)
    massstab = Column('massstab', Integer)
    filesize_mb = Column('filesize_mb', Text)
    bgdi_imagemode = Column('bgdi_imagemode', Text)
    image_height = Column('image_height', Integer)
    image_width = Column('image_width', Integer)

register('ch.swisstopo.lubis-luftbilder_infrarot', luftbilder_swisstopo_ir)


class luftbilder_swisstopo_sw(Base, Vector):
    __tablename__ = 'luftbilder_swisstopo_bw'
    __table_args__ = ({'schema': 'public', 'autoload': False, 'extend_existing': True})
    __template__ = 'templates/htmlpopup/lubis.mako'
    __bodId__ = 'ch.swisstopo.lubis-luftbilder_schwarzweiss'
    __returnedGeometry__ = 'the_geom_footprint'
    __timeInstant__ = 'bgdi_flugjahr'
    __extended_info__ = True
    # Composite labels
    __label__ = 'flugdatum'
    id = Column('ebkey', Text, primary_key=True)
    the_geom = GeometryColumn('the_geom', Geometry(dimensions=2, srid=21781))
    the_geom_footprint = GeometryColumn('the_geom_footprint', Geometry(dimensions=2, srid=21781))
    filename = Column('filename', Text)
    inventarnummer = Column('inventarnummer', Integer)
    bildnummer = Column('bildnummer', Integer)
    flugdatum = Column('flugdatum', Text)
    firma = Column('firma', Text)
    filmart = Column('filmart', Text)
    bgdi_flugjahr = Column('bgdi_flugjahr', Integer)
    orientierung = Column('orientierung', Boolean)
    rotation = Column('rotation', Integer)
    originalsize = Column('originalsize', Text)
    x = Column('x', Integer)
    y = Column('y', Integer)
    flughoehe = Column('flughoehe', Integer)
    ort = Column('ort', Text)
    massstab = Column('massstab', Integer)
    filesize_mb = Column('filesize_mb', Text)
    bgdi_imagemode = Column('bgdi_imagemode', Text)
    image_height = Column('image_height', Integer)
    image_width = Column('image_width', Integer)

register('ch.swisstopo.lubis-luftbilder_schwarzweiss', luftbilder_swisstopo_sw)


class luftbilder_dritte_firmen(Base, Vector):
    __tablename__ = 'luftbilder_dritte_firmen'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/lubis.mako'
    __bodId__ = 'ch.swisstopo.lubis-luftbilder-dritte-firmen'
    __returnedGeometry__ = 'the_geom_footprint'
    __timeInstant__ = 'bgdi_flugjahr'
    __extended_info__ = True
    # Composite labels
    __label__ = 'flugdatum'
    id = Column('ebkey', Text, primary_key=True)
    the_geom = GeometryColumn('the_geom', Geometry(dimensions=2, srid=21781))
    the_geom_footprint = GeometryColumn('the_geom_footprint', Geometry(dimensions=2, srid=21781))
    filename = Column('filename', Text)
    inventarnummer = Column('inventarnummer', Integer)
    bildnummer = Column('bildnummer', Integer)
    flugdatum = Column('flugdatum', Text)
    firma = Column('firma', Text)
    filmart = Column('filmart', Text)
    bgdi_flugjahr = Column('bgdi_flugjahr', Integer)
    orientierung = Column('orientierung', Boolean)
    originalsize = Column('originalsize', Text)
    x = Column('x', Integer)
    y = Column('y', Integer)
    flughoehe = Column('flughoehe', Integer)
    ort = Column('ort', Text)
    massstab = Column('massstab', Integer)
    filesize_mb = Column('filesize_mb', Text)
    contact = Column('contact', Text)
    contact_email = Column('contact_email', Text)
    contact_web = Column('contact_web', Text)
    bgdi_imagemode = Column('bgdi_imagemode', Text)

register('ch.swisstopo.lubis-luftbilder-dritte-firmen', luftbilder_dritte_firmen)


class luftbilder_dritte_kantone(Base, Vector):
    __tablename__ = 'luftbilder_dritte_kantone'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/lubis.mako'
    __bodId__ = 'ch.swisstopo.lubis-luftbilder-dritte-kantone'
    __returnedGeometry__ = 'the_geom_footprint'
    __timeInstant__ = 'bgdi_flugjahr'
    __extended_info__ = True
    # Composite labels
    __label__ = 'flugdatum'
    id = Column('ebkey', Text, primary_key=True)
    the_geom = GeometryColumn('the_geom', Geometry(dimensions=2, srid=21781))
    the_geom_footprint = GeometryColumn('the_geom_footprint', Geometry(dimensions=2, srid=21781))
    filename = Column('filename', Text)
    inventarnummer = Column('inventarnummer', Integer)
    bildnummer = Column('bildnummer', Integer)
    flugdatum = Column('flugdatum', Text)
    firma = Column('firma', Text)
    filmart = Column('filmart', Text)
    bgdi_flugjahr = Column('bgdi_flugjahr', Integer)
    orientierung = Column('orientierung', Boolean)
    originalsize = Column('originalsize', Text)
    x = Column('x', Integer)
    y = Column('y', Integer)
    flughoehe = Column('flughoehe', Integer)
    ort = Column('ort', Text)
    massstab = Column('massstab', Integer)
    filesize_mb = Column('filesize_mb', Text)
    contact = Column('contact', Text)
    contact_email = Column('contact_email', Text)
    contact_web = Column('contact_web', Text)
    bgdi_imagemode = Column('bgdi_imagemode', Text)

register('ch.swisstopo.lubis-luftbilder-dritte-kantone', luftbilder_dritte_kantone)


class bildstreifen(Base, Vector):
    __tablename__ = 'view_bildstreifen'
    __table_args__ = ({'schema': 'ads40', 'autoload': False})
    __template__ = 'templates/htmlpopup/lubis_bildstreifen.mako'
    __bodId__ = 'ch.swisstopo.lubis-bildstreifen'
    __returnedGeometry__ = 'the_geom_footprint'
    __timeInstant__ = 'bgdi_flugjahr'
    __extended_info__ = True
    # Composite labels
    __label__ = 'flugdatum'
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
    gsd = Column('gsd', Numeric)
    toposhop_length = Column('toposhop_length', Numeric)
    toposhop_start_x = Column('toposhop_start_x', Integer)
    toposhop_start_y = Column('toposhop_start_y', Integer)
    toposhop_end_x = Column('toposhop_end_x', Integer)
    toposhop_end_y = Column('toposhop_end_y', Integer)
    toposhop_date = Column('toposhop_date', Text)
register('ch.swisstopo.lubis-bildstreifen', bildstreifen)
