# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from sqlalchemy.types import Numeric
from geoalchemy import GeometryColumn, Geometry

from chsdi.models import *
from chsdi.models.vector import Vector


Base = bases['bafu']

class AM_G(Base, Vector):
    # view in a schema
    __tablename__ = 'am_g'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __esriId__ = 2000
    __bodId__ = 'ch.bafu.bundesinventare-amphibien_wanderobjekte'
    __template__ = 'templates/htmlpopup/bundinv_amphibien_w.mako'
    id = Column('am_g_obj', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    am_g_name = Column('am_g_name', Text)
    the_geom = Column(Geometry)

register('ch.bafu.bundesinventare-amphibien_wanderobjekte', AM_G)

class AM_L(Base, Vector):
    # view in a schema
    __tablename__ = 'am_l'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __esriId__ = 2001
    __bodId__ = 'ch.bafu.bundesinventare-amphibien'
    __template__ = 'templates/htmlpopup/bundinv_amphibien.mako'
    id = Column('am_l_obj', Text, primary_key=True)
    am_l_name = Column('am_l_name', Text)
    am_l_fl = Column('am_l_fl', Text)
    am_l_berei = Column('am_l_berei', Text)
    am_l_gf = Column('am_l_gf', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.bafu.bundesinventare-amphibien', AM_L)

class LHG(Base, Vector):
    # view in a schema
    __tablename__ = 'lhg'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __esriId__ = 2003
    __bodId__ = 'ch.bafu.hydrologie-hydromessstationen'
    __template__ = 'templates/htmlpopup/hydromessstationen.mako'
    id = Column('edv_nr4', Text, primary_key=True)
    lhg_name = Column('lhg_name', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.bafu.hydrologie-hydromessstationen', LHG)


class Temperaturmessnetz(Base, Vector):
    # view in a schema
    __tablename__ = 'temperaturmessnetz'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __esriId__ = 2004
    __bodId__ = 'ch.bafu.hydrologie-wassertemperaturmessstationen'
    __template__ = 'templates/htmlpopup/temperaturmessnetz.mako'
    __queryable_attributes__ = ['nr','name']
    id = Column('nr', Integer, primary_key=True)
    url = Column('url', Text)
    name = Column('name', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.bafu.hydrologie-wassertemperaturmessstationen', Temperaturmessnetz)


class Gewaesserzustandst (Base, Vector):
    # view in a schema
    __tablename__ = 'dbgz'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __esriId__ = 2006
    __bodId__ = 'ch.bafu.hydrologie-gewaesserzustandsmessstationen'
    __template__ = 'templates/htmlpopup/gewaesserzustandsmessstationen.mako'
    __queryable_attributes__ = ['nr','name','gewaesser']
    id = Column('bgdi_id', Integer, primary_key=True)
    name = Column('name', Text)
    nr = Column('nr', Numeric)
    gewaesser = Column('gewaesser', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.bafu.hydrologie-gewaesserzustandsmessstationen', Gewaesserzustandst)


class Teileinzugsgebiete2 (Base, Vector):
    # view in a schema
    __tablename__ = 'ebene_2km'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __esriId__ = 2005
    __bodId__ = 'ch.bafu.wasser-teileinzugsgebiete_2'
    __template__ = 'templates/htmlpopup/teileinzugsgebiete2.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    teilezgnr = Column('teilezgnr', Integer)
    gwlnr = Column('gwlnr', Text)
    measure = Column('measure', Integer)
    teilezgfla = Column('teilezgfla', Text)
    ezgflaeche = Column('ezgflaeche', Text)
    typ2_de = Column ('typ2_de', Text)
    flussgb_de = Column('flussgb_de', Text)
    typ2_fr = Column ('typ2_fr', Text)
    flussgb_fr = Column('flussgb_fr', Text)
    typ2_it = Column ('typ2_it', Text)
    flussgb_it = Column('flussgb_it', Text)
    typ2_rm = Column ('typ2_rm', Text)
    flussgb_rm = Column('flussgb_rm', Text)
    typ2_en = Column ('typ2_en', Text)
    flussgb_en = Column('flussgb_en', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.bafu.wasser-teileinzugsgebiete_2', Teileinzugsgebiete2)



class BLN(Base, Vector):
    # view in a schema
    __tablename__ = 'bln'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __esriId__ = 1000
    __bodId__ = 'ch.bafu.bundesinventare-bln'
    #__queryable_attributes__ = ['bln_name']
    __template__ = 'templates/htmlpopup/bln.mako'
    id = Column('gid', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    bln_name = Column('bln_name', Text)
    bln_obj = Column('bln_obj', Integer)
    bln_fl = Column('bln_fl', Numeric)

register('ch.bafu.bundesinventare-bln', BLN)


class JB(Base, Vector):
    # view in a schema
    __tablename__ = 'jb'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __esriId__ = 2000
    __bodId__ = 'ch.bafu.bundesinventare-jagdbanngebiete'
    #__queryable_attributes__ = ['jb_name']
    __template__ = 'templates/htmlpopup/jb.mako'
    id = Column('gid', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    jb_name = Column('jb_name', Text)
    jb_obj = Column('jb_obj', Integer)
    jb_kat = Column('jb_kat', Text)
    jb_fl = Column('jb_fl', Numeric)
    jb_gf = Column('jb_gf', Numeric)

register('ch.bafu.bundesinventare-jagdbanngebiete', JB)
