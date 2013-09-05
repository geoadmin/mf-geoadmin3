# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from geoalchemy import GeometryColumn, Geometry

from chsdi.models import *
from chsdi.models.vector import Vector


Base = bases['uvek']


# IVS NAT and REG use the same template
class IVS_NAT(Base, Vector):
    __tablename__ = 'ivs_nat'
    __table_args__ = ({'schema': 'astra', 'autoload': False})
    __template__ = 'templates/htmlpopup/ivs_nat.mako'
    __esriId__ = 3000
    __bodId__ = 'ch.astra.ivs-nat'
    __queryable_attributes__ = ['ivs_slaname', 'ivs_nummer', 'ivs_signatur']
    id = Column('nat_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    ivs_slaname = Column('ivs_slaname', Text)
    ivs_nummer = Column('ivs_nummer', Text)
    ivs_signatur = Column('ivs_signatur', Text)
    ivs_signatur_fr = Column('ivs_signatur_fr', Text)
    ivs_signatur_it = Column('ivs_signatur_it', Text)
    ivs_signatur_de = Column('ivs_signatur_de', Text)
    ivs_kanton = Column('ivs_kanton', Text)
    ivs_sladatehist = Column('ivs_sladatehist', Integer)
    ivs_sladatemorph = Column('ivs_sladatemorph', Integer)
    ivs_slabedeutung = Column('ivs_slabedeutung', Integer)
    ivs_sortsla = Column('ivs_sortsla', Text)

register('ch.astra.ivs-nat', IVS_NAT)
register('ch.astra.ivs-nat-verlaeufe', IVS_NAT)


class IVS_REG_LOC(Base, Vector):
    __tablename__ = 'ivs_reg_loc'
    __table_args__ = ({'schema': 'astra', 'autoload': False})
    __template__ = 'templates/htmlpopup/ivs_nat.mako'
    __esriId__ = 4000
    __bodId__ = 'ch.astra.ivs-reg_loc'
    __queryable_attributes__ = ['ivs_slaname', 'ivs_nummer', 'ivs_signatur']
    id = Column('reg_loc_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    ivs_slaname = Column('ivs_slaname', Text)
    ivs_nummer = Column('ivs_nummer', Text)
    ivs_signatur = Column('ivs_signatur', Text)
    ivs_signatur_fr = Column('ivs_signatur_fr', Text)
    ivs_signatur_it = Column('ivs_signatur_it', Text)
    ivs_signatur_de = Column('ivs_signatur_de', Text)
    ivs_kanton = Column('ivs_kanton', Text)
    ivs_sladatehist = Column('ivs_sladatehist', Integer)
    ivs_sladatemorph = Column('ivs_sladatemorph', Integer)
    ivs_slabedeutung = Column('ivs_slabedeutung', Integer)
    ivs_sortsla = Column('ivs_sortsla', Text)

register('ch.astra.ivs-reg_loc', IVS_REG_LOC)

class KANTONE_REG_LOC(Base, Vector):
    __tablename__ = 'kanton_reg_loc'
    __table_args__ = ({'schema': 'astra', 'autoload': False})
    __template__ = 'templates/htmlpopup/kantone.ivs-reg_loc.mako'
    __esriId__ = 4001
    __bodId__ = 'ch.kantone.ivs-reg_loc'
    __displayFieldName__ = 'ivs_slaname'
    __queryable_attributes__ = ['ivs_slaname','ivs_nummer','ivs_signatur']
    id = Column('reg_loc_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    ivs_slaname = Column('ivs_slaname', Text)
    ivs_nummer = Column('ivs_nummer', Text)
    ivs_signatur_fr = Column('ivs_signatur_fr', Text)
    ivs_signatur_it = Column('ivs_signatur_it', Text)
    ivs_signatur_de = Column('ivs_signatur_de', Text)
    ivs_kanton = Column('ivs_kanton', Text)
    ivs_sladatehist = Column('ivs_sladatehist', Integer)
    ivs_sladatemorph = Column('ivs_sladatemorph', Integer)
    ivs_slabedeutung = Column('ivs_slabedeutung', Integer)
    ivs_sortsla = Column('ivs_sortsla', Text)
    
register('ch.kantone.ivs-reg_loc', KANTONE_REG_LOC)

class AUSNAHMETRANSPORTROUTEN(Base, Vector):
    __tablename__ = 'ausnahmetransportrouten'
    __table_args__ = ({'schema': 'astra', 'autoload': False})
    __template__ = 'templates/htmlpopup/ausnahmetransportrouten.mako'
    __esriId__ = 4002
    __bodId__ = 'ch.astra.ausnahmetransportrouten'
    __displayFieldName__ = 'bgdi_id'
    id = Column('id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    bgdi_id = Column('bgdi_id', Integer)
    ri_getrenn = Column('ri_getrenn', Text)
    anz_spuren = Column('anz_spuren', Integer)
    strassen_typ = Column('strassen_typ', Text)
    routentyp_id = Column('routentyp_id', Integer)

register('ch.astra.ausnahmetransportrouten', AUSNAHMETRANSPORTROUTEN)

#class ZAEHLSTELLENREGLOC(Base, Vector):
#    __tablename__ = 'verkehr_reg_loc'
#    __table_args__ = ({'schema': 'astra', 'autoload': False})
#    __template__ = 'templates/htmlpopup/verkehrszaehlstellen.mako'
#    __esriId__ = 4002
#    __bodId__ = 'ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal'
#    __displayFieldName__ = 'zaehlstellen_bezeichnung'
#    __queryable_attributes__ = ['nr','zaehlstellen_bezeichnung']
#    id = Column('nr', Integer, primary_key=True)
#    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
#    zaehlstellen_bezeichnung = Column('zaehlstellen_bezeichnung', Text)
#    zst_physisch_virtuell = Column('zst_physisch_virtuell', Text)
#    messstellentyp = Column('messstellentyp', Text)
#
#register('ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal', ZAEHLSTELLENREGLOC)
#
#class ZAEHLSTELLENUEBER(Base, Vector):
#    __tablename__ = 'verkehr_ueber'
#    __table_args__ = ({'schema': 'astra', 'autoload': False})
#    __template__ = 'templates/htmlpopup/verkehrszaehlstellen.mako'
#    __esriId__ = 4003
#    __bodId__ = 'ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet'
#    __displayFieldName__ = 'zaehlstellen_bezeichnung'
#    __queryable_attributes__ = ['nr','zaehlstellen_bezeichnung']
#    id = Column('nr', Integer, primary_key=True)
#    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
#    zaehlstellen_bezeichnung = Column('zaehlstellen_bezeichnung', Text)
#    zst_physisch_virtuell = Column('zst_physisch_virtuell', Text)
#    messstellentyp = Column('messstellentyp', Text)
#
#register('ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet', ZAEHLSTELLENUEBER)

class KATASTERBELASTETERSTANDORTE(Base, Vector):
    __tablename__ = 'kataster_belasteter_standorte_oev'
    __table_args__ = ({'schema': 'bav', 'autoload': False})
    __template__ = 'templates/htmlpopup/kataster_belasteter_standorte_oev.mako'
    __esriId__ = 4002
    __bodId__ = 'ch.bav.kataster-belasteter-standorte-oev'
    __displayFieldName__ = 'bezeichnung'
    id = Column('vflz_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
#    not_used = Column('the_geom_gen50', Geometry(21781))
    nummer = Column('nummer', Text)
    typ_bez = Column('typ_bez', Text)
    url = Column('url', Text)
    bezeichnung = Column('bezeichnung', Text)
    bewertung_bez = Column('bewertung_bez', Text)
    untersuchungsstand_bez = Column('untersuchungsstand_bez', Text)

register('ch.bav.kataster-belasteter-standorte-oev', KATASTERBELASTETERSTANDORTE)
