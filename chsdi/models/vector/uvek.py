# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer
from geoalchemy import GeometryColumn, Geometry

from chsdi.models import *
from chsdi.models.vector import Vector


Base = bases['uvek']


# IVS NAT and REG use the same template
class IVS_NAT(Base, Vector):
    __tablename__ = 'ivs_nat'
    __table_args__ = ({'schema': 'astra', 'autoload': False})
    __template__ = 'templates/htmlpopup/ivs_nat.mako'
    __esriId__ = 3000
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
    __esriId__ = 4000
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

register('ch.astra.ivs-reg_loc', IVS_REG_LOC)
