# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text 

from chsdi.models import bases

Base = bases['bod']

class Bod(object):
    __dbname__ = 'bod'
    id = 0 # Temporary until a fixed integer is defined for each layer
    idBod = Column('bod_layer_id', Text, primary_key=True)
    idGeoCat = Column('geocat_uuid', Text)
    name = Column('kurzbezeichnung', Text)
    fullName = Column('bezeichnung', Text)
    maps = Column('projekte', Text) # The topics
    dataOwner = Column('datenherr', Text)
    abstract = Column('abstract', Text)
    times = Column('datenstand', Text)
    downloadUrl = Column('url_download', Text)
    urlApplication = Column('url_portale', Text)
    fullTextSearch = Column('volltextsuche', Text)
    wmsContactAbbreviation = Column('wms_kontakt_abkuerzung', Text)
    wmsContactName = Column('wms_kontakt_name', Text)
    wmsUrlResource = Column('wms_resource', Text)
    staging = Column('staging', Text)
    urlDetails = Column('url', Text)
    inspireUpperAbstract = Column('inspire_oberthema_abstract', Text)
    inspireUpperName = Column('inspire_oberthema_name', Text)
    inspireAbstract = Column('inspire_abstract', Text)
    inspireName = Column('inspire_name', Text)
    bundCollectionNumber = Column('geobasisdatensatz_name', Text)
    bundCollection = Column('fk_geobasisdaten_sammlung_bundesrecht', Text)
    scaleLimit = Column('scale_limit', Text)

    def layerMetadata(self):
        return {
            'id': self.id,
            'idBod': self.idBod,
            'idGeoCat': self.idGeoCat,
            'name': self.name,
            'fullName': self.fullName,
            'defaultVisibility': True,
            'parentLayerId': None,
            'subLayerId': None,
            'attributes': {
                'maps': self.maps,
                'dataOwner': self.dataOwner,
                'abstract': self.abstract,
                'times': self.times,
                'downloadUrl': self.downloadUrl,
                'urlApplication': self.urlApplication,
                'fullTextSearch': self.fullTextSearch,
                'wmsContactAbbreviation': self.wmsContactAbbreviation,
                'wmsContactName': self.wmsContactName,
                'wmsUrlResource': self.wmsUrlResource,
                'staging': self.staging,
                'urlDetails': self.urlDetails,
                'inspireUpperAbstract': self.inspireUpperAbstract,
                'inspireUpperName': self.inspireUpperName,
                'inspireAbstract': self.inspireAbstract,
                'inspireName': self.inspireName,
                'bundCollectionNumber': self.bundCollectionNumber,
                'bundCollection': self.bundCollection,
                'scaleLimit': self.scaleLimit
            }
        }

class BodLayerDe(Base, Bod):
    __tablename__ = 'view_bod_layer_info_de'

class BodLayerFr(Base, Bod):
    __tablename__ = 'view_bod_layer_info_fr'

class BodLayerIt(Base, Bod):
    __tablename__ = 'view_bod_layer_info_it'

class BodLayerRm(Base, Bod):
    __tablename__ = 'view_bod_layer_info_rm'

class BodLayerEn(Base, Bod):
    __tablename__ = 'view_bod_layer_info_en'


class GetCapFr(Base):
    __tablename__ = 'view_bod_wmts_getcapabilities_fr'
    __table_args__ = ({'autoload': True, })
    id = Column('fk_dataset_id', Text, primary_key=True)
    arr_all_formats = Column('format', Text)

class GetCapDe(Base):
    __tablename__ = 'view_bod_wmts_getcapabilities_de'
    __table_args__ = ({'autoload': True})
    id = Column('fk_dataset_id', Text, primary_key=True)
    arr_all_formats = Column('format', Text)

class GetCapThemesFr(Base):
    __tablename__ = 'view_bod_wmts_getcapabilities_themes_fr'
    __table_args__ = ({'autoload': True})
    id = Column('inspire_id', Text, primary_key=True)

class GetCapThemesDe(Base):
    __tablename__ = 'view_bod_wmts_getcapabilities_themes_de'
    __table_args__ = ({'autoload': True})
    id = Column('inspire_id', Text, primary_key=True)

class ServiceMetadataDe(Base):
    __tablename__ = 'view_wms_service_metadata_de'
    __table_args__ = ({'autoload': True})
    id = Column('wms_id', Text, primary_key=True)

class ServiceMetadataFr(Base):
    __tablename__ = 'view_wms_service_metadata_fr'
    __table_args__ = ({'autoload': True})
    id = Column('wms_id', Text, primary_key=True)


def computeHeader(mapName):
    return {
        'serviceDescription': 'Description here',
        'mapName': mapName,
        'description': 'Description of the topic here',
        'copyrightText': 'The copyright of the different offices',
        'layers': [],
        'spatialReference': {"wkid" : 21781},
        'tileInfo': {
            'rows': 236,
            'cols': 284,
            'dpi': 96,
            'format': 'jpeg',
            'compressionQuality': '',
            'origin': {"x" : 5.140242, "y" : 45.398181, "spatialReference" : {"wkid" : 4326}},
            'spatialReference': {"wkid" : 21781},
            'lods': [
                {'level': 0, 'resolution': 650, 'scale': 2456694},
                {'level': 1, 'resolution': 500, 'scale': 1889765},
                {'level': 2, 'resolution': 250, 'scale': 944882},
                {'level': 3, 'resolution': 100, 'scale': 377953},
                {'level': 4, 'resolution': 50, 'scale': 188976},
                {'level': 5, 'resolution': 20, 'scale': 75591},
                {'level': 6, 'resolution': 10, 'scale': 37795},
                {'level': 7, 'resolution': 5, 'scale': 18898},
                {'level': 8, 'resolution': 2.5, 'scale': 94449},
                {'level': 9, 'resolution': 2, 'scale': 7559},
                {'level': 10, 'resolution': 1, 'scale': 3780},
                {'level': 11, 'resolution': 0.5, 'scale': 1890},
                {'level': 12, 'resolution': 0.25, 'scale': 945},
                {'level': 13, 'resolution': 0.1, 'scale': 378}
            ]
        },
        'initialExtent': '',
        'fullExtent': '',
        'units': 'esriMeters',
        'capabilities': 'identify,find'
    }

def get_bod_model(lang):
    if lang == 'fr':
        return BodLayerFr
    elif lang == 'it':
        return BodLayerIt
    elif lang == 'en':
        return BodLayerEn
    else:
        return BodLayerDe

def get_wmts_models(lang):
    if lang in ('fr', 'it'):
        return {
            'GetCap': GetCapFr,
            'GetCapThemes': GetCapThemesFr,
            'ServiceMetadata': ServiceMetadataFr
        }
    else:
        return {
            'GetCap': GetCapDe,
            'GetCapThemes': GetCapThemesDe,
            'ServiceMetadata': ServiceMetadataDe
        }
