# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from geoalchemy import GeometryColumn, Geometry
from sqlalchemy.types import Numeric
from chsdi.models import *
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
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
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
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    name = Column('name', Text)

register('ch.vbs.territorialregionen', TERRITORIALREGIONEN)
