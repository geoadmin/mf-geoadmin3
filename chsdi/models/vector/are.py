# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from sqlalchemy.types import Numeric
from geoalchemy import GeometryColumn, Geometry

from chsdi.models import *
from chsdi.models.vector import Vector


Base = bases['are']


class Landschaftstypen(Base, Vector):
    __tablename__ = 'landschaftstypen'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'templates/htmlpopup/landschaftstypen.mako'
    __esriId__ = 3000
    __bodId__ = 'ch.are.landschaftstypen'
    __displayFieldName__ = 'typ_nr'
    id = Column('object', Text, primary_key=True)
    typ_nr = Column('typ_nr', Integer)
    typname_de = Column('typname_de', Text)
    typname_fr = Column('typname_fr', Text)
    regname_de = Column('regname_de', Text)
    regname_fr = Column('regname_fr', Text)
    object_are = Column('object_are', Numeric)
    typ_area = Column('typ_area', Numeric)
    stand = Column('stand', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.are.landschaftstypen', Landschaftstypen)


class Alpenkonvention(Base, Vector):
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
    flaeche_ha = Column('flaeche_ha', Numeric)

register('ch.are.agglomerationen_isolierte_staedte-2000', AggloIsoStaedte)


class GueteklasseOev(Base, Vector):
    __tablename__ = 'gueteklassen'
    __table_args__ = ({'schema': 'oeffentlicher_verkehr', 'autoload': False})
    __template__ = 'templates/htmlpopup/gueteklasseoev.mako'
    __esriId__ = 3003
    __bodId__ = 'ch.are.gueteklassen_oev'
    __displayFieldName__ = 'klasse_de'
    id = Column('id', Integer, primary_key=True)
    klasse_de = Column('klasse_de', Text)
    klasse_fr = Column('klasse_fr', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.are.gueteklassen_oev', GueteklasseOev)


class Bevoelkerungsdichte(Base, Vector):
    __tablename__ = 'bevoelkerungsdichte_vz00'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'templates/htmlpopup/bevoelkerungsdichte.mako'
    __esriId__ = 3004
    __bodId__ = 'ch.are.bevoelkerungsdichte-vz00'
    __displayFieldName__ = 'popt_ha'
    id = Column('row_id', Integer, primary_key=True)
    popt_ha = Column('popt_ha', Numeric)
    stand = Column('stand', Numeric)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.are.bevoelkerungsdichte-vz00', Bevoelkerungsdichte)


class Beschaeftigtendichte(Base, Vector):
    __tablename__ = 'beschaeftigtendichte_bz08'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'templates/htmlpopup/beschaeftigtendichte.mako'
    __esriId__ = 3005
    __bodId__ = 'ch.are.beschaeftigtendichte-bz9'
    __displayFieldName__ = 'empt_ha'
    id = Column('row_id', Integer, primary_key=True)
    empt_ha = Column('empt_ha', Numeric)
    stand = Column('stand', Numeric)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.are.beschaeftigtendichte-bz9', Beschaeftigtendichte)


class Bauzonen(Base, Vector):
    __tablename__ = 'bauzonen_2007'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'templates/htmlpopup/bauzonen.mako'
    __esriId__ = 3006
    __bodId__ = 'ch.are.bauzonen-2007'
    __displayFieldName__ = 'name'
    id = Column('row_id', Integer, primary_key=True)
    name = Column('name', Text)
    nutz_de = Column('nutz_de', Text)
    nutz_fr = Column('nutz_fr', Text)
    kt_kz = Column('kt_kz', Text)
    flaeche_qm = Column('flaeche_qm', Numeric)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.are.bauzonen-2007', Bauzonen)


class Bauzonen_2012(Base, Vector):
    __tablename__ = 'bauzonen_2012'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'templates/htmlpopup/bauzonen_2012.mako'
    __esriId__ = 3007
    __bodId__ = 'ch.are.bauzonen'
    __displayFieldName__ = 'name_'
    id = Column('bgdi_id', Integer, primary_key=True)
    name_ = Column('name_', Text)
    ch_code_hn = Column('ch_code_hn', Text)
    kt_kz = Column('kt_kz', Text)
    bfs_no = Column('bfs_no', Text)
    kt_no = Column('kt_no', Text)
    flaeche = Column('flaeche', Numeric)
    ch_bez_f = Column('ch_bez_f', Text)
    ch_bez_d = Column('ch_bez_d', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.are.bauzonen', Bauzonen_2012)


class Gemeindetyp(Base, Vector):
    __tablename__ = 'gemeindetyp_1990_9klassen'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'templates/htmlpopup/gemeindetyp.mako'
    __esriId__ = 3009
    __bodId__ = 'ch.are.gemeindetyp-1990-9klassen'
    __displayFieldName__ = 'name'
    id = Column('gde_no', Integer, primary_key=True)
    name = Column('name', Text)
    nom = Column('nom', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.are.gemeindetyp-1990-9klassen', Gemeindetyp)


class Gemeindetypen_2012(Base, Vector):
    __tablename__ = 'gemeindetypologie_2012'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'templates/htmlpopup/gemeindetypen_2012.mako'
    __esriId__ = 3010
    __bodId__ = 'ch.are.gemeindetypen'
    __displayFieldName__ = 'name_'
    id = Column('bgdi_id', Integer, primary_key=True)
    name_ = Column('name_', Text)
    typ_code = Column('typ_code', Text)
    typ_bez_d = Column('typ_bez_d', Text)
    typ_bez_f = Column('typ_bez_f', Text)
    bfs_no = Column('bfs_no', Text)
    kt_no = Column('kt_no', Text)
    kt_kz = Column('kt_kz', Text)
    flaeche_ha = Column('flaeche_ha', Numeric)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.are.gemeindetypen', Gemeindetypen_2012)
