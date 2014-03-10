# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from sqlalchemy.types import Numeric
from geoalchemy import GeometryColumn, Geometry

from chsdi.models import *
from chsdi.models.vector import Vector


Base = bases['bafu']


class AM_G(Base, Vector):
    __tablename__ = 'am_g'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-amphibien_wanderobjekte'
    __template__ = 'templates/htmlpopup/bundinv_amphibien_w.mako'
    id = Column('am_g_obj', Integer, primary_key=True)
    am_g_name = Column('am_g_name', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.bundesinventare-amphibien_wanderobjekte', AM_G)


class AM_L(Base, Vector):
    __tablename__ = 'am_l'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
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
    __tablename__ = 'lhg'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.hydrologie-hydromessstationen'
    __template__ = 'templates/htmlpopup/hydromessstationen.mako'
    id = Column('edv_nr4', Text, primary_key=True)
    lhg_name = Column('lhg_name', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.bafu.hydrologie-hydromessstationen', LHG)


class Temperaturmessnetz(Base, Vector):
    __tablename__ = 'temperaturmessnetz'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.hydrologie-wassertemperaturmessstationen'
    __template__ = 'templates/htmlpopup/temperaturmessnetz.mako'
    #__queryable_attributes__ = ['nr', 'name']
    id = Column('nr', Integer, primary_key=True)
    url = Column('url', Text)
    name = Column('name', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.bafu.hydrologie-wassertemperaturmessstationen', Temperaturmessnetz)


class Vorfluter (Base, Vector):
    __tablename__ = 'vorfluter'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.wasser-vorfluter'
    __template__ = 'templates/htmlpopup/vorfluter.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    teilezgnr = Column('teilezgnr', Integer)
    gwlnr = Column('gwlnr', Text)
    measure = Column('measure', Integer)
    endmeasure = Column('endmeasure', Integer)
    name = Column('name', Text)
    regimenr = Column('regimenr', Integer)
    regimetyp = Column('regimetyp', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.bafu.wasser-vorfluter', Vorfluter)


class Gewaesserzustandst (Base, Vector):
    __tablename__ = 'dbgz'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.hydrologie-gewaesserzustandsmessstationen'
    __template__ = 'templates/htmlpopup/gewaesserzustandsmessstationen.mako'
    #__queryable_attributes__ = ['nr', 'name', 'gewaesser']
    id = Column('bgdi_id', Integer, primary_key=True)
    name = Column('name', Text)
    nr = Column('nr', Numeric)
    gewaesser = Column('gewaesser', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.bafu.hydrologie-gewaesserzustandsmessstationen', Gewaesserzustandst)


class Teileinzugsgebiete2 (Base, Vector):
    __tablename__ = 'ebene_2km'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
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
    __tablename__ = 'ebene_40km'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.wasser-teileinzugsgebiete_40'
    __template__ = 'templates/htmlpopup/teileinzugsgebiete40.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    tezgnr40 = Column('tezgnr40', Integer)
    teilezgfla = Column('teilezgfla', Numeric)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.bafu.wasser-teileinzugsgebiete_40', Teileinzugsgebiete40)


class Gebietsauslaesse (Base, Vector):
    __tablename__ = 'outlets'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.wasser-gebietsauslaesse'
    __template__ = 'templates/htmlpopup/gebietsauslaesse.mako'
    __extended_info__ = True
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
    meanalt = Column('meanalt', Text)
    maxalt = Column('maxalt', Text)
    mq_jahr = Column('mq_jahr', Text)
    feuchtflae = Column('feuchtflae', Text)
    wasserflae = Column('wasserflae', Text)
    bebautefl = Column('bebautefl', Text)
    landwirtsc = Column('landwirtsc', Text)
    wald_natur = Column('wald_natur', Text)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.bafu.wasser-gebietsauslaesse', Gebietsauslaesse)


class AU(Base, Vector):
    __tablename__ = 'au'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-auen'
    __template__ = 'templates/htmlpopup/auen.mako'
    #__queryable_attributes__ = ['au_obj', 'au_name']
    id = Column('gid', Integer, primary_key=True)
    au_name = Column('au_name', Text)
    au_obj = Column('au_obj', Integer)
    au_objtyp = Column('au_objtyp', Text)
    au_fl = Column('au_fl', Numeric)
    the_geom = GeometryColumn(Geometry(dimensions=2, srid=21781))

register('ch.bafu.bundesinventare-auen', AU)


class BLN(Base, Vector):
    __tablename__ = 'bln'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
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
    __tablename__ = 'hm'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
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
    __tablename__ = 'jb'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
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
    __tablename__ = 'ml'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-moorlandschaften'
    __template__ = 'templates/htmlpopup/moorlandschaften.mako'
    id = Column('gid', Integer, primary_key=True)
    ml_name = Column('ml_name', Text)
    ml_obj = Column('ml_obj', Integer)
    ml_fl = Column('ml_fl', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.bundesinventare-moorlandschaften', ML)


class WV(Base, Vector):
    __tablename__ = 'wv'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
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


class wasserentnahmeAll(Base, Vector):
    __tablename__ = 'entnahme'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.wasser-entnahme'
    __template__ = 'templates/htmlpopup/wasserentnahme.mako'
    id = Column('gid', Text, primary_key=True)
    rwknr = Column('rwknr', Text)
    kanton = Column('kanton', Text)
    kantoncode = Column('kantoncode', Text)
    ent_gew = Column('ent_gew', Text)
    link = Column('link', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.wasser-entnahme', wasserentnahmeAll)


class wasserleitungen(Base, Vector):
    __tablename__ = 'leitungen'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.wasser-leitungen'
    __template__ = 'templates/htmlpopup/wasserleitungen.mako'
    id = Column('gid', Integer, primary_key=True)
    kanton = Column('kanton', Text)
    kantoncode = Column('kantoncode', Text)
    rwknr = Column('rwknr', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.wasser-leitungen', wasserleitungen)


class wasserrueckgabe(Base, Vector):
    __tablename__ = 'rueckgabe'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.wasser-rueckgabe'
    __template__ = 'templates/htmlpopup/wasserrueckgabe.mako'
    id = Column('gid', Integer, primary_key=True)
    kanton = Column('kanton', Text)
    kantoncode = Column('kantoncode', Text)
    rwknr = Column('rwknr', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.wasser-rueckgabe', wasserrueckgabe)


class flachmoore(Base, Vector):
    __tablename__ = 'fm'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-flachmoore'
    __template__ = 'templates/htmlpopup/flachmoore.mako'
    id = Column('gid', Integer, primary_key=True)
    fm_name = Column('fm_name', Text)
    fm_obj = Column('fm_obj', Text)
    fm_gf = Column('fm_gf', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.bundesinventare-flachmoore', flachmoore)


class flachmooreReg(Base, Vector):
    __tablename__ = 'flachmoore_regional'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-flachmoore_regional'
    __template__ = 'templates/htmlpopup/flachmoore_reg.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    fmreg_name = Column('fmreg_name', Text)
    fmreg_obj = Column('fmreg_obj', Text)
    fmreg_gf = Column('fmreg_gf', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.bundesinventare-flachmoore_regional', flachmooreReg)


class paerke_nationaler_bedeutung(Base, Vector):
    __tablename__ = 'paerke_nationaler_bedeutung'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
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
    __tablename__ = 'ramsar'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
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
    __tablename__ = 'wildruhezonen_jagdbanngebiete'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
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
    __tablename__ = 'wege_wildruhezonen_jagdbanngebiete'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
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
    __tablename__ = 'sb'
    __table_args__ = ({'schema': 'fauna', 'autoload': False})
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
    __tablename__ = 'swissprtr'
    __table_args__ = ({'schema': 'prtr', 'autoload': False})
    __bodId__ = 'ch.bafu.swissprtr'
    __template__ = 'templates/htmlpopup/swissprtr.mako'
    id = Column('prtrnr', Numeric, primary_key=True)
    betrieb = Column('betrieb', Text)
    ort = Column('ort', Text)
    jahr = Column('jahr', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.swissprtr', SWISSPRTR)


class HOLZVORRAT(Base, Vector):
    __tablename__ = 'holzvorrat'
    __table_args__ = ({'schema': 'wald', 'autoload': False})
    __bodId__ = 'ch.bafu.holzvorrat'
    __template__ = 'templates/htmlpopup/holzvorrat.mako'
    id = Column('gid', Integer, primary_key=True)
    fid = Column('id', Integer)
    vorrat = Column('vorrat', Numeric)
    wireg_ = Column('wireg_', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.holzvorrat', HOLZVORRAT)


class HOLZZUWACHS(Base, Vector):
    __tablename__ = 'holzzuwachs'
    __table_args__ = ({'schema': 'wald', 'autoload': False})
    __bodId__ = 'ch.bafu.holzzuwachs'
    __template__ = 'templates/htmlpopup/holzzuwachs.mako'
    id = Column('gid', Integer, primary_key=True)
    wirtschaftsregion = Column('wirtschaftsregion', Text)
    holzzuwachs = Column('holzzuwachs', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.holzzuwachs', HOLZZUWACHS)


class HOLZNUTZUNG(Base, Vector):
    __tablename__ = 'holznutzung'
    __table_args__ = ({'schema': 'wald', 'autoload': False})
    __bodId__ = 'ch.bafu.holznutzung'
    __template__ = 'templates/htmlpopup/holznutzung.mako'
    id = Column('gid', Integer, primary_key=True)
    wireg_ = Column('wireg_', Text)
    nutzung = Column('nutzung', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.holznutzung', HOLZNUTZUNG)


class NABEL(Base, Vector):
    __tablename__ = 'nabel'
    __table_args__ = ({'schema': 'luft', 'autoload': False})
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
    __tablename__ = 'krebspest'
    __table_args__ = ({'schema': 'fischerei', 'autoload': False})
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
    __tablename__ = 'biogeoreg'
    __table_args__ = ({'schema': 'diverse', 'autoload': False})
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
    __tablename__ = 'smaragd'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __bodId__ = 'ch.bafu.schutzgebiete-smaragd'
    __template__ = 'templates/htmlpopup/smaragd.mako'
    id = Column('id', Integer, primary_key=True)
    em_name = Column('em_name', Text)
    em_obj = Column('em_obj', Numeric)
    em_gf = Column('em_gf', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.schutzgebiete-smaragd', smaragd)


class biosphaerenreservate(Base, Vector):
    __tablename__ = 'biores'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
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
    __tablename__ = 'mooseflora'
    __table_args__ = ({'schema': 'flora', 'autoload': False})
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
    __tablename__ = 'ws'
    __table_args__ = ({'schema': 'flora', 'autoload': False})
    __bodId__ = 'ch.bafu.flora-weltensutter_atlas'
    __template__ = 'templates/htmlpopup/weltensutter.mako'
    id = Column('gid', Integer, primary_key=True)
    nom = Column('nom', Text)
    no_surface = Column('no_surface', Numeric)
    ty_surface = Column('ty_surface', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.flora-weltensutter_atlas', weltensutter)


class baumarten(Base, Vector):
    __tablename__ = 'baumartenmischung'
    __table_args__ = ({'schema': 'wald', 'autoload': False})
    __bodId__ = 'ch.bafu.landesforstinventar-baumarten'
    __template__ = 'templates/htmlpopup/baumarten.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    wirtschaft = Column('wirtschaft', Text)
    anteil_lau = Column('anteil_lau', Numeric)
    anteil_nad = Column('anteil_nad', Numeric)
    vorrat = Column('vorrat', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.landesforstinventar-baumarten', baumarten)


class waldanteil(Base, Vector):
    __tablename__ = 'waldanteil'
    __table_args__ = ({'schema': 'wald', 'autoload': False})
    __bodId__ = 'ch.bafu.landesforstinventar-waldanteil'
    __template__ = 'templates/htmlpopup/waldanteil.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    wirtschaft = Column('wirtschaft', Text)
    waldflaech = Column('waldflaech', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.landesforstinventar-waldanteil', waldanteil)


class totholz(Base, Vector):
    __tablename__ = 'totholzvolumen'
    __table_args__ = ({'schema': 'wald', 'autoload': False})
    __bodId__ = 'ch.bafu.landesforstinventar-totholz'
    __template__ = 'templates/htmlpopup/totholz.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    wirtschaft = Column('wirtschaft', Text)
    totholzvol = Column('totholzvol', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.landesforstinventar-totholz', totholz)


class histerdbeben(Base, Vector):
    __tablename__ = 'historische_erdbeben'
    __table_args__ = ({'schema': 'gefahren', 'autoload': False})
    __bodId__ = 'ch.bafu.gefahren-historische_erdbeben'
    __template__ = 'templates/htmlpopup/histerdbeben.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    fid = Column('id', Integer)
    epicentral = Column('epicentral', Text)
    intensity = Column('intensity', Text)
    magnitude = Column('magnitude', Numeric)
    date_time = Column('date_time', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.gefahren-historische_erdbeben', histerdbeben)


class spektral(Base, Vector):
    __tablename__ = 'baugrundkl_spectral'
    __table_args__ = ({'schema': 'gefahren', 'autoload': False})
    __bodId__ = 'ch.bafu.gefahren-spektral'
    __template__ = 'templates/htmlpopup/spektral.mako'
    id = Column('_count', Integer, primary_key=True)
    fid = Column('id', Integer)
    spectral_3 = Column('spectral_3', Text)
    spectral_4 = Column('spectral_4', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.gefahren-spektral', spektral)


class trockenwiesenundweiden(Base, Vector):
    __tablename__ = 'tww'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-trockenwiesen_trockenweiden'
    __template__ = 'templates/htmlpopup/trockenwiesenundweiden.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    tww_name = Column('tww_name', Text)
    tww_fl = Column('tww_fl', Numeric)
    tww_gf = Column('tww_gf', Numeric)
    tww_obj = Column('tww_obj', Numeric)
    tww_tobj = Column('tww_tobj', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.bundesinventare-trockenwiesen_trockenweiden', trockenwiesenundweiden)


class trockenwiesenundweiden_anhang2(Base, Vector):
    __tablename__ = 'trockenwiesen_weiden_anhang2'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-trockenwiesen_trockenweiden_anhang2'
    __template__ = 'templates/htmlpopup/tww_anhang2.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    tww_name = Column('tww_name', Text)
    tww_obj = Column('tww_obj', Numeric)
    tww_tobj = Column('tww_tobj', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.bundesinventare-trockenwiesen_trockenweiden_anhang2', trockenwiesenundweiden_anhang2)


class amphibien_anhang4(Base, Vector):
    __tablename__ = 'amphibien_anhang4'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-amphibien_anhang4'
    __template__ = 'templates/htmlpopup/amphibien_anhang4.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    name = Column('name', Text)
    obnr = Column('obnr', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.bundesinventare-amphibien_anhang4', amphibien_anhang4)


class baugrundklassen(Base, Vector):
    __tablename__ = 'baugrundklassen'
    __table_args__ = ({'schema': 'gefahren', 'autoload': False})
    __bodId__ = 'ch.bafu.gefahren-baugrundklassen'
    __template__ = 'templates/htmlpopup/baugrundklassen.mako'
    id = Column('_count', Integer, primary_key=True)
    bgk = Column('bgk', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.gefahren-baugrundklassen', baugrundklassen)


class emissionplan(Base, Vector):
    __tablename__ = 'laerm_emplan_bahn_2015'
    __table_args__ = ({'schema': 'diverse', 'autoload': False})
    __bodId__ = 'ch.bav.laerm-emissionplan_eisenbahn_2015'
    __template__ = 'templates/htmlpopup/emissionplan.mako'
    __extended_info__ = True
    id = Column('id', Integer, primary_key=True)
    lin_nr_dfa = Column('lin_nr_dfa', Numeric)
    von_m = Column('von_m', Numeric)
    bis_m = Column('bis_m', Numeric)
    lre_t = Column('lre_t', Numeric)
    lre_n = Column('lre_n', Numeric)
    k1_t = Column('k1_t', Numeric)
    k1_n = Column('k1_n', Numeric)
    fb1 = Column('fb1', Numeric)
    fb2 = Column('fb2', Numeric)
    grund1 = Column('grund1', Text)
    grund2 = Column('grund2', Text)
    linienbeze = Column('linienbeze', Text)
    von_abkz = Column('von_abkz', Text)
    von_bpk_bp = Column('von_bpk_bp', Text)
    bis_abkz = Column('bis_abkz', Text)
    bis_bpk_bp = Column('bis_bpk_bp', Text)
    typ_aender = Column('typ_aender', Text)
    datum = Column('datum', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bav.laerm-emissionplan_eisenbahn_2015', emissionplan)


class wrzselect(Base, Vector):
    __tablename__ = 'jgd_select'
    __table_args__ = ({'schema': 'wrzportal', 'autoload': False})
    __bodId__ = 'ch.bafu.wrz-jagdbanngebiete_select'
    __template__ = 'templates/htmlpopup/wrz_select.mako'
    id = Column('objectid', Integer, primary_key=True)
    jb_name = Column('jb_name', Text)
    jb_obj = Column('jb_obj', Integer)
    schutzstatus = Column('schutzstatus', Text)
    bestimmung = Column('bestimmung', Text)
    schutzzeit = Column('schutzzeit', Text)
    grundlage = Column('grundlage', Text)
    zusatzinformation = Column('zusatzinformation', Text)
    kanton = Column('kanton', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.wrz-jagdbanngebiete_select', wrzselect)


class wrzportal(Base, Vector):
    __tablename__ = 'wrz_portal'
    __table_args__ = ({'schema': 'wrzportal', 'autoload': False})
    __bodId__ = 'ch.bafu.wrz-wildruhezonen_portal'
    __template__ = 'templates/htmlpopup/wrz_portal.mako'
    id = Column('objectid', Integer, primary_key=True)
    wrz_name = Column('wrz_name', Text)
    wrz_obj = Column('wrz_obj', Integer)
    schutzstatus = Column('schutzstatus', Text)
    bestimmung = Column('bestimmung', Text)
    schutzzeit = Column('schutzzeit', Text)
    grundlage = Column('grundlage', Text)
    beschlussjahr = Column('beschlussjahr', Text)
    zusatzinformation = Column('zusatzinformation', Text)
    kanton = Column('kanton', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.wrz-wildruhezonen_portal', wrzportal)


class wildtier(Base, Vector):
    __tablename__ = 'wildtierkorridore'
    __table_args__ = ({'schema': 'fauna', 'autoload': False})
    __bodId__ = 'ch.bafu.fauna-wildtierkorridor_national'
    __template__ = 'templates/htmlpopup/wildtierkorridor.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    nr = Column('nr', Text)
    zusta_dt = Column('zusta_dt', Text)
    zusta_fr = Column('zusta_fr', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bafu.fauna-wildtierkorridor_national', wildtier)
