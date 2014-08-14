# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer, Date
from geoalchemy import GeometryColumn, Geometry
from sqlalchemy.types import Numeric

from chsdi.models import *
from chsdi.models.vector import Vector


Base = bases['uvek']


# IVS NAT and REG use the same template
class SicherheitsZonenPlan (Base, Vector):
    __tablename__ = 'sichereitszonen'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __template__ = 'templates/htmlpopup/sicherheitszoneneplan.mako'
    __bodId__ = 'ch.bazl.sicherheitszonenplan'
    __extended_info__ = True
    id = Column('stabil_id', Text, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    zone = Column('zone', Text)
    zonetype_tid = Column('zonetype_tid', Text)
    type_id = Column('type_id', Text)
    zonetype_de = Column('zonetype_de', Text)
    zonetype_fr = Column('zonetype_fr', Text)
    zonetype_it = Column('zonetype_it', Text)
    zone_name = Column('zone_name', Text)
    originator = Column('originator', Text)
    canton = Column('canton', Text)
    municipality = Column('municipality', Text)
    approval_date = Column('approval_date', Text)
    status_id = Column('status_id', Text)
    legalstatus_tid = Column('legalstatus_tid', Text)
    legalstatus_de = Column('legalstatus_de', Text)
    legalstatus_fr = Column('legalstatus_fr', Text)
    legalstatus_it = Column('legalstatus_it', Text)
    title = Column('title', Text)
    weblink = Column('weblink', Text)
    valid_from = Column('valid_from', Text)
    valid_until = Column('valid_until', Text)
    latest_modification = Column('latest_modification', Text)
    doc_description = Column('doc_description', Text)
    doc_id = Column('doc_id', Text)

register('ch.bazl.sicherheitszonenplan', SicherheitsZonenPlan)


class IVS_NAT(Base, Vector):
    __tablename__ = 'ivs_nat'
    __table_args__ = ({'schema': 'astra', 'autoload': False})
    __template__ = 'templates/htmlpopup/ivs_nat.mako'
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
    bgdi_created = Column('bgdi_created', Text)

register('ch.astra.ivs-reg_loc', IVS_REG_LOC)
register('ch.astra.ivs-reg_loc.sub', IVS_REG_LOC)


class KANTONE_REG_LOC(Base, Vector):
    __tablename__ = 'kanton_reg_loc'
    __table_args__ = ({'schema': 'astra', 'autoload': False})
    __template__ = 'templates/htmlpopup/kantone.ivs-reg_loc.mako'
    __bodId__ = 'ch.kantone.ivs-reg_loc'
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

register('ch.kantone.ivs-reg_loc', KANTONE_REG_LOC)


class AUSNAHMETRANSPORTROUTEN(Base, Vector):
    __tablename__ = 'ausnahmetransportrouten'
    __table_args__ = ({'schema': 'astra', 'autoload': False})
    __template__ = 'templates/htmlpopup/ausnahmetransportrouten.mako'
    __bodId__ = 'ch.astra.ausnahmetransportrouten'
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
    __bodId__ = 'ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal'
    __queryable_attributes__ = ['nr', 'zaehlstellen_bezeichnung']
    __extended_info__ = True
    id = Column('nr', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    zaehlstellen_bezeichnung = Column('zaehlstellen_bezeichnung', Text)
    uno_zaehlstelle = Column('uno_zaehlstelle', Text)
    zst_physisch_virtuell = Column('zst_physisch_virtuell', Text)
    messstellentyp = Column('messstellentyp', Text)
    koordinate_ost = Column('koordinate_ost', Integer)
    koordinate_nord = Column('koordinate_nord', Integer)
    kanton = Column('kanton', Text)
    swiss_10 = Column('swiss_10', Integer)
    netz = Column('netz', Text)
    status = Column('status', Text)
    strasse = Column('strasse', Text)
    richtung_1 = Column('richtung_1', Text)
    richtung_2 = Column('richtung_2', Text)
    inbetriebnahme = Column('inbetriebnahme', Text)
    anzahl_fahrstreifen_tot = Column('anzahl_fahrstreifen_tot', Integer)
    bulletins_sasvz = Column('bulletins_sasvz', Text)
    ssvz_2005 = Column('ssvz_2005', Text)
    jahresauswertung = Column('jahresauswertung', Text)
    bgdi_created = Column('bgdi_created', Text)

register('ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal', ZAEHLSTELLENREGLOC)


class ZAEHLSTELLENUEBER(Base, Vector):
    __tablename__ = 'verkehr_ueber'
    __table_args__ = ({'schema': 'astra', 'autoload': False})
    __template__ = 'templates/htmlpopup/verkehrszaehlstellen.mako'
    __bodId__ = 'ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet'
    __queryable_attributes__ = ['nr', 'zaehlstellen_bezeichnung']
    __extended_info__ = True
    id = Column('nr', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    zaehlstellen_bezeichnung = Column('zaehlstellen_bezeichnung', Text)
    uno_zaehlstelle = Column('uno_zaehlstelle', Text)
    zst_physisch_virtuell = Column('zst_physisch_virtuell', Text)
    messstellentyp = Column('messstellentyp', Text)
    koordinate_ost = Column('koordinate_ost', Integer)
    koordinate_nord = Column('koordinate_nord', Integer)
    kanton = Column('kanton', Text)
    swiss_10 = Column('swiss_10', Integer)
    netz = Column('netz', Text)
    status = Column('status', Text)
    strasse = Column('strasse', Text)
    richtung_1 = Column('richtung_1', Text)
    richtung_2 = Column('richtung_2', Text)
    inbetriebnahme = Column('inbetriebnahme', Text)
    anzahl_fahrstreifen_tot = Column('anzahl_fahrstreifen_tot', Integer)
    bulletins_sasvz = Column('bulletins_sasvz', Text)
    ssvz_2005 = Column('ssvz_2005', Text)
    jahresauswertung = Column('jahresauswertung', Text)
    bgdi_created = Column('bgdi_created', Text)

register('ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet', ZAEHLSTELLENUEBER)


class KATASTERBELASTETERSTANDORTE(Base, Vector):
    __tablename__ = 'kataster_belasteter_standorte_oev'
    __table_args__ = ({'schema': 'bav', 'autoload': False})
    __template__ = 'templates/htmlpopup/kataster_belasteter_standorte_oev.mako'
    __bodId__ = 'ch.bav.kataster-belasteter-standorte-oev'
    id = Column('vflz_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    katasternummer = Column('katasternummer', Text)
    standorttyp_de = Column('standorttyp_de', Text)
    standorttyp_fr = Column('standorttyp_fr', Text)
    standorttyp_it = Column('standorttyp_it', Text)
    statusaltlv_de = Column('statusaltlv_de', Text)
    statusaltlv_fr = Column('statusaltlv_fr', Text)
    statusaltlv_it = Column('statusaltlv_it', Text)
    untersuchungsstand_de = Column('untersuchungsstand_de', Text)
    untersuchungsstand_fr = Column('untersuchungsstand_fr', Text)
    untersuchungsstand_it = Column('untersuchungsstand_it', Text)
    url = Column('url', Text)
    bgdi_created = Column('bgdi_created', Text)

register('ch.bav.kataster-belasteter-standorte-oev', KATASTERBELASTETERSTANDORTE)


class ABGELTUNGWASSERKRAFTNUTZUNG(Base, Vector):
    __tablename__ = 'abgeltung_wasserkraftnutzung'
    __table_args__ = ({'schema': 'bfe', 'autoload': False})
    __template__ = 'templates/htmlpopup/abgeltungwasserkraftnutzung.mako'
    __bodId__ = 'ch.bfe.abgeltung-wasserkraftnutzung'
    id = Column('objectnumber', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    area = Column('area', Numeric)
    name = Column('name', Text)
    perimeter = Column('perimeter', Numeric)
    startprotectioncommitment = Column('startprotectioncommitment', Text)
    endprotectioncommitment = Column('endprotectioncommitment', Text)

register('ch.bfe.abgeltung-wasserkraftnutzung', ABGELTUNGWASSERKRAFTNUTZUNG)


class ENERGIEFORSCHUNG(Base, Vector):
    __tablename__ = 'energieforschung'
    __table_args__ = ({'schema': 'bfe', 'autoload': False})
    __template__ = 'templates/htmlpopup/energieforschung.mako'
    __bodId__ = 'ch.bfe.energieforschung'
    __extended_info__ = True
    id = Column('tid', Integer, primary_key=True)
    titel_fr = Column('titel_fr', Text)
    titel_it = Column('titel_it', Text)
    titel_de = Column('titel_de', Text)
    titel_en = Column('titel_en', Text)
    beschreibung_fr = Column('beschreibung_fr', Text)
    beschreibung_en = Column('beschreibung_en', Text)
    beschreibung_de = Column('beschreibung_de', Text)
    beschreibung_it = Column('beschreibung_it', Text)
    projektstatus_fr = Column('projektstatus_fr', Text)
    projektstatus_de = Column('projektstatus_de', Text)
    projektstatus_it = Column('projektstatus_it', Text)
    projektstatus_en = Column('projektstatus_en', Text)
    ch_hauptbereich_fr = Column('ch_hauptbereich_fr', Text)
    ch_hauptbereich_de = Column('ch_hauptbereich_de', Text)
    ch_hauptbereich_it = Column('ch_hauptbereich_it', Text)
    ch_hauptbereich_en = Column('ch_hauptbereich_en', Text)
    ch_unterbereich_fr = Column('ch_unterbereich_fr', Text)
    ch_unterbereich_de = Column('ch_unterbereich_de', Text)
    ch_unterbereich_it = Column('ch_unterbereich_it', Text)
    ch_unterbereich_en = Column('ch_unterbereich_en', Text)
    iea_hauptbereich_fr = Column('iea_hauptbereich_fr', Text)
    iea_hauptbereich_de = Column('iea_hauptbereich_de', Text)
    iea_hauptbereich_it = Column('iea_hauptbereich_it', Text)
    iea_hauptbereich_en = Column('iea_hauptbereich_en', Text)
    iea_unterbereich_fr = Column('iea_unterbereich_fr', Text)
    iea_unterbereich_de = Column('iea_unterbereich_de', Text)
    iea_unterbereich_it = Column('iea_unterbereich_it', Text)
    iea_unterbereich_en = Column('iea_unterbereich_en', Text)
    sprachregion_fr = Column('sprachregion_fr', Text)
    sprachregion_de = Column('sprachregion_de', Text)
    sprachregion_it = Column('sprachregion_it', Text)
    sprachregion_en = Column('sprachregion_en', Text)
    ort_fr = Column('ort_fr', Text)
    ort_de = Column('ort_de', Text)
    ort_it = Column('ort_it', Text)
    ort_en = Column('ort_en', Text)
    beauftragter_1 = Column('beauftragter_1', Text)
    beauftragter_2 = Column('beauftragter_2', Text)
    beauftragter_3 = Column('beauftragter_3', Text)
    bild_1 = Column('bild_1', Text)
    bild_2 = Column('bild_2', Text)
    bild_3 = Column('bild_3', Text)
    schlussbericht = Column('schlussbericht', Text)
    schluesselwoerter = Column('schluesselwoerter', Text)
    kontaktperson_bfe = Column('kontaktperson_bfe', Text)
    projektnummer = Column('projektnummer', Integer)
    anfang = Column('anfang', Text)
    ende = Column('ende', Text)
    plz = Column('plz', Text)
    kanton = Column('kanton', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bfe.energieforschung', ENERGIEFORSCHUNG)


class STATISTIKWASSERKRAFTANLAGEN(Base, Vector):
    __tablename__ = 'statistik_wasserkraftanlagen_powerplant'
    __table_args__ = ({'schema': 'bfe', 'autoload': False})
    __template__ = 'templates/htmlpopup/statistikwasserkraftanlagen.mako'
    __bodId__ = 'ch.bfe.statistik-wasserkraftanlagen'
    __extended_info__ = True
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
    leistung = Column('leistung', Numeric)
    produktionserwartung = Column('produktionserwartung', Numeric)
    leistungsaufnahme_pumpen = Column('leistungsaufnahme_pumpen', Numeric)
    energiebedarf_motore = Column('energiebedarf_motore', Numeric)

register('ch.bfe.statistik-wasserkraftanlagen', STATISTIKWASSERKRAFTANLAGEN)


class STAUANLAGENBUNDESAUFSICHT(Base, Vector):
    __tablename__ = 'stauanlagen_bundesaufsicht'
    __table_args__ = ({'schema': 'bfe', 'autoload': False})
    __template__ = 'templates/htmlpopup/stauanlagenbundesaufsicht.mako'
    __bodId__ = 'ch.bfe.stauanlagen-bundesaufsicht'
    __extended_info__ = True
    id = Column('dam_stabil_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    damname = Column('damname', Text)
    damtype_fr = Column('damtype_fr', Text)
    damtype_en = Column('damtype_en', Text)
    damtype_de = Column('damtype_de', Text)
    damheight = Column('damheight', Integer)
    crestlevel = Column('crestlevel', Integer)
    crestlength = Column('crestlength', Integer)
    facilityname = Column('facilityname', Text)
    beginningofoperation = Column('beginningofoperation', Text)
    startsupervision = Column('startsupervision', Text)
    reservoirname = Column('reservoirname', Text)
    impoundmentvolume = Column('impoundmentvolume', Text)
    impoundmentlevel = Column('impoundmentlevel', Integer)
    storagelevel = Column('storagelevel', Integer)
    facaim_fr = Column('facaim_fr', Text)
    facaim_en = Column('facaim_en', Text)
    facaim_de = Column('facaim_de', Text)
    has_picture = Column('has_picture', Integer)
    facility_stabil_id = Column('facility_stabil_id', Integer)

register('ch.bfe.stauanlagen-bundesaufsicht', STAUANLAGENBUNDESAUFSICHT)


class kleinwasserkraftpotentiale(Base, Vector):
    __tablename__ = 'kleinwasserkraftpotentiale'
    __table_args__ = ({'schema': 'bfe', 'autoload': False})
    __template__ = 'templates/htmlpopup/kleinwasserkraftpotentiale.mako'
    __bodId__ = 'ch.bfe.kleinwasserkraftpotentiale'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    kwprometer = Column('kwprometer', Numeric)
    laenge = Column('laenge', Numeric)
    gwlnr = Column('gwlnr', Text)

register('ch.bfe.kleinwasserkraftpotentiale', kleinwasserkraftpotentiale)


class bakomfernsehsender(Base, Vector):
    __tablename__ = 'nisdb_bro_tooltip'
    __table_args__ = ({'schema': 'bakom', 'autoload': False})
    __template__ = 'templates/htmlpopup/bakomfernsehsender.mako'
    __bodId__ = 'ch.bakom.radio-fernsehsender'
    __extended_info__ = True
    __queryable_attributes__ = ['name', 'code']
    id = Column('id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    name = Column('name', Text)
    code = Column('code', Text)
    power = Column('power', Text)
    service = Column('service', Text)
    program = Column('program', Text)
    freqchan = Column('freqchan', Text)
    bgdi_created = Column('bgdi_created', Text)

register('ch.bakom.radio-fernsehsender', bakomfernsehsender)


class bakomgsm(Base, Vector):
    __tablename__ = 'nisdb_gsm'
    __table_args__ = ({'schema': 'bakom', 'autoload': False})
    __template__ = 'templates/htmlpopup/bakomgsm.mako'
    __bodId__ = 'ch.bakom.mobil-antennenstandorte-gsm'
    id = Column('id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    powercode = Column('powercode', Text)
    bgdi_created = Column('bgdi_created', Text)

register('ch.bakom.mobil-antennenstandorte-gsm', bakomgsm)


class bakomumts(Base, Vector):
    __tablename__ = 'nisdb_umts'
    __table_args__ = ({'schema': 'bakom', 'autoload': False})
    __template__ = 'templates/htmlpopup/bakomumts.mako'
    __bodId__ = 'ch.bakom.mobil-antennenstandorte-umts'
    id = Column('id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    powercode = Column('powercode', Text)
    bgdi_created = Column('bgdi_created', Text)

register('ch.bakom.mobil-antennenstandorte-umts', bakomumts)


class bakomlte(Base, Vector):
    __tablename__ = 'nisdb_lte'
    __table_args__ = ({'schema': 'bakom', 'autoload': False})
    __template__ = 'templates/htmlpopup/bakomlte.mako'
    __bodId__ = 'ch.bakom.mobil-antennenstandorte-lte'
    id = Column('id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    powercode = Column('powercode', Text)
    bgdi_created = Column('bgdi_created', Text)

register('ch.bakom.mobil-antennenstandorte-lte', bakomlte)


class bakomtv(Base, Vector):
    __tablename__ = 'tv_gebiet'
    __table_args__ = ({'schema': 'bakom', 'autoload': False})
    __template__ = 'templates/htmlpopup/bakomtv.mako'
    __bodId__ = 'ch.bakom.versorgungsgebiet-tv'
    __queryable_attributes__ = ['prog']
    id = Column('gid', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    prog = Column('prog', Text)

register('ch.bakom.versorgungsgebiet-tv', bakomtv)


class bakomukw(Base, Vector):
    __tablename__ = 'ukw_gebiet'
    __table_args__ = ({'schema': 'bakom', 'autoload': False})
    __template__ = 'templates/htmlpopup/bakomukw.mako'
    __bodId__ = 'ch.bakom.versorgungsgebiet-ukw'
    __queryable_attributes__ = ['prog']
    id = Column('gid', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    prog = Column('prog', Text)

register('ch.bakom.versorgungsgebiet-ukw', bakomukw)


class ProjFlughafenanlagen(Base, Vector):
    __tablename__ = 'projektierungszonen'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __template__ = 'templates/htmlpopup/projflughafenanlagen.mako'
    __bodId__ = 'ch.bazl.projektierungszonen-flughafenanlagen'
    id = Column('stabil_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    zonekind_text_de = Column('zonekind_text_de', Text)
    zonekind_text_fr = Column('zonekind_text_fr', Text)
    zonekind_text_it = Column('zonekind_text_it', Text)
    canton = Column('canton', Text)
    municipality = Column('municipality', Text)
    legalstatus_text_de = Column('legalstatus_text_de', Text)
    legalstatus_text_fr = Column('legalstatus_text_fr', Text)
    legalstatus_text_it = Column('legalstatus_text_it', Text)
    applicant = Column('applicant', Text)
    validfrom = Column('validfrom', Text)
    durationofeffect = Column('durationofeffect', Text)
    description = Column('description', Text)
    weblink_ref = Column('weblink_ref', Text)
    bgdi_id = Column('bgdi_id', Integer)

register('ch.bazl.projektierungszonen-flughafenanlagen', ProjFlughafenanlagen)


class Luftfahrthindernis(Base, Vector):
    __tablename__ = 'luftfahrthindernis'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __template__ = 'templates/htmlpopup/luftfahrthindernisse.mako'
    __bodId__ = 'ch.bazl.luftfahrthindernis'
    __extended_info__ = True
    id = Column('bgdi_id', Integer, primary_key=True)
    sanctiontext = Column('sanctiontext', Text)
    registrationnumber = Column('registrationnumber', Text)
    lk100 = Column('lk100', Text)
    obstacletype = Column('obstacletype', Text)
    state = Column('state', Text)
    maxheightagl = Column('maxheightagl', Integer)
    topelevationamsl = Column('topelevationamsl', Integer)
    totallength = Column('totallength', Integer)
    startofconstruction = Column('startofconstruction', Date)
    duration = Column('duration', Text)
    geomtype = Column('geomtype', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    registrationnumber = Column('registrationnumber', Text)
    abortionaccomplished = Column('abortionaccomplished', Date)
    bgdi_created = Column('bgdi_created', Text)

register('ch.bazl.luftfahrthindernis', Luftfahrthindernis)


class sgt_facilities(Base, Vector):
    __tablename__ = 'geologische_tiefenlager_fac'
    __table_args__ = ({'schema': 'bfe', 'autoload': False})
    __template__ = 'templates/htmlpopup/sgt_facilities.mako'
    __bodId__ = 'ch.bfe.sachplan-geologie-tiefenlager'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    fackind_text_de = Column('fackind_text_de', Text)
    fackind_text_fr = Column('fackind_text_fr', Text)
    fackind_text_it = Column('fackind_text_it', Text)
    facstatus_text_de = Column('facstatus_text_de', Text)
    facstatus_text_fr = Column('facstatus_text_fr', Text)
    facstatus_text_it = Column('facstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    description = Column('description', Text)
    web = Column('web', Text)
    objname_text_de = Column('objname_text_de', Text)
    objname_text_fr = Column('objname_text_fr', Text)
    objname_text_it = Column('objname_text_it', Text)
    bgdi_created = Column('bgdi_created', Text)
    __minscale__ = 200005
    __maxscale__ = 100000005
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bfe.sachplan-geologie-tiefenlager', sgt_facilities)


class sgt_planning(Base, Vector):
    __tablename__ = 'geologische_tiefenlager'
    __table_args__ = ({'schema': 'bfe', 'autoload': False})
    __template__ = 'templates/htmlpopup/sgt_planning.mako'
    __bodId__ = 'ch.bfe.sachplan-geologie-tiefenlager'
    id = Column('stabil_id', Text, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    facname_de = Column('facname_de', Text)
    measurename_de = Column('measurename_de', Text)
    measurename_fr = Column('measurename_fr', Text)
    measurename_it = Column('measurename_it', Text)
    measuretype_text_de = Column('measuretype_text_de', Text)
    measuretype_text_fr = Column('measuretype_text_fr', Text)
    measuretype_text_it = Column('measuretype_text_it', Text)
    coordinationlevel_text_de = Column('coordinationlevel_text_de', Text)
    coordinationlevel_text_fr = Column('coordinationlevel_text_fr', Text)
    coordinationlevel_text_it = Column('coordinationlevel_text_it', Text)
    planningstatus_text_de = Column('planningstatus_text_de', Text)
    planningstatus_text_fr = Column('planningstatus_text_fr', Text)
    planningstatus_text_it = Column('planningstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description = Column('description', Text)
    web = Column('web', Text)
    bgdi_created = Column('bgdi_created', Text)
    __minscale__ = 50005
    __maxscale__ = 1000005

register('ch.bfe.sachplan-geologie-tiefenlager', sgt_planning)


class sgt_planning_raster(Base, Vector):
    __tablename__ = 'geologische_tiefenlager_raster'
    __table_args__ = ({'schema': 'bfe', 'autoload': False})
    __template__ = 'templates/htmlpopup/sgt_planning.mako'
    __bodId__ = 'ch.bfe.sachplan-geologie-tiefenlager'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    measurename_de = Column('measurename_de', Text)
    measurename_fr = Column('measurename_fr', Text)
    measurename_it = Column('measurename_it', Text)
    measuretype_text_de = Column('measuretype_text_de', Text)
    measuretype_text_fr = Column('measuretype_text_fr', Text)
    measuretype_text_it = Column('measuretype_text_it', Text)
    coordinationlevel_text_de = Column('coordinationlevel_text_de', Text)
    coordinationlevel_text_fr = Column('coordinationlevel_text_fr', Text)
    coordinationlevel_text_it = Column('coordinationlevel_text_it', Text)
    planningstatus_text_de = Column('planningstatus_text_de', Text)
    planningstatus_text_fr = Column('planningstatus_text_fr', Text)
    planningstatus_text_it = Column('planningstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description = Column('description', Text)
    web = Column('web', Text)
    bgdi_created = Column('bgdi_created', Text)
    __maxscale__ = 50005
    __minscale__ = 1
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bfe.sachplan-geologie-tiefenlager', sgt_planning_raster)


class sgt_facilities_td(Base, Vector):
    __tablename__ = 'geologische_tiefenlager_fac'
    __table_args__ = ({'schema': 'bfe', 'autoload': False, 'extend_existing': True})
    __template__ = 'templates/htmlpopup/sgt_facilities.mako'
    __bodId__ = 'ch.bfe.sachplan-geologie-tiefenlager-thematische-darstellung'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    fackind_text_de = Column('fackind_text_de', Text)
    fackind_text_fr = Column('fackind_text_fr', Text)
    fackind_text_it = Column('fackind_text_it', Text)
    facstatus_text_de = Column('facstatus_text_de', Text)
    facstatus_text_fr = Column('facstatus_text_fr', Text)
    facstatus_text_it = Column('facstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    description = Column('description', Text)
    web = Column('web', Text)
    objname_text_de = Column('objname_text_de', Text)
    objname_text_fr = Column('objname_text_fr', Text)
    objname_text_it = Column('objname_text_it', Text)
    bgdi_created = Column('bgdi_created', Text)
    __minscale__ = 200005
    __maxscale__ = 100000005
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bfe.sachplan-geologie-tiefenlager-thematische-darstellung', sgt_facilities_td)


class sgt_planning_td(Base, Vector):
    __tablename__ = 'geologische_tiefenlager'
    __table_args__ = ({'schema': 'bfe', 'autoload': False, 'extend_existing': True})
    __template__ = 'templates/htmlpopup/sgt_planning.mako'
    __bodId__ = 'ch.bfe.sachplan-geologie-tiefenlager-thematische-darstellung'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    measurename_de = Column('measurename_de', Text)
    measurename_fr = Column('measurename_fr', Text)
    measurename_it = Column('measurename_it', Text)
    measuretype_text_de = Column('measuretype_text_de', Text)
    measuretype_text_fr = Column('measuretype_text_fr', Text)
    measuretype_text_it = Column('measuretype_text_it', Text)
    coordinationlevel_text_de = Column('coordinationlevel_text_de', Text)
    coordinationlevel_text_fr = Column('coordinationlevel_text_fr', Text)
    coordinationlevel_text_it = Column('coordinationlevel_text_it', Text)
    planningstatus_text_de = Column('planningstatus_text_de', Text)
    planningstatus_text_fr = Column('planningstatus_text_fr', Text)
    planningstatus_text_it = Column('planningstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description = Column('description', Text)
    web = Column('web', Text)
    bgdi_created = Column('bgdi_created', Text)
    __minscale__ = 50005
    __maxscale__ = 1000005
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bfe.sachplan-geologie-tiefenlager-thematische-darstellung', sgt_planning_td)


class sgt_planning_raster_td(Base, Vector):
    __tablename__ = 'geologische_tiefenlager_raster'
    __table_args__ = ({'schema': 'bfe', 'autoload': False, 'extend_existing': True})
    __template__ = 'templates/htmlpopup/sgt_planning.mako'
    __bodId__ = 'ch.bfe.sachplan-geologie-tiefenlager-thematische-darstellung'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    measurename_de = Column('measurename_de', Text)
    measurename_fr = Column('measurename_fr', Text)
    measurename_it = Column('measurename_it', Text)
    measuretype_text_de = Column('measuretype_text_de', Text)
    measuretype_text_fr = Column('measuretype_text_fr', Text)
    measuretype_text_it = Column('measuretype_text_it', Text)
    coordinationlevel_text_de = Column('coordinationlevel_text_de', Text)
    coordinationlevel_text_fr = Column('coordinationlevel_text_fr', Text)
    coordinationlevel_text_it = Column('coordinationlevel_text_it', Text)
    planningstatus_text_de = Column('planningstatus_text_de', Text)
    planningstatus_text_fr = Column('planningstatus_text_fr', Text)
    planningstatus_text_it = Column('planningstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description = Column('description', Text)
    web = Column('web', Text)
    bgdi_created = Column('bgdi_created', Text)
    __maxscale__ = 50005
    __minscale__ = 1
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bfe.sachplan-geologie-tiefenlager-thematische-darstellung', sgt_planning_raster_td)


class sil_facilities_a(Base, Vector):
    __tablename__ = 'sachplan_inf_luft_facilities_anhorung'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __template__ = 'templates/htmlpopup/sil_facilities.mako'
    __bodId__ = 'ch.bazl.sachplan-infrastruktur-luftfahrt_anhorung'
    id = Column('stabil_id', Text, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    fackind_text_de = Column('fackind_text_de', Text)
    fackind_text_fr = Column('fackind_text_fr', Text)
    fackind_text_it = Column('fackind_text_it', Text)
    facstatus_text_de = Column('facstatus_text_de', Text)
    facstatus_text_fr = Column('facstatus_text_fr', Text)
    facstatus_text_it = Column('facstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    description_text_de = Column('description_text_de', Text)
    description_text_fr = Column('description_text_fr', Text)
    description_text_it = Column('description_text_it', Text)
    document_web = Column('document_web', Text)
    objectname_de = Column('objectname_de', Text)
    objectname_fr = Column('objectname_fr', Text)
    objectname_it = Column('objectname_it', Text)
    bgdi_created = Column('bgdi_created', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bazl.sachplan-infrastruktur-luftfahrt_anhorung', sil_facilities_a)


class sil_planning_a(Base, Vector):
    __tablename__ = 'sachplan_inf_luft_plmeasures_anhorung'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __template__ = 'templates/htmlpopup/sil_planning.mako'
    __bodId__ = 'ch.bazl.sachplan-infrastruktur-luftfahrt_anhorung'
    id = Column('stabil_id', Text, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    plname_de = Column('plname_de', Text)
    plname_fr = Column('plname_fr', Text)
    plname_it = Column('plname_it', Text)
    measuretype_text_de = Column('measuretype_text_de', Text)
    measuretype_text_fr = Column('measuretype_text_fr', Text)
    measuretype_text_it = Column('measuretype_text_it', Text)
    coordinationlevel_text_de = Column('coordinationlevel_text_de', Text)
    coordinationlevel_text_fr = Column('coordinationlevel_text_fr', Text)
    coordinationlevel_text_it = Column('coordinationlevel_text_it', Text)
    planningstatus_text_de = Column('planningstatus_text_de', Text)
    planningstatus_text_fr = Column('planningstatus_text_fr', Text)
    planningstatus_text_it = Column('planningstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description_text_de = Column('description_text_de', Text)
    description_text_fr = Column('description_text_fr', Text)
    description_text_it = Column('description_text_it', Text)
    document_web = Column('document_web', Text)
    bgdi_created = Column('bgdi_created', Text)
    __minscale__ = 50005
    __maxscale__ = 1000005
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bazl.sachplan-infrastruktur-luftfahrt_anhorung', sil_planning_a)


class sil_planning_raster_a(Base, Vector):
    __tablename__ = 'sachplan_inf_luft_plmeasures_r_anhorung'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __template__ = 'templates/htmlpopup/sil_planning.mako'
    __bodId__ = 'ch.bazl.sachplan-infrastruktur-luftfahrt_anhorung'
    id = Column('stabil_id', Text, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    plname_de = Column('plname_de', Text)
    plname_fr = Column('plname_fr', Text)
    plname_it = Column('plname_it', Text)
    measuretype_text_de = Column('measuretype_text_de', Text)
    measuretype_text_fr = Column('measuretype_text_fr', Text)
    measuretype_text_it = Column('measuretype_text_it', Text)
    coordinationlevel_text_de = Column('coordinationlevel_text_de', Text)
    coordinationlevel_text_fr = Column('coordinationlevel_text_fr', Text)
    coordinationlevel_text_it = Column('coordinationlevel_text_it', Text)
    planningstatus_text_de = Column('planningstatus_text_de', Text)
    planningstatus_text_fr = Column('planningstatus_text_fr', Text)
    planningstatus_text_it = Column('planningstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description_text_de = Column('description_text_de', Text)
    description_text_fr = Column('description_text_fr', Text)
    description_text_it = Column('description_text_it', Text)
    document_web = Column('document_web', Text)
    bgdi_created = Column('bgdi_created', Text)
    __maxscale__ = 50005
    __minscale__ = 1
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bazl.sachplan-infrastruktur-luftfahrt_anhorung', sil_planning_raster_a)


class sil_facilities_k(Base, Vector):
    __tablename__ = 'sachplan_inf_luft_facilities_kraft'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __template__ = 'templates/htmlpopup/sil_facilities.mako'
    __bodId__ = 'ch.bazl.sachplan-infrastruktur-luftfahrt_kraft'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    fackind_text_de = Column('fackind_text_de', Text)
    fackind_text_fr = Column('fackind_text_fr', Text)
    fackind_text_it = Column('fackind_text_it', Text)
    facstatus_text_de = Column('facstatus_text_de', Text)
    facstatus_text_fr = Column('facstatus_text_fr', Text)
    facstatus_text_it = Column('facstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    description_text_de = Column('description_text_de', Text)
    description_text_fr = Column('description_text_fr', Text)
    description_text_it = Column('description_text_it', Text)
    document_web = Column('document_web', Text)
    objectname_de = Column('objectname_de', Text)
    objectname_fr = Column('objectname_fr', Text)
    objectname_it = Column('objectname_it', Text)
    bgdi_created = Column('bgdi_created', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bazl.sachplan-infrastruktur-luftfahrt_kraft', sil_facilities_k)


class sil_planning_raster_k(Base, Vector):
    __tablename__ = 'sachplan_inf_luft_plmeasures_r_kraft'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __template__ = 'templates/htmlpopup/sil_planning.mako'
    __bodId__ = 'ch.bazl.sachplan-infrastruktur-luftfahrt_kraft'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    plname_de = Column('plname_de', Text)
    plname_fr = Column('plname_fr', Text)
    plname_it = Column('plname_it', Text)
    measuretype_text_de = Column('measuretype_text_de', Text)
    measuretype_text_fr = Column('measuretype_text_fr', Text)
    measuretype_text_it = Column('measuretype_text_it', Text)
    coordinationlevel_text_de = Column('coordinationlevel_text_de', Text)
    coordinationlevel_text_fr = Column('coordinationlevel_text_fr', Text)
    coordinationlevel_text_it = Column('coordinationlevel_text_it', Text)
    planningstatus_text_de = Column('planningstatus_text_de', Text)
    planningstatus_text_fr = Column('planningstatus_text_fr', Text)
    planningstatus_text_it = Column('planningstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description_text_de = Column('description_text_de', Text)
    description_text_fr = Column('description_text_fr', Text)
    description_text_it = Column('description_text_it', Text)
    document_web = Column('document_web', Text)
    bgdi_created = Column('bgdi_created', Text)
    __maxscale__ = 50005
    __minscale__ = 1
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bazl.sachplan-infrastruktur-luftfahrt_kraft', sil_planning_raster_k)


class nga_anbieter (Base, Vector):
    __tablename__ = 'nga_anbieter'
    __table_args__ = ({'schema': 'bakom', 'autoload': False})
    __template__ = 'templates/htmlpopup/ngamapping.mako'
    __bodId__ = 'ch.bakom.anbieter-eigenes_festnetz'
    id = Column('cellid', Integer, primary_key=True)
    alias = Column('alias', Text)
    fdaurl = Column('fdaurl', Text)
    nbofprovider = Column('nbofprovider', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bakom.anbieter-eigenes_festnetz', nga_anbieter)


class kernkraftwerke (Base, Vector):
    __tablename__ = 'kernkraftwerke'
    __table_args__ = ({'schema': 'bfe', 'autoload': False})
    __template__ = 'templates/htmlpopup/kernkraftwerke.mako'
    __bodId__ = 'ch.bfe.kernkraftwerke'
    __extended_info__ = True
    id = Column('plant_id', Text, primary_key=True)
    name = Column('name', Text)
    operator = Column('operator', Text)
    owner = Column('owner', Text)
    enforcement_1 = Column('enforcement_1', Text)
    enforcement_2 = Column('enforcement_2', Text)
    enforcement_3 = Column('enforcement_3', Text)
    regulatory = Column('regulatory', Text)
    license_de = Column('license_de', Text)
    license_fr = Column('license_fr', Text)
    license_it = Column('license_it', Text)
    license_en = Column('license_en', Text)
    municipality = Column('municipality', Text)
    canton = Column('canton', Text)
    reactor_name = Column('reactor_name', Text)
    reactors = Column('reactors', Integer)
    life_phase_de = Column('life_phase_de', Text)
    life_phase_fr = Column('life_phase_fr', Text)
    life_phase_it = Column('life_phase_it', Text)
    life_phase_en = Column('life_phase_en', Text)
    reactor_type_de = Column('reactor_type_de', Text)
    reactor_type_fr = Column('reactor_type_fr', Text)
    reactor_type_it = Column('reactor_type_it', Text)
    reactor_type_en = Column('reactor_type_en', Text)
    cooling_type_de = Column('cooling_type_de', Text)
    cooling_type_fr = Column('cooling_type_fr', Text)
    cooling_type_it = Column('cooling_type_it', Text)
    cooling_type_en = Column('cooling_type_en', Text)
    nominal_thermal_output = Column('nominal_thermal_output', Text)
    gross_el_output = Column('gross_el_output', Text)
    net_el_output = Column('net_el_output', Text)
    construction_phase = Column('construction_phase', Text)
    commissioning_phase = Column('commissioning_phase', Text)
    operation_phase = Column('operation_phase', Text)
    decontamination_phase = Column('decontamination_phase', Text)
    dismantling_phase = Column('dismantling_phase', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bfe.kernkraftwerke', kernkraftwerke)


class sis_facilities_a (Base, Vector):
    __tablename__ = 'sis_fac_anhorung'
    __table_args__ = ({'schema': 'bav', 'autoload': False})
    __bodId__ = 'ch.bav.sachplan-infrastruktur-schiene_anhorung'
    __template__ = 'templates/htmlpopup/sis_facilities.mako'
    #__queryable_attributes__ = ['facname_de', 'facname_fr', 'facname_it', 'doc_title']
    id = Column('stabil_id', Text, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    fackind_text_de = Column('fackind_text_de', Text)
    fackind_text_fr = Column('fackind_text_fr', Text)
    fackind_text_it = Column('fackind_text_it', Text)
    facstatus_text_de = Column('facstatus_text_de', Text)
    facstatus_text_fr = Column('facstatus_text_fr', Text)
    facstatus_text_it = Column('facstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    description_de = Column('description_de', Text)
    description_fr = Column('description_fr', Text)
    description_it = Column('description_it', Text)
    doc_web = Column('doc_web', Text)
    document_title = Column('doc_title', Text)
    objname_de = Column('objname_de', Text)
    objname_fr = Column('objname_fr', Text)
    objname_it = Column('objname_it', Text)
    bgdi_created = Column('bgdi_created', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bav.sachplan-infrastruktur-schiene_anhorung', sis_facilities_a)


class sis_planning_a (Base, Vector):
    __tablename__ = 'sis_pl_anhorung'
    __table_args__ = ({'schema': 'bav', 'autoload': False})
    __template__ = 'templates/htmlpopup/sis_planning.mako'
    __bodId__ = 'ch.bav.sachplan-infrastruktur-schiene_anhorung'
    #__queryable_attributes__ = ['plname_de', 'plname_fr', 'plname_it', 'doc_title']
    id = Column('stabil_id', Text, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    plname_de = Column('plname_de', Text)
    plname_fr = Column('plname_fr', Text)
    plname_it = Column('plname_it', Text)
    meastype_text_de = Column('meastype_text_de', Text)
    meastype_text_fr = Column('meastype_text_fr', Text)
    meastype_text_it = Column('meastype_text_it', Text)
    coordlevel_text_de = Column('coordlevel_text_de', Text)
    coordlevel_text_fr = Column('coordlevel_text_fr', Text)
    coordlevel_text_it = Column('coordlevel_text_it', Text)
    plstatus_text_de = Column('plstatus_text_de', Text)
    plstatus_text_fr = Column('plstatus_text_fr', Text)
    plstatus_text_it = Column('plstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description_de = Column('description_de', Text)
    description_fr = Column('description_fr', Text)
    description_it = Column('description_it', Text)
    doc_web = Column('doc_web', Text)
    doc_title = Column('doc_title', Text)
    bgdi_created = Column('bgdi_created', Text)
    __minscale__ = 50005
    __maxscale__ = 1000005
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bav.sachplan-infrastruktur-schiene_anhorung', sis_planning_a)


class sis_angaben (Base, Vector):
    __tablename__ = 'sis_angaben'
    __table_args__ = ({'schema': 'bav', 'autoload': False})
    __template__ = 'templates/htmlpopup/sis_angaben.mako'
    __bodId__ = 'ch.bav.sachplan-infrastruktur-schiene_ausgangslage'
    #__queryable_attributes__ = ['name', 'description_de', 'description_fr', 'description_it', 'description_en']
    id = Column('anlage_id', Text, primary_key=True)
    name = Column('name', Text)
    description_de = Column('description_de', Text)
    description_fr = Column('description_fr', Text)
    description_it = Column('description_it', Text)
    facstatus_text_de = Column('facstatus_text_de', Text)
    facstatus_text_fr = Column('facstatus_text_fr', Text)
    facstatus_text_it = Column('facstatus_text_it', Text)
    fackind_text_de = Column('fackind_text_de', Text)
    fackind_text_fr = Column('fackind_text_fr', Text)
    fackind_text_it = Column('fackind_text_it', Text)
    valid_from = Column('valid_from', Text)
    doc_title = Column('doc_title', Text)
    bgdi_created = Column('bgdi_created', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bav.sachplan-infrastruktur-schiene_ausgangslage', sis_angaben)


class sis_planning_raster_a (Base, Vector):
    __tablename__ = 'sis_pl_r_anhorung'
    __table_args__ = ({'schema': 'bav', 'autoload': False})
    __template__ = 'templates/htmlpopup/sis_planning.mako'
    __bodId__ = 'ch.bav.sachplan-infrastruktur-schiene_anhorung'
    #__queryable_attributes__ = ['plname_de', 'plname_fr', 'plname_it', 'doc_title']
    id = Column('stabil_id', Text, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    plname_de = Column('plname_de', Text)
    plname_fr = Column('plname_fr', Text)
    plname_it = Column('plname_it', Text)
    meastype_text_de = Column('meastype_text_de', Text)
    meastype_text_fr = Column('meastype_text_fr', Text)
    meastype_text_it = Column('meastype_text_it', Text)
    coordlevel_text_de = Column('coordlevel_text_de', Text)
    coordlevel_text_fr = Column('coordlevel_text_fr', Text)
    coordlevel_text_it = Column('coordlevel_text_it', Text)
    plstatus_text_de = Column('plstatus_text_de', Text)
    plstatus_text_fr = Column('plstatus_text_fr', Text)
    plstatus_text_it = Column('plstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description_de = Column('description_de', Text)
    description_fr = Column('description_fr', Text)
    description_it = Column('description_it', Text)
    doc_web = Column('doc_web', Text)
    doc_title = Column('doc_title', Text)
    bgdi_created = Column('bgdi_created', Text)
    __maxscale__ = 50005
    __minscale__ = 1
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bav.sachplan-infrastruktur-schiene_anhorung', sis_planning_raster_a)


class sis_facilities_k (Base, Vector):
    __tablename__ = 'sis_fac_kraft'
    __table_args__ = ({'schema': 'bav', 'autoload': False})
    __template__ = 'templates/htmlpopup/sis_facilities.mako'
    __bodId__ = 'ch.bav.sachplan-infrastruktur-schiene_kraft'
    #__queryable_attributes__ = ['facname_de', 'facname_fr', 'facname_it', 'doc_title']
    id = Column('stabil_id', Text, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    fackind_text_de = Column('fackind_text_de', Text)
    fackind_text_fr = Column('fackind_text_fr', Text)
    fackind_text_it = Column('fackind_text_it', Text)
    facstatus_text_de = Column('facstatus_text_de', Text)
    facstatus_text_fr = Column('facstatus_text_fr', Text)
    facstatus_text_it = Column('facstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    description_de = Column('description_de', Text)
    description_fr = Column('description_fr', Text)
    description_it = Column('description_it', Text)
    doc_web = Column('doc_web', Text)
    doc_title = Column('doc_title', Text)
    objname_de = Column('objname_de', Text)
    objname_fr = Column('objname_fr', Text)
    objname_it = Column('objname_it', Text)
    bgdi_created = Column('bgdi_created', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bav.sachplan-infrastruktur-schiene_kraft', sis_facilities_k)


class sis_planning_k (Base, Vector):
    __tablename__ = 'sis_pl_kraft'
    __table_args__ = ({'schema': 'bav', 'autoload': False})
    __template__ = 'templates/htmlpopup/sis_planning.mako'
    __bodId__ = 'ch.bav.sachplan-infrastruktur-schiene_kraft'
    #__queryable_attributes__ = ['plname_de', 'plname_fr', 'plname_it', 'doc_title']
    id = Column('stabil_id', Text, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    plname_de = Column('plname_de', Text)
    plname_fr = Column('plname_fr', Text)
    plname_it = Column('plname_it', Text)
    meastype_text_de = Column('meastype_text_de', Text)
    meastype_text_fr = Column('meastype_text_fr', Text)
    meastype_text_it = Column('meastype_text_it', Text)
    coordlevel_text_de = Column('coordlevel_text_de', Text)
    coordlevel_text_fr = Column('coordlevel_text_fr', Text)
    coordlevel_text_it = Column('coordlevel_text_it', Text)
    plstatus_text_de = Column('plstatus_text_de', Text)
    plstatus_text_fr = Column('plstatus_text_fr', Text)
    plstatus_text_it = Column('plstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description_de = Column('description_de', Text)
    description_fr = Column('description_fr', Text)
    description_it = Column('description_it', Text)
    doc_web = Column('doc_web', Text)
    doc_title = Column('doc_title', Text)
    bgdi_created = Column('bgdi_created', Text)
    __minscale__ = 50005
    __maxscale__ = 1000005
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bav.sachplan-infrastruktur-schiene_kraft', sis_planning_k)


class sis_planning_raster_k (Base, Vector):
    __tablename__ = 'sis_pl_r_kraft'
    __table_args__ = ({'schema': 'bav', 'autoload': False})
    __template__ = 'templates/htmlpopup/sis_planning.mako'
    __bodId__ = 'ch.bav.sachplan-infrastruktur-schiene_kraft'
    #__queryable_attributes__ = ['plname_de', 'plname_fr', 'plname_it', 'doc_title']
    id = Column('stabil_id', Text, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    plname_de = Column('plname_de', Text)
    plname_fr = Column('plname_fr', Text)
    plname_it = Column('plname_it', Text)
    meastype_text_de = Column('meastype_text_de', Text)
    meastype_text_fr = Column('meastype_text_fr', Text)
    meastype_text_it = Column('meastype_text_it', Text)
    coordlevel_text_de = Column('coordlevel_text_de', Text)
    coordlevel_text_fr = Column('coordlevel_text_fr', Text)
    coordlevel_text_it = Column('coordlevel_text_it', Text)
    plstatus_text_de = Column('plstatus_text_de', Text)
    plstatus_text_fr = Column('plstatus_text_fr', Text)
    plstatus_text_it = Column('plstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description_de = Column('description_de', Text)
    description_fr = Column('description_fr', Text)
    description_it = Column('description_it', Text)
    doc_web = Column('doc_web', Text)
    doc_title = Column('doc_title', Text)
    bgdi_created = Column('bgdi_created', Text)
    __maxscale__ = 50005
    __minscale__ = 1
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.bav.sachplan-infrastruktur-schiene_kraft', sis_planning_raster_k)
