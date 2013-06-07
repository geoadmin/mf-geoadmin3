# -*- coding: utf-8 -*-

from chsdi.models import  *
from chsdi.models.vector import Vector

Base = bases['search']

class SwissSearch(Base, Vector):
    __tablename__ = 'swiss_search'
    __table_args__ = ({'autoload': True})
    __mapper_args__ = {'exclude_properties': ['bgdi_modified', 'bgdi_created', 'bgdi_modified_by', 'bgdi_created_by']}

    id = Column('gid', Integer, primary_key=True)
    rank = Column('rank', Integer)
    the_geom = Column(Geometry)
    geom_point = Column('the_geom_point', Geometry)
    geom_poly = Column('the_geom_poly', Geometry)

    def json(self, translate, rawjson=False, nogeom=False):
        o = {'service': '', 
             'id': self.id, 
             'label': '',
             #'bbox': self.bbox if not nogeom else None,
             'objectorig': self.objectorig,
             'name': self.name}
        if self.origin == 'zipcode':
            o.update({'service': 'postalcodes',
                      'name': self.name,
                      'nr': self.plz,
                      'label': "%s <b>%s - %s (%s)</b>"%(translate('plz'), self.plz, self.ort_27, self.kanton)})
        elif self.origin == 'sn25':
            o.update({'service': 'swissnames',
                      'label': "<b>%s</b> (%s) - %s"%(self.name, self.kanton, self.gemname)})
        elif self.origin == 'gg25':
            o.update({'service': 'cities',
                      'name': self.gemname,
                      'bfsnr': self.bfsnr,
                      'nr': self.id,
                      'label': "<b>%s (%s)</b>"%(self.gemname, self.kanton)})
        elif self.origin == 'kantone':
            o.update({'service': 'cantons',
                      'name': self.name,
                      'bfsnr': self.bfsnr,
                      'code': self.kanton,
                      'nr': self.id,
                      'label': "%s <b>%s</b>"%(translate('ct'), self.name)})
        elif self.origin == 'district':
            o.update({'service': 'districts',
                      'name': self.name,
                      'bfsnr': self.bfsnr,
                      'label': "%s <b>%s</b>"%( translate('district'), self.name)})
        elif self.origin == 'address':
            if self.deinr is None:
                address_nr = ''
            else:
                address_nr = self.deinr
            o.update({'service': 'address',
                      'egid': self.egid,
                      'label': "%s %s <b>%s %s</b> "%(self.strname1, address_nr,self.plz, self.ort_27)})
        elif self.origin == 'parcel':
            o.update({'service': 'parcel',
                      'name': self.name,
                      'bfsnr': self.bfsnr,
                      'city': self.gemname,
                      #'Y' : loads(self.geom_point.geom_wkb.decode('hex')).x,
                      #'X' : loads(self.geom_point.geom_wkb.decode('hex')).y,
                      'label': "<b>%s %s</b> (%s)"%(self.gemname,self.name,translate('parcel'))}) 
        if rawjson:
            del o['label']
            del o['bbox']
            del o['rank']
        return o

register('search', SwissSearch)

