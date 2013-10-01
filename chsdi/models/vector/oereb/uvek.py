from sqlalchemy import Column, Text
from geoalchemy import GeometryColumn, Geometry

from chsdi.models import *
from chsdi.models.vector import Vector


Base = bases['uvek']


class Projektierungszonen_Oereb(Base, Vector):
    __tablename__ = 'projektierungszonen_oereb'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __bodId__ = 'ch.bazl.projektierungszonen-flughafenanlagen.oereb'
    id = Column('stabil_id', Text, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    geomType = Column('geom_type', Text)
    xmlData = Column('xml_data', Text)

register_oereb('ch.bazl.projektierungszonen-flughafenanlagen.oereb', Projektierungszonen_Oereb)


class Sichereitszonen_Oereb(Base, Vector):
    __tablename__ = 'sichereitszonen_oereb'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __bodId__ = 'ch.bazl.projektierungszonen-flughafenanlagen.oereb'
    id = Column('stabil_id', Text, primary_key=True)
    the_geom = GeometryColumn(Geometry(dimension=2, srid=21781))
    geomType = Column('geom_type', Text)
    xmlData = Column('xml_data', Text)

register_oereb('ch.bazl.sichereitszonen.oereb', Sichereitszonen_Oereb)
