# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from geoalchemy2.types import Geometry
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
    # specially big layer
    __label__ = 'id'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
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
    # specially big layer
    __label__ = 'id'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
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
    #specially big layer
    __label__ = 'id'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
    fj85 = Column('fj85', Integer)
    fj97 = Column('fj97', Integer)
    fj09 = Column('fj09', Integer)
    id_arealstatistik_85 = Column('id_arealstatistik_85', Integer)
    id_arealstatistik_97 = Column('id_arealstatistik_97', Integer)
    id_arealstatistik_09 = Column('id_arealstatistik_09', Integer)

register('ch.bfs.arealstatistik-1997', Arealstatistik1997)


class ArealstatistikBodenbedeckung2009(Base, Vector):
    __tablename__ = 'arealstatistik_nolc_2009'
    __table_args__ = ({'schema': 'bfs', 'autoload': False})
    __template__ = 'templates/htmlpopup/arealstatistik_nolc.mako'
    __bodId__ = 'ch.bfs.arealstatistik-bodenbedeckung'
    #__minscale__ = 5001
    __maxscale__ = 50000
    #specially big layer
    __label__ = 'id'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
    fj85 = Column('fj85', Integer)
    fj97 = Column('fj97', Integer)
    fj09 = Column('fj09', Integer)
    id_arealstatistik_nolc_85 = Column('id_arealstatistik_nolc_85', Integer)
    id_arealstatistik_nolc_97 = Column('id_arealstatistik_nolc_97', Integer)
    id_arealstatistik_nolc_09 = Column('id_arealstatistik_nolc_09', Integer)

register('ch.bfs.arealstatistik-bodenbedeckung', ArealstatistikBodenbedeckung2009)


class ArealstatistikBodenbedeckung1997(Base, Vector):
    __tablename__ = 'arealstatistik_nolc_1997'
    __table_args__ = ({'schema': 'bfs', 'autoload': False})
    __template__ = 'templates/htmlpopup/arealstatistik_nolc.mako'
    __bodId__ = 'ch.bfs.arealstatistik-bodenbedeckung-1997'
    #__minscale__ = 5001
    __maxscale__ = 50000
    #specially big layer
    __label__ = 'id'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
    fj85 = Column('fj85', Integer)
    fj97 = Column('fj97', Integer)
    fj09 = Column('fj09', Integer)
    id_arealstatistik_nolc_85 = Column('id_arealstatistik_nolc_85', Integer)
    id_arealstatistik_nolc_97 = Column('id_arealstatistik_nolc_97', Integer)
    id_arealstatistik_nolc_09 = Column('id_arealstatistik_nolc_09', Integer)

register('ch.bfs.arealstatistik-bodenbedeckung-1997', ArealstatistikBodenbedeckung1997)


class ArealstatistikBodenbedeckung1985(Base, Vector):
    __tablename__ = 'arealstatistik_nolc_1985'
    __table_args__ = ({'schema': 'bfs', 'autoload': False})
    __template__ = 'templates/htmlpopup/arealstatistik_nolc.mako'
    __bodId__ = 'ch.bfs.arealstatistik-bodenbedeckung-1985'
    #__minscale__ = 5001
    __maxscale__ = 50000
    #specially big layer
    __label__ = 'id'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
    fj85 = Column('fj85', Integer)
    fj97 = Column('fj97', Integer)
    fj09 = Column('fj09', Integer)
    id_arealstatistik_nolc_85 = Column('id_arealstatistik_nolc_85', Integer)
    id_arealstatistik_nolc_97 = Column('id_arealstatistik_nolc_97', Integer)
    id_arealstatistik_nolc_09 = Column('id_arealstatistik_nolc_09', Integer)

register('ch.bfs.arealstatistik-bodenbedeckung-1985', ArealstatistikBodenbedeckung1985)


class ArealstatistikBodennutzung(Base, Vector):
    __tablename__ = 'arealstatistik_nolu_2009'
    __table_args__ = ({'schema': 'bfs', 'autoload': False})
    __template__ = 'templates/htmlpopup/arealstatistik_nolu.mako'
    __bodId__ = 'ch.bfs.arealstatistik-bodennutzung'
    #__minscale__ = 5001
    __maxscale__ = 50000
    #specially big layer
    __label__ = 'id'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
    fj85 = Column('fj85', Integer)
    fj97 = Column('fj97', Integer)
    fj09 = Column('fj09', Integer)
    id_arealstatistik_nolu_85 = Column('id_arealstatistik_nolu_85', Integer)
    id_arealstatistik_nolu_97 = Column('id_arealstatistik_nolu_97', Integer)
    id_arealstatistik_nolu_09 = Column('id_arealstatistik_nolu_09', Integer)

register('ch.bfs.arealstatistik-bodennutzung', ArealstatistikBodennutzung)


class ArealstatistikBodennutzung1997(Base, Vector):
    __tablename__ = 'arealstatistik_nolu_1997'
    __table_args__ = ({'schema': 'bfs', 'autoload': False})
    __template__ = 'templates/htmlpopup/arealstatistik_nolu.mako'
    __bodId__ = 'ch.bfs.arealstatistik-bodennutzung-1997'
    #__minscale__ = 5001
    __maxscale__ = 50000
    #specially big layer
    __label__ = 'id'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
    fj85 = Column('fj85', Integer)
    fj97 = Column('fj97', Integer)
    fj09 = Column('fj09', Integer)
    id_arealstatistik_nolu_85 = Column('id_arealstatistik_nolu_85', Integer)
    id_arealstatistik_nolu_97 = Column('id_arealstatistik_nolu_97', Integer)
    id_arealstatistik_nolu_09 = Column('id_arealstatistik_nolu_09', Integer)

register('ch.bfs.arealstatistik-bodennutzung-1997', ArealstatistikBodennutzung1997)


class ArealstatistikBodennutzung1985(Base, Vector):
    __tablename__ = 'arealstatistik_nolu_1985'
    __table_args__ = ({'schema': 'bfs', 'autoload': False})
    __template__ = 'templates/htmlpopup/arealstatistik_nolu.mako'
    __bodId__ = 'ch.bfs.arealstatistik-bodennutzung-1985'
    #__minscale__ = 5001
    __maxscale__ = 50000
    #specially big layer
    __label__ = 'id'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
    fj85 = Column('fj85', Integer)
    fj97 = Column('fj97', Integer)
    fj09 = Column('fj09', Integer)
    id_arealstatistik_nolu_85 = Column('id_arealstatistik_nolu_85', Integer)
    id_arealstatistik_nolu_97 = Column('id_arealstatistik_nolu_97', Integer)
    id_arealstatistik_nolu_09 = Column('id_arealstatistik_nolu_09', Integer)

register('ch.bfs.arealstatistik-bodennutzung-1985', ArealstatistikBodennutzung1985)


class fsme_faelle(Base, Vector):
    __tablename__ = 'fsme_faelle'
    __table_args__ = ({'schema': 'bag', 'autoload': False})
    __template__ = 'templates/htmlpopup/fsme.mako'
    __bodId__ = 'ch.bag.zecken-fsme-faelle'
    __label__ = 'gemname'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
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
    __label__ = 'gemname'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
    gemname = Column('gemname', Integer)
    bfsnr = Column('bfsnr', Integer)
    bezirksnr = Column('bezirksnr', Integer)
    kantonsnr = Column('kantonsnr', Integer)

register('ch.bag.zecken-fsme-impfung', fsme_impfung)
