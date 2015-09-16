# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from geoalchemy2.types import Geometry
from sqlalchemy.types import Numeric

from chsdi.models import register, bases
from chsdi.models.vector import Vector

Base = bases['vbs']


class Kulturgueter(Base, Vector):
    __tablename__ = 'kgs'
    __table_args__ = ({'schema': 'babs', 'autoload': False})
    __template__ = 'templates/htmlpopup/kgs.mako'
    __queryable_attributes__ = ['zkob']
    __bodId__ = 'ch.babs.kulturgueter'
    __extended_info__ = True
    __label__ = 'zkob'
    id = Column('kgs_nr', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
    zkob = Column('zkob', Text)
    x = Column('x', Numeric)
    y = Column('y', Numeric)
    kategorie = Column('kategorie', Text)
    gemeinde = Column('gemeinde', Text)
    gemeinde_ehemalig = Column('gemeinde_ehemalig', Text)
    objektart = Column('objektart', Text)
    hausnr = Column('hausnr', Text)
    adresse = Column('adresse', Text)
    kurztexte = Column('kurztexte', Text)
    kt_kz = Column('kt_kz', Text)
    pdf_list = Column('pdf_list', Text)
    link_uri = Column('link_uri', Text)
    link_title = Column('link_title', Text)
    link_2_uri = Column('link_2_uri', Text)
    link_2_title = Column('link_2_title', Text)
    link_3_uri = Column('link_3_uri', Text)
    link_3_title = Column('link_3_title', Text)

register('ch.babs.kulturgueter', Kulturgueter)


class TERRITORIALREGIONEN(Base, Vector):
    __tablename__ = 'territorialregionen'
    __table_args__ = ({'autoload': False})
    __template__ = 'templates/htmlpopup/territorialregionen.mako'
    __bodId__ = 'ch.vbs.territorialregionen'
    __label__ = 'name'
    id = Column('terreg_nr', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=3, srid=21781))
    name = Column('name', Text)

register('ch.vbs.territorialregionen', TERRITORIALREGIONEN)


class Patrouilledesglaciers_z(Base, Vector):
    __tablename__ = 'patrouille_z'
    __table_args__ = ({'schema': 'militaer', 'autoload': False})
    __template__ = 'templates/htmlpopup/patrouilledesglaciers_z.mako'
    __bodId__ = 'ch.vbs.patrouilledesglaciers-z_rennen'
    __label__ = 'name'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=3, srid=21781))
    name = Column('name', Text)

register('ch.vbs.patrouilledesglaciers-z_rennen', Patrouilledesglaciers_z)


class Patrouilledesglaciers_a(Base, Vector):
    __tablename__ = 'patrouille_a'
    __table_args__ = ({'schema': 'militaer', 'autoload': False})
    __template__ = 'templates/htmlpopup/patrouilledesglaciers_a.mako'
    __bodId__ = 'ch.vbs.patrouilledesglaciers-a_rennen'
    __label__ = 'name'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=3, srid=21781))
    name = Column('name', Text)

register('ch.vbs.patrouilledesglaciers-a_rennen', Patrouilledesglaciers_a)


class Retablierungsstellen(Base, Vector):
    __tablename__ = 'retablierungsstellen'
    __table_args__ = ({'schema': 'militaer', 'autoload': False})
    __template__ = 'templates/htmlpopup/retablierungsstellen.mako'
    __bodId__ = 'ch.vbs.retablierungsstellen'
    __queryable_attributes__ = ['name']
    __label__ = 'name'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=3, srid=21781))
    name = Column('name', Text)
    url = Column('url', Text)
register('ch.vbs.retablierungsstellen', Retablierungsstellen)


class Armeelogistikcenter(Base, Vector):
    __tablename__ = 'armeelogistikcenter'
    __table_args__ = ({'schema': 'militaer', 'autoload': False})
    __template__ = 'templates/htmlpopup/armeelogistikcenter.mako'
    __bodId__ = 'ch.vbs.armeelogistikcenter'
    __queryable_attributes__ = ['name', 'abkuerzung']
    __label__ = 'name'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=3, srid=21781))
    name = Column('name', Text)
    abkuerzung = Column('abkuerzung', Text)
    mail = Column('email', Text)
    url = Column('url', Text)
register('ch.vbs.armeelogistikcenter', Armeelogistikcenter)


class Bundestankstellen_bebeco(Base, Vector):
    __tablename__ = 'bundestankstellen_bebeco'
    __table_args__ = ({'schema': 'militaer', 'autoload': False})
    __template__ = 'templates/htmlpopup/bundestankstellen.mako'
    __bodId__ = 'ch.vbs.bundestankstellen-bebeco'
    __queryable_attributes__ = ['ort']
    __label__ = 'ort'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=3, srid=21781))
    ort = Column('ort', Text)
register('ch.vbs.bundestankstellen-bebeco', Bundestankstellen_bebeco)


class Logistikraeume_armeelogistikcenter(Base, Vector):
    __tablename__ = 'abschnittsregionen_armeelogistikzentren'
    __table_args__ = ({'schema': 'militaer', 'autoload': False})
    __template__ = 'templates/htmlpopup/logistikraeume.mako'
    __bodId__ = 'ch.vbs.logistikraeume-armeelogistikcenter'
    __queryable_attributes__ = ['kanton', 'region']
    __label__ = 'kanton'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=3, srid=21781))
    kanton = Column('kantone', Text)
    region = Column('region', Text)
register('ch.vbs.logistikraeume-armeelogistikcenter', Logistikraeume_armeelogistikcenter)
