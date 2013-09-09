# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from sqlalchemy.types import Numeric
from geoalchemy import GeometryColumn, Geometry

from chsdi.models import  *
from chsdi.models.vector import Vector


Base = bases['stopo']

class SwissboundariesBezirk(Base, Vector):
    # view in a schema
    __tablename__ = 'swissboundaries_bezirke'
    __table_args__ = ({'schema': 'tlm', 'autoload': False})
    __template__ = 'templates/htmlpopup/swissboundaries_bezirk.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill'
    __displayFieldName__ = 'name'
    id = Column('id', Integer, primary_key=True)
    name = Column('name',Text)
    flaeche = Column('flaeche',Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill', SwissboundariesBezirk)

class SwissboundariesGemeinde(Base, Vector):
    # view in a schema
    __tablename__ = 'swissboundaries_gemeinden'
    __table_args__ = ({'schema': 'tlm', 'autoload': False})
    __template__ = 'templates/htmlpopup/swissboundaries_gemeinde.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill'
    __displayFieldName__ = 'gemname'
    id = Column('id', Integer, primary_key=True)
    gemname = Column('gemname',Text)
    gemflaeche = Column('gemflaeche',Numeric)
    perimeter = Column('perimeter',Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill', SwissboundariesGemeinde)

class SwissboundariesKanton(Base, Vector):
    # view in a schema
    __tablename__ = 'swissboundaries_kantone'
    __table_args__ = ({'schema': 'tlm', 'autoload': False})
    __template__ = 'templates/htmlpopup/swissboundaries_kanton.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.swissboundaries3d-kanton-flaeche.fill'
    __displayFieldName__ = 'name'
    id = Column('kantonsnr', Integer, primary_key=True)
    ak = Column('ak',Text)
    name = Column('name',Text)
    flaeche = Column('flaeche',Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.swissboundaries3d-kanton-flaeche.fill', SwissboundariesKanton)

# # These two layers do not have a table on their own
# class CadastralWebMap(Base, Vector):
#     __tablename__ = 'kantone25plus'
#     __table_args__ = ({'autoload': False})
#     __template__ = 'templates/htmlpopup/cadastralwebmap.mako'
#     __esriId__ = 1000
#     __bodId__ = 'ch.kantone.cadastralwebmap-farbe'
#     __displayFieldName__ = ''
#     id = Column('gid', Integer, primary_key=True)
#     the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.kantone.cadastralwebmap-farbe', CadastralWebMap)
 
class Vec200Terminal(Base, Vector):
    __tablename__ = 'vec200_terminal_tiles'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_terminal.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.vec200-transportation-oeffentliche-verkehr'
    __displayFieldName__ = 'objval'
    id = Column('gtdboid', Text, primary_key=True)
    objval = Column('objval',Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

#Ne fonctionne qu'avec une seule classe par couche...
#class Vec200ShipKursschiff(Base, Vector):
#    __tablename__ = 'v200_ship_kursschiff_linie_tooltip'
#    __table_args__ = ({'autoload': False})
#    __template__ = 'templates/htmlpopup/vec200_ship_kursschiff_linie.mako'
#    __esriId__ = 1000
#    __bodId__ = 'ch.swisstopo.vec200-transportation-oeffentliche-verkehr'
#    __displayFieldName__ = 'objval'
#    id = Column('gtdboid', Text, primary_key=True)
#    objval = Column('objval',Text)
#    detn = Column('detn',Text)
#    rsu = Column('rsu',Text)
#    use = Column('use',Text)
#    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
#
#Ne fonctionne qu'avec une seule classe par couche...
#class Vec200Railway(Base, Vector):
#    __tablename__ = 'vec200_railway_tiles'
#    __table_args__ = ({'autoload': False})
#    __template__ = 'templates/htmlpopup/vec200_railway.mako'
#    __esriId__ = 1000
#    __bodId__ = 'ch.swisstopo.vec200-transportation-oeffentliche-verkehr'
#    __displayFieldName__ = 'objval'
#    id = Column('gtdboid', Text, primary_key=True)
#    objval = Column('objval',Text)
#    construct = Column('construct',Text)
#    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

#no register...
#class Vec200Runway(Base, Vector):
#    __tablename__ = 'vec200_runway'
#    __table_args__ = ({'autoload': False})
#    __template__ = 'templates/htmlpopup/vec200_runway.mako'
#    __esriId__ = 1000
#    __bodId__ = 'ch.swisstopo.vec200-transportation-oeffentliche-verkehr'
#    __displayFieldName__ = ''
#    id = Column('gtdboid', Text, primary_key=True)
#    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

#no register...
#class Vec200Airport(Base, Vector):
#    __tablename__ = 'vec200_airport'
#    __table_args__ = ({'autoload': False})
#    __template__ = 'templates/htmlpopup/vec200_airport.mako'
#    __esriId__ = 1000
#    __bodId__ = 'ch.swisstopo.vec200-transportation-oeffentliche-verkehr'
#    __displayFieldName__ = ''
#    id = Column('gtdboid', Text, primary_key=True)
#    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec200-transportation-oeffentliche-verkehr', Vec200Terminal)
#register('ch.swisstopo.vec200-transportation-oeffentliche-verkehr', Vec200ShipKursschiff)
#register('ch.swisstopo.vec200-transportation-oeffentliche-verkehr', Vec200Railway)

class treasurehunt(Base, Vector):
    __tablename__ = 'treasurehunt'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/treasurehunt.mako'
    __maxscale__ = 2505
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.treasurehunt'
    __displayFieldName__ = 'title_de'
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
    __tablename__ = 'vec200_trafficinfo_tiles'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_trafficinfo.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.vec200-transportation-strassennetz'
    __displayFieldName__ = 'objname'
    id = Column('gtdboid', Text, primary_key=True)
    objname = Column('objname',Text)
    objval = Column('objval',Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

#class Vec200ShipAutofaehre(Base, Vector):
#     __tablename__ = 'v200_ship_autofaehre_tooltip'
#     __table_args__ = ({'autoload': False})
#     __template__ = 'templates/htmlpopup/vec200_ship_autofaehre.mako'
#     __esriId__ = 1000
#     __bodId__ = 'ch.swisstopo.vec200-transportation-strassennetz'
#     __displayFieldName__ = 'objval'
#     id = Column('gtdboid', Text, primary_key=True)
#     objval = Column('objval',Text)
#     use = Column('use',Text)
#     rsu = Column('rsu',Text)
#     detn = Column('detn',Text)
#     the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
 
#class Vec200Road(Base, Vector):
#    __tablename__ = 'vec200_road_tiles'
#    __table_args__ = ({'autoload': False})
#    __template__ = 'templates/htmlpopup/vec200_road.mako'
#    __esriId__ = 1000
#    __bodId__ = 'ch.swisstopo.vec200-transportation-strassennetz'
#    __displayFieldName__ = 'objval'
#    id = Column('gtdboid', Text, primary_key=True)
#    construct = Column('construct',Text)
#    objval = Column('objval',Text)
#    toll = Column('toll',Text)
#    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

#class Vec200Ramp(Base, Vector):
#    __tablename__ = 'vec200_ramp_tiles'
#    __table_args__ = ({'autoload': False})
#    __template__ = 'templates/htmlpopup/vec200_ramp.mako'
#    __esriId__ = 1000
#    __bodId__ = 'ch.swisstopo.vec200-transportation-strassennetz'
#    __displayFieldName__ = 'objval'
#    id = Column('gtdboid', Text, primary_key=True)
#    construct = Column('construct',Text)
#    objval = Column('objval',Text)
#    toll = Column('toll',Text)
#    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

#class Vec200Customsoffice(Base, Vector):
#    __tablename__ = 'vec200_customsoffice_tiles'
#    __table_args__ = ({'autoload': False})
#    __template__ = 'templates/htmlpopup/vec200_customsoffice.mako'
#    __esriId__ = 1000
#    __bodId__ = 'ch.swisstopo.vec200-transportation-strassennetz'
#    __displayFieldName__ = 'objname'
#    id = Column('gtdboid', Text, primary_key=True)
#    objname = Column('objname', Text)
#    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

# no register...
#class Vec200Interchange(Base, Vector):
#    __tablename__ = 'vec200_interchange'
#    __table_args__ = ({'autoload': False})
#    __template__ = 'templates/htmlpopup/vec200_interchange.mako'
#    __esriId__ = 1000
#    __bodId__ = 'ch.swisstopo.vec200-transportation-strassennetz'
#    __displayFieldName__ = ''
#    id = Column('gtdboid', Text, primary_key=True)
#    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Trafficinfo)
#register('ch.swisstopo.vec200-transportation-strassennetz', Vec200ShipAutofaehre)
#register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Road)
#register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Ramp)
#register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Customsoffice)

class Vec200Protectedarea(Base, Vector):
    __tablename__ = 'vec200_protectedarea'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_protectedarea.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.vec200-adminboundaries-protectedarea'
    __displayFieldName__ = 'name'
    id = Column('gtdboid', Text, primary_key=True)
    name = Column('name', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec200-adminboundaries-protectedarea', Vec200Protectedarea)

class Vec200Flowingwater(Base, Vector):
    __tablename__ = 'vec200_flowingwater'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_flowingwater.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.vec200-hydrography'
    __displayFieldName__ = 'name'
    id = Column('gtdboid', Text, primary_key=True)
    name = Column('name', Text)
    exs = Column('exs', Text)
    hoc = Column('hoc', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
 
#class Vec200Stagnantwater(Base, Vector):
#    __tablename__ = 'vec200_stagnantwater'
#    __table_args__ = ({'autoload': False})
#    __template__ = 'templates/htmlpopup/vec200_stagnantwater.mako'
#    __esriId__ = 1000
#    __bodId__ = 'ch.swisstopo.vec200-hydrography'
#    __displayFieldName__ = 'name'
#    id = Column('gtdboid', Text, primary_key=True)
#    name = Column('name', Text)
#    seesph = Column('seesph', Numeric)
#    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec200-hydrography', Vec200Flowingwater)
#register('ch.swisstopo.vec200-hydrography', Vec200Stagnantwater)

class Vec200Landcover(Base, Vector):
    __tablename__ = 'vec200_landcover'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_landcover.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.vec200-landcover'
    __displayFieldName__ = 'objname1'
    id = Column('gtdboid', Text, primary_key=True)
    objname1 = Column('objname1', Text)
    objval = Column('objval', Text)
    ppi = Column('ppi', Text)
    ppl = Column('ppl', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec200-landcover', Vec200Landcover)

class Vec200Builtupp(Base, Vector):
    __tablename__ = 'vec200_builtupp'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_builtupp.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.vec200-miscellaneous'
    __displayFieldName__ = 'objname'
    id = Column('gtdboid', Text, primary_key=True)
    objname = Column('objname', Text)
    ppi = Column('ppi', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

#class Vec200Poi(Base, Vector):
#    __tablename__ = 'v200_poi_tooltip'
#    __table_args__ = ({'autoload': False})
#    __template__ = 'templates/htmlpopup/vec200_poi.mako'
#    __esriId__ = 1000
#    __bodId__ = 'ch.swisstopo.vec200-miscellaneous'
#    __displayFieldName__ = 'objname'
#    id = Column('gtdboid', Text, primary_key=True)
#    objname = Column('objname', Text)
#    objval = Column('objval', Text)
#    ppc = Column('ppc', Text)
#    pro = Column('pro', Text)
#    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

#class Vec200Supply(Base, Vector):
#    __tablename__ = 'vec200_supply'
#    __table_args__ = ({'autoload': False})
#    __template__ = 'templates/htmlpopup/vec200_supply.mako'
#    __esriId__ = 1000
#    __bodId__ = 'ch.swisstopo.vec200-miscellaneous'
#    __displayFieldName__ = 'fco'
#    id = Column('gtdboid', Text, primary_key=True)
#    fco = Column('fco', Text)
#    loc = Column('loc', Text)
#    pro = Column('pro', Text)
#    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec200-miscellaneous', Vec200Builtupp)
#register('ch.swisstopo.vec200-miscellaneous', Vec200Poi)
#register('ch.swisstopo.vec200-miscellaneous', Vec200Supply)

class Vec200Namedlocation(Base, Vector):
    __tablename__ = 'vec200_namedlocation'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec200_namedlocation.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.vec200-names-namedlocation'
    __displayFieldName__ = 'objname1'
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
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.vec25-strassennetz'
    __displayFieldName__ = 'objectval'
    id = Column('objectid', Integer, primary_key=True)
    objectval = Column('objectval', Text)
    length = Column('length', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec25-strassennetz', Vec25Strassennetz)

class Vec25Uebrige(Base, Vector):
    __tablename__ = 'v25_uvk_25_l'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec25_uebrigeverk.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.vec25-uebrigerverkehr'
    __displayFieldName__ = 'objectval'
    id = Column('objectid', Integer, primary_key=True)
    objectval = Column('objectval', Text)
    length = Column('length', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec25-uebrigerverkehr', Vec25Uebrige)

class Vec25Anlagen(Base, Vector):
    __tablename__ = 'v25_anl_25_a'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec25_anlagen.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.vec25-anlagen'
    __displayFieldName__ = 'objectval'
    id = Column('objectid', Integer, primary_key=True)
    objectval = Column('objectval', Text)
    area = Column('area', Numeric)
    perimeter = Column('perimeter', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec25-anlagen', Vec25Anlagen)

class Vec25Eisenbahnnetz(Base, Vector):
    __tablename__ = 'v25_eis_25_l'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec25_eisenbahnnetz.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.vec25-eisenbahnnetz'
    __displayFieldName__ = 'objectval'
    id = Column('objectid', Integer, primary_key=True)
    objectval = Column('objectval', Text)
    length = Column('length', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec25-eisenbahnnetz', Vec25Eisenbahnnetz)

class Vec25Gebaeude(Base, Vector):
    __tablename__ = 'v25_geb_25_a'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec25_gebaeude.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.vec25-gebaeude'
    __displayFieldName__ = 'objectval'
    id = Column('objectid', Integer, primary_key=True)
    objectval = Column('objectval', Text)
    area = Column('area', Numeric)
    perimeter = Column('perimeter', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec25-gebaeude', Vec25Gebaeude)

class Vec25Gewaessernetz(Base, Vector):
    __tablename__ = 'v25_gwn_25_l'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec25_gewaessernetz.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.vec25-gewaessernetz'
    __displayFieldName__ = 'objectval'
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
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.vec25-primaerflaechen'
    __displayFieldName__ = 'objectval'
    id = Column('objectid', Integer, primary_key=True)
    objectval = Column('objectval', Text)
    area = Column('area', Numeric)
    perimeter = Column('perimeter', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
 
register('ch.swisstopo.vec25-primaerflaechen', Vec25Primaerflaechen)

class Vec25Einzelobjekte(Base, Vector):
    __tablename__ = 'v25_eob_25_l'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec25_einzelobjekte.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.vec25-einzelobjekte'
    __displayFieldName__ = 'objectval'
    id = Column('objectid', Integer, primary_key=True)
    objectval = Column('objectval', Text)
    length = Column('length', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec25-einzelobjekte', Vec25Einzelobjekte)

class Vec25Heckenbaeume(Base, Vector):
    __tablename__ = 'v25_heb_25_l'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/vec25_heckenbaeume.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.vec25-heckenbaeume'
    __displayFieldName__ = 'objectval'
    id = Column('objectid', Integer, primary_key=True)
    objectval = Column('objectval', Text)
    length = Column('length', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.vec25-heckenbaeume', Vec25Heckenbaeume)

class Dreiecksvermaschung(Base, Vector):
        # view in a schema
        __tablename__ = 'dreiecksvermaschung'
        __table_args__ = ({'schema': 'geodaesie', 'autoload': False})
        __template__ = 'templates/htmlpopup/dreiecksvermaschung.mako'
        __esriId__ = 1000
        __bodId__ = 'ch.swisstopo.dreiecksvermaschung'
        __displayFieldName__ = 'nom'
        id = Column('bgdi_id', Integer, primary_key=True)
        nom = Column('nom',Text)
        num = Column('num',Text)
        type = Column('type',Text)        
        the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.dreiecksvermaschung',Dreiecksvermaschung)

class DufourErst(Base, Vector):
# view in a schema
    __tablename__ = 'view_gridstand_datenhaltung_dufour_erst'
    __table_args__ = ({'schema': 'datenstand', 'autoload': False})
    __template__ = 'templates/htmlpopup/dufour_erst.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.hiks-dufour'
    __displayFieldName__ = 'kbbez'
    id = Column('tilenumber', Text, primary_key=True)
    kbbez = Column('kbbez', Text)
    datenstand = Column('datenstand', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.hiks-dufour',DufourErst)

class SiegfriedErst(Base, Vector):
# view in a schema
    __tablename__ = 'view_gridstand_datenhaltung_siegfried_erst'
    __table_args__ = ({'schema': 'datenstand', 'autoload': False})
    __template__ = 'templates/htmlpopup/siegfried_erst.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.hiks-siegfried'
    __displayFieldName__ = 'kbbez'
    id = Column('tilenumber', Text, primary_key=True)
    kbbez = Column('kbbez', Text)
    datenstand = Column('datenstand', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.hiks-siegfried',SiegfriedErst)

#two registers...
class GridstandPk25(Base, Vector):
# view in a schema
    __tablename__ = 'view_gridstand_datenhaltung_pk25_tilecache'
    __table_args__ = ({'schema': 'datenstand', 'autoload': False})
    __template__ = 'templates/htmlpopup/pk25_metadata.mako'
    __esriId__ = 1000
    __bodId__ = ''
    __displayFieldName__ = 'lk_name'
    id = Column('kbnum', Text, primary_key=True)
    lk_name = Column('lk_name', Text)
    release = Column('release', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.pixelkarte-pk25.metadata',GridstandPk25)
register('ch.swisstopo.pixelkarte-farbe-pk25.noscale',GridstandPk25)

#two registers...
class GridstandPk50(Base, Vector):
# view in a schema
    __tablename__ = 'view_gridstand_datenhaltung_pk50_tilecache'
    __table_args__ = ({'schema': 'datenstand', 'autoload': False})
    __template__ = 'templates/htmlpopup/pk50_metadata.mako'
    __esriId__ = 1000
    __bodId__ = ''
    __displayFieldName__ = 'lk_name'
    id = Column('kbnum', Text, primary_key=True)
    lk_name = Column('lk_name', Text)
    release = Column('release', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.pixelkarte-pk50.metadata',GridstandPk50)
register('ch.swisstopo.pixelkarte-farbe-pk50.noscale',GridstandPk50)

#two registers...
class GridstandPk100(Base, Vector):
# view in a schema
    __tablename__ = 'view_gridstand_datenhaltung_pk100_tilecache'
    __table_args__ = ({'schema': 'datenstand', 'autoload': False})
    __template__ = 'templates/htmlpopup/pk100_metadata.mako'
    __esriId__ = 1000
    __bodId__ = ''
    __displayFieldName__ = 'lk_name'
    id = Column('kbnum', Text, primary_key=True)
    lk_name = Column('lk_name', Text)
    release = Column('release', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.pixelkarte-pk100.metadata',GridstandPk100)
register('ch.swisstopo.pixelkarte-farbe-pk100.noscale',GridstandPk100)

#two registers...
class GridstandPk200(Base, Vector):
# view in a schema
    __tablename__ = 'view_gridstand_datenhaltung_pk200_tilecache'
    __table_args__ = ({'schema': 'datenstand', 'autoload': False})
    __template__ = 'templates/htmlpopup/pk200_metadata.mako'
    __esriId__ = 1000
    __bodId__ = ''
    __displayFieldName__ = 'lk_name'
    id = Column('kbnum', Text, primary_key=True)
    lk_name = Column('lk_name', Text)
    release = Column('release', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.pixelkarte-pk200.metadata',GridstandPk200)
register('ch.swisstopo.pixelkarte-farbe-pk200.noscale',GridstandPk200)

#two registers...
class GridstandPk500(Base, Vector):
# view in a schema
    __tablename__ = 'view_gridstand_datenhaltung_pk500_tilecache'
    __table_args__ = ({'schema': 'datenstand', 'autoload': False})
    __template__ = 'templates/htmlpopup/pk500_metadata.mako'
    __esriId__ = 1000
    __bodId__ = ''
    __displayFieldName__ = 'lk_name'
    id = Column('kbnum', Text, primary_key=True)
    lk_name = Column('lk_name', Text)
    release = Column('release', Integer)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.pixelkarte-pk500.metadata',GridstandPk500)
register('ch.swisstopo.pixelkarte-farbe-pk500.noscale',GridstandPk500)

class GridstandSwissimage(Base, Vector):
# view in a schema
    __tablename__ = 'view_gridstand_datenhaltung_swissimage_tilecache'
    __table_args__ = ({'schema': 'datenstand', 'autoload': False})
    __template__ = 'templates/htmlpopup/images_metadata.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.images-swissimage.metadata'
    __displayFieldName__ = 'lk25_name'
    id = Column('tilenumber', Text, primary_key=True)
    lk25_name = Column('lk25_name', Text)
    datenstand = Column('datenstand', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.images-swissimage.metadata',GridstandSwissimage)

class GeolKarten500Metadata(Base, Vector):
# view in a schema
    __tablename__ = 'gk500'
    __table_args__ = ({'schema': 'public', 'autoload': False})
    __template__ = 'templates/htmlpopup/geolkarten500_metadata.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.geologie-geolkarten500.metadata'
    __displayFieldName__ = 'prod_id'
    id = Column('bgdi_id', Integer, primary_key=True)
    prod_id = Column('prod_id', Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geolkarten500.metadata',GeolKarten500Metadata)
 
class GeologischerAtlasPK(Base, Vector):
# view in a schema
    __tablename__ = 'kv_ga25_pk'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geol_ga_pk.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.geologie-geologischer_atlas'
    __displayFieldName__ = 'titel'
    id = Column('nr', Text, primary_key=True)
    titel = Column('titel', Text)
    grat25 = Column('grat25', Text)
    jahr = Column('jahr', Numeric)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geologischer_atlas',GeologischerAtlasPK)

class GeologischeKarteLine(Base, Vector):
# view in a schema
    __tablename__ = 'geologische_karte_line'
    __table_args__ = ({'schema': 'geol', 'autoload': False})
    __template__ = 'templates/htmlpopup/geologische_karte_line.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.swisstopo.geologie-geologische_karte'
    __displayFieldName__ = 'id'
    id = Column('fid', Text, primary_key=True)
    gid = Column ('id', Integer)
    type_de = Column('type_de',Text)
    type_fr = Column('type_fr',Text)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

#class GeologischeKartePlg(Base, Vector):
## view in a schema
#     __tablename__ = 'geologische_karte_plg'
#     __table_args__ = ({'schema': 'geol', 'autoload': False})
#     __template__ = 'templates/htmlpopup/geologische_karte_plg.mako'
#     __esriId__ = 1000
#     __bodId__ = 'ch.swisstopo.geologie-geologische_karte'
#     __displayFieldName__ = 'id'
#     id = Column('id', Text, primary_key=True)
#     leg_geol_d = Column('leg_geol_d', Text)
#     leg_geol_f = Column('leg_geol_f', Text)
#     the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geologische_karte',GeologischeKarteLine)
#register('ch.swisstopo.geologie-geologische_karte',GeologischeKartePlg)

class GeologieMineralischeRohstoffe200(Base, Vector):
# view in a schema
        __tablename__ = 'geotechnik_mineralische_rohstoffe200'
        __table_args__ = ({'schema': 'geol', 'autoload': False})
        __template__ = 'templates/htmlpopup/geotechnik_mineralische_rohstoffe200.mako'
        __esriId__ = 1000
        __bodId__ = 'ch.swisstopo.geologie-geotechnik-mineralische_rohstoffe200'
        __displayFieldName__ = 'file_name'
        id = Column('bgdi_id', Integer, primary_key=True)
        file_name = Column('file_name', Text)
        legend = Column('legend', Text)
        area_name = Column('area_name', Text)
        the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-mineralische_rohstoffe200',GeologieMineralischeRohstoffe200)

class GeologieGeotechnikGk200(Base, Vector):
# view in a schema
        __tablename__ = 'geotechnik_gk200_lgd'
        __table_args__ = ({'schema': 'geol', 'autoload': False})
        __template__ = 'templates/htmlpopup/geotechnik_gk200.mako'
        __esriId__ = 1000
        __bodId__ = 'ch.swisstopo.geologie-geotechnik-gk200'
        __displayFieldName__ = 'file_name'
        id = Column('bgdi_id', Integer, primary_key=True)
        file_name = Column('file_name', Text)
        the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-gk200',GeologieGeotechnikGk200)

class Gk500_Gensese (Base, Vector):
# view in a schema
        __tablename__ = 'gk500_genese' 
        __table_args__ = ({'schema': 'geol', 'autoload': False})
        __template__ = 'templates/htmlpopup/gk500-genese.mako'
        __esriId__ = 1000
        __bodId__ = 'ch.swisstopo.geologie-geotechnik-gk500-genese'
        __displayFieldName__ = 'genese_de'
        id = Column('bgdi_id', Integer, primary_key=True)
        genese_de = Column('genese_de', Text)
        genese_fr = Column('genese_fr', Text)
        genese_en = Column('genese_en', Text)
        genese_it = Column('genese_it', Text)
        genese_rm = Column('genese_rm', Text)
        bgdi_tooltip_color = Column('bgdi_tooltip_color', Text)
        the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-gk500-genese',Gk500_Gensese)

class Gk500_Gesteinsklassierung (Base, Vector):
# view in a schema
        __tablename__ = 'gk500_gesteinsklassierung' 
        __table_args__ = ({'schema': 'geol', 'autoload': False})
        __template__ = 'templates/htmlpopup/gk500-gesteinsklassierung.mako'
        __esriId__ = 1000
        __bodId__ = 'ch.swisstopo.geologie-geotechnik-gk500-gesteinsklassierung'
        __displayFieldName__ = 'gestkl_de'
        id = Column('bgdi_id', Integer, primary_key=True)
        gestkl_de = Column('gestkl_de', Text)
        gestkl_fr = Column('gestkl_fr', Text)
        gestkl_en = Column('gestkl_en', Text)
        gestkl_it = Column('gestkl_it', Text)
        gestkl_rm = Column('gestkl_rm', Text)
        bgdi_tooltip_color = Column('bgdi_tooltip_color', Text)
        the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-gk500-gesteinsklassierung',Gk500_Gesteinsklassierung)

class Gk500_lithologie_hauptgruppen(Base, Vector):
# view in a schema
        __tablename__ = 'gk500_lithologie_hauptgruppen'
        __table_args__ = ({'schema': 'geol', 'autoload': False})
        __template__ = 'templates/htmlpopup/lithologie_hauptgruppen.mako'
        __esriId__ = 1000
        __bodId__ = 'ch.swisstopo.geologie-geotechnik-gk500-lithologie_hauptgruppen'
        __displayFieldName__ = 'bgdi_tooltip_de'
        id = Column('bgdi_id', Integer, primary_key=True)
        bgdi_tooltip_de = Column('bgdi_tooltip_de', Text)
        bgdi_tooltip_fr= Column('bgdi_tooltip_fr', Text)
        bgdi_tooltip_en = Column('bgdi_tooltip_en', Text)
        bgdi_tooltip_it = Column('bgdi_tooltip_it', Text)
        bgdi_tooltip_rm = Column('bgdi_tooltip_rm', Text)
        bgdi_tooltip_color = Column('bgdi_tooltip_color', Text)
        the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-gk500-lithologie_hauptgruppen',Gk500_lithologie_hauptgruppen)

class GeologieGeotechnikSteinbrueche1980(Base, Vector):
# view in a schema
        __tablename__ = 'geotechnik_steinbrueche_1980'
        __table_args__ = ({'schema': 'geol', 'autoload': False})
        __template__ = 'templates/htmlpopup/steinbrueche_1980.mako'
        __esriId__ = 1000
        __bodId__ = 'ch.swisstopo.geologie-geotechnik-steinbrueche_1980'
        __displayFieldName__ = 'id'
        id = Column('id', Integer, primary_key=True)
        gesteinsgr = Column('gesteinsgr', Text)
        gestein = Column('gestein', Text)
        the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-steinbrueche_1980',GeologieGeotechnikSteinbrueche1980)

class GeologieGeotechnikSteinbrueche1995(Base, Vector):
# view in a schema
        __tablename__ = 'geotechnik_steinbrueche_1995'
        __table_args__ = ({'schema': 'geol', 'autoload': False})
        __template__ = 'templates/htmlpopup/steinbrueche_1995.mako'
        __esriId__ = 1000
        __bodId__ = 'ch.swisstopo.geologie-geotechnik-steinbrueche_1995'
        __displayFieldName__ = 'id'
        id = Column('id', Integer, primary_key=True)
        gesteinsgr = Column('gesteinsgr', Text)
        gestein = Column('gestein', Text)
        the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-steinbrueche_1995',GeologieGeotechnikSteinbrueche1995)

class GeologieGeotechnikZementindustrie1965(Base, Vector):
# view in a schema
        __tablename__ = 'geotechnik_zementindustrie'
        __table_args__ = ({'schema': 'geol', 'autoload': False})
        __template__ = 'templates/htmlpopup/zementindustrie_1965.mako'
        __esriId__ = 1000
        __bodId__ = 'ch.swisstopo.geologie-geotechnik-zementindustrie_1965'
        __displayFieldName__ = 'id'
        id = Column('id', Integer, primary_key=True)
        stoff = Column('stoff', Text)
        the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))

register('ch.swisstopo.geologie-geotechnik-zementindustrie_1965',GeologieGeotechnikZementindustrie1965)

# class GeologieGeotechnikZementindustrie1995(Base, Vector):
#         # view in a schema
#         __tablename__ = 'geotechnik_zementindustrie'
#         __table_args__ = ({'schema': 'geol', 'autoload': False, 'extend_existing': True})
#         __template__ = 'templates/htmlpopup/zementindustrie_1995.mako'
#         __esriId__ = 1000
#         __bodId__ = 'ch.swisstopo.geologie-geotechnik-zementindustrie_1995'
#         __displayFieldName__ = ''
#         id = Column('id', Integer, primary_key=True)
#         the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo.geologie-geotechnik-zementindustrie_1995',GeologieGeotechnikZementindustrie1995)
# 
# class GeologieGeotechnikZiegeleien1907(Base, Vector):
#         # view in a schema
#         __tablename__ = 'geotechnik_ziegeleien_1907'
#         __table_args__ = ({'schema': 'geol', 'autoload': False})
#         __template__ = 'templates/htmlpopup/ziegeleien_1907.mako'
#         __queryable_attributes__ = ['ziegelei_2']
#         __esriId__ = 1000
#         __bodId__ = 'ch.swisstopo.geologie-geotechnik-ziegeleien_1907'
#         __displayFieldName__ = ''
#         id = Column('id', Integer, primary_key=True)
#         the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo.geologie-geotechnik-ziegeleien_1907',GeologieGeotechnikZiegeleien1907)
# 
# class GeologieGeotechnikZiegeleien1965(Base, Vector):
#         # view in a schema
#         __tablename__ = 'geotechnik_ziegeleien_1965'
#         __table_args__ = ({'schema': 'geol', 'autoload': False})
#         __template__ = 'templates/htmlpopup/ziegeleien_1965.mako'
#         __queryable_attributes__ = ['ziegelei']
#         __esriId__ = 1000
#         __bodId__ = 'ch.swisstopo.geologie-geotechnik-ziegeleien_1965'
#         __displayFieldName__ = ''
#         id = Column('id', Integer, primary_key=True)
#         the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo.geologie-geotechnik-ziegeleien_1965',GeologieGeotechnikZiegeleien1965)
# 
# class GeologieGeotechnikZiegeleien1995(Base, Vector):
#         # view in a schema
#         __tablename__ = 'geotechnik_ziegeleien_1995'
#         __table_args__ = ({'schema': 'geol', 'autoload': False})
#         __template__ = 'templates/htmlpopup/ziegeleien_1995.mako'
#         __queryable_attributes__ = ['ziegeleien']
#         __esriId__ = 1000
#         __bodId__ = 'ch.swisstopo.geologie-geotechnik-ziegeleien_1995'
#         __displayFieldName__ = ''
#         id = Column('id', Integer, primary_key=True)
#         the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo.geologie-geotechnik-ziegeleien_1995',GeologieGeotechnikZiegeleien1995)
# 
# class GeologieHydroKarteGrundwasservorkommen(Base, Vector):
#         # view in a schema
#         __tablename__ = 'grundwasservorkommen'
#         __table_args__ = ({'schema': 'geol', 'autoload': False})
#         __template__ = 'templates/htmlpopup/grundwasservorkommen.mako'
#         __esriId__ = 1000
#         __bodId__ = 'ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen'
#         __displayFieldName__ = ''
#         id = Column('bgdi_id', Integer, primary_key=True)
#         the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen',GeologieHydroKarteGrundwasservorkommen)
# 
# class GeologieHydroKarteGrundwasservulneabilitaet(Base, Vector):
#         # view in a schema
#         __tablename__ = 'grundwasservorkommen_plg'
#         __table_args__ = ({'schema': 'geol', 'autoload': False})
#         __template__ = 'templates/htmlpopup/grundwasservulnerabilitaet.mako'
#         __esriId__ = 1000
#         __bodId__ = 'ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet'
#         __displayFieldName__ = ''
#         id = Column('bgdi_id', Integer, primary_key=True)
#         the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet',GeologieHydroKarteGrundwasservulneabilitaet)
# 
# class GeologieGeothermie(Base, Vector):
#         # view in a schema
#         __tablename__ = 'geophysik_geothermie'
#         __table_args__ = ({'schema': 'geol', 'autoload': False})
#         __template__ = 'templates/htmlpopup/geothermie.mako'
#         __esriId__ = 1000
#         __bodId__ = 'ch.swisstopo.geologie-geophysik-geothermie'
#         __displayFieldName__ = ''
#         id = Column('gid', Integer, primary_key=True)
#         fid = Column ('id', Integer)
#         the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo.geologie-geophysik-geothermie',GeologieGeothermie)
# 
# class Geologischer_Deklination(Base, Vector):
#         # view in a schema
#         __tablename__ = 'geophysik_deklination'
#         __table_args__ = ({'schema': 'geol', 'autoload': False})
#         __template__ = 'templates/htmlpopup/deklination.mako'
#         __esriId__ = 1000
#         __bodId__ = 'ch.swisstopo.geologie-geophysik-deklination'
#         __displayFieldName__ = ''
#         id = Column('gid', Integer, primary_key=True)
#         the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo.geologie-geophysik-deklination',Geologischer_Deklination)
# 
# class Geologischer_Inklination(Base, Vector):
#         # view in a schema
#         __tablename__ = 'geophysik_inklination'
#         __table_args__ = ({'schema': 'geol', 'autoload': False})
#         __template__ = 'templates/htmlpopup/inklination.mako'
#         __esriId__ = 1000
#         __bodId__ = 'ch.swisstopo.geologie-geophysik-inklination'
#         __displayFieldName__ = ''
#         id = Column('gid', Integer, primary_key=True)
#         the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo.geologie-geophysik-inklination',Geologischer_Inklination)
# 
# class Geologischer_Aeromagnetik_Jura(Base, Vector):
#         # view in a schema
#         __tablename__ = 'gravimetrie_aeromagnetik_jura'
#         __table_args__ = ({'schema': 'geol', 'autoload': False})
#         __template__ = 'templates/htmlpopup/aeromagnetik_jura.mako'
#         __esriId__ = 1000
#         __bodId__ = 'ch.swisstopo.geologie-geophysik-aeromagnetische_karte_jura'
#         __displayFieldName__ = ''
#         id = Column('gid', Integer, primary_key=True)
#         fid = Column ('id', Integer)
#         the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo.geologie-geophysik-aeromagnetische_karte_jura',Geologischer_Aeromagnetik_Jura)
# 
# class GeologieGeophysikTotalintensitaet(Base, Vector):
#         # view in a schema
#         __tablename__ = 'geophysik_totalintensitaet'
#         __table_args__ = ({'schema': 'geol', 'autoload': False})
#         __template__ = 'templates/htmlpopup/totalintensitaet.mako'
#         __esriId__ = 1000
#         __bodId__ = 'ch.swisstopo.geologie-geophysik-totalintensitaet'
#         __displayFieldName__ = ''
#         id = Column('gid', Integer, primary_key=True)
#         fid = Column ('id', Integer)
#         the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo.geologie-geophysik-totalintensitaet',GeologieGeophysikTotalintensitaet)
# 
# class GeologieRohstoffeIndustrieminerale(Base, Vector):
#         # view in a schema
#         __tablename__ = 'rohstoffe_industrieminerale'
#         __table_args__ = ({'schema': 'geol', 'autoload': False})
#         __template__ = 'templates/htmlpopup/rohstoffe_industrieminerale.mako'
#         __queryable_attributes__ = ['name_ads']
#         __esriId__ = 1000
#         __bodId__ = 'ch.swisstopo.geologie-rohstoffe-industrieminerale'
#         __displayFieldName__ = ''
#         id = Column('id', Integer, primary_key=True)
#         the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo.geologie-rohstoffe-industrieminerale',GeologieRohstoffeIndustrieminerale)
# 
# class GeologieRohstoffeKohlenBitumenErdgas(Base, Vector):
#         # view in a schema
#         __tablename__ = 'rohstoffe_kohlen_bitumen_erdgas'
#         __table_args__ = ({'schema': 'geol', 'autoload': False})
#         __template__ = 'templates/htmlpopup/rohstoffe_kohlen_bitumen_erdgas.mako'
#         __queryable_attributes__ = ['name_ads']
#         __esriId__ = 1000
#         __bodId__ = 'ch.swisstopo.geologie-rohstoffe-kohlen_bitumen_erdgas'
#         __displayFieldName__ = ''
#         id = Column('id', Integer, primary_key=True)
#         the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo.geologie-rohstoffe-kohlen_bitumen_erdgas',GeologieRohstoffeKohlenBitumenErdgas)
# 
# class GeologieRohstoffeVererzungen(Base, Vector):
#         # view in a schema
#         __tablename__ = 'rohstoffe_vererzungen'
#         __table_args__ = ({'schema': 'geol', 'autoload': False})
#         __template__ = 'templates/htmlpopup/rohstoffe_vererzungen.mako'
#         __queryable_attributes__ = ['name_ads']
#         __esriId__ = 1000
#         __bodId__ = 'ch.swisstopo.geologie-rohstoffe-vererzungen'
#         __displayFieldName__ = ''
#         id = Column('id', Integer, primary_key=True)
#         the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo.geologie-rohstoffe-vererzungen',GeologieRohstoffeVererzungen)
# 
# class GeologieTektonischeKarteLine(Base, Vector):
#         # view in a schema
#         __tablename__ = 'tektonische_karte_line'
#         __table_args__ = ({'schema': 'geol', 'autoload': False})
#         __template__ = 'templates/htmlpopup/tektonische_karte_line.mako'
#         __esriId__ = 1000
#         __bodId__ = 'ch.swisstopo.geologie-tektonische_karte'
#         __displayFieldName__ = ''
#         id = Column('fid', Text, primary_key=True)
#         gid = Column ('id', Integer)
#         the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# class GeologieTektonischeKartePoly(Base, Vector):
#         # view in a schema
#         __tablename__ = 'tektonische_karte_flaechen'
#         __table_args__ = ({'schema': 'geol', 'autoload': False})
#         __template__ = 'templates/htmlpopup/tektonische_karte_poly.mako'
#         __esriId__ = 1000
#         __bodId__ = 'ch.swisstopo.geologie-tektonische_karte'
#         __displayFieldName__ = ''
#         id = Column('fid', Integer, primary_key=True)
#         gid = Column ('id', Integer)
#         the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo.geologie-tektonische_karte',GeologieTektonischeKarteLine)
# register('ch.swisstopo.geologie-tektonische_karte',GeologieTektonischeKartePoly)
# 
# class Swisstlm3dWanderwege(Base, Vector):
#     # view in a schema
#     __tablename__ = 'wanderwege_swissmap'
#     __table_args__ = ({'schema': 'karto', 'autoload': False})
#     __template__ = 'templates/htmlpopup/swissmap_online_wanderwege.mako'
#     __esriId__ = 1000
#     __bodId__ = 'ch.swisstopo.swisstlm3d-wanderwege'
#     __displayFieldName__ = ''
#     id = Column('nr', Integer, primary_key=True)
#     the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo.swisstlm3d-wanderwege',Swisstlm3dWanderwege)
# 
# class VerschiebungsvektorenTsp1(Base, Vector):
#         # view in a schema
#         __tablename__ = 'verschiebungsvektoren_tsp1'
#         __table_args__ = ({'schema': 'geodaesie', 'autoload': False})
#         __template__ = 'templates/htmlpopup/verschiebungsvektoren_tps1.mako'
#         __queryable_attributes__ = ['name']
#         __esriId__ = 1000
#         __bodId__ = 'ch.swisstopo.verschiebungsvektoren-tsp1'
#         __displayFieldName__ = ''
#         id = Column('id', Integer, primary_key=True)
#         the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo.verschiebungsvektoren-tsp1',VerschiebungsvektorenTsp1)
# 
# class VerschiebungsvektorenTsp2(Base, Vector):
#         # view in a schema
#         __tablename__ = 'verschiebungsvektoren_tsp2'
#         __table_args__ = ({'schema': 'geodaesie', 'autoload': False})
#         __template__ = 'templates/htmlpopup/verschiebungsvektoren_tps2.mako'
#         __queryable_attributes__ = ['name']
#         __esriId__ = 1000
#         __bodId__ = 'ch.swisstopo.verschiebungsvektoren-tsp2'
#         __displayFieldName__ = ''
#         id = Column('id', Integer, primary_key=True)
#         the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo.verschiebungsvektoren-tsp2',VerschiebungsvektorenTsp2)
# 
# class SwissmapOnlineWanderwege(Base, Vector):
#  	# view in a schema
#  	__tablename__ = 'wanderwege_swissmap'
#  	__table_args__ = ({'schema': 'karto', 'autoload': False, 'extend_existing': True})
#  	__template__ = 'templates/htmlpopup/swissmap_online_wanderwege.mako'
#     __esriId__ = 1000
#     __bodId__ = 'ch.swisstopo-karto.wanderwege'
#     __displayFieldName__ = ''
#  	id = Column('nr', Integer, primary_key=True)
#  	the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo-karto.wanderwege',SwissmapOnlineWanderwege)
# 
# class PLZOrtschaften(Base, Vector):
#        # view in a schema
#        __tablename__ = 'gabmo_plz'
#        __table_args__ = ({'schema': 'vd', 'autoload': False})
#        __template__ = 'templates/htmlpopup/gabmo_plz.mako'
#        __esriId__ = 1000
#        __bodId__ = 'ch.swisstopo-vd.ortschaftenverzeichnis_plz'
#        __displayFieldName__ = ''
#        id = Column('os_uuid', Text, primary_key=True)
#        plz = Column('plz', Integer)
#        zusziff = Column('zusziff', Text)
#        langtext = Column('langtext', Text)
#        the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo-vd.ortschaftenverzeichnis_plz',PLZOrtschaften)
# 
# class geometaStandAV(Base, Vector): 	 
#        # view in a schema 	 
#        __tablename__ = 'amogr_standav' 	 
#        __table_args__ = ({'schema': 'vd', 'autoload': False}) 	 
#        __template__ = 'templates/htmlpopup/standav.mako' 	 
#        __esriId__ = 1000
#        __bodId__ = 'ch.swisstopo-vd.geometa-standav'
#        __displayFieldName__ = ''
#        id = Column('gid', Integer, primary_key=True) 	 
#        fid = Column ('id', Integer) 	 
#        the_geom = Column('the_geom_gen50',Geometry(21781)) 	 
#        not_used = Column('the_geom',Geometry(21781)) 	 
# 	  	 
# register('ch.swisstopo-vd.geometa-standav',geometaStandAV)
# 
# class geometaLos(Base, Vector):
#        # view in a schema
#        __tablename__ = 'amogr_los'
#        __table_args__ = ({'schema': 'vd', 'autoload': False})
#        __template__ = 'templates/htmlpopup/los.mako'
#        __esriId__ = 1000
#        __bodId__ = 'ch.swisstopo-vd.geometa-los'
#        __displayFieldName__ = ''
#        id = Column('gid', Integer, primary_key=True)
#        fid = Column ('id', Integer)
#        the_geom = Column('the_geom_gen50',Geometry(21781))
#        not_used = Column('the_geom',Geometry(21781))
# 
# register('ch.swisstopo-vd.geometa-los',geometaLos)
# 
# class geometaGemeinde(Base, Vector):
#        # view in a schema
#        __tablename__ = 'amogr_gemeinde'
#        __table_args__ = ({'schema': 'vd', 'autoload': False})
#        __template__ = 'templates/htmlpopup/gemeinde.mako'
#        __esriId__ = 1000
#        __bodId__ = 'ch.swisstopo-vd.geometa-gemeinde'
#        __displayFieldName__ = ''
#        id = Column('gid', Integer, primary_key=True)
#        fid = Column ('id', Integer)
# #       gembfs = Column ('bfs_nr', Integer)
# #       gemkanton = Column ('kanton', Text)
# #       gemgemeinde = Column ('gemeindename', Text)
# #       gemdarstellung = Column ('abgabestelle', Text)
# #       gemflaeche = Column ('flaeche_ha', Text)
# #       geompdf_liste = Column ('pdf_liste', Text)
#        the_geom = Column('the_geom_gen50',Geometry(21781))
#        not_used = Column('the_geom',Geometry(21781))
# 
# register('ch.swisstopo-vd.geometa-gemeinde',geometaGemeinde)
# 
# class geometaGrundbuch(Base, Vector):
#        # view in a schema
#        __tablename__ = 'amogr_grundbuch'
#        __table_args__ = ({'schema': 'vd', 'autoload': False})
#        __template__ = 'templates/htmlpopup/grundbuch.mako'
#        __esriId__ = 1000
#        __bodId__ = 'ch.swisstopo-vd.geometa-grundbuch'
#        __displayFieldName__ = ''
#        id = Column('gid', Integer, primary_key=True)
#        fid = Column ('id', Integer)
# #       grundgemeinde = Column ('ortsteil_grundbuch', Text)
# #       grundfuehrung = Column ('grundbuchfuehrung_d', Text)
# #       grundkreis = Column ('grundbuchkreis', Text)
# #       grundadresse = Column ('adresse', Text)
# #       grundtel = Column ('telefon', Text)
# #       grundurl = Column ('email', Text)
#        the_geom = Column('the_geom_gen50',Geometry(21781))
#        not_used = Column('the_geom',Geometry(21781))
# 
# register('ch.swisstopo-vd.geometa-grundbuch',geometaGrundbuch)
# 
# class geometaNfgeom(Base, Vector):
#        # view in a schema
#        __tablename__ = 'amogr_nfgeom'
#        __table_args__ = ({'schema': 'vd', 'autoload': False})
#        __template__ = 'templates/htmlpopup/nfgeom.mako'
#        __esriId__ = 1000
#        __bodId__ = 'ch.swisstopo-vd.geometa-nfgeom'
#        __displayFieldName__ = ''
#        id = Column('gid', Integer, primary_key=True)
# #       nfname = Column ('name', Text)
# #       nffirmenname = Column ('firmenname', Text)
# #       nfadresse = Column ('adresse', Text)
#        the_geom = Column('the_geom_gen50',Geometry(21781))
#        not_used = Column('the_geom',Geometry(21781))
# 
# register('ch.swisstopo-vd.geometa-nfgeom',geometaNfgeom)
# 
# #two registers...
# class spannungsarmeGebiete(Base, Vector):
#        __tablename__ = 'spannungsarme_gebiete'
#        __table_args__ = ({'schema': 'vd', 'autoload': False})
#        __template__ = 'templates/htmlpopup/spannungsarme_gebiete.mako'
#        __esriId__ = 1000
#        __bodId__ = ''
#        __displayFieldName__ = ''
#        id = Column('identifier', Text, primary_key=True)
#        the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# register('ch.swisstopo-vd.spannungsarme-gebiete',spannungsarmeGebiete)
# register('ch.swisstopo.transformationsgenauigkeit',spannungsarmeGebiete)
# 
# class geologieGeotopePunkte(Base, Vector):
#      __tablename__ = 'geotope_pkt'
#      __table_args__ = ({'schema': 'geol', 'autoload': False})
#      __template__ = 'templates/htmlpopup/geotope.mako'
#      __esriId__ = 1000
#      __bodId__ = 'ch.swisstopo.geologie-geotope'
#      __displayFieldName__ = ''
#      id = Column('objectid', Integer, primary_key=True)
#      the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
# 
# class geologieGeotopeFlaechen(Base, Vector):
#      __tablename__ = 'geotope_plg'
#      __table_args__ = ({'schema': 'geol', 'autoload': False})
#      __template__ = 'templates/htmlpopup/geotope.mako'
#      __esriId__ = 1000
#      __bodId__ = 'ch.swisstopo.geologie-geotope'
#      __displayFieldName__ = ''
#      id = Column('objectid', Integer, primary_key=True)
#      the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
#      
# register('ch.swisstopo.geologie-geotope',geologieGeotopePunkte)
# register('ch.swisstopo.geologie-geotope',geologieGeotopeFlaechen)
