# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer, Boolean
from geoalchemy import GeometryColumn, Geometry

from chsdi.models import *
from chsdi.models.vector import Vector

Base = bases['lubis']


class Luftbilder(Base, Vector):
    __tablename__ = 'lubis_data_view'
    __table_args__ = ({'schema': 'swisstopo', 'autoload': False})
    __template__ = 'templates/htmlpopup/lubis.mako'
    __bodId__ = 'ch.swisstopo.lubis-luftbilder'
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

register('ch.swisstopo.lubis-luftbilder', Luftbilder)
