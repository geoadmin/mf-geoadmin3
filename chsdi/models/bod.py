# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text, Integer, Boolean
from sqlalchemy.dialects import postgresql

from chsdi.models import bases

Base = bases['bod']


class Bod(object):
    __dbname__ = 'bod'
    idBod = Column('bod_layer_id', Text, primary_key=True)
    id = Column('bgdi_id', Text)
    idGeoCat = Column('geocat_uuid', Text)
    name = Column('kurzbezeichnung', Text)
    fullName = Column('bezeichnung', Text)
    maps = Column('projekte', Text)  # The topics
    dataOwner = Column('datenherr', Text)
    abstract = Column('abstract', Text)
    dataStatus = Column('datenstand', Text)
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
            'attributes': {
                'maps': self.maps,
                'dataOwner': self.dataOwner,
                'abstract': self.abstract,
                'dataStatus': self.dataStatus,
                'downloadUrl': self.downloadUrl,
                'urlApplication': self.urlApplication,
                'wmsContactAbbreviation': self.wmsContactAbbreviation,
                'wmsContactName': self.wmsContactName,
                'wmsUrlResource': self.wmsUrlResource,
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


class LayersConfig(Base):
    __tablename__ = 'view_layers_js'
    __table_args__ = ({'schema': 're3', 'autoload': False})

    idBod = Column('layer_id', Text, primary_key=True)
    attribution = Column('attribution', Text)
    background = Column('backgroundlayer', Boolean)
    haslegend = Column('haslegend', Boolean)
    format = Column('image_format', Text)
    type = Column('layertype', Text)
    opacity = Column('opacity', postgresql.DOUBLE_PRECISION)
    minResolution = Column('minresolution', postgresql.DOUBLE_PRECISION)
    maxResolution = Column('maxresolution', postgresql.DOUBLE_PRECISION)
    parentLayerId = Column('parentlayerid', Text)
    queryable = Column('queryable', Boolean)
    searchable = Column('searchable', Boolean)
    singleTile = Column('singletile', Boolean)
    subLayerIds = Column('sublayerids', Text)
    matrixSet = Column('tilematrixsetid', Text)
    timeEnabled = Column('timeenabled', Boolean)
    timestamps = Column('timestamps', postgresql.ARRAY(Text))
    maps = Column('projects', Text)
    staging = Column('staging', Text)
    wmsLayers = Column('wms_layers', Text)
    wmsUrl = Column('wms_url', Text)

    def getLayerConfig(self, translate):
        config = {}
        for k in self.__dict__.keys():
            if not k.startswith("_") and \
               self.__dict__[k] is not None and \
               k != 'maps':
                if k == 'idBod':
                    config['label'] = translate(self.__dict__[k])
                elif k == 'attribution':
                    config[k] = translate(self.__dict__[k])
                elif k == 'matrixSet':
                    if self.__dict__[k] != '21781_26':
                        config['resolutions'] = self._getResolutionsFromMatrixSet(
                            self.__dict__[k]
                        )
                else:
                    config[k] = self.__dict__[k]
        return {self.idBod: config}

    def _getResolutionsFromMatrixSet(self, matrixSet):
        resolutions = [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250,
                       1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1]
        matrixSet = int(matrixSet.split('_')[1])
        return resolutions[0:matrixSet + 1]


class BodLayerDe(Base, Bod):
    __tablename__ = 'view_bod_layer_info_de'
    __table_args__ = ({'schema': 're3'})


class BodLayerFr(Base, Bod):
    __tablename__ = 'view_bod_layer_info_fr'
    __table_args__ = ({'schema': 're3'})


class BodLayerIt(Base, Bod):
    __tablename__ = 'view_bod_layer_info_it'
    __table_args__ = ({'schema': 're3'})


class BodLayerRm(Base, Bod):
    __tablename__ = 'view_bod_layer_info_rm'
    __table_args__ = ({'schema': 're3'})


class BodLayerEn(Base, Bod):
    __tablename__ = 'view_bod_layer_info_en'
    __table_args__ = ({'schema': 're3'})


class GetCapFr(Base):
    __tablename__ = 'view_bod_wmts_getcapabilities_fr'
    __table_args__ = ({'schema': 're3', 'autoload': True})
    id = Column('fk_dataset_id', Text, primary_key=True)
    arr_all_formats = Column('format', Text)


class GetCapDe(Base):
    __tablename__ = 'view_bod_wmts_getcapabilities_de'
    __table_args__ = ({'schema': 're3', 'autoload': True})
    id = Column('fk_dataset_id', Text, primary_key=True)
    arr_all_formats = Column('format', Text)


class GetCapThemesFr(Base):
    __tablename__ = 'view_bod_wmts_getcapabilities_themes_fr'
    __table_args__ = ({'schema': 're3', 'autoload': True})
    id = Column('inspire_id', Text, primary_key=True)


class GetCapThemesDe(Base):
    __tablename__ = 'view_bod_wmts_getcapabilities_themes_de'
    __table_args__ = ({'schema': 're3', 'autoload': True})
    id = Column('inspire_id', Text, primary_key=True)


class ServiceMetadataDe(Base):
    __tablename__ = 'view_wms_service_metadata_de'
    __table_args__ = ({'schema': 're3', 'autoload': True})
    id = Column('wms_id', Text, primary_key=True)


class ServiceMetadataFr(Base):
    __tablename__ = 'view_wms_service_metadata_fr'
    __table_args__ = ({'schema': 're3', 'autoload': True})
    id = Column('wms_id', Text, primary_key=True)

# TODO use GetCap model to fill that up instead


def computeHeader(mapName):
    return {
        'mapName': mapName,
        'description': 'Configuration for the map (topic) ' + mapName,
        'copyrightText': 'Data ' + mapName,
        'layers': [],
        'spatialReference': {"wkid": 21781},
        'tileInfo': {
            'rows': 256,  # tile width in pixel
            'cols': 256,
            'dpi': 96,
            'format': 'PNG,JPEG',
            'compressionQuality': '',
            'origin': {"x": 420000, "y": 350000, "spatialReference": {"wkid": 21781}},
            'spatialReference': {"wkid": 21781},
            'lods': [
                {'level': 0, 'resolution': 4000, 'scale': 14285750.5715, 'width': 1, 'height': 1},
                {'level': 1, 'resolution': 3750, 'scale': 13392891.1608, 'width': 1, 'height': 1},
                {'level': 2, 'resolution': 3500, 'scale': 12500031.7501, 'width': 1, 'height': 1},
                {'level': 3, 'resolution': 3250, 'scale': 11607172.3393, 'width': 1, 'height': 1},
                {'level': 4, 'resolution': 3000, 'scale': 10714312.9286, 'width': 1, 'height': 1},
                {'level': 5, 'resolution': 2750, 'scale': 9821453.51791, 'width': 1, 'height': 1},
                {'level': 6, 'resolution': 2500, 'scale': 8928594.10719, 'width': 1, 'height': 1},
                {'level': 7, 'resolution': 2250, 'scale': 8035734.69647, 'width': 1, 'height': 1},
                {'level': 8, 'resolution': 2000, 'scale': 7142875.28575, 'width': 1, 'height': 1},
                {'level': 9, 'resolution': 1750, 'scale': 6250015.87503, 'width': 2, 'height': 1},
                {'level': 10, 'resolution': 1500, 'scale': 5357156.46431, 'width': 2, 'height': 1},
                {'level': 11, 'resolution': 1250, 'scale': 4464297.05359, 'width': 2, 'height': 1},
                {'level': 12, 'resolution': 1000, 'scale': 3571437.64288, 'width': 2, 'height': 2},
                {'level': 13, 'resolution': 750, 'scale': 2678578.23216, 'width': 3, 'height': 2},
                {'level': 14, 'resolution': 650, 'scale': 2321434.46787, 'width': 3, 'height': 2},
                {'level': 15, 'resolution': 500, 'scale': 1785718.82144, 'width': 4, 'height': 3},
                {'level': 16, 'resolution': 250, 'scale': 892859.410719, 'width': 8, 'height': 5},
                {'level': 17, 'resolution': 100, 'scale': 357143.764288, 'width': 19, 'height': 13},
                {'level': 18, 'resolution': 50, 'scale': 178571.882144, 'width': 38, 'height': 25},
                {'level': 19, 'resolution': 20, 'scale': 71428.7528575, 'width': 94, 'height': 63},
                {'level': 20, 'resolution': 10, 'scale': 35714.3764288, 'width': 188, 'height': 125},
                {'level': 21, 'resolution': 5, 'scale': 17857.1882144, 'width': 375, 'height': 250},
                {'level': 22, 'resolution': 2.5, 'scale': 8928.59410719, 'width': 750, 'height': 500},
                {'level': 23, 'resolution': 2, 'scale': 7142.87528575, 'width': 938, 'height': 625},
                {'level': 24, 'resolution': 1.5, 'scale': 5357.15646431, 'width': 1250, 'height': 834},
                {'level': 25, 'resolution': 1, 'scale': 3571.43764288, 'width': 1875, 'height': 1250},
                {'level': 26, 'resolution': 0.5, 'scale': 1785.71882144, 'width': 3750, 'height': 2500},
                {'level': 27, 'resolution': 0.25, 'scale': 892.857, 'width': 7500, 'height': 5000}
            ]
        },
        'initialExtent': {
            'xmin': 458000, 'ymin': 76375, 'xmax': 862500, 'ymax': 289125,
            'spatialReference': {'wkid': 21781}
        },
        'fullExtent': {
            'xmin': 42000, 'ymin': 30000, 'xmax': 900000, 'ymax': 350000,
            'spatialReference': {'wkid': 21781}
        },
        'units': 'esriMeters',
        'capabilities': 'Map'
    }


class Topics(Base):
    __tablename__ = 'topics'
    __table_args__ = ({'schema': 're3', 'autoload': False})
    id = Column('topic', Text, primary_key=True)
    orderKey = Column('order_key', Integer)
    availableLangs = Column('lang', Text)
    defaultBackgroundLayer = Column('default_background', Text)
    selectedLayers = Column('selected_layers', postgresql.ARRAY(Text))


class Catalog(object):
    __dbname__ = 'bod'
    id = Column('bgdi_id', Integer, primary_key=True)
    parentId = Column('parent_id', Integer)
    topic = Column('topic', Text)
    category = Column('category', Text)
    idBod = Column('bod_layer_id', Text)
    nameDe = Column('name_de', Text)
    nameFr = Column('name_fr', Text)
    nameIt = Column('name_it', Text)
    nameRm = Column('name_rm', Text)
    nameEn = Column('name_en', Text)
    orderKey = Column('order_key', Integer)
    selectedOpen = Column('selected_open', Boolean)
    path = Column('path', Text)
    depth = Column('depth', Integer)

    def to_dict(self, lang):

        self.label = self._get_label_from_lang(lang)

        return dict([
            (k, getattr(self, k)) for
            k in self.__dict__.keys()
            if not k.startswith("_") and
            self.__dict__[k] is not None and
            k not in ('nameDe', 'nameFr', 'nameIt', 'nameRm', 'nameEn')
        ])

    def _get_label_from_lang(self, lang):
        return {
            'de': self.nameDe,
            'fr': self.nameFr,
            'it': self.nameIt,
            'rm': self.nameRm,
            'en': self.nameEn
        }[lang]


class CatalogDe(Base, Catalog):
    __tablename__ = 'view_catalog_de'
    __table_args__ = ({'schema': 're3'})


class CatalogFr(Base, Catalog):
    __tablename__ = 'view_catalog_fr'
    __table_args__ = ({'schema': 're3'})


class CatalogIt(Base, Catalog):
    __tablename__ = 'view_catalog_it'
    __table_args__ = ({'schema': 're3'})


class CatalogRm(Base, Catalog):
    __tablename__ = 'view_catalog_rm'
    __table_args__ = ({'schema': 're3'})


class CatalogEn(Base, Catalog):
    __tablename__ = 'view_catalog_en'
    __table_args__ = ({'schema': 're3'})


class CatalogInspireDe(Base, Catalog):
    __tablename__ = 'view_catalog_inspire_de'
    __table_args__ = ({'schema': 're3'})


class CatalogInspireFr(Base, Catalog):
    __tablename__ = 'view_catalog_inspire_fr'
    __table_args__ = ({'schema': 're3'})


class CatalogInspireIt(Base, Catalog):
    __tablename__ = 'view_catalog_inspire_it'
    __table_args__ = ({'schema': 're3'})


class CatalogInpireRm(Base, Catalog):
    __tablename__ = 'view_catalog_inspire_rm'
    __table_args__ = ({'schema': 're3'})


class CatalogInspireEn(Base, Catalog):
    __tablename__ = 'view_catalog_inspire_en'
    __table_args__ = ({'schema': 're3'})


class CatalogEchDe(Base, Catalog):
    __tablename__ = 'view_catalog_ech_de'
    __table_args__ = ({'schema': 're3'})


class CatalogEchFr(Base, Catalog):
    __tablename__ = 'view_catalog_ech_fr'
    __table_args__ = ({'schema': 're3'})


class CatalogEchIt(Base, Catalog):
    __tablename__ = 'view_catalog_ech_it'
    __table_args__ = ({'schema': 're3'})


class CatalogEchRm(Base, Catalog):
    __tablename__ = 'view_catalog_ech_rm'
    __table_args__ = ({'schema': 're3'})


class CatalogEchEn(Base, Catalog):
    __tablename__ = 'view_catalog_ech_en'
    __table_args__ = ({'schema': 're3'})


def get_bod_model(lang):
    if lang == 'fr':
        return BodLayerFr
    elif lang == 'it':
        return BodLayerIt
    elif lang == 'rm':
        return BodLayerRm
    elif lang == 'en':
        return BodLayerEn
    else:
        return BodLayerDe


def get_catalog_model(lang, topic):
    if lang == 'fr':
        if topic == 'inspire':
            return CatalogInspireFr
        elif topic == 'ech':
            return CatalogEchFr
        return CatalogFr
    elif lang == 'it':
        if topic == 'inspire':
            return CatalogInspireIt
        elif topic == 'ech':
            return CatalogEchIt
        return CatalogIt
    elif lang == 'rm':
        if topic == 'inspire':
            return CatalogInspireRm
        elif topic == 'ech':
            return CatalogEchRm
        return CatalogRm
    elif lang == 'en':
        if topic == 'inspire':
            return CatalogInspireEn
        elif topic == 'ech':
            return CatalogEchEn
        return CatalogEn
    else:
        if topic == 'inspire':
            return CatalogInspireDe
        elif topic == 'ech':
            return CatalogEchDe
        return CatalogDe


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
