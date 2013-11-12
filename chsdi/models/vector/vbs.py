# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from geoalchemy import GeometryColumn, Geometry
from sqlalchemy.types import Numeric
from chsdi.models import *
from chsdi.models.vector import Vector

Base = bases['vbs']


class Kulturgueter(Base, Vector):
    __tablename__ = 'kgs'
    __table_args__ = ({'schema': 'babs', 'autoload': False})
    __template__ = 'templates/htmlpopup/kgs.mako'
    __queryable_attributes__ = ['zkob']
    __bodId__ = 'ch.babs.kulturgueter'
    id = Column('kgs_nr', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    zkob = Column('zkob', Text)
    x = Column('x', Numeric)
    y = Column('y', Numeric)
    gemeinde = Column('gemeinde', Text)
    kt_kz = Column('kt_kz', Text)

register('ch.babs.kulturgueter', Kulturgueter)


class TERRITORIALREGIONEN(Base, Vector):
    __tablename__ = 'territorialregionen'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/territorialregionen.mako'
    __bodId__ = 'ch.bfs.arealstatistik-1985'
    id = Column('terreg_nr', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    name = Column('name', Text)

register('ch.vbs.territorialregionen', TERRITORIALREGIONEN)
