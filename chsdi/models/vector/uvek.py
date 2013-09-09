# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from geoalchemy import GeometryColumn, Geometry
from sqlalchemy.types import Numeric

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

class ZAEHLSTELLENREGLOC(Base, Vector):
    __tablename__ = 'verkehr_reg_loc'
    __table_args__ = ({'schema': 'astra', 'autoload': False})
    __template__ = 'templates/htmlpopup/verkehrszaehlstellen.mako'
    __esriId__ = 4002
    __bodId__ = 'ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal'
    __displayFieldName__ = 'zaehlstellen_bezeichnung'
    __queryable_attributes__ = ['nr','zaehlstellen_bezeichnung']
    id = Column('nr', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    zaehlstellen_bezeichnung = Column('zaehlstellen_bezeichnung', Text)
    zst_physisch_virtuell = Column('zst_physisch_virtuell', Text)
    messstellentyp = Column('messstellentyp', Text)

register('ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal', ZAEHLSTELLENREGLOC)

class ZAEHLSTELLENUEBER(Base, Vector):
    __tablename__ = 'verkehr_ueber'
    __table_args__ = ({'schema': 'astra', 'autoload': False})
    __template__ = 'templates/htmlpopup/verkehrszaehlstellen.mako'
    __esriId__ = 4003
    __bodId__ = 'ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet'
    __displayFieldName__ = 'zaehlstellen_bezeichnung'
    __queryable_attributes__ = ['nr','zaehlstellen_bezeichnung']
    id = Column('nr', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    zaehlstellen_bezeichnung = Column('zaehlstellen_bezeichnung', Text)
    zst_physisch_virtuell = Column('zst_physisch_virtuell', Text)
    messstellentyp = Column('messstellentyp', Text)

register('ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet', ZAEHLSTELLENUEBER)

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

class ABGELTUNGWASSERKRAFTNUTZUNG(Base, Vector):
    __tablename__ = 'abgeltung_wasserkraftnutzung'
    __table_args__ = ({'schema': 'bfe', 'autoload': False})
    __template__ = 'templates/htmlpopup/abgeltungwasserkraftnutzung.mako'
    __esriId__ = 4004
    __bodId__ = 'ch.bfe.abgeltung-wasserkraftnutzung'
    __displayFieldName__ = 'name'
    id = Column('objectnumber', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    area = Column('area', Numeric)
    name = Column('name', Text)
    perimeter = Column('perimeter', Numeric)
    startprotectioncommitment = Column('startprotectioncommitment', Text)
    endprotectioncommitment = Column('endprotectioncommitment', Text)

register('ch.bfe.abgeltung-wasserkraftnutzung', ABGELTUNGWASSERKRAFTNUTZUNG)

#class ENERGIEFORSCHUNG(Base, Vector):
#    __tablename__ = 'energieforschung' 
#    __table_args__ = ({'schema': 'bfe', 'autoload': False})
#    __template__ = 'templates/htmlpopup/energieforschung.mako'
#    __esriId__ = 4004
#    __bodId__ = 'ch.bfe.energieforschung'
#    __displayFieldName__ = 'name'
#    __extended_info__ = True
#    id = Column('tid', Integer, primary_key=True)
#    the_geom = Column(Geometry(21781))
#
#register('ch.bfe.energieforschung', ENERGIEFORSCHUNG)

class STATISTIKWASSERKRAFTANLAGEN(Base, Vector):
    __tablename__ = 'statistik_wasserkraftanlagen_powerplant'
    __table_args__ = ({'schema': 'bfe', 'autoload': False})
    __template__ = 'templates/htmlpopup/statistikwasserkraftanlagen.mako'
    __esriId__ = 4005
    __bodId__ = 'ch.bfe.statistik-wasserkraftanlagen'
    __displayFieldName__ = 'name'
    id = Column('wastanumber', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    name = Column('name', Text)
    location = Column('location', Text)
    canton = Column('canton', Text)
    hydropowerplantoperationalstatus_it = Column('hydropowerplantoperationalstatus_it', Text)
    hydropowerplanttype_it = Column('hydropowerplanttype_it', Text)
    hydropowerplantoperationalstatus_fr = Column('hydropowerplantoperationalstatus_fr', Text)
    hydropowerplanttype_fr = Column('hydropowerplanttype_fr', Text)
    hydropowerplantoperationalstatus_de = Column('hydropowerplantoperationalstatus_de', Text)
    hydropowerplanttype_de = Column('hydropowerplanttype_de', Text)
    beginningofoperation = Column('beginningofoperation', Integer)
    endofoperation = Column('endofoperation', Integer)

register('ch.bfe.statistik-wasserkraftanlagen', STATISTIKWASSERKRAFTANLAGEN)

#class STAUANLAGENBUNDESAUFSICHT(Base, Vector):
#    __tablename__ = 'stauanlagen_bundesaufsicht'
#    __table_args__ = ({'schema': 'bfe', 'autoload': False})
#    __template__ = 'templates/htmlpopup/stauanlagenbundesaufsicht.mako'
#    __esriId__ = 4006
#    __bodId__ = 'ch.bfe.stauanlagen-bundesaufsicht'
#    __displayFieldName__ = 'damname'
#    id = Column('dam_stabil_id', Integer, primary_key=True)
#    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
#    damname = Column('damname', Text)
#    damtype_fr = Column('damtype_fr', Text)
#    damtype_en = Column('damtype_en', Text)
#    damtype_de = Column('damtype_de', Text)
#    damheight = Column('damheight', Integer)
#    crestlevel = Column('crestlevel', Integer)
#    crestlength = Column('crestlength', Integer)
#    facilityname = Column('facilityname', Text)
#    beginningofoperation = Column('beginningofoperation', Text)
#    facaim_fr = Column('facaim_fr', Text)
#    startsupervision = Column('startsupervision', Text)
#    reservoirname = Column('reservoirname', Text)
#    impoundmentvolume = Column('impoundmentvolume', Text)
#    impoundmentlevel = Column('impoundmentlevel', Integer)
#    storagelevel = Column('storagelevel', Integer)
#    facaim_en = Column('facaim_en', Text)
#    facaim_de = Column('facaim_de', Text)
#    has_picture = Column('has_picture', Integer)
#    facility_stabil_id = Column('facility_stabil_id', Integer)
#        
#register('ch.bfe.stauanlagen-bundesaufsicht', STAUANLAGENBUNDESAUFSICHT)
#
class kleinwasserkraftpotentiale(Base, Vector):
    __tablename__ = 'kleinwasserkraftpotentiale'
    __table_args__ = ({'schema': 'bfe', 'autoload': False})
    __template__ = 'templates/htmlpopup/kleinwasserkraftpotentiale.mako'
    __esriId__ = 4006
    __bodId__ = 'ch.bfe.kleinwasserkraftpotentiale'
    __displayFieldName__ = 'gwlnr'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    kwprometer = Column('kwprometer', Numeric)
    laenge = Column('laenge', Numeric)
    gwlnr = Column('gwlnr', Text)
    
register('ch.bfe.kleinwasserkraftpotentiale', kleinwasserkraftpotentiale)

#class bakomfernsehsender(Base, Vector):
#    __tablename__ = 'nisdb_bro_tooltip'
#    __table_args__ = ({'schema': 'bakom', 'autoload': False})
#    __template__ = 'templates/htmlpopup/bakomfernsehsender.mako'
#    __esriId__ = 4007
#    __bodId__ = 'ch.bakom.radio-fernsehsender'
#    __displayFieldName__ = 'name'
#    __extended_info__ = True
#    __queryable_attributes__ = ['name','code']
#    id = Column('id', Integer, primary_key=True)
#    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
#    name = Column('name', Text) 
#    code = Column('code', Text) 
#    power = Column('power', Text) 
#    service = Column('service', Text) 
#    program = Column('program', Text) 
#    freqchan = Column('freqchan', Text) 
#
#register('ch.bakom.radio-fernsehsender', bakomfernsehsender)

class bakomgsm(Base, Vector):
    __tablename__ = 'nisdb_gsm'
    __table_args__ = ({'schema': 'bakom', 'autoload': False})
    __template__ = 'templates/htmlpopup/bakomgsm.mako'
    __esriId__ = 4008
    __bodId__ = 'ch.bakom.mobil-antennenstandorte-gsm'
    __displayFieldName__ = 'id'
    id = Column('id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    powercode = Column('powercode', Text)

register('ch.bakom.mobil-antennenstandorte-gsm', bakomgsm)

class bakomumts(Base, Vector):
    __tablename__ = 'nisdb_umts'
    __table_args__ = ({'schema': 'bakom', 'autoload': False})
    __template__ = 'templates/htmlpopup/bakomumts.mako'
    __esriId__ = 4009
    __bodId__ = 'ch.bakom.mobil-antennenstandorte-umts'
    __displayFieldName__ = 'id'
    id = Column('id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    powercode = Column('powercode', Text)

register('ch.bakom.mobil-antennenstandorte-umts', bakomumts)

class bakomlte(Base, Vector):
    __tablename__ = 'nisdb_lte'
    __table_args__ = ({'schema': 'bakom', 'autoload': False})
    __template__ = 'templates/htmlpopup/bakomlte.mako'
    __esriId__ = 4010
    __bodId__ = 'ch.bakom.mobil-antennenstandorte-lte'
    __displayFieldName__ = 'id'
    id = Column('id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    powercode = Column('powercode', Text)

register('ch.bakom.mobil-antennenstandorte-lte', bakomlte)

class bakomtv(Base, Vector):
    __tablename__ = 'tv_gebiet'
    __table_args__ = ({'schema': 'bakom', 'autoload': False})
    __template__ = 'templates/htmlpopup/bakomtv.mako'
    __esriId__ = 4011
    __bodId__ = 'ch.bakom.versorgungsgebiet-tv'
    __displayFieldName__ = 'prog'
    __queryable_attributes__ = ['prog']
    id = Column('gid', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    prog = Column('prog', Text)

register('ch.bakom.versorgungsgebiet-tv', bakomtv)

class bakomukw(Base, Vector):
    __tablename__ = 'ukw_gebiet'
    __table_args__ = ({'schema': 'bakom', 'autoload': False})
    __template__ = 'templates/htmlpopup/bakomukw.mako'
    __esriId__ = 4012
    __bodId__ = 'ch.bakom.versorgungsgebiet-ukw'
    __displayFieldName__ = 'prog'
    __queryable_attributes__ = ['prog']
    id = Column('gid', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    prog = Column('prog', Text)

register('ch.bakom.versorgungsgebiet-ukw', bakomukw)
