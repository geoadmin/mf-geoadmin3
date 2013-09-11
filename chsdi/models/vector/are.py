# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from sqlalchemy.types import Numeric
from geoalchemy import GeometryColumn, Geometry

from chsdi.models import  *
from chsdi.models.vector import Vector


Base = bases['are']

class Landschaftstypen(Base, Vector):
    # view in a schema
    __tablename__ = 'landschaftstypen'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'templates/htmlpopup/landschaftstypen.mako'
    __esriId__ = 3000
    __bodId__ = 'ch.are.landschaftstypen'
    __displayFieldName__ = 'typ_nr'
    id = Column('object', Text, primary_key=True)
    typ_nr = Column('typ_nr', Numeric)
    typname_de = Column('typname_de', Text)
    typname_fr = Column('typname_fr', Text)
    regname_de = Column('regname_de', Text)
    regname_fr = Column('regname_fr', Text)
    object_are = Column ('object_are', Numeric)
    typ_area = Column ('typ_area', Numeric)
    stand = Column ('stand', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.are.landschaftstypen', Landschaftstypen)

class Alpenkonvention(Base, Vector):
    # view in a schema
    __tablename__ = 'alpenkonvention'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'templates/htmlpopup/alpenkonvention.mako'
    __esriId__ = 3001
    __bodId__ = 'ch.are.alpenkonvention'
    __displayFieldName__ = 'stand'
    id = Column('row_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))
    flaeche_ha = Column('flaeche_ha', Numeric)
    stand = Column('stand', Numeric)

register('ch.are.alpenkonvention', Alpenkonvention)

class AggloIsoStaedte(Base, Vector):
    # view in a schema
    __tablename__ = 'agglomerationen_isolierte_staedte_2000'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'templates/htmlpopup/aggloisostaedte.mako'
    __esriId__ = 3002
    __bodId__ = 'ch.are.agglomerationen_isolierte_staedte-2000'
    __displayFieldName__ = 'name'
    id = Column('row_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))
    name = Column('name', Text)
    klasse_de = Column('klasse_de', Text)
    klasse_fr = Column('klasse_fr', Text)
    flaeche_ha= Column('flaeche_ha', Numeric)

register('ch.are.agglomerationen_isolierte_staedte-2000', AggloIsoStaedte)

