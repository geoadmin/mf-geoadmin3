# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from geoalchemy import GeometryColumn, Geometry
from sqlalchemy.types import Numeric
from chsdi.models import  *
from chsdi.models.vector import Vector

Base = bases['edi']

class Arealstatistik1985(Base, Vector):
    # view in a schema
    __tablename__ = 'arealstatistik_1985'
    __table_args__ = ({'schema': 'bfs', 'autoload': False})
    __template__ = 'templates/htmlpopup/arealstatistik1985.mako'
    __esriId__ = 3001
    __bodId__ = 'ch.bfs.arealstatistik-1985'
    __displayFieldName__ = 'gmde'
    #__queryable_attributes__ = ['gmde']
    # __minscale__ = 5001
    __maxscale__ = 25000
    id = Column('reli', Integer, primary_key=True)
    #id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    gmde = Column('gmde', Integer) 
    fj85 = Column('fj85', Integer) 
    id_arealstatistik = Column('id_arealstatistik', Integer) 
    fj97 = Column('fj97', Integer) 
    id_arealstatistik_97 = Column('id_arealstatistik_97', Integer) 

register('ch.bfs.arealstatistik-1985', Arealstatistik1985)
