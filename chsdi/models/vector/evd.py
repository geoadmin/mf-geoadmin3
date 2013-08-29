# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from geoalchemy import GeometryColumn, Geometry
from sqlalchemy.types import Numeric
from chsdi.models import  *
from chsdi.models.vector import Vector

Base = bases['evd']

class BODENEIGNUNG(Base, Vector):
    # view in a schema
    __tablename__ = 'bodeneignung'
    __table_args__ = ({'schema': 'blw', 'autoload': False})
    __template__ = 'templates/htmlpopup/bodeneignung-kulurtyp.mako'
    __esriId__ = 3000
    __bodId__ = 'ch.blw.bodeneignung-kulturtyp'
    __displayFieldName__ = 'farbe'
    __queryable_attributes__ = ['farbe']
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    farbe = Column('farbe', Integer)
    symb_color = Column('symb_color', Text)

register('ch.blw.bodeneignung-kulturtyp', BODENEIGNUNG)
