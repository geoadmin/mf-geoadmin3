# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from geoalchemy import GeometryColumn, Geometry
from sqlalchemy.types import Numeric
from chsdi.models import *
from chsdi.models.vector import Vector

Base = bases['edi']


class Arealstatistik2009(Base, Vector):
    __tablename__ = 'arealstatistik_std_2009'
    __table_args__ = ({'schema': 'bfs', 'autoload': False})
    __template__ = 'templates/htmlpopup/arealstatistik_std.mako'
    __bodId__ = 'ch.bfs.arealstatistik'
    # __minscale__ = 5001
    __maxscale__ = 50000
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    fj85 = Column('fj85', Integer)
    fj97 = Column('fj97', Integer)
    fj09 = Column('fj09', Integer)
    id_arealstatistik_85 = Column('id_arealstatistik_85', Integer)
    id_arealstatistik_97 = Column('id_arealstatistik_97', Integer)
    id_arealstatistik_09 = Column('id_arealstatistik_09', Integer)

register('ch.bfs.arealstatistik', Arealstatistik2009)


class Arealstatistik1985(Base, Vector):
    __tablename__ = 'arealstatistik_std_1985'
    __table_args__ = ({'schema': 'bfs', 'autoload': False})
    __template__ = 'templates/htmlpopup/arealstatistik_std.mako'
    __bodId__ = 'ch.bfs.arealstatistik-1985'
    # __minscale__ = 5001
    __maxscale__ = 50000
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    fj85 = Column('fj85', Integer)
    fj97 = Column('fj97', Integer)
    fj09 = Column('fj09', Integer)
    id_arealstatistik_85 = Column('id_arealstatistik_85', Integer)
    id_arealstatistik_97 = Column('id_arealstatistik_97', Integer)
    id_arealstatistik_09 = Column('id_arealstatistik_09', Integer)

register('ch.bfs.arealstatistik-1985', Arealstatistik1985)


class Arealstatistik1997(Base, Vector):
    __tablename__ = 'arealstatistik_std_1997'
    __table_args__ = ({'schema': 'bfs', 'autoload': False})
    __template__ = 'templates/htmlpopup/arealstatistik_std.mako'
    __bodId__ = 'ch.bfs.arealstatistik-1997'
    #__minscale__ = 5001
    __maxscale__ = 50000
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    fj85 = Column('fj85', Integer)
    fj97 = Column('fj97', Integer)
    fj09 = Column('fj09', Integer)
    id_arealstatistik_85 = Column('id_arealstatistik_85', Integer)
    id_arealstatistik_97 = Column('id_arealstatistik_97', Integer)
    id_arealstatistik_09 = Column('id_arealstatistik_09', Integer)

register('ch.bfs.arealstatistik-1997', Arealstatistik1997)


class fsme_faelle(Base, Vector):
    __tablename__ = 'fsme_faelle'
    __table_args__ = ({'schema': 'bag', 'autoload': False})
    __template__ = 'templates/htmlpopup/fsme.mako'
    __bodId__ = 'ch.bag.zecken-fsme-faelle'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    gemname = Column('gemname', Integer)
    bfsnr = Column('bfsnr', Integer)
    bezirksnr = Column('bezirksnr', Integer)
    kantonsnr = Column('kantonsnr', Integer)

register('ch.bag.zecken-fsme-faelle', fsme_faelle)


class fsme_impfung(Base, Vector):
    __tablename__ = 'fsme_impfung'
    __table_args__ = ({'schema': 'bag', 'autoload': False})
    __template__ = 'templates/htmlpopup/fsme.mako'
    __bodId__ = 'ch.bag.zecken-fsme-impfung'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    gemname = Column('gemname', Integer)
    bfsnr = Column('bfsnr', Integer)
    bezirksnr = Column('bezirksnr', Integer)
    kantonsnr = Column('kantonsnr', Integer)

register('ch.bag.zecken-fsme-impfung', fsme_impfung)
