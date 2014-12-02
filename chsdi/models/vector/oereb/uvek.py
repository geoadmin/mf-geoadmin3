# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text
from geoalchemy2.types import Geometry

from chsdi.models import *
from chsdi.models.vector import Vector


Base = bases['uvek']


class Projektierungszonen_Oereb(Base, Vector):
    __tablename__ = 'projektierungszonen_oereb'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __bodId__ = 'ch.bazl.projektierungszonen-flughafenanlagen.oereb'
    id = Column('stabil_id', Text, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
    geomType = Column('geom_type', Text)
    xmlData = Column('xml_data', Text)
    bgdi_created = Column('bgdi_created', Text)
    data_created = Column('data_created', Text)

register_oereb('ch.bazl.projektierungszonen-flughafenanlagen.oereb', Projektierungszonen_Oereb)


class Sichereitszonen_Oereb(Base, Vector):
    __tablename__ = 'sichereitszonen_oereb'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __bodId__ = 'ch.bazl.sicherheitszonenplan.oereb'
    id = Column('stabil_id', Text, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
    geomType = Column('geom_type', Text)
    xmlData = Column('xml_data', Text)
    bgdi_created = Column('bgdi_created', Text)
    data_created = Column('data_created', Text)

register_oereb('ch.bazl.sicherheitszonenplan.oereb', Sichereitszonen_Oereb)


class Kataster_belasteten_standorte_oev_Oereb(Base, Vector):
    __tablename__ = 'kataster_belasteter_standorte_oev_oereb'
    __table_args__ = ({'schema': 'bav', 'autoload': False})
    __bodId__ = 'ch.bav.kataster-belasteter-standorte-oev.oereb'
    id = Column('stabil_id', Text, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
    geomType = Column('geom_type', Text)
    xmlData = Column('xml_data', Text)
    bgdi_created = Column('bgdi_created', Text)
    data_created = Column('data_created', Text)

register_oereb('ch.bav.kataster-belasteter-standorte-oev.oereb', Kataster_belasteten_standorte_oev_Oereb)


class Kataster_belasteten_standorte_zivflpl_Oereb(Base, Vector):
    __tablename__ = 'kataster_belasteter_standorte_zivflpl_oereb'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __bodId__ = 'ch.bazl.kataster-belasteter-standorte-zivilflugplaetze.oereb'
    id = Column('stabil_id', Text, primary_key=True)
    the_geom = Column(Geometry(geometry_type='GEOMETRY',
                               dimension=2, srid=21781))
    geomType = Column('geom_type', Text)
    xmlData = Column('xml_data', Text)
    bgdi_created = Column('bgdi_created', Text)
    data_created = Column('data_created', Text)

register_oereb('ch.bazl.kataster-belasteter-standorte-zivilflugplaetze.oereb', Kataster_belasteten_standorte_zivflpl_Oereb)
