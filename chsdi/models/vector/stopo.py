# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from sqlalchemy.types import Numeric
from geoalchemy import GeometryColumn, Geometry

from chsdi.models import *
from chsdi.models.vector import Vector


Base = bases['stopo']


class GravimetrischerAtlasMetadata (Base, Vector):
    __tablename__ = 'gravimetrie_atlas_metadata'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/gravimetrischer_atlas_metadata.mako'
    __bodId__ = 'ch.swisstopo.geologie-gravimetrischer_atlas.metadata'
    id = Column('nr', Integer, primary_key=True)
    titel = Column('titel', Text)
    jahr = Column('jahr', Numeric)
    autor = Column('autor', Text)
    formate_de = Column('formate_de', Text)
    formate_fr = Column('formate_fr', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-gravimetrischer_atlas.metadata', GravimetrischerAtlasMetadata)


class GeolSpezialKartenMetadata (Base, Vector):
    __tablename__ = 'kv_gsk_all'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/gsk_metadata.mako'
    __bodId__ = 'ch.swisstopo.geologie-spezialkarten_schweiz.metadata'
    id = Column('nr', Integer, primary_key=True)
    titel = Column('titel', Text)
    jahr = Column('jahr', Numeric)
    author = Column('author', Text)
    format_kz = Column('format_kz', Text)
    massstab = Column('massstab', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-spezialkarten_schweiz.metadata', GeolSpezialKartenMetadata)


class SwissboundariesBezirk(Base, Vector):
    __tablename__ = 'swissboundaries_bezirke'
    __table_args__ = ({'schema': 'tlm', 'autoload': False})
    __template__ = 'templates/htmlpopup/swissboundaries_bezirk.mako'
    __bodId__ = 'ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill'
    id = Column('id', Integer, primary_key=True)
    name = Column('name', Text)
    flaeche = Column('flaeche', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill', SwissboundariesBezirk)


class SwissboundariesGemeinde(Base, Vector):
    __tablename__ = 'swissboundaries_gemeinden'
    __table_args__ = ({'schema': 'tlm', 'autoload': False})
    __template__ = 'templates/htmlpopup/swissboundaries_gemeinde.mako'
    __bodId__ = 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill'
    id = Column('id', Integer, primary_key=True)
    gemname = Column('gemname', Text)
    gemflaeche = Column('gemflaeche', Numeric)
    perimeter = Column('perimeter', Numeric)
    kanton = Column('kanton', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill', SwissboundariesGemeinde)


class SwissboundariesKanton(Base, Vector):
    __tablename__ = 'swissboundaries_kantone'
    __table_args__ = ({'schema': 'tlm', 'autoload': False})
    __template__ = 'templates/htmlpopup/swissboundaries_kanton.mako'
    __bodId__ = 'ch.swisstopo.swissboundaries3d-kanton-flaeche.fill'
    id = Column('kantonsnr', Integer, primary_key=True)
    ak = Column('ak', Text)
    name = Column('name', Text)
    flaeche = Column('flaeche', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.swissboundaries3d-kanton-flaeche.fill', SwissboundariesKanton)


class CadastralWebMap(Base, Vector):
    __tablename__ = 'kantone25plus'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/cadastralwebmap.mako'
    __bodId__ = 'ch.kantone.cadastralwebmap-farbe'
    __displayFieldName__ = 'kantonsnr'
    id = Column('gid', Integer, primary_key=True)
    kantonsnr = Column('kantonsnr', Integer)
    ak = Column('ak', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.kantone.cadastralwebmap-farbe', CadastralWebMap)


class Vec200Terminal(Base, Vector):
    __tablename__ = 'vec200_terminal'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_terminal.mako'
    __bodId__ = 'ch.swisstopo.vec200-transportation-oeffentliche-verkehr'
    id = Column('gtdboid', Text, primary_key=True)
    objval = Column('objval', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))


class Vec200ShipKursschiff(Base, Vector):
    __tablename__ = 'v200_ship_kursschiff_linie_tooltip'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_ship_kursschiff_linie.mako'
    __bodId__ = 'ch.swisstopo.vec200-transportation-oeffentliche-verkehr'
    id = Column('gtdboid', Text, primary_key=True)
    detn = Column('detn', Text)
    rsu = Column('rsu', Text)
    use = Column('use', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))


class Vec200Railway(Base, Vector):
    __tablename__ = 'vec200_railway'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_railway.mako'
    __bodId__ = 'ch.swisstopo.vec200-transportation-oeffentliche-verkehr'
    id = Column('gtdboid', Text, primary_key=True)
    objval = Column('objval', Text)
    construct = Column('construct', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec200-transportation-oeffentliche-verkehr', Vec200Terminal)
register('ch.swisstopo.vec200-transportation-oeffentliche-verkehr', Vec200ShipKursschiff)
register('ch.swisstopo.vec200-transportation-oeffentliche-verkehr', Vec200Railway)


class treasurehunt(Base, Vector):
    __tablename__ = 'treasurehunt'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/treasurehunt.mako'
    __maxscale__ = 2505
    __bodId__ = 'ch.swisstopo.treasurehunt'
    id = Column('bgdi_id', Integer, primary_key=True)
    title_de = Column('title_de', Text)
    title_fr = Column('title_fr', Text)
    title_it = Column('title_it', Text)
    info_de = Column('info_de', Text)
    info_fr = Column('info_fr', Text)
    info_it = Column('info_it', Text)
    link_de = Column('link_de', Text)
    link_fr = Column('link_fr', Text)
    link_it = Column('link_it', Text)
    type_coord = Column('type_coord', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.treasurehunt', treasurehunt)


class Vec200Trafficinfo(Base, Vector):
    __tablename__ = 'vec200_trafficinfo'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_trafficinfo.mako'
    __bodId__ = 'ch.swisstopo.vec200-transportation-strassennetz'
    id = Column('gtdboid', Text, primary_key=True)
    objname = Column('objname', Text)
    objval = Column('objval', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))


class Vec200ShipAutofaehre(Base, Vector):
    __tablename__ = 'v200_ship_autofaehre_tooltip'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_ship_autofaehre.mako'
    __bodId__ = 'ch.swisstopo.vec200-transportation-strassennetz'
    id = Column('gtdboid', Text, primary_key=True)
    use = Column('use', Text)
    rsu = Column('rsu', Text)
    detn = Column('detn', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))


class Vec200Road(Base, Vector):
    __tablename__ = 'vec200_road'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_road.mako'
    __bodId__ = 'ch.swisstopo.vec200-transportation-strassennetz'
    id = Column('gtdboid', Text, primary_key=True)
    construct = Column('construct', Text)
    objval = Column('objval', Text)
    toll = Column('toll', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))


class Vec200Ramp(Base, Vector):
    __tablename__ = 'vec200_ramp'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_ramp.mako'
    __bodId__ = 'ch.swisstopo.vec200-transportation-strassennetz'
    id = Column('gtdboid', Text, primary_key=True)
    construct = Column('construct', Text)
    objval = Column('objval', Text)
    toll = Column('toll', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))


class Vec200Customsoffice(Base, Vector):
    __tablename__ = 'vec200_customsoffice'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_customsoffice.mako'
    __bodId__ = 'ch.swisstopo.vec200-transportation-strassennetz'
    id = Column('gtdboid', Text, primary_key=True)
    objname = Column('objname', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Trafficinfo)
register('ch.swisstopo.vec200-transportation-strassennetz', Vec200ShipAutofaehre)
register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Road)
register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Ramp)
register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Customsoffice)


class Vec200Protectedarea(Base, Vector):
    __tablename__ = 'vec200_protectedarea'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_protectedarea.mako'
    __bodId__ = 'ch.swisstopo.vec200-adminboundaries-protectedarea'
    id = Column('gtdboid', Text, primary_key=True)
    name = Column('name', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec200-adminboundaries-protectedarea', Vec200Protectedarea)


class Vec200Flowingwater(Base, Vector):
    __tablename__ = 'vec200_flowingwater'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_flowingwater.mako'
    __bodId__ = 'ch.swisstopo.vec200-hydrography'
    id = Column('gtdboid', Text, primary_key=True)
    name = Column('name', Text)
    exs = Column('exs', Text)
    hoc = Column('hoc', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))


class Vec200Stagnantwater(Base, Vector):
    __tablename__ = 'vec200_stagnantwater'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_stagnantwater.mako'
    __bodId__ = 'ch.swisstopo.vec200-hydrography'
    id = Column('gtdboid', Text, primary_key=True)
    name = Column('name', Text)
    seesph = Column('seesph', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec200-hydrography', Vec200Flowingwater)
register('ch.swisstopo.vec200-hydrography', Vec200Stagnantwater)


class Vec200Landcover(Base, Vector):
    __tablename__ = 'vec200_landcover'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_landcover.mako'
    __bodId__ = 'ch.swisstopo.vec200-landcover'
    id = Column('gtdboid', Text, primary_key=True)
    objname1 = Column('objname1', Text)
    objval = Column('objval', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec200-landcover', Vec200Landcover)


class Vec200Builtupp(Base, Vector):
    __tablename__ = 'vec200_builtupp'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_builtupp.mako'
    __bodId__ = 'ch.swisstopo.vec200-miscellaneous'
    id = Column('gtdboid', Text, primary_key=True)
    objname = Column('objname', Text)
    ppi = Column('ppi', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))


class Vec200Poi(Base, Vector):
    __tablename__ = 'v200_poi_tooltip'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_poi.mako'
    __bodId__ = 'ch.swisstopo.vec200-miscellaneous'
    id = Column('gtdboid', Text, primary_key=True)
    objname = Column('objname', Text)
    objval = Column('objval', Text)
    ppc = Column('ppc', Text)
    pro = Column('pro', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))


class Vec200Supply(Base, Vector):
    __tablename__ = 'vec200_supply'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_supply.mako'
    __bodId__ = 'ch.swisstopo.vec200-miscellaneous'
    id = Column('gtdboid', Text, primary_key=True)
    fco = Column('fco', Text)
    loc = Column('loc', Text)
    pro = Column('pro', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec200-miscellaneous', Vec200Builtupp)
register('ch.swisstopo.vec200-miscellaneous', Vec200Poi)
register('ch.swisstopo.vec200-miscellaneous', Vec200Supply)


class Vec200Namedlocation(Base, Vector):
    __tablename__ = 'vec200_namedlocation'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_namedlocation.mako'
    __bodId__ = 'ch.swisstopo.vec200-names-namedlocation'
    id = Column('gtdboid', Text, primary_key=True)
    objname1 = Column('objname1', Text)
    objname2 = Column('objname2', Text)
    altitude = Column('altitude', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec200-names-namedlocation', Vec200Namedlocation)


class Vec25Strassennetz(Base, Vector):
    __tablename__ = 'v25_str_25_l_tooltip'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec25_strassennetz.mako'
    __bodId__ = 'ch.swisstopo.vec25-strassennetz'
    id = Column('objectid', Integer, primary_key=True)
    length = Column('length', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec25-strassennetz', Vec25Strassennetz)


class Vec25Uebrige(Base, Vector):
    __tablename__ = 'v25_uvk_25_l'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec25_uebrigeverk.mako'
    __bodId__ = 'ch.swisstopo.vec25-uebrigerverkehr'
    id = Column('objectid', Integer, primary_key=True)
    length = Column('length', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec25-uebrigerverkehr', Vec25Uebrige)


class Vec25Anlagen(Base, Vector):
    __tablename__ = 'v25_anl_25_a'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec25_anlagen.mako'
    __bodId__ = 'ch.swisstopo.vec25-anlagen'
    id = Column('objectid', Integer, primary_key=True)
    area = Column('area', Numeric)
    perimeter = Column('perimeter', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec25-anlagen', Vec25Anlagen)


class Vec25Eisenbahnnetz(Base, Vector):
    __tablename__ = 'v25_eis_25_l'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec25_eisenbahnnetz.mako'
    __bodId__ = 'ch.swisstopo.vec25-eisenbahnnetz'
    id = Column('objectid', Integer, primary_key=True)
    length = Column('length', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec25-eisenbahnnetz', Vec25Eisenbahnnetz)


class Vec25Gebaeude(Base, Vector):
    __tablename__ = 'v25_geb_25_a'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec25_gebaeude.mako'
    __bodId__ = 'ch.swisstopo.vec25-gebaeude'
    id = Column('objectid', Integer, primary_key=True)
    area = Column('area', Numeric)
    perimeter = Column('perimeter', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec25-gebaeude', Vec25Gebaeude)


class Vec25Gewaessernetz(Base, Vector):
    __tablename__ = 'v25_gwn_25_l'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec25_gewaessernetz.mako'
    __bodId__ = 'ch.swisstopo.vec25-gewaessernetz'
    id = Column('objectid', Integer, primary_key=True)
    objectval = Column('objectval', Text)
    gewissnr = Column('gewissnr', Numeric)
    name = Column('name', Text)
    length = Column('length', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec25-gewaessernetz', Vec25Gewaessernetz)


class Vec25Primaerflaechen(Base, Vector):
    __tablename__ = 'v25_pri25_a'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec25_primaerflaechen.mako'
    __bodId__ = 'ch.swisstopo.vec25-primaerflaechen'
    id = Column('objectid', Integer, primary_key=True)
    area = Column('area', Numeric)
    perimeter = Column('perimeter', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec25-primaerflaechen', Vec25Primaerflaechen)


class Vec25Einzelobjekte(Base, Vector):
    __tablename__ = 'v25_eob_25_l'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec25_einzelobjekte.mako'
    __bodId__ = 'ch.swisstopo.vec25-einzelobjekte'
    id = Column('objectid', Integer, primary_key=True)
    length = Column('length', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec25-einzelobjekte', Vec25Einzelobjekte)


class Vec25Heckenbaeume(Base, Vector):
    __tablename__ = 'v25_heb_25_l'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec25_heckenbaeume.mako'
    __bodId__ = 'ch.swisstopo.vec25-heckenbaeume'
    id = Column('objectid', Integer, primary_key=True)
    length = Column('length', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec25-heckenbaeume', Vec25Heckenbaeume)


class Dreiecksvermaschung(Base, Vector):
    __tablename__ = 'dreiecksvermaschung'
    __table_args__ = ({'schema': 'geodaesie', 'autoload': False})
    __template__ = 'templates/htmlpopup/dreiecksvermaschung.mako'
    __bodId__ = 'ch.swisstopo.dreiecksvermaschung'
    id = Column('bgdi_id', Integer, primary_key=True)
    nom = Column('nom', Text)
    num = Column('num', Text)
    type = Column('type', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.dreiecksvermaschung', Dreiecksvermaschung)


class GridstandPk25(Base, Vector):
    __tablename__ = 'view_gridstand_datenhaltung_pk25_tilecache'
    __table_args__ = ({'schema': 'datenstand', 'autoload': False})
    __template__ = 'templates/htmlpopup/pk25_metadata.mako'
    __bodId__ = 'ch.swisstopo.pixelkarte-farbe-pk25.noscale'
    id = Column('kbnum', Text, primary_key=True)
    lk_name = Column('lk_name', Text)
    release = Column('release', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.pixelkarte-farbe-pk25.noscale', GridstandPk25)


class GridstandPk25Meta(GridstandPk25):
    __bodId__ = 'ch.swisstopo.pixelkarte-pk25.metadata'

register('ch.swisstopo.pixelkarte-pk25.metadata', GridstandPk25Meta)


class GridstandPk50(Base, Vector):
    __tablename__ = 'view_gridstand_datenhaltung_pk50_tilecache'
    __table_args__ = ({'schema': 'datenstand', 'autoload': False})
    __template__ = 'templates/htmlpopup/pk50_metadata.mako'
    __bodId__ = 'ch.swisstopo.pixelkarte-farbe-pk50.noscale'
    id = Column('kbnum', Text, primary_key=True)
    lk_name = Column('lk_name', Text)
    release = Column('release', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.pixelkarte-farbe-pk50.noscale', GridstandPk50)


class GridstandPk50Meta(GridstandPk50):
    __bodId__ = 'ch.swisstopo.pixelkarte-pk50.metadata'

register('ch.swisstopo.pixelkarte-pk50.metadata', GridstandPk50Meta)


class GridstandPk100(Base, Vector):
    __tablename__ = 'view_gridstand_datenhaltung_pk100_tilecache'
    __table_args__ = ({'schema': 'datenstand', 'autoload': False})
    __template__ = 'templates/htmlpopup/pk100_metadata.mako'
    __bodId__ = 'ch.swisstopo.pixelkarte-farbe-pk100.noscale'
    id = Column('kbnum', Text, primary_key=True)
    lk_name = Column('lk_name', Text)
    release = Column('release', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.pixelkarte-farbe-pk100.noscale', GridstandPk100)


class GridstandPk100Meta(GridstandPk100):
    __bodId__ = 'ch.swisstopo.pixelkarte-pk100.metadata'

register('ch.swisstopo.pixelkarte-pk100.metadata', GridstandPk100Meta)


class GridstandPk200(Base, Vector):
    __tablename__ = 'view_gridstand_datenhaltung_pk200_tilecache'
    __table_args__ = ({'schema': 'datenstand', 'autoload': False})
    __template__ = 'templates/htmlpopup/pk200_metadata.mako'
    __bodId__ = 'ch.swisstopo.pixelkarte-farbe-pk200.noscale'
    id = Column('kbnum', Text, primary_key=True)
    lk_name = Column('lk_name', Text)
    release = Column('release', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.pixelkarte-farbe-pk200.noscale', GridstandPk200)


class GridstandPk200Meta(GridstandPk200):
    __bodId__ = 'ch.swisstopo.pixelkarte-pk200.metadata'

register('ch.swisstopo.pixelkarte-pk200.metadata', GridstandPk200Meta)


class GridstandPk500(Base, Vector):
    __tablename__ = 'view_gridstand_datenhaltung_pk500_tilecache'
    __table_args__ = ({'schema': 'datenstand', 'autoload': False})
    __template__ = 'templates/htmlpopup/pk500_metadata.mako'
    __bodId__ = 'ch.swisstopo.pixelkarte-farbe-pk500.noscale'
    id = Column('kbnum', Text, primary_key=True)
    lk_name = Column('lk_name', Text)
    release = Column('release', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.pixelkarte-farbe-pk500.noscale', GridstandPk500)


class GridstandPk500Meta(GridstandPk500):
    __bodId__ = 'ch.swisstopo.pixelkarte-pk500.metadata'

register('ch.swisstopo.pixelkarte-pk500.metadata', GridstandPk500Meta)


class GridstandSwissimage(Base, Vector):
    __tablename__ = 'view_gridstand_datenhaltung_swissimage_tilecache'
    __table_args__ = ({'schema': 'datenstand', 'autoload': False})
    __template__ = 'templates/htmlpopup/images_metadata.mako'
    __bodId__ = 'ch.swisstopo.images-swissimage.metadata'
    id = Column('tilenumber', Text, primary_key=True)
    lk25_name = Column('lk25_name', Text)
    datenstand = Column('datenstand', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.images-swissimage.metadata', GridstandSwissimage)


class GeolGeocoverMetadata(Base, Vector):
    __tablename__ = 'kv_geocover'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geocover_metadata.mako'
    __bodId__ = 'ch.swisstopo.geologie-geocover.metadata'
    id = Column('gid', Integer, primary_key=True)
    nr = Column('nr', Text)
    titel = Column('titel', Text)
    basis = Column('basis', Text)
    vektorisierung_jahr = Column('vektorisierung_jahr', Integer)
    grat25 = Column('grat25', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geocover.metadata', GeolGeocoverMetadata)


class GeolGenKarteGGK200(Base, Vector):
    __tablename__ = 'kv_ggk_pk'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/generalkarte_ggk200.mako'
    __bodId__ = 'ch.swisstopo.geologie-generalkarte-ggk200'
    id = Column('gid', Integer, primary_key=True)
    nr = Column('nr', Integer)
    titel = Column('titel', Text)
    url_legend = Column('url_legend', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-generalkarte-ggk200', GeolGenKarteGGK200)


class GeolKarten500Metadata(Base, Vector):
    __tablename__ = 'gk500'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/geolkarten500_metadata.mako'
    __bodId__ = 'ch.swisstopo.geologie-geolkarten500.metadata'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geolkarten500.metadata', GeolKarten500Metadata)


class GeologischeKarteLine(Base, Vector):
    __tablename__ = 'geologische_karte_line'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geologische_karte_line.mako'
    __bodId__ = 'ch.swisstopo.geologie-geologische_karte'
    id = Column('fid', Text, primary_key=True)
    gid = Column('id', Integer)
    type_de = Column('type_de', Text)
    type_fr = Column('type_fr', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))


class GeologischeKartePlg(Base, Vector):
    __tablename__ = 'geologische_karte_plg'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geologische_karte_plg.mako'
    __bodId__ = 'ch.swisstopo.geologie-geologische_karte'
    id = Column('id', Text, primary_key=True)
    leg_geol_d = Column('leg_geol_d', Text)
    leg_geol_f = Column('leg_geol_f', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geologische_karte', GeologischeKarteLine)
register('ch.swisstopo.geologie-geologische_karte', GeologischeKartePlg)


class GeologieMineralischeRohstoffe200(Base, Vector):
    __tablename__ = 'geotechnik_mineralische_rohstoffe200'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geotechnik_mineralische_rohstoffe200.mako'
    __bodId__ = 'ch.swisstopo.geologie-geotechnik-mineralische_rohstoffe200'
    id = Column('bgdi_id', Integer, primary_key=True)
    legend = Column('legend', Text)
    area_name = Column('area_name', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-mineralische_rohstoffe200', GeologieMineralischeRohstoffe200)


class GeologieGeotechnikGk200(Base, Vector):
    __tablename__ = 'geotechnik_gk200_lgd'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geotechnik_gk200.mako'
    __bodId__ = 'ch.swisstopo.geologie-geotechnik-gk200'
    id = Column('bgdi_id', Integer, primary_key=True)
    file_name = Column('file_name', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-gk200', GeologieGeotechnikGk200)


class Gk500_Gensese (Base, Vector):
    __tablename__ = 'gk500_genese'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/gk500-genese.mako'
    __bodId__ = 'ch.swisstopo.geologie-geotechnik-gk500-genese'
    id = Column('bgdi_id', Integer, primary_key=True)
    genese_de = Column('genese_de', Text)
    genese_fr = Column('genese_fr', Text)
    genese_en = Column('genese_en', Text)
    genese_it = Column('genese_it', Text)
    genese_rm = Column('genese_rm', Text)
    bgdi_tooltip_color = Column('bgdi_tooltip_color', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-gk500-genese', Gk500_Gensese)


class Gk500_Gesteinsklassierung (Base, Vector):
    __tablename__ = 'gk500_gesteinsklassierung'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/gk500-gesteinsklassierung.mako'
    __bodId__ = 'ch.swisstopo.geologie-geotechnik-gk500-gesteinsklassierung'
    id = Column('bgdi_id', Integer, primary_key=True)
    gestkl_de = Column('gestkl_de', Text)
    gestkl_fr = Column('gestkl_fr', Text)
    gestkl_en = Column('gestkl_en', Text)
    gestkl_it = Column('gestkl_it', Text)
    gestkl_rm = Column('gestkl_rm', Text)
    bgdi_tooltip_color = Column('bgdi_tooltip_color', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-gk500-gesteinsklassierung', Gk500_Gesteinsklassierung)


class Gk500_lithologie_hauptgruppen(Base, Vector):
    __tablename__ = 'gk500_lithologie_hauptgruppen'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/lithologie_hauptgruppen.mako'
    __bodId__ = 'ch.swisstopo.geologie-geotechnik-gk500-lithologie_hauptgruppen'
    id = Column('bgdi_id', Integer, primary_key=True)
    bgdi_tooltip_de = Column('bgdi_tooltip_de', Text)
    bgdi_tooltip_fr = Column('bgdi_tooltip_fr', Text)
    bgdi_tooltip_en = Column('bgdi_tooltip_en', Text)
    bgdi_tooltip_it = Column('bgdi_tooltip_it', Text)
    bgdi_tooltip_rm = Column('bgdi_tooltip_rm', Text)
    bgdi_tooltip_color = Column('bgdi_tooltip_color', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-gk500-lithologie_hauptgruppen', Gk500_lithologie_hauptgruppen)


class GeologieGeotechnikSteinbrueche1915(Base, Vector):
    __tablename__ = 'geotechnik_steinbrueche_1915'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/steinbrueche_1915.mako'
    __bodId__ = 'ch.swisstopo.geologie-geotechnik-steinbrueche_1915'
    id = Column('id', Integer, primary_key=True)
    gesteinsgr = Column('gesteinsgr', Text)
    gestein = Column('gestein', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-steinbrueche_1915', GeologieGeotechnikSteinbrueche1915)


class GeologieGeotechnikSteinbrueche1965(Base, Vector):
    __tablename__ = 'geotechnik_steinbrueche_1965'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/steinbrueche_1965.mako'
    __bodId__ = 'ch.swisstopo.geologie-geotechnik-steinbrueche_1965'
    id = Column('id', Integer, primary_key=True)
    gesteinsgr = Column('gesteinsgr', Text)
    gestein = Column('gestein', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-steinbrueche_1965', GeologieGeotechnikSteinbrueche1965)


class GeologieGeotechnikSteinbrueche1980(Base, Vector):
    __tablename__ = 'geotechnik_steinbrueche_1980'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/steinbrueche_1980.mako'
    __bodId__ = 'ch.swisstopo.geologie-geotechnik-steinbrueche_1980'
    id = Column('id', Integer, primary_key=True)
    gesteinsgr = Column('gesteinsgr', Text)
    gestein = Column('gestein', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-steinbrueche_1980', GeologieGeotechnikSteinbrueche1980)


class GeologieGeotechnikSteinbrueche1995(Base, Vector):
    __tablename__ = 'geotechnik_steinbrueche_1995'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/steinbrueche_1995.mako'
    __bodId__ = 'ch.swisstopo.geologie-geotechnik-steinbrueche_1995'
    id = Column('id', Integer, primary_key=True)
    gesteinsgr = Column('gesteinsgr', Text)
    gestein = Column('gestein', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-steinbrueche_1995', GeologieGeotechnikSteinbrueche1995)


class GeologieGeotechnikZementindustrie1965(Base, Vector):
    __tablename__ = 'geotechnik_zementindustrie'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/zementindustrie_1965.mako'
    __bodId__ = 'ch.swisstopo.geologie-geotechnik-zementindustrie_1965'
    id = Column('id', Integer, primary_key=True)
    stoff = Column('stoff', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-zementindustrie_1965', GeologieGeotechnikZementindustrie1965)


class GeologieGeotechnikZementindustrie1995(Base, Vector):
    __tablename__ = 'geotechnik_zementindustrie'
    __table_args__ = ({'schema': 'geol', 'autoload': False, 'extend_existing': True})
    __template__ = 'templates/htmlpopup/zementindustrie_1995.mako'
    __bodId__ = 'ch.swisstopo.geologie-geotechnik-zementindustrie_1995'
    id = Column('id', Integer, primary_key=True)
    stoff = Column('stoff', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-zementindustrie_1995', GeologieGeotechnikZementindustrie1995)


class GeologieGeotechnikZiegeleien1907(Base, Vector):
    __tablename__ = 'geotechnik_ziegeleien_1907'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/ziegeleien_1907.mako'
    #__queryable_attributes__ = ['ziegelei_2']
    __bodId__ = 'ch.swisstopo.geologie-geotechnik-ziegeleien_1907'
    id = Column('id', Integer, primary_key=True)
    ziegelei_2 = Column('ziegelei_2', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-ziegeleien_1907', GeologieGeotechnikZiegeleien1907)


class GeologieGeotechnikZiegeleien1965(Base, Vector):
    __tablename__ = 'geotechnik_ziegeleien_1965'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/ziegeleien_1965.mako'
    #__queryable_attributes__ = ['ziegelei']
    __bodId__ = 'ch.swisstopo.geologie-geotechnik-ziegeleien_1965'
    id = Column('id', Integer, primary_key=True)
    ziegelei = Column('ziegelei', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-ziegeleien_1965', GeologieGeotechnikZiegeleien1965)


class GeologieGeotechnikZiegeleien1995(Base, Vector):
    __tablename__ = 'geotechnik_ziegeleien_1995'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/ziegeleien_1995.mako'
    #__queryable_attributes__ = ['ziegeleien']
    __bodId__ = 'ch.swisstopo.geologie-geotechnik-ziegeleien_1995'
    id = Column('id', Integer, primary_key=True)
    ziegeleien = Column('ziegeleien', Text)
    produkt = Column('produkt', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-ziegeleien_1995', GeologieGeotechnikZiegeleien1995)


class GeologieHydroKarteGrundwasservorkommen(Base, Vector):
    __tablename__ = 'grundwasservorkommen'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/grundwasservorkommen.mako'
    __bodId__ = 'ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen'
    id = Column('bgdi_id', Integer, primary_key=True)
    type_de = Column('type_de', Text)
    type_fr = Column('type_fr', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen', GeologieHydroKarteGrundwasservorkommen)


class GeologieHydroKarteGrundwasservulneabilitaet(Base, Vector):
    __tablename__ = 'grundwasservorkommen_plg'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/grundwasservulnerabilitaet.mako'
    __bodId__ = 'ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet'
    id = Column('bgdi_id', Integer, primary_key=True)
    type_de = Column('type_de', Text)
    type_fr = Column('type_fr', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet', GeologieHydroKarteGrundwasservulneabilitaet)


class GeologieGeothermie(Base, Vector):
    __tablename__ = 'geophysik_geothermie'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geothermie.mako'
    __bodId__ = 'ch.swisstopo.geologie-geophysik-geothermie'
    id = Column('gid', Integer, primary_key=True)
    fid = Column('id', Integer)
    contour = Column('contour', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geophysik-geothermie', GeologieGeothermie)


class Geologischer_Deklination(Base, Vector):
    __tablename__ = 'geophysik_deklination'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/deklination.mako'
    __bodId__ = 'ch.swisstopo.geologie-geophysik-deklination'
    id = Column('gid', Integer, primary_key=True)
    magne = Column('magne', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geophysik-deklination', Geologischer_Deklination)


class Geologischer_Inklination(Base, Vector):
    __tablename__ = 'geophysik_inklination'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/inklination.mako'
    __bodId__ = 'ch.swisstopo.geologie-geophysik-inklination'
    id = Column('gid', Integer, primary_key=True)
    contour = Column('contour', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geophysik-inklination', Geologischer_Inklination)


class Geologischer_Aeromagnetik_Jura(Base, Vector):
    __tablename__ = 'gravimetrie_aeromagnetik_jura'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/aeromagnetik_jura.mako'
    __bodId__ = 'ch.swisstopo.geologie-geophysik-aeromagnetische_karte_jura'
    id = Column('gid', Integer, primary_key=True)
    fid = Column('id', Integer)
    et_fromatt = Column('et_fromatt', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geophysik-aeromagnetische_karte_jura', Geologischer_Aeromagnetik_Jura)


class Geologischer_Aeromagnetik_CH(Base, Vector):
    __tablename__ = 'gravimetrie_aeromagnetik_ch'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/aeromagnetik_schweiz.mako'
    __bodId__ = 'ch.swisstopo.geologie-geophysik-aeromagnetische_karte_schweiz'
    id = Column('gid', Integer, primary_key=True)
    fid = Column('id', Integer)
    et_fromatt = Column('et_fromatt', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geophysik-aeromagnetische_karte_schweiz', Geologischer_Aeromagnetik_CH)


class GeologieIsostatischeAnomalien(Base, Vector):
    __tablename__ = 'schwerekarte_isostatische_anomalien'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/isostatische_anomalien.mako'
    __bodId__ = 'ch.swisstopo.geologie-geodaesie-isostatische_anomalien'
    id = Column('gid', Integer, primary_key=True)
    fid = Column('id', Integer)
    et_fromatt = Column('et_fromatt', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geodaesie-isostatische_anomalien', GeologieIsostatischeAnomalien)


class GeologieBouguerAnomalien(Base, Vector):
    __tablename__ = 'geodaesie_bouguer_anomalien'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/bouguer_anomalien.mako'
    __bodId__ = 'ch.swisstopo.geologie-geodaesie-bouguer_anomalien'
    id = Column('gid', Integer, primary_key=True)
    et_fromatt = Column('et_fromatt', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geodaesie-bouguer_anomalien', GeologieBouguerAnomalien)


class GeologieGeophysikTotalintensitaet(Base, Vector):
    __tablename__ = 'geophysik_totalintensitaet'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/totalintensitaet.mako'
    __bodId__ = 'ch.swisstopo.geologie-geophysik-totalintensitaet'
    id = Column('gid', Integer, primary_key=True)
    fid = Column('id', Integer)
    contour = Column('contour', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geophysik-totalintensitaet', GeologieGeophysikTotalintensitaet)


class GeologieRohstoffeIndustrieminerale(Base, Vector):
    __tablename__ = 'rohstoffe_industrieminerale'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/rohstoffe_industrieminerale.mako'
    #__queryable_attributes__ = ['name_ads']
    __bodId__ = 'ch.swisstopo.geologie-rohstoffe-industrieminerale'
    id = Column('id', Integer, primary_key=True)
    rohstoff = Column('rohstoff', Text)
    name_ads = Column('name_ads', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-rohstoffe-industrieminerale', GeologieRohstoffeIndustrieminerale)


class GeologieRohstoffeKohlenBitumenErdgas(Base, Vector):
    __tablename__ = 'rohstoffe_kohlen_bitumen_erdgas'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/rohstoffe_kohlen_bitumen_erdgas.mako'
    #__queryable_attributes__ = ['name_ads']
    __bodId__ = 'ch.swisstopo.geologie-rohstoffe-kohlen_bitumen_erdgas'
    id = Column('id', Integer, primary_key=True)
    rohstoff = Column('rohstoff', Text)
    name_ads = Column('name_ads', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-rohstoffe-kohlen_bitumen_erdgas', GeologieRohstoffeKohlenBitumenErdgas)


class GeologieRohstoffeVererzungen(Base, Vector):
    __tablename__ = 'rohstoffe_vererzungen'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/rohstoffe_vererzungen.mako'
    #__queryable_attributes__ = ['name_ads']
    __bodId__ = 'ch.swisstopo.geologie-rohstoffe-vererzungen'
    id = Column('id', Integer, primary_key=True)
    rohstoff = Column('rohstoff', Text)
    name_ads = Column('name_ads', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-rohstoffe-vererzungen', GeologieRohstoffeVererzungen)


class GeologieTektonischeKarteLine(Base, Vector):
    __tablename__ = 'tektonische_karte_line'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/tektonische_karte_line.mako'
    __bodId__ = 'ch.swisstopo.geologie-tektonische_karte'
    id = Column('fid', Integer, primary_key=True)
    line_id = Column('line_id', Integer)
    type_de = Column('type_de', Text)
    type_fr = Column('type_fr', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))


class GeologieTektonischeKartePoly(Base, Vector):
    __tablename__ = 'tektonische_karte_flaechen'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/tektonische_karte_poly.mako'
    __bodId__ = 'ch.swisstopo.geologie-tektonische_karte'
    id = Column('fid', Integer, primary_key=True)
    t2_id = Column('t2_id', Integer)
    type_de = Column('type_de', Text)
    type_fr = Column('type_fr', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-tektonische_karte', GeologieTektonischeKarteLine)
register('ch.swisstopo.geologie-tektonische_karte', GeologieTektonischeKartePoly)


class Swisstlm3dWanderwege(Base, Vector):
    __tablename__ = 'wanderwege_swissmap'
    __table_args__ = ({'schema': 'karto', 'autoload': False})
    __template__ = 'templates/htmlpopup/swissmap_online_wanderwege.mako'
    __bodId__ = 'ch.swisstopo.swisstlm3d-wanderwege'
    id = Column('nr', Integer, primary_key=True)
    hikingtype = Column('hikingtype', Text)
    bridgetype = Column('bridgetype', Text)
    tunneltype = Column('tunneltype', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.swisstlm3d-wanderwege', Swisstlm3dWanderwege)


class VerschiebungsvektorenTsp1(Base, Vector):
    __tablename__ = 'verschiebungsvektoren_tsp1'
    __table_args__ = ({'schema': 'geodaesie', 'autoload': False})
    __template__ = 'templates/htmlpopup/verschiebungsvektoren_tps1.mako'
    #__queryable_attributes__ = ['name']
    __bodId__ = 'ch.swisstopo.verschiebungsvektoren-tsp1'
    id = Column('id', Integer, primary_key=True)
    name = Column('name', Text)
    type = Column('type', Text)
    e_lv03 = Column('e_lv03', Numeric)
    e_lv95 = Column('e_lv95', Numeric)
    n_lv03 = Column('n_lv03', Numeric)
    n_lv95 = Column('n_lv95', Numeric)
    de = Column('de', Numeric)
    dn = Column('dn', Numeric)
    fs = Column('fs', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.verschiebungsvektoren-tsp1', VerschiebungsvektorenTsp1)


class VerschiebungsvektorenTsp2(Base, Vector):
    __tablename__ = 'verschiebungsvektoren_tsp2'
    __table_args__ = ({'schema': 'geodaesie', 'autoload': False})
    __template__ = 'templates/htmlpopup/verschiebungsvektoren_tps2.mako'
    #__queryable_attributes__ = ['name']
    __bodId__ = 'ch.swisstopo.verschiebungsvektoren-tsp2'
    id = Column('id', Integer, primary_key=True)
    name = Column('name', Text)
    type = Column('type', Text)
    e_lv03 = Column('e_lv03', Numeric)
    e_lv95 = Column('e_lv95', Numeric)
    n_lv03 = Column('n_lv03', Numeric)
    n_lv95 = Column('n_lv95', Numeric)
    de = Column('de', Numeric)
    dn = Column('dn', Numeric)
    fs = Column('fs', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.verschiebungsvektoren-tsp2', VerschiebungsvektorenTsp2)


class SwissmapOnlineWanderwege(Base, Vector):
    __tablename__ = 'wanderwege_swissmap'
    __table_args__ = ({'schema': 'karto', 'autoload': False, 'extend_existing': True})
    __template__ = 'templates/htmlpopup/swissmap_online_wanderwege.mako'
    __bodId__ = 'ch.swisstopo-karto.wanderwege'
    id = Column('nr', Integer, primary_key=True)
    hikingtype = Column('hikingtype', Text)
    bridgetype = Column('bridgetype', Text)
    tunneltype = Column('tunneltype', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo-karto.wanderwege', SwissmapOnlineWanderwege)


class PLZOrtschaften(Base, Vector):
    __tablename__ = 'gabmo_plz'
    __table_args__ = ({'schema': 'vd', 'autoload': False})
    __template__ = 'templates/htmlpopup/gabmo_plz.mako'
    __bodId__ = 'ch.swisstopo-vd.ortschaftenverzeichnis_plz'
    id = Column('os_uuid', Text, primary_key=True)
    plz = Column('plz', Integer)
    zusziff = Column('zusziff', Text)
    langtext = Column('langtext', Text)
    bgdi_created = Column('bgdi_created', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo-vd.ortschaftenverzeichnis_plz', PLZOrtschaften)


class geometaStandAV(Base, Vector):
    __tablename__ = 'amogr_standav'
    __table_args__ = ({'schema': 'vd', 'autoload': False})
    __template__ = 'templates/htmlpopup/standav.mako'
    __bodId__ = 'ch.swisstopo-vd.geometa-standav'
    id = Column('gid', Integer, primary_key=True)
    fid = Column('id', Integer)
    quality = Column('quality', Text)
    frame = Column('frame', Text)
    the_geom = GeometryColumn('the_geom_gen50', Geometry(dimension=2, srid=21781))

register('ch.swisstopo-vd.geometa-standav', geometaStandAV)


class geometaLos(Base, Vector):
    __tablename__ = 'amogr_los'
    __table_args__ = ({'schema': 'vd', 'autoload': False})
    __template__ = 'templates/htmlpopup/los.mako'
    __bodId__ = 'ch.swisstopo-vd.geometa-los'
    id = Column('gid', Integer, primary_key=True)
    fid = Column('id', Integer)
    neu_id = Column('neu_id', Text)
    operatsname = Column('operatsname', Text)
    losnr = Column('losnr', Text)
    taetigkeit_d = Column('taetigkeit_d', Text)
    taetigkeit_f = Column('taetigkeit_f', Text)
    taetigkeit_i = Column('taetigkeit_i', Text)
    quality = Column('quality', Text)
    flaeche_vertrag = Column('flaeche_vertrag', Text)
    frame = Column('frame', Text)
    bgdi_created = Column('bgdi_created', Text)
    the_geom = GeometryColumn('the_geom_gen50', Geometry(dimension=2, srid=21781))

register('ch.swisstopo-vd.geometa-los', geometaLos)

# link sur le pdf ne fontionne pas...


class geometaGemeinde(Base, Vector):
    __tablename__ = 'amogr_gemeinde'
    __table_args__ = ({'schema': 'vd', 'autoload': False})
    __template__ = 'templates/htmlpopup/gemeinde.mako'
    __bodId__ = 'ch.swisstopo-vd.geometa-gemeinde'
    id = Column('gid', Integer, primary_key=True)
    fid = Column('id', Integer)
    gemeindename = Column('gemeindename', Text)
    kanton = Column('kanton', Text)
    flaeche_ha = Column('flaeche_ha', Text)
    bfs_nr = Column('bfs_nr', Integer)
    pdf_liste = Column('pdf_liste', Text)
    abgabestelle = Column('abgabestelle', Text)
    bgdi_created = Column('bgdi_created', Text)
    the_geom = GeometryColumn('the_geom_gen50', Geometry(dimension=2, srid=21781))

register('ch.swisstopo-vd.geometa-gemeinde', geometaGemeinde)


class geometaGrundbuch(Base, Vector):
    __tablename__ = 'amogr_grundbuch'
    __table_args__ = ({'schema': 'vd', 'autoload': False})
    __template__ = 'templates/htmlpopup/grundbuch.mako'
    __bodId__ = 'ch.swisstopo-vd.geometa-grundbuch'
    id = Column('gid', Integer, primary_key=True)
    fid = Column('id', Integer)
    ortsteil_grundbuch = Column('ortsteil_grundbuch', Text)
    grundbuchfuehrung_d = Column('grundbuchfuehrung_d', Text)
    grundbuchfuehrung_f = Column('grundbuchfuehrung_f', Text)
    grundbuchfuehrung_i = Column('grundbuchfuehrung_i', Text)
    grundbuchkreis = Column('grundbuchkreis', Text)
    adresse = Column('adresse', Text)
    telefon = Column('telefon', Text)
    email = Column('email', Text)
    bgdi_created = Column('bgdi_created', Text)
    the_geom = GeometryColumn('the_geom_gen50', Geometry(dimension=2, srid=21781))

register('ch.swisstopo-vd.geometa-grundbuch', geometaGrundbuch)


class geometaNfgeom(Base, Vector):
    __tablename__ = 'amogr_nfgeom'
    __table_args__ = ({'schema': 'vd', 'autoload': False})
    __template__ = 'templates/htmlpopup/nfgeom.mako'
    __bodId__ = 'ch.swisstopo-vd.geometa-nfgeom'
    id = Column('gid', Integer, primary_key=True)
    name = Column('name', Text)
    firmenname = Column('firmenname', Text)
    adresse = Column('adresse', Text)
    telefon = Column('telefon', Text)
    email = Column('email', Text)
    bgdi_created = Column('bgdi_created', Text)
    the_geom = GeometryColumn('the_geom_gen50', Geometry(dimension=2, srid=21781))

register('ch.swisstopo-vd.geometa-nfgeom', geometaNfgeom)


class oerebkataster(Base, Vector):
    __tablename__ = 'view_oereb_nfgeom'
    __table_args__ = ({'schema': 'vd', 'autoload': False})
    __template__ = 'templates/htmlpopup/oerebkataster.mako'
    __bodId__ = 'ch.swisstopo-vd.stand-oerebkataster'
    id = Column('gid', Integer, primary_key=True)
    fid = Column('id', Integer)
    gemeindename = Column('gemeindename', Text)
    kanton = Column('kanton', Text)
    oereb_status_de = Column('oereb_status_de', Text)
    oereb_status_fr = Column('oereb_status_fr', Text)
    oereb_status_it = Column('oereb_status_it', Text)
    oereb_status_rm = Column('oereb_status_rm', Text)
    oereb_status_en = Column('oereb_status_en', Text)
    bfs_nr = Column('bfs_nr', Integer)
    firmenname = Column('firmenname', Text)
    adresszeile = Column('adresszeile', Text)
    plz = Column('plz', Integer)
    ort = Column('ort', Text)
    telefon = Column('telefon', Text)
    email = Column('email', Text)
    url_oereb = Column('url_oereb', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo-vd.stand-oerebkataster', oerebkataster)


class spannungsarmeGebiete(Base, Vector):
    __tablename__ = 'spannungsarme_gebiete'
    __table_args__ = ({'schema': 'vd', 'autoload': False})
    __template__ = 'templates/htmlpopup/spannungsarme_gebiete.mako'
    __bodId__ = 'ch.swisstopo.transformationsgenauigkeit'
    id = Column('identifier', Text, primary_key=True)
    sg_name = Column('sg_name', Text)
    vali_date = Column('vali_date', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.transformationsgenauigkeit', spannungsarmeGebiete)


class spannungsarmeGebieteVD(spannungsarmeGebiete):
    __bodId__ = 'ch.swisstopo-vd.spannungsarme-gebiete'

register('ch.swisstopo-vd.spannungsarme-gebiete', spannungsarmeGebieteVD)


class geologieGeotopePunkte(Base, Vector):
    __tablename__ = 'geotope_pkt'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geotope.mako'
    __bodId__ = 'ch.swisstopo.geologie-geotope'
    id = Column('objectid', Integer, primary_key=True)
    nom = Column('nom', Text)
    fix_id = Column('fix_id', Text)
    nummer = Column('nummer', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))


class geologieGeotopeFlaechen(Base, Vector):
    __tablename__ = 'geotope_plg'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geotope.mako'
    __bodId__ = 'ch.swisstopo.geologie-geotope'
    id = Column('objectid', Integer, primary_key=True)
    nom = Column('nom', Text)
    fix_id = Column('fix_id', Text)
    nummer = Column('nummer', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotope', geologieGeotopePunkte)
register('ch.swisstopo.geologie-geotope', geologieGeotopeFlaechen)


class steine_hist_bauwerke(Base, Vector):
    __tablename__ = 'geotechnik_steine_historische_bauwerke'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geol_steine_hist_bauwerke.mako'
    __bodId__ = 'ch.swisstopo.geologie-geotechnik-steine_historische_bauwerke'
    __extended_info__ = True
    id = Column('bgdi_id', Integer, primary_key=True)
    objekt = Column('objekt', Text)
    obtyp = Column('obtyp', Text)
    ort = Column('ort', Text)
    objektteil = Column('objektteil', Text)
    age = Column('age', Text)
    gestart = Column('gestart', Text)
    referenz = Column('referenz', Text)
    hyperlink = Column('hyperlink', Text)
    abbauort = Column('abbauort', Text)
    bemerkung = Column('bemerkung', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-steine_historische_bauwerke', steine_hist_bauwerke)


class gisgeol_punkte(Base, Vector):
    __tablename__ = 'view_gisgeol_points'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/gisgeol.mako'
    __bodId__ = 'ch.swisstopo.geologie-gisgeol-punkte'
    id = Column('gid', Integer, primary_key=True)
    sgd_nr = Column('sgd_nr', Integer)
    title = Column('title', Text)
    author = Column('author', Text)
    report_structure = Column('report_structure', Text)
    aux_info = Column('auxiliary_information', Text)
    doccreation = Column('doccreation_date', Text)
    copy_avail = Column('copy_avail', Text)
    view_avail = Column('view_avail', Text)
    pdf_url = Column('pdf_url', Text)
    bgdi_data_status = Column('bgdi_data_status', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-gisgeol-punkte', gisgeol_punkte)


class gisgeol_linien(Base, Vector):
    __tablename__ = 'view_gisgeol_lines'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/gisgeol.mako'
    __bodId__ = 'ch.swisstopo.geologie-gisgeol-linien'
    id = Column('gid', Integer, primary_key=True)
    sgd_nr = Column('sgd_nr', Integer)
    title = Column('title', Text)
    author = Column('author', Text)
    report_structure = Column('report_structure', Text)
    aux_info = Column('auxiliary_information', Text)
    doccreation = Column('doccreation_date', Text)
    copy_avail = Column('copy_avail', Text)
    view_avail = Column('view_avail', Text)
    pdf_url = Column('pdf_url', Text)
    bgdi_data_status = Column('bgdi_data_status', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-gisgeol-linien', gisgeol_linien)


class gisgeol_flaechen_1x1km(Base, Vector):
    __tablename__ = 'view_gisgeol_surfaces_1x1km'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/gisgeol.mako'
    __bodId__ = 'ch.swisstopo.geologie-gisgeol-flaechen-1x1km'
    id = Column('gid', Integer, primary_key=True)
    sgd_nr = Column('sgd_nr', Integer)
    title = Column('title', Text)
    author = Column('author', Text)
    report_structure = Column('report_structure', Text)
    aux_info = Column('auxiliary_information', Text)
    doccreation = Column('doccreation_date', Text)
    copy_avail = Column('copy_avail', Text)
    view_avail = Column('view_avail', Text)
    pdf_url = Column('pdf_url', Text)
    bgdi_data_status = Column('bgdi_data_status', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-gisgeol-flaechen-1x1km', gisgeol_flaechen_1x1km)


class gisgeol_flaechen_10x10km(Base, Vector):
    __tablename__ = 'view_gisgeol_surfaces_10x10km'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/gisgeol.mako'
    __bodId__ = 'ch.swisstopo.geologie-gisgeol-flaechen-10x10km'
    id = Column('gid', Integer, primary_key=True)
    sgd_nr = Column('sgd_nr', Integer)
    title = Column('title', Text)
    author = Column('author', Text)
    report_structure = Column('report_structure', Text)
    aux_info = Column('auxiliary_information', Text)
    doccreation = Column('doccreation_date', Text)
    copy_avail = Column('copy_avail', Text)
    view_avail = Column('view_avail', Text)
    pdf_url = Column('pdf_url', Text)
    bgdi_data_status = Column('bgdi_data_status', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-gisgeol-flaechen-10x10km', gisgeol_flaechen_10x10km)


class gisgeol_flaechen_10to21000km2(Base, Vector):
    __tablename__ = 'view_gisgeol_surfaces_10to21000km2'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/gisgeol.mako'
    __bodId__ = 'ch.swisstopo.geologie-gisgeol-flaechen-10to21000km2'
    id = Column('gid', Integer, primary_key=True)
    sgd_nr = Column('sgd_nr', Integer)
    title = Column('title', Text)
    author = Column('author', Text)
    report_structure = Column('report_structure', Text)
    aux_info = Column('auxiliary_information', Text)
    doccreation = Column('doccreation_date', Text)
    copy_avail = Column('copy_avail', Text)
    view_avail = Column('view_avail', Text)
    pdf_url = Column('pdf_url', Text)
    bgdi_data_status = Column('bgdi_data_status', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-gisgeol-flaechen-10to21000km2', gisgeol_flaechen_10to21000km2)


class gisgeol_flaechen_gt21000km2(Base, Vector):
    __tablename__ = 'view_gisgeol_surfaces_gt21000km2'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/gisgeol.mako'
    __bodId__ = 'ch.swisstopo.geologie-gisgeol-flaechen-gt21000km2'
    id = Column('gid', Integer, primary_key=True)
    sgd_nr = Column('sgd_nr', Integer)
    title = Column('title', Text)
    author = Column('author', Text)
    report_structure = Column('report_structure', Text)
    aux_info = Column('auxiliary_information', Text)
    doccreation = Column('doccreation_date', Text)
    copy_avail = Column('copy_avail', Text)
    view_avail = Column('view_avail', Text)
    pdf_url = Column('pdf_url', Text)
    bgdi_data_status = Column('bgdi_data_status', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-gisgeol-flaechen-gt21000km2', gisgeol_flaechen_gt21000km2)


class gisgeol_flaechen_lt10km2(Base, Vector):
    __tablename__ = 'view_gisgeol_surfaces_lt10km2'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/gisgeol.mako'
    __bodId__ = 'ch.swisstopo.geologie-gisgeol-flaechen-lt10km2'
    id = Column('gid', Integer, primary_key=True)
    sgd_nr = Column('sgd_nr', Integer)
    title = Column('title', Text)
    author = Column('author', Text)
    report_structure = Column('report_structure', Text)
    aux_info = Column('auxiliary_information', Text)
    doccreation = Column('doccreation_date', Text)
    copy_avail = Column('copy_avail', Text)
    view_avail = Column('view_avail', Text)
    pdf_url = Column('pdf_url', Text)
    bgdi_data_status = Column('bgdi_data_status', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-gisgeol-flaechen-lt10km2', gisgeol_flaechen_lt10km2)


class geocover_line_aux(Base, Vector):
    __tablename__ = 'view_geocover_line_aux'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geocover_line_aux.mako'
    __bodId__ = 'ch.swisstopo.geologie-geocover'
    id = Column('bgdi_id', Integer, primary_key=True)
    basisdatensatz = Column('basisdatensatz', Text)
    description = Column('description', Text)
    spec_description = Column('spec_description', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geocover', geocover_line_aux)


class geocover_point_hydro(Base, Vector):
    __tablename__ = 'view_geocover_point_hydro'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geocover_point_hydro.mako'
    __bodId__ = 'ch.swisstopo.geologie-geocover'
    id = Column('bgdi_id', Integer, primary_key=True)
    basisdatensatz = Column('basisdatensatz', Text)
    description = Column('description', Text)
    spec_description = Column('spec_description', Text)
    azimut = Column('azimut', Text)
    depth = Column('depth', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geocover', geocover_point_hydro)


class geocover_point_geol(Base, Vector):
    __tablename__ = 'view_geocover_point_geol'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geocover_point_hydro.mako'
    __bodId__ = 'ch.swisstopo.geologie-geocover'
    id = Column('bgdi_id', Integer, primary_key=True)
    basisdatensatz = Column('basisdatensatz', Text)
    description = Column('description', Text)
    spec_description = Column('spec_description', Text)
    azimut = Column('azimut', Text)
    depth = Column('depth', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geocover', geocover_point_geol)


class geocover_point_drill(Base, Vector):
    __tablename__ = 'view_geocover_point_drill'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geocover_point_drill.mako'
    __bodId__ = 'ch.swisstopo.geologie-geocover'
    id = Column('bgdi_id', Integer, primary_key=True)
    basisdatensatz = Column('basisdatensatz', Text)
    description = Column('description', Text)
    spec_description = Column('spec_description', Text)
    azimut = Column('azimut', Text)
    depth_1 = Column('depth_1', Text)
    description_1 = Column('description_1', Text)
    depth_2 = Column('depth_2', Text)
    description_2 = Column('description_2', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geocover', geocover_point_drill)


class geocover_point_info(Base, Vector):
    __tablename__ = 'view_geocover_point_info'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geocover_point_info.mako'
    __bodId__ = 'ch.swisstopo.geologie-geocover'
    id = Column('bgdi_id', Integer, primary_key=True)
    basisdatensatz = Column('basisdatensatz', Text)
    description = Column('description', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geocover', geocover_point_info)


class geocover_point_struct(Base, Vector):
    __tablename__ = 'view_geocover_point_struct'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geocover_point_struct.mako'
    __bodId__ = 'ch.swisstopo.geologie-geocover'
    id = Column('bgdi_id', Integer, primary_key=True)
    basisdatensatz = Column('basisdatensatz', Text)
    description = Column('description', Text)
    spec_description = Column('spec_description', Text)
    azimut = Column('azimut', Text)
    dip = Column('dip', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geocover', geocover_point_struct)


class geocover_polygon_aux_1(Base, Vector):
    __tablename__ = 'view_geocover_polygon_aux_1'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geocover_polygon.mako'
    __bodId__ = 'ch.swisstopo.geologie-geocover'
    id = Column('bgdi_id', Integer, primary_key=True)
    basisdatensatz = Column('basisdatensatz', Text)
    description = Column('description', Text)
    tecto = Column('tecto', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geocover', geocover_polygon_aux_1)


class geocover_polygon_aux_2(Base, Vector):
    __tablename__ = 'view_geocover_polygon_aux_2'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geocover_polygon.mako'
    __bodId__ = 'ch.swisstopo.geologie-geocover'
    id = Column('bgdi_id', Integer, primary_key=True)
    basisdatensatz = Column('basisdatensatz', Text)
    description = Column('description', Text)
    tecto = Column('tecto', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geocover', geocover_polygon_aux_2)


class geocover_polygon_main(Base, Vector):
    __tablename__ = 'view_geocover_polygon_main'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geocover_polygon.mako'
    __bodId__ = 'ch.swisstopo.geologie-geocover'
    id = Column('bgdi_id', Integer, primary_key=True)
    basisdatensatz = Column('basisdatensatz', Text)
    description = Column('description', Text)
    tecto = Column('tecto', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geocover', geocover_polygon_main)


class ga25_line_aux(Base, Vector):
    __tablename__ = 'view_ga25_line_aux'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/ga25_line_aux.mako'
    __bodId__ = 'ch.swisstopo.geologie-geologischer_atlas'
    id = Column('bgdi_id', Integer, primary_key=True)
    basisdatensatz = Column('basisdatensatz', Text)
    description = Column('description', Text)
    spec_description = Column('spec_description', Text)
    url_legend = Column('url_legende', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geologischer_atlas', ga25_line_aux)


class ga25_point_hydro(Base, Vector):
    __tablename__ = 'view_ga25_point_hydro'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/ga25_point_hydro.mako'
    __bodId__ = 'ch.swisstopo.geologie-geologischer_atlas'
    id = Column('bgdi_id', Integer, primary_key=True)
    basisdatensatz = Column('basisdatensatz', Text)
    description = Column('description', Text)
    spec_description = Column('spec_description', Text)
    azimut = Column('azimut', Text)
    depth = Column('depth', Text)
    url_legend = Column('url_legende', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geologischer_atlas', ga25_point_hydro)


class ga25_point_geol(Base, Vector):
    __tablename__ = 'view_ga25_point_geol'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/ga25_point_hydro.mako'
    __bodId__ = 'ch.swisstopo.geologie-geologischer_atlas'
    id = Column('bgdi_id', Integer, primary_key=True)
    basisdatensatz = Column('basisdatensatz', Text)
    description = Column('description', Text)
    spec_description = Column('spec_description', Text)
    azimut = Column('azimut', Text)
    depth = Column('depth', Text)
    url_legend = Column('url_legende', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geologischer_atlas', ga25_point_geol)


class ga25_point_drill(Base, Vector):
    __tablename__ = 'view_ga25_point_drill'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/ga25_point_drill.mako'
    __bodId__ = 'ch.swisstopo.geologie-geologischer_atlas'
    id = Column('bgdi_id', Integer, primary_key=True)
    basisdatensatz = Column('basisdatensatz', Text)
    description = Column('description', Text)
    spec_description = Column('spec_description', Text)
    azimut = Column('azimut', Text)
    depth_1 = Column('depth_1', Text)
    description_1 = Column('description_1', Text)
    depth_2 = Column('depth_2', Text)
    description_2 = Column('description_2', Text)
    url_legend = Column('url_legende', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geologischer_atlas', ga25_point_drill)


class ga25_point_info(Base, Vector):
    __tablename__ = 'view_ga25_point_info'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/ga25_point_info.mako'
    __bodId__ = 'ch.swisstopo.geologie-geologischer_atlas'
    id = Column('bgdi_id', Integer, primary_key=True)
    basisdatensatz = Column('basisdatensatz', Text)
    description = Column('description', Text)
    url_legend = Column('url_legende', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geologischer_atlas', ga25_point_info)


class ga25_point_struct(Base, Vector):
    __tablename__ = 'view_ga25_point_struct'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/ga25_point_struct.mako'
    __bodId__ = 'ch.swisstopo.geologie-geologischer_atlas'
    id = Column('bgdi_id', Integer, primary_key=True)
    basisdatensatz = Column('basisdatensatz', Text)
    description = Column('description', Text)
    spec_description = Column('spec_description', Text)
    azimut = Column('azimut', Text)
    dip = Column('dip', Text)
    url_legend = Column('url_legende', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geologischer_atlas', ga25_point_struct)


class ga25_polygon_aux_1(Base, Vector):
    __tablename__ = 'view_ga25_polygon_aux_1'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/ga25_polygon.mako'
    __bodId__ = 'ch.swisstopo.geologie-geologischer_atlas'
    id = Column('bgdi_id', Integer, primary_key=True)
    basisdatensatz = Column('basisdatensatz', Text)
    description = Column('description', Text)
    tecto = Column('tecto', Text)
    url_legend = Column('url_legende', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geologischer_atlas', ga25_polygon_aux_1)


class ga25_polygon_aux_2(Base, Vector):
    __tablename__ = 'view_ga25_polygon_aux_2'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/ga25_polygon.mako'
    __bodId__ = 'ch.swisstopo.geologie-geologischer_atlas'
    id = Column('bgdi_id', Integer, primary_key=True)
    basisdatensatz = Column('basisdatensatz', Text)
    description = Column('description', Text)
    tecto = Column('tecto', Text)
    url_legend = Column('url_legende', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geologischer_atlas', ga25_polygon_aux_2)


class ga25_polygon_main(Base, Vector):
    __tablename__ = 'view_ga25_polygon_main'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/ga25_polygon.mako'
    __bodId__ = 'ch.swisstopo.geologie-geologischer_atlas'
    id = Column('bgdi_id', Integer, primary_key=True)
    basisdatensatz = Column('basisdatensatz', Text)
    description = Column('description', Text)
    tecto = Column('tecto', Text)
    url_legend = Column('url_legende', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geologischer_atlas', ga25_polygon_main)
