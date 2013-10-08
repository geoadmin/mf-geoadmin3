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
    __queryable_attributes__ = ['nr', 'name']
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
    __queryable_attributes__ = ['nr', 'name', 'gewaesser']
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
    typ2_de = Column('typ2_de', Text)
    flussgb_de = Column('flussgb_de', Text)
    typ2_fr = Column('typ2_fr', Text)
    flussgb_fr = Column('flussgb_fr', Text)
    typ2_it = Column('typ2_it', Text)
    flussgb_it = Column('flussgb_it', Text)
    typ2_rm = Column('typ2_rm', Text)
    flussgb_rm = Column('flussgb_rm', Text)
    typ2_en = Column('typ2_en', Text)
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
    __queryable_attributes__ = ['nr', 'name']
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


class wasserrueckgabe(Base, Vector):
    # view in a schema
    __tablename__ = 'rueckgabe'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __esriId__ = 2018
    __bodId__ = 'ch.bafu.wasser-rueckgabe'
    __template__ = 'templates/htmlpopup/wasserrueckgabe.mako'
    id = Column('gid', Integer, primary_key=True)
    kanton = Column('kanton', Text)
    kantoncode = Column('kantoncode', Text)
    rwknr = Column('rwknr', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.wasser-rueckgabe', wasserrueckgabe)


class flachmoore(Base, Vector):
    # view in a schema
    __tablename__ = 'fm'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __esriId__ = 2019
    __bodId__ = 'ch.bafu.bundesinventare-flachmoore'
    __template__ = 'templates/htmlpopup/flachmoore.mako'
    id = Column('gid', Integer, primary_key=True)
    fm_name = Column('fm_name', Text)
    fm_obj = Column('fm_obj', Text)
    fm_gf = Column('fm_gf', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.bundesinventare-flachmoore', flachmoore)


class flachmooreReg(Base, Vector):
    # view in a schema
    __tablename__ = 'flachmoore_regional'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __esriId__ = 2020
    __bodId__ = 'ch.bafu.bundesinventare-flachmoore_regional'
    __template__ = 'templates/htmlpopup/flachmoore_reg.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    fmreg_name = Column('fmreg_name', Text)
    fmreg_obj = Column('fmreg_obj', Text)
    fmreg_gf = Column('fmreg_gf', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.bundesinventare-flachmoore_regional', flachmooreReg)


class paerke_nationaler_bedeutung(Base, Vector):
    # view in a schema
    __tablename__ = 'paerke_nationaler_bedeutung'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __esriId__ = 2021
    __bodId__ = 'ch.bafu.schutzgebiete-paerke_nationaler_bedeutung'
    __template__ = 'templates/htmlpopup/paerke_nationaler_bedeutung.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    park_name = Column('park_name', Text)
    park_nr = Column('park_nr', Numeric)
    park_statu = Column('park_statu', Text)
    park_fl = Column('park_fl', Numeric)
    park_gf = Column('park_gf', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.schutzgebiete-paerke_nationaler_bedeutung', paerke_nationaler_bedeutung)


class ramsar(Base, Vector):
    # view in a schema
    __tablename__ = 'ramsar'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __esriId__ = 2022
    __bodId__ = 'ch.bafu.schutzgebiete-ramsar'
    __template__ = 'templates/htmlpopup/ramsar.mako'
    id = Column('ra_id', Integer, primary_key=True)
    ra_name = Column('ra_name', Text)
    ra_obj = Column('ra_obj', Integer)
    ra_fl = Column('ra_fl', Text)
    ra_gf = Column('ra_gf', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.schutzgebiete-ramsar', ramsar)


class wildruhezonen_jagdbanngebiete(Base, Vector):
    # view in a schema
    __tablename__ = 'wildruhezonen_jagdbanngebiete'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __esriId__ = 2023
    __bodId__ = 'ch.bafu.wildruhezonen-jagdbanngebiete'
    __template__ = 'templates/htmlpopup/wildruhezonen_jagdbanngebiete.mako'
    id = Column('wrz_jb_obj', Text, primary_key=True)
    wrz_obj = Column('wrz_obj', Integer)
    wrz_name = Column('wrz_name', Text)
    jb_obj = Column('jb_obj', Integer)
    jb_name = Column('jb_name', Text)
    wrz_status = Column('wrz_status', Text)
    bestimmung = Column('bestimmung', Text)
    zeitraum = Column('zeitraum', Text)
    grundlage = Column('grundlage', Text)
    zusatzinfo = Column('zusatzinfo', Text)
    bearbeitungsjahr = Column('bearbeitungsjahr', Text)
    kanton = Column('kanton', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.wildruhezonen-jagdbanngebiete', wildruhezonen_jagdbanngebiete)


class wege_wildruhezonen_jagdbanngebiete(Base, Vector):
    # view in a schema
    __tablename__ = 'wege_wildruhezonen_jagdbanngebiete'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __esriId__ = 2024
    __bodId__ = 'ch.bafu.wege-wildruhezonen-jagdbanngebiete'
    __template__ = 'templates/htmlpopup/wege_wildruhezonen_jagdbanngebiete.mako'
    id = Column('weg_id', Integer, primary_key=True)
    jb_obj = Column('jb_obj', Integer)
    wrz_obj = Column('wrz_obj', Integer)
    length_km = Column('length_km', Numeric)
    weg_wrz_jb_version = Column('weg_wrz_jb_version', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.wege-wildruhezonen-jagdbanngebiete', wege_wildruhezonen_jagdbanngebiete)


class steinbockkolonien(Base, Vector):
    # view in a schema
    __tablename__ = 'sb'
    __table_args__ = ({'schema': 'fauna', 'autoload': False})
    __esriId__ = 2025
    __bodId__ = 'ch.bafu.fauna-steinbockkolonien'
    __template__ = 'templates/htmlpopup/steinbockkolonien.mako'
    id = Column('gid', Integer, primary_key=True)
    sb_name = Column('sb_name', Text)
    sb_obj = Column('sb_obj', Integer)
    sb_kt = Column('sb_kt', Text)
    sb_fl = Column('sb_fl', Numeric)
    sb_gf = Column('sb_gf', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.fauna-steinbockkolonien', steinbockkolonien)


class SWISSPRTR(Base, Vector):
    # view in a schema
    __tablename__ = 'swissprtr'
    __table_args__ = ({'schema': 'prtr', 'autoload': False})
    __esriId__ = 2026
    __bodId__ = 'ch.bafu.swissprtr'
    __template__ = 'templates/htmlpopup/swissprtr.mako'
    id = Column('prtrnr', Numeric, primary_key=True)
    betrieb = Column('betrieb', Text)
    ort = Column('ort', Text)
    jahr = Column('jahr', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.swissprtr', SWISSPRTR)


class HOLZVORRAT(Base, Vector):
    # view in a schema
    __tablename__ = 'holzvorrat'
    __table_args__ = ({'schema': 'wald', 'autoload': False})
    __esriId__ = 2027
    __bodId__ = 'ch.bafu.holzvorrat'
    __template__ = 'templates/htmlpopup/holzvorrat.mako'
    id = Column('gid', Integer, primary_key=True)
    fid = Column('id', Integer)
    vorrat = Column('vorrat', Numeric)
    wireg_ = Column('wireg_', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.holzvorrat', HOLZVORRAT)


class HOLZZUWACHS(Base, Vector):
    # view in a schema
    __tablename__ = 'holzzuwachs'
    __table_args__ = ({'schema': 'wald', 'autoload': False})
    __esriId__ = 2028
    __bodId__ = 'ch.bafu.holzzuwachs'
    __template__ = 'templates/htmlpopup/holzzuwachs.mako'
    id = Column('gid', Integer, primary_key=True)
    wirtschaftsregion = Column('wirtschaftsregion', Text)
    holzzuwachs = Column('holzzuwachs', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.holzzuwachs', HOLZZUWACHS)


class HOLZNUTZUNG(Base, Vector):
    # view in a schema
    __tablename__ = 'holznutzung'
    __table_args__ = ({'schema': 'wald', 'autoload': False})
    __esriId__ = 2029
    __bodId__ = 'ch.bafu.holznutzung'
    __template__ = 'templates/htmlpopup/holznutzung.mako'
    id = Column('gid', Integer, primary_key=True)
    wireg_ = Column('wireg_', Text)
    nutzung = Column('nutzung', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.holznutzung', HOLZNUTZUNG)


class NABEL(Base, Vector):
    # view in a schema
    __tablename__ = 'nabel'
    __table_args__ = ({'schema': 'luft', 'autoload': False})
    __esriId__ = 2030
    __bodId__ = 'ch.bafu.nabelstationen'
    __template__ = 'templates/htmlpopup/nabel.mako'
    id = Column('id_stat', Text, primary_key=True)
    name = Column('name', Text)
    typ_de = Column('typ_de', Text)
    typ_fr = Column('typ_fr', Text)
    desc_de = Column('desc_de', Text)
    desc_fr = Column('desc_fr', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.nabelstationen', NABEL)


class krebspest(Base, Vector):
    # view in a schema
    __tablename__ = 'krebspest'
    __table_args__ = ({'schema': 'fischerei', 'autoload': False})
    __esriId__ = 2031
    __bodId__ = 'ch.bafu.fischerei-krebspest'
    __template__ = 'templates/htmlpopup/krebspest.mako'
    id = Column('_count', Integer, primary_key=True)
    kennummer = Column('kennummer', Text)
    gewaesser = Column('gewaesser', Text)
    art_lat = Column('art_lat', Text)
    jahr = Column('jahr', Text)
    ort = Column('ort', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.fischerei-krebspest', krebspest)


class biogeoreg(Base, Vector):
    # view in a schema
    __tablename__ = 'biogeoreg'
    __table_args__ = ({'schema': 'diverse', 'autoload': False})
    __esriId__ = 2032
    __bodId__ = 'ch.bafu.biogeographische_regionen'
    __template__ = 'templates/htmlpopup/biogeoreg.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    biogreg_r6 = Column('biogreg_r6', Text)
    biogreg_ve = Column('biogreg_ve', Text)
    biogreg_r1 = Column('biogreg_r1', Text)
    biogreg_c6 = Column('biogreg_c6', Integer)
    biogreg_c1 = Column('biogreg_c1', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.biogeographische_regionen', biogeoreg)


class smaragd(Base, Vector):
    # view in a schema
    __tablename__ = 'smaragd'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __esriId__ = 2033
    __bodId__ = 'ch.bafu.schutzgebiete-smaragd'
    __template__ = 'templates/htmlpopup/smaragd.mako'
    id = Column('id', Integer, primary_key=True)
    em_name = Column('em_name', Text)
    em_obj = Column('em_obj', Numeric)
    em_gf = Column('em_gf', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.schutzgebiete-smaragd', smaragd)


class biosphaerenreservate(Base, Vector):
    # view in a schema
    __tablename__ = 'biores'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __esriId__ = 2034
    __bodId__ = 'ch.bafu.schutzgebiete-biosphaerenreservate'
    __template__ = 'templates/htmlpopup/biosphaerenreservate.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    biores_ver = Column('biores_ver', Text)
    biores_fl = Column('biores_fl', Text)
    biores_gf = Column('biores_gf', Text)
    biores_nam = Column('biores_nam', Text)
    biores_obj = Column('biores_obj', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.schutzgebiete-biosphaerenreservate', biosphaerenreservate)


class moose(Base, Vector):
    # view in a schema
    __tablename__ = 'mooseflora'
    __table_args__ = ({'schema': 'flora', 'autoload': False})
    __esriId__ = 2035
    __bodId__ = 'ch.bafu.moose'
    __template__ = 'templates/htmlpopup/moose.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    populationsnr = Column('populationsnr', Numeric)
    jahr = Column('jahr', Integer)
    standort = Column('standort', Text)
    rl_text = Column('rl_text', Text)
    nhv_text = Column('nhv_text', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.moose', moose)


class weltensutter(Base, Vector):
    # view in a schema
    __tablename__ = 'ws'
    __table_args__ = ({'schema': 'flora', 'autoload': False})
    __esriId__ = 2036
    __bodId__ = 'ch.bafu.flora-weltensutter_atlas'
    __template__ = 'templates/htmlpopup/weltensutter.mako'
    id = Column('gid', Integer, primary_key=True)
    nom = Column('nom', Text)
    no_surface = Column('no_surface', Numeric)
    ty_surface = Column('ty_surface', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.flora-weltensutter_atlas', weltensutter)
