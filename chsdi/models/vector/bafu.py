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


class Teileinzugsgebiete40 (Base, Vector):
    # view in a schema
    __tablename__ = 'ebene_40km'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __esriId__ = 2007
    __bodId__ = 'ch.bafu.wasser-teileinzugsgebiete_40'
    __template__ = 'templates/htmlpopup/teileinzugsgebiete40.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    tezgnr40 = Column('tezgnr40', Integer)
    teilezgfla = Column('teilezgfla', Numeric)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.bafu.wasser-teileinzugsgebiete_40', Teileinzugsgebiete40)


class Gebietsauslaesse (Base, Vector):
    # view in a schema
    __tablename__ = 'outlets'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __esriId__ = 2008
    __bodId__ = 'ch.bafu.wasser-gebietsauslaesse'
    __template__ = 'templates/htmlpopup/gebietsauslaesse.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    ezgnr = Column('ezgnr', Integer)
    gwlnr = Column('gwlnr', Text)
    measure = Column('measure', Integer)
    gesamtflae = Column('gesamtflae', Text)
    gewaessern = Column('gewaessern', Text)
    anteil_ch = Column('anteil_ch', Text)
    kanal_de = Column('kanal_de', Text)
    kanal_fr = Column('kanal_fr', Text)
    kanal_it = Column('kanal_it', Text)
    kanal_rm = Column('kanal_rm', Text)
    kanal_en = Column('kanal_en', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.bafu.wasser-gebietsauslaesse', Gebietsauslaesse)


class AU(Base, Vector):
    # view in a schema
    __tablename__ = 'au'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __esriId__ = 2009
    __bodId__ = 'ch.bafu.bundesinventare-auen'
    __template__ = 'templates/htmlpopup/auen.mako'
    __queryable_attributes__ = ['nr','name']
    id = Column('gid', Integer, primary_key=True)
    au_obj = Column('au_obj', Integer)
    au_objtyp = Column('au_objtyp', Text)
    au_fl = Column('au_fl', Numeric)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.bafu.bundesinventare-auen', AU)


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


class HM(Base, Vector):
    # view in a schema
    __tablename__ = 'hm'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __esriId__ = 2010
    __bodId__ = 'ch.bafu.bundesinventare-hochmoore'
    __template__ = 'templates/htmlpopup/hochmoore.mako'
    id = Column('gid', Integer, primary_key=True)
    hm_name = Column('hm_name', Text)
    hm_obj = Column('hm_obj', Integer)
    hm_typ = Column('hm_typ', Integer)
    hm_fl = Column('hm_fl', Numeric)
    hm_ke = Column('hm_ke', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.bundesinventare-hochmoore', HM)


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


class ML(Base, Vector):
    # view in a schema
    __tablename__ = 'ml'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __esriId__ = 2011
    __bodId__ = 'ch.bafu.bundesinventare-moorlandschaften'
    __template__ = 'templates/htmlpopup/moorlandschaften.mako'
    id = Column('gid', Integer, primary_key=True)
    ml_name = Column('ml_name', Text)
    ml_obj = Column('ml_obj', Integer)
    ml_fl = Column('ml_fl', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.bundesinventare-moorlandschaften', ML)


class WV(Base, Vector):
    # view in a schema
    __tablename__ = 'wv'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __esriId__ = 2012
    __bodId__ = 'ch.bafu.bundesinventare-vogelreservate'
    __template__ = 'templates/htmlpopup/vogelreservate.mako'
    id = Column('gid', Integer, primary_key=True)
    wv_name = Column('wv_name', Text)
    wv_obj = Column('wv_obj', Integer)
    wv_kat = Column('wv_kat', Text)
    wv_fl = Column('wv_fl', Numeric)
    wv_gf = Column('wv_gf', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.bundesinventare-vogelreservate', WV)


class wasserentnahmeWkB(Base, Vector):
    # view in a schema
    __tablename__ = 'invent_ent_wknutz_bedeutend'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __esriId__ = 2013
    __bodId__ = 'ch.bafu.wasser-entnahme'
    __template__ = 'templates/htmlpopup/wasserentnahme_wk_b.mako'
    id = Column('gid', Text, primary_key=True)
    rwknr = Column('rwknr', Text)
    kanton = Column('kanton', Text)
    kantoncode = Column('kantoncode', Text)
    ent_gew = Column('ent_gew', Text)
    link = Column('link', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.wasser-entnahme', wasserentnahmeWkB)


class wasserentnahmeWkW(Base, Vector):
    # view in a schema
    __tablename__ = 'invent_ent_wknutz_weitere'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __esriId__ = 2014
    __bodId__ = 'ch.bafu.wasser-entnahme'
    __template__ = 'templates/htmlpopup/wasserentnahme_wk_w.mako'
    id = Column('gid', Text, primary_key=True)
    rwknr = Column('rwknr', Text)
    kanton = Column('kanton', Text)
    kantoncode = Column('kantoncode', Text)
    ent_gew = Column('ent_gew', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.wasser-entnahme', wasserentnahmeWkW)


class wasserentnahmeAnB(Base, Vector):
    # view in a schema
    __tablename__ = 'invent_ent_andere_bedeutend'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __esriId__ = 2015
    __bodId__ = 'ch.bafu.wasser-entnahme'
    __template__ = 'templates/htmlpopup/wasserentnahme_an_b.mako'
    id = Column('gid', Text, primary_key=True)
    rwknr = Column('rwknr', Text)
    kanton = Column('kanton', Text)
    kantoncode = Column('kantoncode', Text)
    ent_gew = Column('ent_gew', Text)
    link = Column('link', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.wasser-entnahme', wasserentnahmeAnB)


class wasserentnahmeAnW(Base, Vector):
    # view in a schema
    __tablename__ = 'invent_ent_andere_weitere'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __esriId__ = 2016
    __bodId__ = 'ch.bafu.wasser-entnahme'
    __template__ = 'templates/htmlpopup/wasserentnahme_an_w.mako'
    id = Column('gid', Text, primary_key=True)
    rwknr = Column('rwknr', Text)
    kanton = Column('kanton', Text)
    kantoncode = Column('kantoncode', Text)
    ent_gew = Column('ent_gew', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.wasser-entnahme', wasserentnahmeAnW)


class wasserleitungen(Base, Vector):
    # view in a schema
    __tablename__ = 'leitungen'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __esriId__ = 2017
    __bodId__ = 'ch.bafu.wasser-leitungen'
    __template__ = 'templates/htmlpopup/wasserleitungen.mako'
    id = Column('gid', Integer, primary_key=True)
    kanton = Column('kanton', Text)
    kantoncode = Column('kantoncode', Text)
    rwknr = Column('rwknr', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.wasser-leitungen', wasserleitungen)

