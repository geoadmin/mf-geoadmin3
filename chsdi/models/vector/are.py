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
    __bodId__ = 'ch.are.landschaftstypen'
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
    __bodId__ = 'ch.are.alpenkonvention'
    id = Column('row_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))
    flaeche_ha = Column('flaeche_ha', Numeric)
    stand = Column('stand', Numeric)

register('ch.are.alpenkonvention', Alpenkonvention)


class AggloIsoStaedteWithDate(Base, Vector):
    __tablename__ = 'agglomerationen_isolierte_staedte_2000'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'templates/htmlpopup/aggloisostaedte.mako'
    __bodId__ = 'ch.are.agglomerationen_isolierte_staedte-2000'
    id = Column('row_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))
    name = Column('name', Text)
    klasse_de = Column('klasse_de', Text)
    klasse_fr = Column('klasse_fr', Text)
    flaeche_ha = Column('flaeche_ha', Numeric)

register('ch.are.agglomerationen_isolierte_staedte-2000', AggloIsoStaedteWithDate)


class AggloIsoStaedte(Base, Vector):
    __tablename__ = 'agglomerationen_isolierte_staedte'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'templates/htmlpopup/aggloisostaedte.mako'
    __bodId__ = 'ch.are.agglomerationen_isolierte_staedte'
    id = Column('row_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))
    name = Column('name', Text)
    klasse_de = Column('klasse_de', Text)
    klasse_fr = Column('klasse_fr', Text)
    flaeche_ha = Column('flaeche_ha', Numeric)

register('ch.are.agglomerationen_isolierte_staedte', AggloIsoStaedte)


class GueteklasseOev(Base, Vector):
    __tablename__ = 'gueteklassen'
    __table_args__ = ({'schema': 'oeffentlicher_verkehr', 'autoload': False})
    __template__ = 'templates/htmlpopup/gueteklasseoev.mako'
    __bodId__ = 'ch.are.gueteklassen_oev'
    id = Column('id', Integer, primary_key=True)
    klasse_de = Column('klasse_de', Text)
    klasse_fr = Column('klasse_fr', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.are.gueteklassen_oev', GueteklasseOev)


class BevoelkerungsdichteWithDate(Base, Vector):
    __tablename__ = 'bevoelkerungsdichte_vz00'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'templates/htmlpopup/bevoelkerungsdichte.mako'
    __bodId__ = 'ch.are.bevoelkerungsdichte-vz00'
    id = Column('row_id', Integer, primary_key=True)
    popt_ha = Column('popt_ha', Numeric)
    stand = Column('stand', Numeric)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.are.bevoelkerungsdichte-vz00', BevoelkerungsdichteWithDate)


class Bevoelkerungsdichte(Base, Vector):
    __tablename__ = 'bevoelkerungsdichte'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'templates/htmlpopup/bevoelkerungsdichte.mako'
    __bodId__ = 'ch.are.bevoelkerungsdichte'
    id = Column('row_id', Integer, primary_key=True)
    popt_ha = Column('popt_ha', Numeric)
    stand = Column('stand', Numeric)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.are.bevoelkerungsdichte', Bevoelkerungsdichte)


class BeschaeftigtendichteWithDate(Base, Vector):
    __tablename__ = 'beschaeftigtendichte_bz08'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'templates/htmlpopup/beschaeftigtendichte.mako'
    __bodId__ = 'ch.are.beschaeftigtendichte-bz08'
    id = Column('row_id', Integer, primary_key=True)
    empt_ha = Column('empt_ha', Numeric)
    stand = Column('stand', Numeric)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.are.beschaeftigtendichte-bz08', BeschaeftigtendichteWithDate)


class Beschaeftigtendichte(Base, Vector):
    __tablename__ = 'beschaeftigtendichte'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'templates/htmlpopup/beschaeftigtendichte.mako'
    __bodId__ = 'ch.are.beschaeftigtendichte'
    id = Column('row_id', Integer, primary_key=True)
    empt_ha = Column('empt_ha', Numeric)
    stand = Column('stand', Numeric)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.are.beschaeftigtendichte', Beschaeftigtendichte)


class Bauzonen(Base, Vector):
    __tablename__ = 'bauzonen_2007'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'templates/htmlpopup/bauzonen.mako'
    __bodId__ = 'ch.are.bauzonen-2007'
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
    __bodId__ = 'ch.are.bauzonen'
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
    __bodId__ = 'ch.are.gemeindetyp-1990-9klassen'
    id = Column('gde_no', Integer, primary_key=True)
    name = Column('name', Text)
    nom = Column('nom', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.are.gemeindetyp-1990-9klassen', Gemeindetyp)


class Gemeindetypen_2012(Base, Vector):
    __tablename__ = 'gemeindetypologie_2012'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': False})
    __template__ = 'templates/htmlpopup/gemeindetypen_2012.mako'
    __bodId__ = 'ch.are.gemeindetypen'
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
