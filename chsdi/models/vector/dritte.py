# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from sqlalchemy.types import Numeric
from geoalchemy2.types import Geometry

from chsdi.models import register, bases
from chsdi.models.vector import Vector


Base = bases['dritte']


class FEUERSTELLEN(Base, Vector):
    __tablename__ = 'feuerstellen'
    __table_args__ = ({'schema': 'tamedia', 'autoload': False})
    __template__ = 'templates/htmlpopup/swissmap_online_feuerstellen.mako'
    __bodId__ = 'ch.tamedia.schweizerfamilie-feuerstellen'
    __label__ = 'gemeinde'
    id = Column('nr', Integer, primary_key=True)
    gemeinde = Column('gemeinde', Text)
    ort = Column('ort', Text)
    kanton = Column('kanton', Text)
    karte = Column('karte', Text)
    url = Column('url', Text)
    koordinate_lv03 = Column('koordinate_lv03', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.tamedia.schweizerfamilie-feuerstellen', FEUERSTELLEN)


class NOTFALLSCHUTZ(Base, Vector):
    __tablename__ = 'zonenplan_kernanlagen'
    __table_args__ = ({'schema': 'ensi', 'autoload': False})
    __template__ = 'templates/htmlpopup/zonenplan_kernanlagen.mako'
    __bodId__ = 'ch.ensi.zonenplan-notfallschutz-kernanlagen'
    __label__ = 'name'
    id = Column('nr', Integer, primary_key=True)
    name = Column('name', Text)
    zone = Column('zone', Text)
    sektor = Column('sektor', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.ensi.zonenplan-notfallschutz-kernanlagen', NOTFALLSCHUTZ)


class PRONATURA(Base, Vector):
    __tablename__ = 'waldreservate'
    __table_args__ = ({'schema': 'pronatura', 'autoload': False})
    __template__ = 'templates/htmlpopup/pronatura.mako'
    __bodId__ = 'ch.pronatura.waldreservate'
    __queryable_attributes__ = ['name', 'sg_nr', 'gisflaeche', 'mcpfe']
    __label__ = 'name'
    id = Column('bgdi_id', Integer, primary_key=True)
    sg_nr = Column('sg_nr', Numeric)
    name = Column('name', Text)
    gisflaeche = Column('obj_gisflaeche', Numeric)
    mcpfe = Column('mcpfe', Text)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.pronatura.waldreservate', PRONATURA)


class Aeromagnetische_karte_1500(Base, Vector):
    __tablename__ = 'am_1500'
    __table_args__ = ({'schema': 'nagra', 'autoload': False})
    __template__ = 'templates/htmlpopup/aeromagnetische_karte.mako'
    __bodId__ = 'ch.nagra.aeromagnetische-karte_1500'
    __label__ = 'id'
    id = Column('et_id', Integer, primary_key=True)
    et_fromatt_1500 = Column('et_fromatt_1500', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.nagra.aeromagnetische-karte_1500', Aeromagnetische_karte_1500)


class Aeromagnetische_karte_1100(Base, Vector):
    __tablename__ = 'am_1100'
    __table_args__ = ({'schema': 'nagra', 'autoload': False})
    __template__ = 'templates/htmlpopup/aeromagnetische_karte.mako'
    __bodId__ = 'ch.nagra.aeromagnetische-karte_1100'
    __label__ = 'id'
    id = Column('et_id', Integer, primary_key=True)
    et_fromatt_1100 = Column('et_fromatt_1100', Numeric)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))

register('ch.nagra.aeromagnetische-karte_1100', Aeromagnetische_karte_1100)
