# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from sqlalchemy.types import Numeric
from geoalchemy2.types import Geometry

from chsdi.models import register, bases
from chsdi.models.vector import Vector


Base = bases['bafu']


class Vec25_gewaessernetz_2000(Base, Vector):
    __tablename__ = 'gewaessernetz_2000'
    __table_args__ = ({'schema': 'vec25', 'autoload': False})
    __bodId__ = 'ch.bafu.vec25-gewaessernetz_2000'
    __template__ = 'templates/htmlpopup/vec25-gewaessernetz_2000.mako'
    __label__ = 'name'
    __queryable_attributes__ = ['gwlnr', 'gewissnr', 'name', 'objectval']
    id = Column('bgdi_id', Integer, primary_key=True)
    name = Column('name', Text)
    objectval = Column('objectval', Text)
    gewissnr = Column('gewissnr', Integer)
    gwlnr = Column('gwlnr', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.vec25-gewaessernetz_2000', Vec25_gewaessernetz_2000)


class Untersuchungsgebiete(Base, Vector):
    __tablename__ = 'hydrologie_untersuchungsgebiete'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.hydrologie-untersuchungsgebiete'
    __template__ = 'templates/htmlpopup/hug.mako'
    __queryable_attributes__ = ['name', 'shape_area', 'max_hoe', 'min_hoe', 'mit_hoe', 'station', 'regimetyp', 'df', 'sc', 'ms', 'mp', 'antws_tot', 'antwiack', 'antogr', 'antweid', 'antunpr', 'antgeb', 'antindu', 'antgew_ms', 'antveg_los_ov', 'antv_ab86']
    __extended_info__ = True
    __label__ = 'name'
    id = Column('bgdi_id', Integer, primary_key=True)
    name = Column('name', Text)
    max_hoe = Column('max_hoe', Integer)
    min_hoe = Column('min_hoe', Integer)
    mit_hoe = Column('mit_hoe', Integer)
    station = Column('station', Text)
    regimtyp = Column('regimetyp', Text)
    df = Column('df', Numeric)
    sc = Column('sc', Numeric)
    ms = Column('ms', Numeric)
    mp = Column('mp', Numeric)
    antws_tot = Column('antws_tot', Numeric)
    antogr = Column('antogr', Numeric)
    antwiack = Column('antwiack', Numeric)
    antweid = Column('antweid', Numeric)
    antunpr = Column('antunpr', Numeric)
    antgeb = Column('antgeb', Numeric)
    antindu = Column('antindu', Numeric)
    antgew_ms = Column('antgew_ms', Numeric)
    antveg_los_ov = Column('antveg_los_ov', Numeric)
    antv_ab86 = Column('antv_ab86', Numeric)
    hyperlink = Column('hyperlink', Text)
    shape_area = Column('shape_area', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.hydrologie-untersuchungsgebiete', Untersuchungsgebiete)


class Hochwassergrenzwertpegel(Base, Vector):
    __tablename__ = 'hochwassergrenzwertpegel'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.hydrologie-hochwassergrenzwertpegel'
    __template__ = 'templates/htmlpopup/hochwassergrenzwertpegel.mako'
    __queryable_attributes__ = ['name', 'hoehe', 'einzugsgebietsflaeche', 'nummer', 'fluss', 'm_ende', 'm_beginn']
    __extended_info__ = True
    __label__ = 'name'
    id = Column('bgdi_id', Integer, primary_key=True)
    name = Column('name', Text)
    nummer = Column('nummer', Text)
    datenherkunft = Column('datenherkunft', Text)
    rechtswert = Column('rechtswert', Numeric)
    hochwert = Column('hochwert', Numeric)
    hoehe = Column('hoehe', Numeric)
    einzugsgebietsflaeche = Column('einzugsgebietsflaeche', Numeric)
    fluss = Column('fluss', Text)
    m_beginn = Column('m_beginn', Text)
    m_ende = Column('m_ende', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.hydrologie-hochwassergrenzwertpegel', Hochwassergrenzwertpegel)


class Atlas_kantonale_messstationen(Base, Vector):
    __tablename__ = 'hydro_atlas_kant_messstationen'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.hydrologischer-atlas_kantonale-messstationen'
    __template__ = 'templates/htmlpopup/atlas_kantonale_messstationen.mako'
    __queryable_attributes__ = ['hoehe', 'betriebsbeginn', 'einzugsgebietsflaeche', 'nummer', 'vergletscherung', 'bilanzgebietsnummer']
    __extended_info__ = True
    __label__ = 'name'
    id = Column('bgdi_id', Integer, primary_key=True)
    name = Column('name', Text)
    nummer = Column('nummer', Text)
    datenherkunft = Column('datenherkunft', Text)
    rechtswert = Column('rechtswert', Numeric)
    hochwert = Column('hochwert', Numeric)
    hoehe = Column('hoehe', Numeric)
    betriebsbeginn = Column('betriebsbeginn', Numeric)
    einzugsgebietsflaeche = Column('einzugsgebietsflaeche', Numeric)
    bilanzgebietsnummer = Column('bilanzgebietsnummer', Integer)
    vergletscherung = Column('vergletscherung', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.hydrologischer-atlas_kantonale-messstationen', Atlas_kantonale_messstationen)


class Daueruntersuchung_fliessgewaesser(Base, Vector):
    __tablename__ = 'hydro_duntersuchung_fliessgewaesser'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser'
    __template__ = 'templates/htmlpopup/daueruntersuchung_fliessgewaesser.mako'
    __queryable_attributes__ = ['name', 'hoehe', 'betriebsbeginn', 'einzugsgebietsflaeche', 'mittlerehoehe', 'vergletscherung', 'stationierung', 'flussgebiet']
    __extended_info__ = True
    __label__ = 'name'
    id = Column('bgdi_id', Integer, primary_key=True)
    name = Column('name', Text)
    rechtswert = Column('rechtswert', Text)
    hochwert = Column('hochwert', Text)
    hoehe = Column('hoehe', Text)
    betriebsbeginn = Column('betriebsbeginn', Text)
    einzugsgebietsflaeche = Column('einzugsgebietsflaeche', Text)
    mittlerehoehe = Column('mittlerehoehe', Text)
    vergletscherung = Column('vergletscherung', Text)
    stationierung = Column('stationierung', Text)
    flussgebiet = Column('flussgebiet', Text)
    hyperlink_d = Column('hyperlink_d', Text)
    hyperlink_f = Column('hyperlink_f', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser', Daueruntersuchung_fliessgewaesser)


class Vec25_seen(Base, Vector):
    __tablename__ = 'seen'
    __table_args__ = ({'schema': 'vec25', 'autoload': False})
    __bodId__ = 'ch.bafu.vec25-seen'
    __template__ = 'templates/htmlpopup/vec25_seen.mako'
    __extended_info__ = True
    __label__ = 'name'
    __queryable_attributes__ = ['gewaesserkennzahl', 'name', 'seetyp', 'ausgleichsbecken', 'reguliert', 'seeflaeche_km2', 'inhalt_see_mio_m3', 'nutzinhalt_mio_m3', 'tiefe_see_m', 'hoehenlage_muem', 'uferlaenge_m', 'gwlnr']
    id = Column('bgdi_id', Integer, primary_key=True)
    name = Column('name', Text)
    gewaesserkennzahl = Column('gewaesserkennzahl', Integer)
    seetyp = Column('seetyp', Integer)
    natur_mit = Column('natur_mit', Integer)
    ausgleichsbecken = Column('ausgleichsbecken', Numeric)
    reguliert = Column('reguliert', Integer)
    seeflaeche_km2 = Column('seeflaeche_km2', Numeric)
    inhalt_see_mio_m3 = Column('inhalt_see_mio_m3', Numeric)
    nutzinhalt_mio_m3 = Column('nutzinhalt_mio_m3', Numeric)
    tiefe_see_m = Column('tiefe_see_m', Integer)
    hoehenlage_muem = Column('hoehenlage_muem', Integer)
    uferlaenge_m = Column('uferlaenge_m', Integer)
    gwlnr = Column('gwlnr', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.vec25-seen', Vec25_seen)


class Hydro_Atlas_Flussgebiete(Base, Vector):
    __tablename__ = 'atlas_flussgebiete'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.hydrologischer-atlas_flussgebiete'
    __template__ = 'templates/htmlpopup/atlas_flussgebiete.mako'
    __label__ = 'name'
    __queryable_attributes__ = ['nummer', 'name', 'shape_area', 'umfang']
    id = Column('bgdi_id', Integer, primary_key=True)
    name = Column('name', Text)
    nummer = Column('nummer', Integer)
    flussgebiet = Column('flussgebiet', Integer)
    shape_area = Column('shape_area', Numeric)
    umfang = Column('umfang', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.hydrologischer-atlas_flussgebiete', Hydro_Atlas_Flussgebiete)


class Hydro_Atlas_Bilanzgebiete(Base, Vector):
    __tablename__ = 'atlas_bilanzgebiete'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.hydrologischer-atlas_bilanzgebiete'
    __template__ = 'templates/htmlpopup/atlas_bilanzgebiete.mako'
    __label__ = 'name'
    __queryable_attributes__ = ['name', 'flussgebiet', 'shape_area']
    id = Column('bgdi_id', Integer, primary_key=True)
    name = Column('name', Text)
    nummer = Column('nummer', Integer)
    flussgebiet = Column('flussgebiet', Integer)
    shape_area = Column('shape_area', Numeric)
    umfang = Column('umfang', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.hydrologischer-atlas_bilanzgebiete', Hydro_Atlas_Bilanzgebiete)


class Hydro_Atlas_Basisgebiete(Base, Vector):
    __tablename__ = 'atlas_basisgebiete'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.hydrologischer-atlas_basisgebiete'
    __template__ = 'templates/htmlpopup/atlas_basisgebiete.mako'
    __extended_info__ = True
    __label__ = 'nummer'
    __queryable_attributes__ = ['gebietskennzahl', 'bemerkung', 'flussgebiet', 'max_hoe', 'min_hoe', 'mit_hoe', 'mit_ns', 's_w_ns', 'jahrtemp_g', 'winttemp_g', 'shape_area']
    id = Column('bgdi_id', Integer, primary_key=True)
    nummer = Column('nummer', Integer)
    gebietskennzahl = Column('gebietskennzahl', Integer)
    bemerkung = Column('bemerkung', Text)
    flussgebiet = Column('flussgebiet', Integer)
    max_hoe = Column('max_hoe', Integer)
    min_hoe = Column('min_hoe', Integer)
    mit_hoe = Column('mit_hoe', Numeric)
    mit_ns = Column('mit_ns', Numeric)
    s_w_ns = Column('s_w_ns', Numeric)
    jahrtemp_g = Column('jahrtemp_g', Numeric)
    winttemp_g = Column('winttemp_g', Numeric)
    shape_area = Column('shape_area', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.hydrologischer-atlas_basisgebiete', Hydro_Atlas_Basisgebiete)


class Niedrigwasserstatistik(Base, Vector):
    __tablename__ = 'niedrigwasserstatistik'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.hydrologie-niedrigwasserstatistik'
    __template__ = 'templates/htmlpopup/niedrigwasserstatistik.mako'
    __extended_info__ = True
    __label__ = 'name'
    __queryable_attributes__ = ['kennnr', 'name', 'gebflaeche', 'beginn', 'ende', 'beeinflussung', 'genauigkeit', 'anz_jahre', 'nm1q100', 'nm1q50', 'nm1q20', 'nm1q10', 'nm1q5', 'nm1q2', 'nm7q100', 'nm7q50', 'nm7q20', 'nm7q10', 'nm7q5', 'nm7q2', 'nm14q100', 'nm14q50', 'nm14q20', 'nm14q10', 'nm14q5', 'nm14q2', 'nm30q100', 'nm30q50', 'nm30q20', 'nm30q10', 'nm30q5', 'nm30q2']
    id = Column('bgdi_id', Integer, primary_key=True)
    kennnr = Column('kennnr', Numeric)
    name = Column('name', Text)
    gebflaeche = Column('gebflaeche', Numeric)
    coord_x = Column('coord_x', Numeric)
    coord_y = Column('coord_y', Numeric)
    beginn = Column('beginn', Numeric)
    ende = Column('ende', Numeric)
    beeinflussung = Column('beeinflussung', Text)
    genauigkeit = Column('genauigkeit', Text)
    anz_jahre = Column('anz_jahre', Integer)
    nm1q100 = Column('nm1q100', Numeric)
    nm1q50 = Column('nm1q50', Numeric)
    nm1q20 = Column('nm1q20', Numeric)
    nm1q10 = Column('nm1q10', Numeric)
    nm1q5 = Column('nm1q5', Numeric)
    nm1q2 = Column('nm1q2', Numeric)
    nm7q100 = Column('nm7q100', Numeric)
    nm7q50 = Column('nm7q50', Numeric)
    nm7q20 = Column('nm7q20', Numeric)
    nm7q10 = Column('nm7q10', Numeric)
    nm7q5 = Column('nm7q5', Numeric)
    nm7q2 = Column('nm7q2', Numeric)
    nm14q100 = Column('nm14q100', Numeric)
    nm14q50 = Column('nm14q50', Numeric)
    nm14q20 = Column('nm14q20', Numeric)
    nm14q10 = Column('nm14q10', Numeric)
    nm14q5 = Column('nm14q5', Numeric)
    nm14q2 = Column('nm14q2', Numeric)
    nm30q100 = Column('nm30q100', Numeric)
    nm30q50 = Column('nm30q50', Numeric)
    nm30q20 = Column('nm30q20', Numeric)
    nm30q10 = Column('nm30q10', Numeric)
    nm30q5 = Column('nm30q5', Numeric)
    nm30q2 = Column('nm30q2', Numeric)
    hyperlink_de = Column('hyperlink_d', Text)
    hyperlink_fr = Column('hyperlink_f', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.hydrologie-niedrigwasserstatistik', Niedrigwasserstatistik)


class Typ_fliessgewaesser(Base, Vector):
    __tablename__ = 'typ_fliessgewaesser'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.typisierung-fliessgewaesser'
    __template__ = 'templates/htmlpopup/fliessgewaesser_typ.mako'
    __extended_info__ = True
    __label__ = 'objectid_gwn25'
    __queryable_attributes__ = ['objectid_gwn25', 'grosserfluss', 'biogeo', 'hoehe', 'abfluss', 'gefaelle', 'geo', 'code', 'gewaessertyp', 'aehnlichkeit']
    id = Column('bgdi_id', Integer, primary_key=True)
    gewaessertyp = Column('gewaessertyp', Integer)
    grosserfluss = Column('grosserfluss', Text)
    objectid_gwn25 = Column('objectid_gwn25', Integer)
    biogeo = Column('biogeo', Text)
    hoehe = Column('hoehe', Text)
    abfluss = Column('abfluss', Text)
    gefaelle = Column('gefaelle', Text)
    geo = Column('geo', Text)
    code = Column('code', Integer)
    objectid_gwn25 = Column('objectid_gwn25', Integer)
    aehnlichkeit = Column('aehnlichkeit', Integer)
    shape_length = Column('shape_length', Numeric)
    url_portraits = Column('url_portraits', Text)
    url_uebersicht_de = Column('url_uebersicht_de', Text)
    url_uebersicht_fr = Column('url_uebersicht_fr', Text)
    name = Column('name', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.typisierung-fliessgewaesser', Typ_fliessgewaesser)


class Wasser_Vermessungsstrecken(Base, Vector):
    __tablename__ = 'vermessungsstrecken'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.wasserbau-vermessungsstrecken'
    __template__ = 'templates/htmlpopup/vermessungsstrecken.mako'
    __extended_info__ = True
    __label__ = 'bezeichnung'
    __queryable_attributes__ = ['gewaessernummer', 'streckenid', 'bezeichnung', 'gwlnr']
    id = Column('bgdi_id', Integer, primary_key=True)
    bezeichnung = Column('bezeichnung', Text)
    routeid = Column('routeid', Integer)
    gewaessernummer = Column('gewaessernummer', Text)
    bemerkung = Column('bemerkung', Text)
    anfangsmass = Column('anfangsmass', Numeric)
    endmass = Column('endmass', Numeric)
    streckenid = Column('streckenid', Integer)
    bezeichnung = Column('bezeichnung', Text)
    laenge_km = Column('laenge_km', Numeric)
    anzahl_profile = Column('anzahl_profile', Integer)
    aufnahme_intervall = Column('aufnahme_intervall', Integer)
    aufnahme_letzte = Column('aufnahme_letzte', Integer)
    gwlnr = Column('gwlnr', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.wasserbau-vermessungsstrecken', Wasser_Vermessungsstrecken)


class Mittlere_abfluesse(Base, Vector):
    __tablename__ = 'mittlere_abfluesse'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.mittlere-abfluesse'
    __template__ = 'templates/htmlpopup/mittlere_abfluesse.mako'
    __extended_info__ = True
    __label__ = 'regimenummer'
    __queryable_attributes__ = ['mqn_jahr', 'mqn_jan', 'mqn_feb', 'mqn_mar', 'mqn_apr', 'mqn_mai', 'mqn_jun', 'mqn_jul', 'mqn_aug', 'mqn_sep', 'mqn_okt', 'mqn_nov', 'mqn_dez', 'regimetyp', 'regimenummer', 'abflussvar']
    id = Column('bgdi_id', Integer, primary_key=True)
    mqn_jahr = Column('mqn_jahr', Numeric)
    mqn_jan = Column('mqn_jan', Numeric)
    mqn_feb = Column('mqn_feb', Numeric)
    mqn_mar = Column('mqn_mar', Numeric)
    mqn_apr = Column('mqn_apr', Numeric)
    mqn_mai = Column('mqn_mai', Numeric)
    mqn_jun = Column('mqn_jun', Numeric)
    mqn_jul = Column('mqn_jul', Numeric)
    mqn_aug = Column('mqn_aug', Numeric)
    mqn_sep = Column('mqn_sep', Numeric)
    mqn_okt = Column('mqn_okt', Numeric)
    mqn_nov = Column('mqn_nov', Numeric)
    mqn_dez = Column('mqn_dez', Numeric)
    regimetyp = Column('regimetyp', Text)
    regimenummer = Column('regimenummer', Integer)
    abflussvar = Column('abflussvar', Integer)
    the_geom = Column(Geometry(geometry_type='GEOMETRY', dimension=2, srid=21781))

register('ch.bafu.mittlere-abfluesse', Mittlere_abfluesse)


class Wasserbau_querprofilmarken(Base, Vector):
    __tablename__ = 'querprofilmarken'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.wasserbau-querprofilmarken'
    __template__ = 'templates/htmlpopup/querprofilmarken.mako'
    __extended_info__ = True
    __label__ = 'schluesselid'
    __queryable_attributes__ = ['typ', 'herkunft']
    id = Column('bgdi_id', Integer, primary_key=True)
    schluesselid = Column('schluesselid', Integer)
    typ = Column('typ', Text)
    x_koordinate = Column('x_koordinate', Numeric)
    y_koordinate = Column('y_koordinate', Numeric)
    azimut = Column('azimut', Integer)
    herkunft = Column('herkunft', Text)
    bemerkung = Column('bemerkung', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY', dimension=2, srid=21781))

register('ch.bafu.wasserbau-querprofilmarken', Wasserbau_querprofilmarken)


class Feststoffe_geschiebemessnetz(Base, Vector):
    __tablename__ = 'geschiebemessnetz'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.feststoffe-geschiebemessnetz'
    __template__ = 'templates/htmlpopup/geschiebemessnetz.mako'
    __extended_info__ = True
    __label__ = 'fluss'
    __queryable_attributes__ = ['gsch_n', 'lk', 'lage', 'fn', 'hmax', 'hmin', 'hmed', 'exp', 'form', 'geologie', 'platz', 'fluss', 'station', 'institut', 'amt']
    id = Column('bgdi_id', Integer, primary_key=True)
    rechtswert = Column('rechtswert', Integer)
    hochwert = Column('hochwert', Text)
    gsch_n = Column('gsch_n', Numeric)
    lk = Column('lk', Numeric)
    lage = Column('lage', Integer)
    fn = Column('fn', Numeric)
    hmax = Column('hmax', Numeric)
    hmin = Column('hmin', Numeric)
    hmed = Column('hmed', Numeric)
    exp = Column('exp', Text)
    form = Column('form', Numeric)
    geologie = Column('geologie', Text)
    platz = Column('platz', Text)
    fluss = Column('fluss', Text)
    station = Column('station', Text)
    institut = Column('institut', Text)
    amt = Column('amt', Text)
    abteilung = Column('abteilung', Text)
    sektion = Column('sektion', Text)
    kontakt_name = Column('kontakt_name', Text)
    strasse = Column('strasse', Text)
    plz = Column('plz', Text)
    ort = Column('ort', Text)
    sachbearb = Column('sachbearb', Text)
    telephon = Column('telephon', Text)
    fax = Column('fax', Text)
    emailadresse1 = Column('emailadresse1', Text)
    emailadresse2 = Column('emailadresse2', Text)
    pdf_file = Column('pdf_file', Text)
    lage_de = Column('lage_de', Text)
    lage_fr = Column('lage_fr', Text)
    platz_de = Column('platz_de', Text)
    platz_fr = Column('platz_fr', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY', dimension=2, srid=21781))

register('ch.bafu.feststoffe-geschiebemessnetz', Feststoffe_geschiebemessnetz)


class Hydro_q347(Base, Vector):
    __tablename__ = 'hydro_q347'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.hydrologie-q347'
    __template__ = 'templates/htmlpopup/hydro_q347.mako'
    __extended_info__ = True
    __label__ = 'gewaesser'
    __queryable_attributes__ = ['basisid', 'lhg', 'gewaesser', 'flaeche', 'q_84_93', 'qp', 'p', 'qmod']
    id = Column('bgdi_id', Integer, primary_key=True)
    gewaesser = Column('gewaesser', Text)
    bilanzid = Column('bilanzid', Text)
    id_q347 = Column('id', Integer)
    basisid = Column('basisid', Text)
    lhg = Column('lhg', Text)
    gewaesser = Column('gewaesser', Text)
    flaeche = Column('flaeche', Numeric)
    q_84_93 = Column('q_84_93', Numeric)
    qp = Column('qp', Numeric)
    p = Column('p', Text)
    qmod = Column('qmod', Numeric)
    bemerkung = Column('bemerkung', Text)
    symbolisierung = Column('symbolisierung', Integer)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
register('ch.bafu.hydrologie-q347', Hydro_q347)


class HUG_stationen(Base, Vector):
    __tablename__ = 'hydrologie_untersuchungsgebiete_stationen'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.hydrologie-untersuchungsgebiete_stationen'
    __template__ = 'templates/htmlpopup/hug_stationen.mako'
    __queryable_attributes__ = ['name', 'hoehe', 'betriebsbeginn', 'einzugsgebietsflaeche', 'mittlerehoehe', 'vergletscherung', 'stationierung', 'flussgebiet']
    __label__ = 'name'
    __extended_info__ = True
    id = Column('geodb_oid', Integer, primary_key=True)
    name = Column('name', Text)
    hochwert = Column('hochwert', Integer)
    rechtswert = Column('rechtswert', Integer)
    hoehe = Column('hoehe', Integer)
    betriebsbeginn = Column('betriebsbeginn', Integer)
    einzugsgebietsflaeche = Column('einzugsgebietsflaeche', Numeric)
    mittlerehoehe = Column('mittlerehoehe', Integer)
    vergletscherung = Column('vergletscherung', Numeric)
    stationierung = Column('stationierung', Numeric)
    flussgebiet = Column('flussgebiet', Text)
    hyperlink_f = Column('hyperlink_f', Text)
    hyperlink_d = Column('hyperlink_d', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.hydrologie-untersuchungsgebiete_stationen', HUG_stationen)


class Hintergrundkarte(Base, Vector):
    __tablename__ = 'hydrologie_hintergrundkarte'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.hydrologie-hintergrundkarte'
    __label__ = 'name'
    id = Column('bgdi_id', Integer, primary_key=True)
    name = Column('name', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.hydrologie-hintergrundkarte', Hintergrundkarte)


class Strukturguete_hochrhein_linkesufer(Base, Vector):
    __tablename__ = 'strukturguete_hochrhein'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.strukturguete-hochrhein_linkesufer'
    __template__ = 'templates/htmlpopup/strukturguete_hochrhein.mako'
    __queryable_attributes__ = ['lumfeld', 'rumfeld', 'lufer', 'rufer', 'sohle']
    __label__ = 'id'
    id = Column('bgdi_id', Integer, primary_key=True)
    datenherkunft = Column('datenherkunft', Text)
    lumfeld = Column('l_umfeld', Integer)
    rumfeld = Column('r_umfeld', Integer)
    lufer = Column('l_ufer', Integer)
    rufer = Column('r_ufer', Integer)
    sohle = Column('sohle', Integer)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.strukturguete-hochrhein_linkesufer', Strukturguete_hochrhein_linkesufer)


class Strukturguete_hochrhein_linkesumfeld(Base, Vector):
    __tablename__ = 'strukturguete_hochrhein'
    __table_args__ = ({'schema': 'wasser', 'autoload': False, 'extend_existing': True})
    __bodId__ = 'ch.bafu.strukturguete-hochrhein_linkesumfeld'
    __template__ = 'templates/htmlpopup/strukturguete_hochrhein.mako'
    __queryable_attributes__ = ['lumfeld', 'rumfeld', 'lufer', 'rufer', 'sohle']
    __label__ = 'id'
    id = Column('bgdi_id', Integer, primary_key=True)
    datenherkunft = Column('datenherkunft', Text)
    lumfeld = Column('l_umfeld', Integer)
    rumfeld = Column('r_umfeld', Integer)
    lufer = Column('l_ufer', Integer)
    rufer = Column('r_ufer', Integer)
    sohle = Column('sohle', Integer)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.strukturguete-hochrhein_linkesumfeld', Strukturguete_hochrhein_linkesumfeld)


class Strukturguete_hochrhein_rechtesumfeld(Base, Vector):
    __tablename__ = 'strukturguete_hochrhein'
    __table_args__ = ({'schema': 'wasser', 'autoload': False, 'extend_existing': True})
    __bodId__ = 'ch.bafu.strukturguete-hochrhein_rechtesumfeld'
    __template__ = 'templates/htmlpopup/strukturguete_hochrhein.mako'
    __queryable_attributes__ = ['lumfeld', 'rumfeld', 'lufer', 'rufer', 'sohle']
    __label__ = 'id'
    id = Column('bgdi_id', Integer, primary_key=True)
    datenherkunft = Column('datenherkunft', Text)
    lumfeld = Column('l_umfeld', Integer)
    rumfeld = Column('r_umfeld', Integer)
    lufer = Column('l_ufer', Integer)
    rufer = Column('r_ufer', Integer)
    sohle = Column('sohle', Integer)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.strukturguete-hochrhein_rechtesumfeld', Strukturguete_hochrhein_rechtesumfeld)


class Strukturguete_hochrhein_rechtesufer(Base, Vector):
    __tablename__ = 'strukturguete_hochrhein'
    __table_args__ = ({'schema': 'wasser', 'autoload': False, 'extend_existing': True})
    __bodId__ = 'ch.bafu.strukturguete-hochrhein_rechtesufer'
    __template__ = 'templates/htmlpopup/strukturguete_hochrhein.mako'
    __queryable_attributes__ = ['lumfeld', 'rumfeld', 'lufer', 'rufer', 'sohle']
    __label__ = 'id'
    id = Column('bgdi_id', Integer, primary_key=True)
    datenherkunft = Column('datenherkunft', Text)
    lumfeld = Column('l_umfeld', Integer)
    rumfeld = Column('r_umfeld', Integer)
    lufer = Column('l_ufer', Integer)
    rufer = Column('r_ufer', Integer)
    sohle = Column('sohle', Integer)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.strukturguete-hochrhein_rechtesufer', Strukturguete_hochrhein_rechtesufer)


class Strukturguete_hochrhein_sohle(Base, Vector):
    __tablename__ = 'strukturguete_hochrhein'
    __table_args__ = ({'schema': 'wasser', 'autoload': False, 'extend_existing': True})
    __bodId__ = 'ch.bafu.strukturguete-hochrhein_sohle'
    __template__ = 'templates/htmlpopup/strukturguete_hochrhein.mako'
    __queryable_attributes__ = ['lumfeld', 'rumfeld', 'lufer', 'rufer', 'sohle']
    __label__ = 'id'
    id = Column('bgdi_id', Integer, primary_key=True)
    datenherkunft = Column('datenherkunft', Text)
    lumfeld = Column('l_umfeld', Integer)
    rumfeld = Column('r_umfeld', Integer)
    lufer = Column('l_ufer', Integer)
    rufer = Column('r_ufer', Integer)
    sohle = Column('sohle', Integer)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.strukturguete-hochrhein_sohle', Strukturguete_hochrhein_sohle)


class Gewaesserschutz_badewasserqualitaet(Base, Vector):
    __tablename__ = 'gewaesserschutz_badewasserqualitaet'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.gewaesserschutz-badewasserqualitaet'
    __template__ = 'templates/htmlpopup/gewaesserschutz_badewasserqualitaet.mako'
    __queryable_attributes__ = ['rbdsuname', 'groupid', 'bwname', 'nwunitname', 'rbdname']
    __extended_info__ = True
    __label__ = 'bwname'
    id = Column('bgdi_id', Integer, primary_key=True)
    bwid = Column('bwid', Text)
    bwname = Column('bwname', Text)
    aeussereraspekt = Column('aeussereraspekt', Text)
    yearbw = Column('year_bw', Integer)
    ch1903x = Column('rechtswert', Integer)
    ch1903y = Column('hochwert', Integer)
    groupid = Column('groupid', Text)
    qualitaetklasse = Column('qualitaetsklasse', Text)
    rbdname = Column('rbdname', Text)
    rbdsuname = Column('rbdsuname', Text)
    nwunitname = Column('nwunitname', Text)
    url = Column('hyperlink', Text)
    kanton = Column('kanton', Text)
    latbw = Column('longitude', Numeric)
    lonbw = Column('latitude', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.gewaesserschutz-badewasserqualitaet', Gewaesserschutz_badewasserqualitaet)


class AM_G(Base, Vector):
    __tablename__ = 'am_g'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-amphibien_wanderobjekte'
    __template__ = 'templates/htmlpopup/bundinv_amphibien_w.mako'
    __label__ = 'am_g_name'
    id = Column('am_g_obj', Integer, primary_key=True)
    am_g_name = Column('am_g_name', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.bundesinventare-amphibien_wanderobjekte', AM_G)


class AM_L(Base, Vector):
    __tablename__ = 'am_l'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-amphibien'
    __template__ = 'templates/htmlpopup/bundinv_amphibien.mako'
    __label__ = 'am_l_name'
    id = Column('bgdi_id', Text, primary_key=True)
    am_l_obj = Column('am_l_obj', Text)
    am_l_name = Column('am_l_name', Text)
    am_l_fl = Column('am_l_fl', Text)
    am_l_berei = Column('am_l_berei', Text)
    am_l_gf = Column('am_l_gf', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.bundesinventare-amphibien', AM_L)


class LHG(Base, Vector):
    __tablename__ = 'lhg'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.hydrologie-hydromessstationen'
    __template__ = 'templates/htmlpopup/hydromessstationen.mako'
    __label__ = 'lhg_name'
    id = Column('edv_nr4', Text, primary_key=True)
    lhg_name = Column('lhg_name', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.hydrologie-hydromessstationen', LHG)


class Temperaturmessnetz(Base, Vector):
    __tablename__ = 'temperaturmessnetz'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.hydrologie-wassertemperaturmessstationen'
    __template__ = 'templates/htmlpopup/temperaturmessnetz.mako'
    __queryable_attributes__ = ['id', 'name']
    __label__ = 'name'
    id = Column('nr', Integer, primary_key=True)
    url = Column('url', Text)
    name = Column('name', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.hydrologie-wassertemperaturmessstationen', Temperaturmessnetz)


class Klaeranlagen_q347(Base, Vector):
    __tablename__ = 'klaeranlagen'
    __table_args__ = ({'schema': 'wasser', 'autoload': False, 'extend_existing': True})
    __bodId__ = 'ch.bafu.gewaesserschutz-klaeranlagen_anteilq347'
    __template__ = 'templates/htmlpopup/klaeranlagen.mako'
    __extended_info__ = True
    __queryable_attributes__ = ['nummer', 'name', 'ort', 'name_vorfluter', 'gewiss_nr', 'reinigungstyp', 'abw_tagesmittel', 'abw_tagesspitze', 'spitzenbelastung_regen', 'rohabwasser_tag', 'frischschlamm_tag', 'stabilisierter_schlamm_tag', 'bsb5anteil', 'bsb5absolut', 'csbanteil', 'csbabsolut', 'docanteil', 'docabsolut', 'nh4_nanteil', 'nh4_nabsolut', 'nh4_n_ganzjaehrig', 'nanteil', 'nabsolut', 'n_abwassertemperatur', 'gesamtpanteil', 'gesamtpabsolut', 'gesamt_ungel_stoffe_absolut', 'andere_stoffe', 'kanton', 'vsa_kategorie', 'ausbaugroesse_egw', 'anzahl_nat_einwohner', 'jahr_nat_einwohner', 'abwasseranteil_q347', 'gwlnr']
    __label__ = 'name'
    id = Column('nummer', Integer, primary_key=True)
    name = Column('name', Text)
    rechtswert = Column('rechtswert', Integer)
    hochwert = Column('hochwert', Integer)
    hoehe = Column('hoehe', Integer)
    adresse = Column('adresse', Text)
    plz = Column('plz', Integer)
    ort = Column('ort', Text)
    tel_nr = Column('tel_nr', Text)
    vorfluterbez = Column('vorfluterbez', Text)
    name_vorfluter = Column('name_vorfluter', Text)
    gewiss_nr = Column('gewiss_nr', Integer)
    reinigungstyp = Column('reinigungstyp', Text)
    abw_tagesmittel = Column('abw_tagesmittel', Integer)
    abw_tagesspitze = Column('abw_tagesspitze', Integer)
    spitzenbelastung_regen = Column('spitzenbelastung_regen', Integer)
    rohabwasser_tag = Column('rohabwasser_tag', Integer)
    frischschlamm_tag = Column('frischschlamm_tag', Integer)
    stabilisierter_schlamm_tag = Column('stabilisierter_schlamm_tag', Integer)
    bsb5anteil = Column('bsb5anteil', Integer)
    bsb5absolut = Column('bsb5absolut', Integer)
    csbanteil = Column('csbanteil', Integer)
    csbabsolut = Column('csbabsolut', Integer)
    docanteil = Column('docanteil', Integer)
    docabsolut = Column('docabsolut', Integer)
    nh4_nanteil = Column('nh4_nanteil', Integer)
    nh4_nabsolut = Column('nh4_nabsolut', Integer)
    nh4_n_ganzjaehrig = Column('nh4_n_ganzjaehrig', Text)
    nanteil = Column('nanteil', Integer)
    nabsolut = Column('nabsolut', Integer)
    n_abwassertemperatur = Column('n_abwassertemperatur', Integer)
    gesamtpanteil = Column('gesamtpanteil', Integer)
    gesamtpabsolut = Column('gesamtpabsolut', Numeric)
    gesamt_ungel_stoffe_absolut = Column('gesamt_ungel_stoffe_absolut', Integer)
    andere_stoffe = Column('andere_stoffe', Text)
    kanton = Column('kanton', Text)
    vsa_kategorie = Column('vsa_kategorie', Text)
    ausbaugroesse_egw = Column('ausbaugroesse_egw', Integer)
    anzahl_nat_einwohner = Column('anzahl_nat_einwohner', Integer)
    jahr_nat_einwohner = Column('jahr_nat_einwohner', Integer)
    abwasseranteil_q347 = Column('abwasseranteil_q347', Numeric)
    gwlnr = Column('gwlnr', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.gewaesserschutz-klaeranlagen_anteilq347', Klaeranlagen_q347)


class Reinigungstyp(Base, Vector):
    __tablename__ = 'klaeranlagen'
    __table_args__ = ({'schema': 'wasser', 'autoload': False, 'extend_existing': True})
    __bodId__ = 'ch.bafu.gewaesserschutz-klaeranlagen_reinigungstyp'
    __template__ = 'templates/htmlpopup/klaeranlagen.mako'
    __extended_info__ = True
    __queryable_attributes__ = ['nummer', 'name', 'ort', 'name_vorfluter', 'gewiss_nr', 'reinigungstyp', 'abw_tagesmittel', 'abw_tagesspitze', 'spitzenbelastung_regen', 'rohabwasser_tag', 'frischschlamm_tag', 'stabilisierter_schlamm_tag', 'bsb5anteil', 'bsb5absolut', 'csbanteil', 'csbabsolut', 'docanteil', 'docabsolut', 'nh4_nanteil', 'nh4_nabsolut', 'nh4_n_ganzjaehrig', 'nanteil', 'nabsolut', 'n_abwassertemperatur', 'gesamtpanteil', 'gesamtpabsolut', 'gesamt_ungel_stoffe_absolut', 'andere_stoffe', 'kanton', 'vsa_kategorie', 'ausbaugroesse_egw', 'anzahl_nat_einwohner', 'jahr_nat_einwohner', 'abwasseranteil_q347', 'gwlnr']
    __label__ = 'name'
    id = Column('nummer', Integer, primary_key=True)
    name = Column('name', Text)
    rechtswert = Column('rechtswert', Integer)
    hochwert = Column('hochwert', Integer)
    hoehe = Column('hoehe', Integer)
    adresse = Column('adresse', Text)
    plz = Column('plz', Integer)
    ort = Column('ort', Text)
    tel_nr = Column('tel_nr', Text)
    vorfluterbez = Column('vorfluterbez', Text)
    name_vorfluter = Column('name_vorfluter', Text)
    gewiss_nr = Column('gewiss_nr', Integer)
    reinigungstyp = Column('reinigungstyp', Text)
    abw_tagesmittel = Column('abw_tagesmittel', Integer)
    abw_tagesspitze = Column('abw_tagesspitze', Integer)
    spitzenbelastung_regen = Column('spitzenbelastung_regen', Integer)
    rohabwasser_tag = Column('rohabwasser_tag', Integer)
    frischschlamm_tag = Column('frischschlamm_tag', Integer)
    stabilisierter_schlamm_tag = Column('stabilisierter_schlamm_tag', Integer)
    bsb5anteil = Column('bsb5anteil', Integer)
    bsb5absolut = Column('bsb5absolut', Integer)
    csbanteil = Column('csbanteil', Integer)
    csbabsolut = Column('csbabsolut', Integer)
    docanteil = Column('docanteil', Integer)
    docabsolut = Column('docabsolut', Integer)
    nh4_nanteil = Column('nh4_nanteil', Integer)
    nh4_nabsolut = Column('nh4_nabsolut', Integer)
    nh4_n_ganzjaehrig = Column('nh4_n_ganzjaehrig', Text)
    nanteil = Column('nanteil', Integer)
    nabsolut = Column('nabsolut', Integer)
    n_abwassertemperatur = Column('n_abwassertemperatur', Integer)
    gesamtpanteil = Column('gesamtpanteil', Integer)
    gesamtpabsolut = Column('gesamtpabsolut', Numeric)
    gesamt_ungel_stoffe_absolut = Column('gesamt_ungel_stoffe_absolut', Integer)
    andere_stoffe = Column('andere_stoffe', Text)
    kanton = Column('kanton', Text)
    vsa_kategorie = Column('vsa_kategorie', Text)
    ausbaugroesse_egw = Column('ausbaugroesse_egw', Integer)
    anzahl_nat_einwohner = Column('anzahl_nat_einwohner', Integer)
    jahr_nat_einwohner = Column('jahr_nat_einwohner', Integer)
    abwasseranteil_q347 = Column('abwasseranteil_q347', Numeric)
    gwlnr = Column('gwlnr', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.gewaesserschutz-klaeranlagen_reinigungstyp', Reinigungstyp)


class Klaeranlagen_ausbaugroesse(Base, Vector):
    __tablename__ = 'klaeranlagen'
    __table_args__ = ({'schema': 'wasser', 'autoload': False, 'extend_existing': True})
    __bodId__ = 'ch.bafu.gewaesserschutz-klaeranlagen_ausbaugroesse'
    __template__ = 'templates/htmlpopup/klaeranlagen.mako'
    __extended_info__ = True
    __queryable_attributes__ = ['nummer', 'name', 'ort', 'name_vorfluter', 'gewiss_nr', 'reinigungstyp', 'abw_tagesmittel', 'abw_tagesspitze', 'spitzenbelastung_regen', 'rohabwasser_tag', 'frischschlamm_tag', 'stabilisierter_schlamm_tag', 'bsb5anteil', 'bsb5absolut', 'csbanteil', 'csbabsolut', 'docanteil', 'docabsolut', 'nh4_nanteil', 'nh4_nabsolut', 'nh4_n_ganzjaehrig', 'nanteil', 'nabsolut', 'n_abwassertemperatur', 'gesamtpanteil', 'gesamtpabsolut', 'gesamt_ungel_stoffe_absolut', 'andere_stoffe', 'kanton', 'vsa_kategorie', 'ausbaugroesse_egw', 'anzahl_nat_einwohner', 'jahr_nat_einwohner', 'abwasseranteil_q347', 'gwlnr']
    __label__ = 'name'
    id = Column('nummer', Integer, primary_key=True)
    name = Column('name', Text)
    rechtswert = Column('rechtswert', Integer)
    hochwert = Column('hochwert', Integer)
    hoehe = Column('hoehe', Integer)
    adresse = Column('adresse', Text)
    plz = Column('plz', Integer)
    ort = Column('ort', Text)
    tel_nr = Column('tel_nr', Text)
    vorfluterbez = Column('vorfluterbez', Text)
    name_vorfluter = Column('name_vorfluter', Text)
    gewiss_nr = Column('gewiss_nr', Integer)
    reinigungstyp = Column('reinigungstyp', Text)
    abw_tagesmittel = Column('abw_tagesmittel', Integer)
    abw_tagesspitze = Column('abw_tagesspitze', Integer)
    spitzenbelastung_regen = Column('spitzenbelastung_regen', Integer)
    rohabwasser_tag = Column('rohabwasser_tag', Integer)
    frischschlamm_tag = Column('frischschlamm_tag', Integer)
    stabilisierter_schlamm_tag = Column('stabilisierter_schlamm_tag', Integer)
    bsb5anteil = Column('bsb5anteil', Integer)
    bsb5absolut = Column('bsb5absolut', Integer)
    csbanteil = Column('csbanteil', Integer)
    csbabsolut = Column('csbabsolut', Integer)
    docanteil = Column('docanteil', Integer)
    docabsolut = Column('docabsolut', Integer)
    nh4_nanteil = Column('nh4_nanteil', Integer)
    nh4_nabsolut = Column('nh4_nabsolut', Integer)
    nh4_n_ganzjaehrig = Column('nh4_n_ganzjaehrig', Text)
    nanteil = Column('nanteil', Integer)
    nabsolut = Column('nabsolut', Integer)
    n_abwassertemperatur = Column('n_abwassertemperatur', Integer)
    gesamtpanteil = Column('gesamtpanteil', Integer)
    gesamtpabsolut = Column('gesamtpabsolut', Numeric)
    gesamt_ungel_stoffe_absolut = Column('gesamt_ungel_stoffe_absolut', Integer)
    andere_stoffe = Column('andere_stoffe', Text)
    kanton = Column('kanton', Text)
    vsa_kategorie = Column('vsa_kategorie', Text)
    ausbaugroesse_egw = Column('ausbaugroesse_egw', Integer)
    anzahl_nat_einwohner = Column('anzahl_nat_einwohner', Integer)
    jahr_nat_einwohner = Column('jahr_nat_einwohner', Integer)
    abwasseranteil_q347 = Column('abwasseranteil_q347', Numeric)
    gwlnr = Column('gwlnr', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.gewaesserschutz-klaeranlagen_ausbaugroesse', Klaeranlagen_ausbaugroesse)


class Flussordnungszahlen_strahler(Base, Vector):
    __tablename__ = 'flussordnungszahlen'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.flussordnungszahlen-strahler'
    __template__ = 'templates/htmlpopup/flussordnungszahlen.mako'
    __label__ = 'arc_id'
    id = Column('bgdi_id', Integer, primary_key=True)
    arc_id = Column('arc_id', Integer)
    floz = Column('floz', Integer)
    main_len = Column('main_len', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.flussordnungszahlen-strahler', Flussordnungszahlen_strahler)


class Grundwasserschutzareale (Base, Vector):
    __tablename__ = 'grundwasserschutzareale'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.grundwasserschutzareale'
    __template__ = 'templates/htmlpopup/wasser_grundwasser.mako'
    __label__ = 'typ_de'  # Translatable labels in de fr it en
    id = Column('bgdi_id', Integer, primary_key=True)
    kanton = Column('kanton', Text)
    name = Column('name', Text)
    typ_de = Column('typ_de', Text)
    typ_fr = Column('typ_fr', Text)
    typ_it = Column('typ_it', Text)
    typ_en = Column('typ_en', Text)
    source = Column('source', Text)
    status_de = Column('status_de', Text)
    status_fr = Column('status_fr', Text)
    status_it = Column('status_it', Text)
    status_en = Column('status_en', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.grundwasserschutzareale', Grundwasserschutzareale)


class Grundwasserschutzzonen (Base, Vector):
    __tablename__ = 'grundwasserschutzzonen'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.grundwasserschutzzonen'
    __template__ = 'templates/htmlpopup/wasser_grundwasser.mako'
    __label__ = 'typ_de'  # Translatable labels in de fr it en
    id = Column('bgdi_id', Integer, primary_key=True)
    kanton = Column('kanton', Text)
    name = Column('name', Text)
    typ_de = Column('typ_de', Text)
    typ_fr = Column('typ_fr', Text)
    typ_it = Column('typ_it', Text)
    typ_en = Column('typ_en', Text)
    source = Column('source', Text)
    status_de = Column('status_de', Text)
    status_fr = Column('status_fr', Text)
    status_it = Column('status_it', Text)
    status_en = Column('status_en', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.grundwasserschutzzonen', Grundwasserschutzzonen)


class Gewaesserschutzbereiche (Base, Vector):
    __tablename__ = 'gewaesserschutzbereiche'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.gewaesserschutzbereiche'
    __template__ = 'templates/htmlpopup/wasser_schutzbereiche.mako'
    __label__ = 'typ_de'  # Translatable labels in de fr it en
    id = Column('bgdi_id', Integer, primary_key=True)
    kanton = Column('kanton', Text)
    typ_de = Column('typ_de', Text)
    typ_fr = Column('typ_fr', Text)
    typ_it = Column('typ_it', Text)
    typ_en = Column('typ_en', Text)
    source = Column('source', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.gewaesserschutzbereiche', Gewaesserschutzbereiche)


class Vorfluter (Base, Vector):
    __tablename__ = 'vorfluter'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.wasser-vorfluter'
    __template__ = 'templates/htmlpopup/vorfluter.mako'
    __label__ = 'teilezgnr'
    id = Column('bgdi_id', Integer, primary_key=True)
    teilezgnr = Column('teilezgnr', Integer)
    gwlnr = Column('gwlnr', Text)
    measure = Column('measure', Integer)
    endmeasure = Column('endmeasure', Integer)
    name = Column('name', Text)
    regimenr = Column('regimenr', Integer)
    regimetyp = Column('regimetyp', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.wasser-vorfluter', Vorfluter)


class Gewaesserzustandst (Base, Vector):
    __tablename__ = 'dbgz'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.hydrologie-gewaesserzustandsmessstationen'
    __template__ = 'templates/htmlpopup/gewaesserzustandsmessstationen.mako'
    __label__ = 'name'
    __queryable_attributes__ = ['nr', 'name', 'gewaesser']
    id = Column('bgdi_id', Integer, primary_key=True)
    name = Column('name', Text)
    nr = Column('nr', Numeric)
    gewaesser = Column('gewaesser', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.hydrologie-gewaesserzustandsmessstationen', Gewaesserzustandst)


class Teileinzugsgebiete2 (Base, Vector):
    __tablename__ = 'ebene_2km'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.wasser-teileinzugsgebiete_2'
    __template__ = 'templates/htmlpopup/teileinzugsgebiete2.mako'
    __label__ = 'teilezgnr'
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
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.wasser-teileinzugsgebiete_2', Teileinzugsgebiete2)


class Teileinzugsgebiete40 (Base, Vector):
    __tablename__ = 'ebene_40km'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.wasser-teileinzugsgebiete_40'
    __template__ = 'templates/htmlpopup/teileinzugsgebiete40.mako'
    __label__ = 'tezgnr40'
    id = Column('bgdi_id', Integer, primary_key=True)
    tezgnr40 = Column('tezgnr40', Integer)
    teilezgfla = Column('teilezgfla', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.wasser-teileinzugsgebiete_40', Teileinzugsgebiete40)


class Gebietsauslaesse (Base, Vector):
    __tablename__ = 'outlets'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.wasser-gebietsauslaesse'
    __template__ = 'templates/htmlpopup/gebietsauslaesse.mako'
    __extended_info__ = True
    __label__ = 'ezgnr'
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
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.wasser-gebietsauslaesse', Gebietsauslaesse)


class AU(Base, Vector):
    __tablename__ = 'au'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-auen'
    __template__ = 'templates/htmlpopup/auen.mako'
    __label__ = 'au_name'
    __queryable_attributes__ = ['au_obj', 'au_name']
    id = Column('gid', Integer, primary_key=True)
    au_name = Column('au_name', Text)
    au_obj = Column('au_obj', Integer)
    au_objtyp = Column('au_objtyp', Text)
    au_fl = Column('au_fl', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.bundesinventare-auen', AU)


class BLN(Base, Vector):
    __tablename__ = 'bln'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-bln'
    __queryable_attributes__ = ['bln_name']
    __template__ = 'templates/htmlpopup/bln.mako'
    __label__ = 'bln_name'
    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
    bln_name = Column('bln_name', Text)
    bln_obj = Column('bln_obj', Integer)
    bln_fl = Column('bln_fl', Numeric)

register('ch.bafu.bundesinventare-bln', BLN)


class HM(Base, Vector):
    __tablename__ = 'hm'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-hochmoore'
    __template__ = 'templates/htmlpopup/hochmoore.mako'
    __label__ = 'hm_name'
    id = Column('gid', Integer, primary_key=True)
    hm_name = Column('hm_name', Text)
    hm_obj = Column('hm_obj', Integer)
    hm_typ = Column('hm_typ', Integer)
    hm_fl = Column('hm_fl', Numeric)
    hm_ke = Column('hm_ke', Integer)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.bundesinventare-hochmoore', HM)


class HMA(Base, Vector):
    __tablename__ = 'hochmoore_anhoerung'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-hochmoore_anhoerung'
    __template__ = 'templates/htmlpopup/hochmoore_anhoerung.mako'
    __label__ = 'obj_name'
    id = Column('bgdi_id', Integer, primary_key=True)
    obj_nr = Column('obj_nr', Text)
    obj_name = Column('obj_name', Text)
    tobj_type = Column('tobj_type', Text)
    flaeche = Column('flaeche', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.bundesinventare-hochmoore_anhoerung', HMA)


class TTA(Base, Vector):
    __tablename__ = 'trockenwiesen_trockenweiden_anhoerung'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-trockenwiesen_trockenweiden_anhoerung'
    __template__ = 'templates/htmlpopup/trockenwiesen_trockenweiden_anhoerung.mako'
    __label__ = 'obj_name'
    id = Column('bgdi_id', Integer, primary_key=True)
    obj_nr = Column('obj_nr', Text)
    obj_name = Column('obj_name', Text)
    flaeche = Column('flaeche', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.bundesinventare-trockenwiesen_trockenweiden_anhoerung', TTA)


class MLA(Base, Vector):
    __tablename__ = 'moorlandschaften_anhoerung'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-moorlandschaften_anhoerung'
    __template__ = 'templates/htmlpopup/moorlandschaften_anhoerung.mako'
    __label__ = 'obj_name'
    id = Column('bgdi_id', Integer, primary_key=True)
    obj_nr = Column('obj_nr', Text)
    obj_name = Column('obj_name', Text)
    flaeche = Column('flaeche', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.bundesinventare-moorlandschaften_anhoerung', MLA)


class FMA(Base, Vector):
    __tablename__ = 'flachmoore_anhoerung'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-flachmoore_anhoerung'
    __template__ = 'templates/htmlpopup/flachmoore_anhoerung.mako'
    __label__ = 'obj_name'
    id = Column('bgdi_id', Integer, primary_key=True)
    obj_nr = Column('obj_nr', Text)
    obj_name = Column('obj_name', Text)
    flaeche = Column('flaeche', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.bundesinventare-flachmoore_anhoerung', FMA)


class AA(Base, Vector):
    __tablename__ = 'auen_anhoerung'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-auen_anhoerung'
    __template__ = 'templates/htmlpopup/auen_anhoerung.mako'
    __label__ = 'obj_name'
    id = Column('bgdi_id', Integer, primary_key=True)
    obj_nr = Column('obj_nr', Text)
    obj_name = Column('obj_name', Text)
    flaeche = Column('flaeche', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.bundesinventare-auen_anhoerung', AA)


class AWA(Base, Vector):
    __tablename__ = 'amphibien_wanderobjekte_anhoerung'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-amphibien_wanderobjekte_anhoerung'
    __template__ = 'templates/htmlpopup/amphibien_wanderobjekte_anhoerung.mako'
    __label__ = 'obj_name'
    id = Column('bgdi_id', Integer, primary_key=True)
    obj_nr = Column('obj_nr', Text)
    obj_name = Column('obj_name', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.bundesinventare-amphibien_wanderobjekte_anhoerung', AWA)


class AMA(Base, Vector):
    __tablename__ = 'amphibien_anhoerung'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-amphibien_anhoerung'
    __template__ = 'templates/htmlpopup/amphibien_anhoerung.mako'
    __label__ = 'obj_name'
    id = Column('bgdi_id', Integer, primary_key=True)
    obj_nr = Column('obj_nr', Text)
    obj_name = Column('obj_name', Text)
    bereich = Column('bereich', Text)
    flaeche = Column('flaeche', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.bundesinventare-amphibien_anhoerung', AMA)


class JB(Base, Vector):
    __tablename__ = 'jb'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-jagdbanngebiete'
    __queryable_attributes__ = ['jb_name']
    __template__ = 'templates/htmlpopup/jb.mako'
    __label__ = 'jb_name'  # Composite labels
    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
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
    __label__ = 'ml_name'
    id = Column('gid', Integer, primary_key=True)
    ml_name = Column('ml_name', Text)
    ml_obj = Column('ml_obj', Integer)
    ml_fl = Column('ml_fl', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.bundesinventare-moorlandschaften', ML)


class WV(Base, Vector):
    __tablename__ = 'wv'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-vogelreservate'
    __template__ = 'templates/htmlpopup/vogelreservate.mako'
    __label__ = 'wv_name'
    id = Column('gid', Integer, primary_key=True)
    wv_name = Column('wv_name', Text)
    wv_obj = Column('wv_obj', Integer)
    wv_kat = Column('wv_kat', Text)
    wv_fl = Column('wv_fl', Numeric)
    wv_gf = Column('wv_gf', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.bundesinventare-vogelreservate', WV)


class wasserentnahmeAll(Base, Vector):
    __tablename__ = 'entnahme'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.wasser-entnahme'
    __template__ = 'templates/htmlpopup/wasserentnahme.mako'
    __label__ = 'rwknr'
    id = Column('gid', Text, primary_key=True)
    rwknr = Column('rwknr', Text)
    kanton = Column('kanton', Text)
    kantoncode = Column('kantoncode', Text)
    ent_gew = Column('ent_gew', Text)
    link = Column('link', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.wasser-entnahme', wasserentnahmeAll)


class wasserleitungen(Base, Vector):
    __tablename__ = 'leitungen'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.wasser-leitungen'
    __template__ = 'templates/htmlpopup/wasserleitungen.mako'
    __label__ = 'rwknr'
    id = Column('gid', Integer, primary_key=True)
    kanton = Column('kanton', Text)
    kantoncode = Column('kantoncode', Text)
    rwknr = Column('rwknr', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.wasser-leitungen', wasserleitungen)


class wasserrueckgabe(Base, Vector):
    __tablename__ = 'rueckgabe'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.wasser-rueckgabe'
    __template__ = 'templates/htmlpopup/wasserrueckgabe.mako'
    __label__ = 'rwknr'
    id = Column('gid', Integer, primary_key=True)
    kanton = Column('kanton', Text)
    kantoncode = Column('kantoncode', Text)
    rwknr = Column('rwknr', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.wasser-rueckgabe', wasserrueckgabe)


class flachmoore(Base, Vector):
    __tablename__ = 'fm'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-flachmoore'
    __template__ = 'templates/htmlpopup/flachmoore.mako'
    __label__ = 'fm_name'
    id = Column('gid', Integer, primary_key=True)
    fm_name = Column('fm_name', Text)
    fm_obj = Column('fm_obj', Text)
    fm_gf = Column('fm_gf', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.bundesinventare-flachmoore', flachmoore)


class flachmooreReg(Base, Vector):
    __tablename__ = 'flachmoore_regional'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-flachmoore_regional'
    __template__ = 'templates/htmlpopup/flachmoore_reg.mako'
    __label__ = 'fmreg_name'
    id = Column('bgdi_id', Integer, primary_key=True)
    fmreg_name = Column('fmreg_name', Text)
    fmreg_obj = Column('fmreg_obj', Text)
    fmreg_gf = Column('fmreg_gf', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.bundesinventare-flachmoore_regional', flachmooreReg)


class schutzgebiete_aulav_auen(Base, Vector):
    __tablename__ = 'auengebiete'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __bodId__ = 'ch.bafu.schutzgebiete-aulav_auen'
    __template__ = 'templates/htmlpopup/bafu_schutzge_aulav_std.mako'
    __maxscale__ = 10000
    id = Column('bgdi_id', Integer, primary_key=True)
    key_obj = Column('au_obj', Numeric)
    key_name = Column('au_name', Text)
    key_version = Column('au_version', Text)
    typ = Column('typ', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.schutzgebiete-aulav_auen', schutzgebiete_aulav_auen)


class schutzgebiete_aulav_auen_general(Base, Vector):
    __tablename__ = 'auengebiete_general'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __bodId__ = 'ch.bafu.schutzgebiete-aulav_auen'
    __template__ = 'templates/htmlpopup/bafu_schutzge_aulav_auen_general.mako'
    __minscale__ = 10001
    __maxscale__ = 5000000
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.schutzgebiete-aulav_auen', schutzgebiete_aulav_auen_general)


class schutzgebiete_aulav_jagdbanngebiete(Base, Vector):
    __tablename__ = 'jagdbanngebiete'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __bodId__ = 'ch.bafu.schutzgebiete-aulav_jagdbanngebiete'
    __template__ = 'templates/htmlpopup/bafu_schutzge_aulav_std.mako'
    __maxscale__ = 10000
    id = Column('bgdi_id', Integer, primary_key=True)
    key_obj = Column('jb_obj', Numeric)
    key_name = Column('jb_name', Text)
    key_version = Column('jb_version', Text)
    typ = Column('typ', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.schutzgebiete-aulav_jagdbanngebiete', schutzgebiete_aulav_jagdbanngebiete)


class schutzgebiete_aulav_jagdbanngebiete_general(Base, Vector):
    __tablename__ = 'jagdbanngebiete_general'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __bodId__ = 'ch.bafu.schutzgebiete-aulav_jagdbanngebiete'
    __template__ = 'templates/htmlpopup/bafu_schutzge_aulav_jagdbanngebiete_general.mako'
    __minscale__ = 10001
    __maxscale__ = 5000000
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.schutzgebiete-aulav_jagdbanngebiete', schutzgebiete_aulav_jagdbanngebiete_general)


class schutzgebiete_aulav_moorlandschaften(Base, Vector):
    __tablename__ = 'moorlandschaften'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __bodId__ = 'ch.bafu.schutzgebiete-aulav_moorlandschaften'
    __template__ = 'templates/htmlpopup/bafu_schutzge_aulav_std.mako'
    __maxscale__ = 10000
    id = Column('bgdi_id', Integer, primary_key=True)
    key_obj = Column('ml_obj', Numeric)
    key_name = Column('ml_name', Text)
    key_version = Column('ml_version', Text)
    typ = Column('typ', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.schutzgebiete-aulav_moorlandschaften', schutzgebiete_aulav_moorlandschaften)


class schutzgebiete_aulav_moorlandschaften_general(Base, Vector):
    __tablename__ = 'moorlandschaften_general'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __bodId__ = 'ch.bafu.schutzgebiete-aulav_moorlandschaften'
    __template__ = 'templates/htmlpopup/bafu_schutzge_aulav_moorlandschaften_general.mako'
    __minscale__ = 10001
    __maxscale__ = 5000000
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.schutzgebiete-aulav_moorlandschaften', schutzgebiete_aulav_moorlandschaften_general)


class schutzgebiete_aulav_uebrige(Base, Vector):
    __tablename__ = 'uebrige_gebiete'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __bodId__ = 'ch.bafu.schutzgebiete-aulav_uebrige'
    __template__ = 'templates/htmlpopup/bafu_schutzge_aulav_uebrige.mako'
    __maxscale__ = 10000
    id = Column('bgdi_id', Integer, primary_key=True)
    wv_obj = Column('wv_obj', Numeric)
    wv_name = Column('wv_name', Text)
    nat_park = Column('nat_park', Numeric)
    fm_obj = Column('fm_obj', Numeric)
    fm_name = Column('fm_name', Text)
    hm_obj = Column('hm_obj', Numeric)
    hm_name = Column('hm_name', Text)
    np_name = Column('np_name', Text)
    typ = Column('typ', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.schutzgebiete-aulav_uebrige', schutzgebiete_aulav_uebrige)


class schutzgebiete_aulav_uebrige_general(Base, Vector):
    __tablename__ = 'uebrige_gebiete_general'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __bodId__ = 'ch.bafu.schutzgebiete-aulav_uebrige'
    __template__ = 'templates/htmlpopup/bafu_schutzge_aulav_uebrige_general.mako'
    __minscale__ = 10001
    __maxscale__ = 5000000
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.schutzgebiete-aulav_uebrige', schutzgebiete_aulav_uebrige_general)


class paerke_nationaler_bedeutung(Base, Vector):
    __tablename__ = 'paerke_nationaler_bedeutung'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __bodId__ = 'ch.bafu.schutzgebiete-paerke_nationaler_bedeutung'
    __template__ = 'templates/htmlpopup/paerke_nationaler_bedeutung.mako'
    __label__ = 'park_name'
    id = Column('bgdi_id', Integer, primary_key=True)
    park_name = Column('park_name', Text)
    park_nr = Column('park_nr', Numeric)
    park_statu = Column('park_statu', Text)
    park_fl = Column('park_fl', Numeric)
    park_gf = Column('park_gf', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.schutzgebiete-paerke_nationaler_bedeutung', paerke_nationaler_bedeutung)


class ramsar(Base, Vector):
    __tablename__ = 'ramsar'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __bodId__ = 'ch.bafu.schutzgebiete-ramsar'
    __template__ = 'templates/htmlpopup/ramsar.mako'
    __label__ = 'ra_name'
    id = Column('ra_id', Integer, primary_key=True)
    ra_name = Column('ra_name', Text)
    ra_obj = Column('ra_obj', Integer)
    ra_fl = Column('ra_fl', Text)
    ra_gf = Column('ra_gf', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.schutzgebiete-ramsar', ramsar)


class wildruhezonen_jagdbanngebiete(Base, Vector):
    __tablename__ = 'wildruhezonen_jagdbanngebiete'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __bodId__ = 'ch.bafu.wildruhezonen-jagdbanngebiete'
    __template__ = 'templates/htmlpopup/wildruhezonen_jagdbanngebiete.mako'
    __label__ = 'wrz_name'
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
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.wildruhezonen-jagdbanngebiete', wildruhezonen_jagdbanngebiete)


class wege_wildruhezonen_jagdbanngebiete(Base, Vector):
    __tablename__ = 'wege_wildruhezonen_jagdbanngebiete'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __bodId__ = 'ch.bafu.wege-wildruhezonen-jagdbanngebiete'
    __template__ = 'templates/htmlpopup/wege_wildruhezonen_jagdbanngebiete.mako'
    __label__ = 'wrz_obj'
    id = Column('weg_id', Integer, primary_key=True)
    jb_obj = Column('jb_obj', Integer)
    wrz_obj = Column('wrz_obj', Integer)
    length_km = Column('length_km', Numeric)
    weg_wrz_jb_version = Column('weg_wrz_jb_version', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.wege-wildruhezonen-jagdbanngebiete', wege_wildruhezonen_jagdbanngebiete)


class oekom_abschnitte(Base, Vector):
    __tablename__ = 'oekom_abschnitte'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.oekomorphologie-f_abschnitte'
    __template__ = 'templates/htmlpopup/oekom_abschnitte.mako'
    __extended_info__ = True
    __label__ = 'anfangsmass'
    id = Column('bgdi_id', Integer, primary_key=True)
    abschnr = Column('abschnr', Text)
    gsbreite = Column('gsbreite', Numeric)
    breitenvar_de = Column('breitenvar_de', Text)
    breitenvar_fr = Column('breitenvar_fr', Text)
    sohlver_de = Column('sohlver_de', Text)
    sohlver_fr = Column('sohlver_fr', Text)
    lufbebre = Column('lufbebre', Numeric)
    rufbebre = Column('rufbebre', Numeric)
    oekomklasse_de = Column('oekomklasse_de', Text)
    oekomklasse_fr = Column('oekomklasse_fr', Text)
    bemerkung = Column('bemerkung', Text)
    anfangsmass = Column('anfangsmass', Numeric)
    endmass = Column('endmass', Numeric)
    anfangsrechtswert = Column('anfangsrechtswert', Numeric)
    anfangshochwert = Column('anfangshochwert', Numeric)
    endrechtswert = Column('endrechtswert', Numeric)
    endhochwert = Column('endhochwert', Numeric)
    eindol_de = Column('eindol_de', Text)
    eindol_fr = Column('eindol_fr', Text)
    vnatabst_de = Column('vnatabst_de', Text)
    vnatabst_fr = Column('vnatabst_fr', Text)
    tiefenvar_de = Column('tiefenvar_de', Text)
    tiefenvar_fr = Column('tiefenvar_fr', Text)
    sohlmat = Column('sohlmat', Numeric)
    lbukver_de = Column('lbukver_de', Text)
    lbukver_fr = Column('lbukver_fr', Text)
    rbukver_de = Column('rbukver_de', Text)
    rbukver_fr = Column('rbukver_fr', Text)
    lbukmat_de = Column('lbukmat_de', Text)
    lbukmat_fr = Column('lbukmat_fr', Text)
    rbukmat_de = Column('rbukmat_de', Text)
    rbukmat_fr = Column('rbukmat_fr', Text)
    luferber_de = Column('luferber_de', Text)
    luferber_fr = Column('luferber_fr', Text)
    ruferber_de = Column('ruferber_de', Text)
    ruferber_fr = Column('ruferber_fr', Text)
    lufbebew_de = Column('lufbebew_de', Text)
    lufbebew_fr = Column('lufbebew_fr', Text)
    rufbebew_de = Column('rufbebew_de', Text)
    rufbebew_fr = Column('rufbebew_fr', Text)
    bewalgen_de = Column('bewalgen_de', Text)
    bewalgen_fr = Column('bewalgen_fr', Text)
    bewmakro_de = Column('bewmakro_de', Text)
    bewmakro_fr = Column('bewmakro_fr', Text)
    totholz_de = Column('totholz_de', Text)
    totholz_fr = Column('totholz_fr', Text)
    notizen = Column('notizen', Text)
    translid = Column('translid', Numeric)
    datum = Column('datum', Text)
    oekomklasse = Column('oekomklasse', Numeric)
    sohlmat_de = Column('sohlmat_de', Text)
    sohlmat_fr = Column('sohlmat_fr', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.oekomorphologie-f_abschnitte', oekom_abschnitte)


class oekom_abstuerze(Base, Vector):
    __tablename__ = 'oekom_abstuerze'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.oekomorphologie-f_abstuerze'
    __template__ = 'templates/htmlpopup/oekom_abstuerze.mako'
    __extended_info__ = True
    __label__ = 'abstnr'
    id = Column('bgdi_id', Integer, primary_key=True)
    abstnr = Column('abstnr', Text)
    absttyp_de = Column('absttyp_de', Text)
    absttyp_fr = Column('absttyp_fr', Text)
    abstmat_de = Column('abstmat_de', Text)
    abstmat_fr = Column('abstmat_fr', Text)
    absthoehe = Column('absthoehe', Numeric,)
    bemerkung = Column('bemerkung', Text)
    mass = Column('mass', Numeric,)
    rechtswert = Column('rechtswert', Numeric)
    hochwert = Column('hochwert', Numeric)
    abschnr = Column('abschnr', Text)
    notizen = Column('notizen', Text)
    translid = Column('translid', Numeric)
    loc_angle_geo = Column('loc_angle_geo', Numeric)
    datum = Column('datum', Text)
    absttyp = Column('absttyp', Numeric)
    abstmat = Column('abstmat', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.oekomorphologie-f_abstuerze', oekom_abstuerze)


class oekom_bauwerke(Base, Vector):
    __tablename__ = 'oekom_bauwerke'
    __table_args__ = ({'schema': 'wasser', 'autoload': False})
    __bodId__ = 'ch.bafu.oekomorphologie-f_bauwerke'
    __template__ = 'templates/htmlpopup/oekom_bauwerke.mako'
    __extended_info__ = True
    __label__ = 'bauwnr'
    id = Column('bgdi_id', Integer, primary_key=True)
    bauwnr = Column('bauwnr', Text)
    bauwtyp_de = Column('bauwtyp_de', Text)
    bauwtyp_fr = Column('bauwtyp_fr', Text)
    bauwhoehe = Column('bauwhoehe', Numeric)
    mass = Column('mass', Numeric)
    rechtswert = Column('rechtswert', Numeric)
    hochwert = Column('hochwert', Numeric)
    abschnr = Column('abschnr', Text)
    bemerkung = Column('bemerkung', Text)
    notizen = Column('notizen', Text)
    translid = Column('translid', Numeric)
    loc_angle_geo = Column('loc_angle_geo', Numeric)
    datum = Column('datum', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.oekomorphologie-f_bauwerke', oekom_bauwerke)


class steinbockkolonien(Base, Vector):
    __tablename__ = 'sb'
    __table_args__ = ({'schema': 'fauna', 'autoload': False})
    __bodId__ = 'ch.bafu.fauna-steinbockkolonien'
    __template__ = 'templates/htmlpopup/steinbockkolonien.mako'
    __label__ = 'sb_name'
    id = Column('gid', Integer, primary_key=True)
    sb_name = Column('sb_name', Text)
    sb_obj = Column('sb_obj', Integer)
    sb_kt = Column('sb_kt', Text)
    sb_fl = Column('sb_fl', Numeric)
    sb_gf = Column('sb_gf', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.fauna-steinbockkolonien', steinbockkolonien)


class SWISSPRTR(Base, Vector):
    __tablename__ = 'swissprtr'
    __table_args__ = ({'schema': 'prtr', 'autoload': False})
    __bodId__ = 'ch.bafu.swissprtr'
    __template__ = 'templates/htmlpopup/swissprtr.mako'
    __label__ = 'betrieb'
    id = Column('prtrnr', Numeric, primary_key=True)
    betrieb = Column('betrieb', Text)
    ort = Column('ort', Text)
    jahr = Column('jahr', Integer)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.swissprtr', SWISSPRTR)


class HOLZVORRAT(Base, Vector):
    __tablename__ = 'holzvorrat'
    __table_args__ = ({'schema': 'wald', 'autoload': False})
    __bodId__ = 'ch.bafu.holzvorrat'
    __template__ = 'templates/htmlpopup/holzvorrat.mako'
    __label__ = 'wireg_'
    id = Column('gid', Integer, primary_key=True)
    fid = Column('id', Integer)
    vorrat = Column('vorrat', Numeric)
    wireg_ = Column('wireg_', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.holzvorrat', HOLZVORRAT)


class HOLZZUWACHS(Base, Vector):
    __tablename__ = 'holzzuwachs'
    __table_args__ = ({'schema': 'wald', 'autoload': False})
    __bodId__ = 'ch.bafu.holzzuwachs'
    __template__ = 'templates/htmlpopup/holzzuwachs.mako'
    __label__ = 'wirtschaftsregion'
    id = Column('gid', Integer, primary_key=True)
    wirtschaftsregion = Column('wirtschaftsregion', Text)
    holzzuwachs = Column('holzzuwachs', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.holzzuwachs', HOLZZUWACHS)


class HOLZNUTZUNG(Base, Vector):
    __tablename__ = 'holznutzung'
    __table_args__ = ({'schema': 'wald', 'autoload': False})
    __bodId__ = 'ch.bafu.holznutzung'
    __template__ = 'templates/htmlpopup/holznutzung.mako'
    __label__ = 'wireg_'
    id = Column('gid', Integer, primary_key=True)
    wireg_ = Column('wireg_', Text)
    nutzung = Column('nutzung', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.holznutzung', HOLZNUTZUNG)


class NABEL(Base, Vector):
    __tablename__ = 'nabel'
    __table_args__ = ({'schema': 'luft', 'autoload': False})
    __bodId__ = 'ch.bafu.nabelstationen'
    __template__ = 'templates/htmlpopup/nabel.mako'
    __label__ = 'name'
    id = Column('id_stat', Text, primary_key=True)
    name = Column('name', Text)
    typ_de = Column('typ_de', Text)
    typ_fr = Column('typ_fr', Text)
    desc_de = Column('desc_de', Text)
    desc_fr = Column('desc_fr', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.nabelstationen', NABEL)


class krebspest(Base, Vector):
    __tablename__ = 'krebspest'
    __table_args__ = ({'schema': 'fischerei', 'autoload': False})
    __bodId__ = 'ch.bafu.fischerei-krebspest'
    __template__ = 'templates/htmlpopup/krebspest.mako'
    __label__ = 'kennummer'
    id = Column('_count', Integer, primary_key=True)
    kennummer = Column('kennummer', Text)
    gewaesser = Column('gewaesser', Text)
    art_lat = Column('art_lat', Text)
    jahr = Column('jahr', Text)
    ort = Column('ort', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.fischerei-krebspest', krebspest)


class biogeoreg(Base, Vector):
    __tablename__ = 'biogeoreg'
    __table_args__ = ({'schema': 'diverse', 'autoload': False})
    __bodId__ = 'ch.bafu.biogeographische_regionen'
    __template__ = 'templates/htmlpopup/biogeoreg.mako'
    __label__ = 'biogreg_r1'
    id = Column('bgdi_id', Integer, primary_key=True)
    biogreg_r6 = Column('biogreg_r6', Text)
    biogreg_ve = Column('biogreg_ve', Text)
    biogreg_r1 = Column('biogreg_r1', Text)
    biogreg_c6 = Column('biogreg_c6', Integer)
    biogreg_c1 = Column('biogreg_c1', Integer)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.biogeographische_regionen', biogeoreg)


class smaragd(Base, Vector):
    __tablename__ = 'smaragd'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __bodId__ = 'ch.bafu.schutzgebiete-smaragd'
    __template__ = 'templates/htmlpopup/smaragd.mako'
    __label__ = 'em_name'
    id = Column('id', Integer, primary_key=True)
    em_name = Column('em_name', Text)
    em_obj = Column('em_obj', Numeric)
    em_gf = Column('em_gf', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.schutzgebiete-smaragd', smaragd)


class biosphaerenreservate(Base, Vector):
    __tablename__ = 'biores'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __bodId__ = 'ch.bafu.schutzgebiete-biosphaerenreservate'
    __template__ = 'templates/htmlpopup/biosphaerenreservate.mako'
    __label__ = 'biores_nam'
    id = Column('bgdi_id', Integer, primary_key=True)
    biores_ver = Column('biores_ver', Text)
    biores_fl = Column('biores_fl', Text)
    biores_gf = Column('biores_gf', Text)
    biores_nam = Column('biores_nam', Text)
    biores_obj = Column('biores_obj', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.schutzgebiete-biosphaerenreservate', biosphaerenreservate)


class moose(Base, Vector):
    __tablename__ = 'mooseflora'
    __table_args__ = ({'schema': 'flora', 'autoload': False})
    __bodId__ = 'ch.bafu.moose'
    __template__ = 'templates/htmlpopup/moose.mako'
    __label__ = 'genus'
    id = Column('bgdi_id', Integer, primary_key=True)
    genus = Column('genus', Text)
    populationsnr = Column('populationsnr', Numeric)
    jahr = Column('jahr', Integer)
    standort = Column('standort', Text)
    rl_text = Column('rl_text', Text)
    nhv_text = Column('nhv_text', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.moose', moose)


class weltensutter(Base, Vector):
    __tablename__ = 'ws'
    __table_args__ = ({'schema': 'flora', 'autoload': False})
    __bodId__ = 'ch.bafu.flora-weltensutter_atlas'
    __template__ = 'templates/htmlpopup/weltensutter.mako'
    __label__ = 'nom'
    id = Column('gid', Integer, primary_key=True)
    nom = Column('nom', Text)
    no_surface = Column('no_surface', Numeric)
    ty_surface = Column('ty_surface', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.flora-weltensutter_atlas', weltensutter)


class baumarten(Base, Vector):
    __tablename__ = 'baumartenmischung'
    __table_args__ = ({'schema': 'wald', 'autoload': False})
    __bodId__ = 'ch.bafu.landesforstinventar-baumarten'
    __template__ = 'templates/htmlpopup/baumarten.mako'
    __label__ = 'wirtschaft'
    id = Column('bgdi_id', Integer, primary_key=True)
    wirtschaft = Column('wirtschaft', Text)
    anteil_lau = Column('anteil_lau', Numeric)
    anteil_nad = Column('anteil_nad', Numeric)
    vorrat = Column('vorrat', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.landesforstinventar-baumarten', baumarten)


class waldanteil(Base, Vector):
    __tablename__ = 'waldanteil'
    __table_args__ = ({'schema': 'wald', 'autoload': False})
    __bodId__ = 'ch.bafu.landesforstinventar-waldanteil'
    __template__ = 'templates/htmlpopup/waldanteil.mako'
    __label__ = 'wirtschaft'
    id = Column('bgdi_id', Integer, primary_key=True)
    wirtschaft = Column('wirtschaft', Text)
    waldflaech = Column('waldflaech', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.landesforstinventar-waldanteil', waldanteil)


class totholz(Base, Vector):
    __tablename__ = 'totholzvolumen'
    __table_args__ = ({'schema': 'wald', 'autoload': False})
    __bodId__ = 'ch.bafu.landesforstinventar-totholz'
    __template__ = 'templates/htmlpopup/totholz.mako'
    __label__ = 'wirtschaft'
    id = Column('bgdi_id', Integer, primary_key=True)
    wirtschaft = Column('wirtschaft', Text)
    totholzvol = Column('totholzvol', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.landesforstinventar-totholz', totholz)


class histerdbeben(Base, Vector):
    __tablename__ = 'historische_erdbeben'
    __table_args__ = ({'schema': 'gefahren', 'autoload': False})
    __bodId__ = 'ch.bafu.gefahren-historische_erdbeben'
    __template__ = 'templates/htmlpopup/histerdbeben.mako'
    __label__ = 'date_time'
    id = Column('bgdi_id', Integer, primary_key=True)
    fid = Column('id', Integer)
    epicentral = Column('epicentral', Text)
    intensity = Column('intensity', Text)
    magnitude = Column('magnitude', Numeric)
    date_time = Column('date_time', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.gefahren-historische_erdbeben', histerdbeben)


class spektral(Base, Vector):
    __tablename__ = 'baugrundkl_spectral'
    __table_args__ = ({'schema': 'gefahren', 'autoload': False})
    __bodId__ = 'ch.bafu.gefahren-spektral'
    __template__ = 'templates/htmlpopup/spektral.mako'
    __label__ = 'id'
    id = Column('_count', Integer, primary_key=True)
    fid = Column('id', Integer)
    spectral_3 = Column('spectral_3', Text)
    spectral_4 = Column('spectral_4', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.gefahren-spektral', spektral)


class trockenwiesenundweiden(Base, Vector):
    __tablename__ = 'tww'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-trockenwiesen_trockenweiden'
    __template__ = 'templates/htmlpopup/trockenwiesenundweiden.mako'
    __label__ = 'tww_name'
    id = Column('bgdi_id', Integer, primary_key=True)
    tww_name = Column('tww_name', Text)
    tww_fl = Column('tww_fl', Numeric)
    tww_gf = Column('tww_gf', Numeric)
    tww_obj = Column('tww_obj', Numeric)
    tww_tobj = Column('tww_tobj', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.bundesinventare-trockenwiesen_trockenweiden', trockenwiesenundweiden)


class trockenwiesenundweiden_anhang2(Base, Vector):
    __tablename__ = 'trockenwiesen_weiden_anhang2'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-trockenwiesen_trockenweiden_anhang2'
    __template__ = 'templates/htmlpopup/tww_anhang2.mako'
    __label__ = 'tww_name'
    id = Column('bgdi_id', Integer, primary_key=True)
    tww_name = Column('tww_name', Text)
    tww_obj = Column('tww_obj', Numeric)
    tww_tobj = Column('tww_tobj', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.bundesinventare-trockenwiesen_trockenweiden_anhang2', trockenwiesenundweiden_anhang2)


class amphibien_anhang4(Base, Vector):
    __tablename__ = 'amphibien_anhang4'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __bodId__ = 'ch.bafu.bundesinventare-amphibien_anhang4'
    __template__ = 'templates/htmlpopup/amphibien_anhang4.mako'
    __label__ = 'name'
    id = Column('bgdi_id', Integer, primary_key=True)
    name = Column('name', Text)
    obnr = Column('obnr', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.bundesinventare-amphibien_anhang4', amphibien_anhang4)


class baugrundklassen(Base, Vector):
    __tablename__ = 'baugrundklassen'
    __table_args__ = ({'schema': 'gefahren', 'autoload': False})
    __bodId__ = 'ch.bafu.gefahren-baugrundklassen'
    __template__ = 'templates/htmlpopup/baugrundklassen.mako'
    __label__ = 'bgk'
    id = Column('_count', Integer, primary_key=True)
    bgk = Column('bgk', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.gefahren-baugrundklassen', baugrundklassen)


class wrzselect(Base, Vector):
    __tablename__ = 'jgd_select'
    __table_args__ = ({'schema': 'wrzportal', 'autoload': False})
    __bodId__ = 'ch.bafu.wrz-jagdbanngebiete_select'
    __template__ = 'templates/htmlpopup/wrz_select.mako'
    __label__ = 'jb_name'
    id = Column('objectid', Integer, primary_key=True)
    jb_name = Column('jb_name', Text)
    jb_obj = Column('jb_obj', Integer)
    schutzstatus = Column('schutzstatus', Text)
    bestimmung = Column('bestimmung', Text)
    schutzzeit = Column('schutzzeit', Text)
    grundlage = Column('grundlage', Text)
    zusatzinformation = Column('zusatzinformation', Text)
    kanton = Column('kanton', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.wrz-jagdbanngebiete_select', wrzselect)


class wrzportal(Base, Vector):
    __tablename__ = 'wrz_portal'
    __table_args__ = ({'schema': 'wrzportal', 'autoload': False})
    __bodId__ = 'ch.bafu.wrz-wildruhezonen_portal'
    __template__ = 'templates/htmlpopup/wrz_portal.mako'
    __label__ = 'wrz_name'
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
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.wrz-wildruhezonen_portal', wrzportal)


class wildtier(Base, Vector):
    __tablename__ = 'wildtierkorridore'
    __table_args__ = ({'schema': 'fauna', 'autoload': False})
    __bodId__ = 'ch.bafu.fauna-wildtierkorridor_national'
    __template__ = 'templates/htmlpopup/wildtierkorridor.mako'
    __label__ = 'nr'
    id = Column('bgdi_id', Integer, primary_key=True)
    nr = Column('nr', Text)
    zusta_dt = Column('zusta_dt', Text)
    zusta_fr = Column('zusta_fr', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.fauna-wildtierkorridor_national', wildtier)


class waldreservate(Base, Vector):
    __tablename__ = 'waldreservate'
    __table_args__ = ({'schema': 'wald', 'autoload': False})
    __template__ = 'templates/htmlpopup/bafu_waldreservate.mako'
    __bodId__ = 'ch.bafu.waldreservate'
    __label__ = 'name'
    __queryable_attributes__ = ['objnummer', 'name', 'gisflaeche', 'gisteilobjekt', 'mcpfe']
    id = Column('bgdi_id', Integer, primary_key=True)
    objnummer = Column('objnummer', Text)
    gisteilobjekt = Column('obj_gisteilobjekt', Numeric)
    name = Column('name', Text)
    gisflaeche = Column('obj_gisflaeche', Numeric)
    mcpfe = Column('mcpfe_class', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.waldreservate', waldreservate)


class sturm_staudruck_30(Base, Vector):
    __tablename__ = 'data_staudruck'
    __table_args__ = ({'schema': 'diverse', 'autoload': False})
    __bodId__ = 'ch.bafu.sturm-staudruck_30'
    __template__ = 'templates/htmlpopup/sturm_staudruck.mako'
    __label__ = 'id'
    id = Column('bgdi_id', Integer, primary_key=True)
    staudruck_30 = Column('staudruck_30', Text)
    staudruck_50 = Column('staudruck_50', Text)
    staudruck_100 = Column('staudruck_100', Text)
    staudruck_300 = Column('staudruck_300', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.sturm-staudruck_30', sturm_staudruck_30)


class sturm_staudruck_50(Base, Vector):
    __tablename__ = 'data_staudruck'
    __table_args__ = ({'schema': 'diverse', 'autoload': False, 'extend_existing': True})
    __bodId__ = 'ch.bafu.sturm-staudruck_50'
    __template__ = 'templates/htmlpopup/sturm_staudruck.mako'
    __label__ = 'id'
    id = Column('bgdi_id', Integer, primary_key=True)
    staudruck_30 = Column('staudruck_30', Text)
    staudruck_50 = Column('staudruck_50', Text)
    staudruck_100 = Column('staudruck_100', Text)
    staudruck_300 = Column('staudruck_300', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.sturm-staudruck_50', sturm_staudruck_50)


class sturm_staudruck_100(Base, Vector):
    __tablename__ = 'data_staudruck'
    __table_args__ = ({'schema': 'diverse', 'autoload': False, 'extend_existing': True})
    __bodId__ = 'ch.bafu.sturm-staudruck_100'
    __template__ = 'templates/htmlpopup/sturm_staudruck.mako'
    __label__ = 'id'
    id = Column('bgdi_id', Integer, primary_key=True)
    staudruck_30 = Column('staudruck_30', Text)
    staudruck_50 = Column('staudruck_50', Text)
    staudruck_100 = Column('staudruck_100', Text)
    staudruck_300 = Column('staudruck_300', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.sturm-staudruck_100', sturm_staudruck_100)


class sturm_staudruck_300(Base, Vector):
    __tablename__ = 'data_staudruck'
    __table_args__ = ({'schema': 'diverse', 'autoload': False, 'extend_existing': True})
    __bodId__ = 'ch.bafu.sturm-staudruck_300'
    __template__ = 'templates/htmlpopup/sturm_staudruck.mako'
    __label__ = 'id'
    id = Column('bgdi_id', Integer, primary_key=True)
    staudruck_30 = Column('staudruck_30', Text)
    staudruck_50 = Column('staudruck_50', Text)
    staudruck_100 = Column('staudruck_100', Text)
    staudruck_300 = Column('staudruck_300', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.sturm-staudruck_300', sturm_staudruck_300)


class sturm_boeenspitzen_30(Base, Vector):
    __tablename__ = 'data_boeenspitzen'
    __table_args__ = ({'schema': 'diverse', 'autoload': False})
    __bodId__ = 'ch.bafu.sturm-boeenspitzen_30'
    __template__ = 'templates/htmlpopup/sturm_boeenspitzen.mako'
    __label__ = 'id'
    id = Column('oid', Integer, primary_key=True)
    boenspitzen_kmh_30 = Column('boenspitzen_kmh_30', Text)
    boenspitzen_ms_30 = Column('boenspitzen_ms_30', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.sturm-boeenspitzen_30', sturm_boeenspitzen_30)


class sturm_boeenspitzen_50(Base, Vector):
    __tablename__ = 'data_boeenspitzen'
    __table_args__ = ({'schema': 'diverse', 'autoload': False, 'extend_existing': True})
    __bodId__ = 'ch.bafu.sturm-boeenspitzen_50'
    __template__ = 'templates/htmlpopup/sturm_boeenspitzen.mako'
    __label__ = 'id'
    id = Column('oid', Integer, primary_key=True)
    boenspitzen_kmh_50 = Column('boenspitzen_kmh_50', Text)
    boenspitzen_ms_50 = Column('boenspitzen_ms_50', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.sturm-boeenspitzen_50', sturm_boeenspitzen_50)


class sturm_boeenspitzen_100(Base, Vector):
    __tablename__ = 'data_boeenspitzen'
    __table_args__ = ({'schema': 'diverse', 'autoload': False, 'extend_existing': True})
    __bodId__ = 'ch.bafu.sturm-boeenspitzen_100'
    __template__ = 'templates/htmlpopup/sturm_boeenspitzen.mako'
    __label__ = 'id'
    id = Column('oid', Integer, primary_key=True)
    boenspitzen_kmh_100 = Column('boenspitzen_kmh_100', Text)
    boenspitzen_ms_100 = Column('boenspitzen_ms_100', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.sturm-boeenspitzen_100', sturm_boeenspitzen_100)


class sturm_boeenspitzen_300(Base, Vector):
    __tablename__ = 'data_boeenspitzen'
    __table_args__ = ({'schema': 'diverse', 'autoload': False, 'extend_existing': True})
    __bodId__ = 'ch.bafu.sturm-boeenspitzen_300'
    __template__ = 'templates/htmlpopup/sturm_boeenspitzen.mako'
    __label__ = 'id'
    id = Column('oid', Integer, primary_key=True)
    boenspitzen_kmh_300 = Column('boenspitzen_kmh_300', Text)
    boenspitzen_ms_300 = Column('boenspitzen_ms_300', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.sturm-boeenspitzen_300', sturm_boeenspitzen_300)


class Hochwasserstatistik(Base, Vector):
    __tablename__ = 'hochwasserstatistik'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __bodId__ = 'ch.bafu.hydrologie-hochwasserstatistik'
    __template__ = 'templates/htmlpopup/hochwasserstatistik.mako'
    __queryable_attributes__ = ['name', 'einzugsgebietsflaeche', 'dimension', 'kenn_nr', 'statj_anf', 'statj_end', 'statj_tot', 'hq2', 'hq5', 'hq10', 'hq30', 'hq50', 'hq100', 'hq300', 'mittlerehoehe', 'regimename']
    __extended_info__ = True
    __label__ = 'name'
    id = Column('bgdi_id', Integer, primary_key=True)
    name = Column('name', Text)
    x_koord = Column('x_koord', Integer)
    y_koord = Column('y_koord', Integer)
    einzugsgebietsflaeche = Column('einzugsgebietsflaeche', Numeric)
    dimension = Column('dimension', Text)
    kenn_nr = Column('kenn_nr', Integer)
    statj_anf = Column('statj_anf', Integer)
    statj_end = Column('statj_end', Integer)
    statj_tot = Column('statj_tot', Integer)
    hq2 = Column('hq2', Numeric)
    hq5 = Column('hq5', Numeric)
    hq10 = Column('hq10', Numeric)
    hq30 = Column('hq30', Numeric)
    hq50 = Column('hq50', Numeric)
    hq100 = Column('hq100', Numeric)
    hq300 = Column('hq300', Numeric)
    mittlerehoehe = Column('mittlerehoehe', Numeric)
    regimename = Column('regimename', Text)
    url_fr = Column('url_fr', Text)
    url_de = Column('url_de', Text)
    urlhqpdf = Column('urlhqpdf', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.bafu.hydrologie-hochwasserstatistik', Hochwasserstatistik)
