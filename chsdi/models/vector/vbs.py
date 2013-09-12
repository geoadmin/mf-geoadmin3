# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from geoalchemy import GeometryColumn, Geometry
from sqlalchemy.types import Numeric
from chsdi.models import  *
from chsdi.models.vector import Vector

Base = bases['vbs']

#class Kulturgueter(Base, Vector):
#    # view in a schema
#    __tablename__ = 'kgs'
#    __table_args__ = ({'schema': 'babs', 'autoload': True})
#    __template__ = 'templates/htmlpopup/kgs.mako'
#    __esriId__ = 3002
#    __bodId__ = 'ch.bfs.arealstatistik-1985'
#    __displayFieldName__ = 'gmde'
#    __queryable_attributes__ = ['zkob']
#    __extended_info__ = True
#    # __minscale__ = 5001
#    # __maxscale__ = 25000
#
#    id = Column('kgs_nr', Integer, primary_key=True)
#    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
#
#register('ch.babs.kulturgueter', Kulturgueter)

class TERRITORIALREGIONEN(Base, Vector):
    # view in a schema
    __tablename__ = 'territorialregionen'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/territorialregionen.mako'
    __esriId__ = 3003
    __bodId__ = 'ch.bfs.arealstatistik-1985'
    __displayFieldName__ = 'name'
    id = Column('terreg_nr', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    name = Column('name', Text)

register('ch.vbs.territorialregionen', TERRITORIALREGIONEN)
