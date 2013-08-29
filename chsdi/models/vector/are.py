# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from sqlalchemy.types import Numeric
from geoalchemy import GeometryColumn, Geometry

from chsdi.models import  *
from chsdi.models.vector import Vector


Base = bases['are']

class Landschaftstypen(Base, Queryable):
    # view in a schema
    __tablename__ = 'landschaftstypen'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'tooltips/htmlpopup/landschaftstypen.mako'
    __bodId__ = 'ch.are.landschaftstypen'
    typ_nr = Column('typ_nr', Numeric)
    id = Column('object', Text, primary_key=True)
    typname_de = Column('typname_de', Text)
    typname_fr = Column('typname_fr', Text)
    regname_de = Column('regname_de', Text)
    regname_fr = Column('regname_fr', Text)
    object_are = Column ('object_are', Numeric)
    typ_area = Column ('typ_area', Numeric)
    stand = Column ('stand', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.are.landschaftstypen', Landschaftstypen)
