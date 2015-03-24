# -*- coding: utf-8 -*-

from sys import maxsize
import re
import datetime
import decimal
from pyramid.threadlocal import get_current_registry
from shapely.geometry import asShape
from shapely.geometry import box
from sqlalchemy.sql import func
from sqlalchemy.orm.util import class_mapper
from sqlalchemy.orm.properties import ColumnProperty
from geoalchemy2.types import Geometry
from geoalchemy2.elements import WKBElement
from geoalchemy2.shape import to_shape

import geojson
from papyrus.geo_interface import GeoInterface


def getResolution(imageDisplay, mapExtent):
    bounds = mapExtent.bounds
    mapMeterWidth = abs(bounds[0] - bounds[2])
    mapMeterHeight = abs(bounds[1] - bounds[3])
    xRes = mapMeterWidth / imageDisplay[0]
    yRes = mapMeterHeight / imageDisplay[1]
    return max(xRes, yRes)


def getScale(imageDisplay, mapExtent):
    resolution = getResolution(imageDisplay, mapExtent)
    return resolution * 39.37 * imageDisplay[2]


def getToleranceMeters(imageDisplay, mapExtent, tolerance):
    bounds = mapExtent.bounds
    mapMeterWidth = abs(bounds[0] - bounds[2])
    mapMeterHeight = abs(bounds[1] - bounds[3])
    imgPixelWidth = imageDisplay[0]
    imgPixelHeight = imageDisplay[1]

    # Test for null values
    if all((tolerance, imgPixelWidth, mapMeterWidth, imgPixelHeight, mapMeterHeight)):
        toleranceMeters = max(mapMeterWidth / imgPixelWidth, mapMeterHeight / imgPixelHeight) * tolerance
        return toleranceMeters
    return 0.0


class Vector(GeoInterface):
    __minscale__ = 0
    __maxscale__ = maxsize
    __minresolution__ = 0
    __maxresolution__ = maxsize
    attributes = {}

    # Overrides GeoInterface
    def __read__(self):
        id = None
        geom = None
        properties = {}

        for p in class_mapper(self.__class__).iterate_properties:
            if isinstance(p, ColumnProperty):
                if len(p.columns) != 1:  # pragma: no cover
                    raise NotImplementedError
                col = p.columns[0]
                val = getattr(self, p.key)
                if col.primary_key:
                    id = val
                elif isinstance(col.type, Geometry) and col.name == self.geometry_column_to_return().name:
                    if hasattr(self, '_shape'):
                        geom = self._shape
                    elif val is not None:
                        geom = to_shape(val)
                elif not col.foreign_keys and not isinstance(col.type, Geometry):
                    properties[p.key] = val

        if self.__add_properties__:
            for k in self.__add_properties__:
                properties[k] = getattr(self, k)

        properties = self.insertLabel(properties)
        return geojson.Feature(id=id, geometry=geom, properties=properties)

    @property
    def srid(self):
        return self.geometry_column().type.srid

    # Overrides GeoInterface
    @property
    def __geo_interface__(self):
        feature = self.__read__()
        extents = []
        try:
            shape = asShape(feature.geometry)
            extents.append(shape.bounds)
        except:
            pass
        try:
            for geom in feature.geometry.geometries:
                extents.append(asShape(geom).bounds)
        except:
            pass
        return geojson.Feature(
            id=self.id,
            geometry=feature.geometry,
            bbox=max(extents, key=extentArea) if extents else None,
            properties=feature.properties,
            # For ESRI
            layerBodId=self.__bodId__,
            layerName='',
            featureId=self.id,
            geometryType=feature.type
        )

    @property
    def __interface__(self):
        return {
            "layerBodId": self.__bodId__,
            "layerName": '',
            "featureId": self.id,
            "attributes": self.getAttributes()
        }

    @classmethod
    def geometry_column(cls):
        return cls.__mapper__.columns['the_geom']

    def geometry_column_to_return(cls):
        geomColumnName = cls.__returnedGeometry__ if hasattr(cls, '__returnedGeometry__') else 'the_geom'
        return cls.__mapper__.columns[geomColumnName]

    @classmethod
    def primary_key_column(cls):
        return cls.__mapper__.primary_key[0]

    @classmethod
    def time_instant_column(cls):
        return getattr(cls, cls.__timeInstant__)

    @classmethod
    def label_column(cls):
        return cls.__mapper__.columns[cls.__label__] if hasattr(cls, '__label__') else cls.__mapper__.primary_key[0]

    @classmethod
    def geom_filter(cls, geometry, geometryType, imageDisplay, mapExtent, tolerance):
        toleranceMeters = getToleranceMeters(imageDisplay, mapExtent, tolerance)
        scale = None
        resolution = None
        minScale = cls.__minscale__ if hasattr(cls, '__minscale__') else None
        maxScale = cls.__maxscale__ if hasattr(cls, '__maxscale__') else None
        minResolution = cls.__minresolution__ if hasattr(cls, '__minresolution__') else None
        maxResolution = cls.__maxresolution__ if hasattr(cls, '__maxresolution__') else None
        if None not in (minScale, maxScale) and all(val != 0.0 for val in imageDisplay) and mapExtent.area != 0.0:
            scale = getScale(imageDisplay, mapExtent)
        if None not in (minResolution, maxResolution) and all(val != 0.0 for val in imageDisplay) and mapExtent.area != 0.0:
            resolution = getResolution(imageDisplay, mapExtent)
        if (scale is None or (scale > cls.__minscale__ and scale <= cls.__maxscale__)) and \
           (resolution is None or (resolution > cls.__minresolution__ and resolution <= cls.__maxresolution__)):
            geom = esriRest2Shapely(geometry, geometryType)
            wkbGeometry = WKBElement(buffer(geom.wkb), 21781)
            geomColumn = cls.geometry_column()
            geomFilter = func.ST_DWITHIN(geomColumn, wkbGeometry, toleranceMeters)
            return geomFilter
        return None

    @classmethod
    def get_column_by_property_name(cls, columnPropName):
        if columnPropName in cls.__mapper__.columns:
            return cls.__mapper__.columns.get(columnPropName)
        return None

    # Based on a naming convention
    @classmethod
    def get_queryable_attributes_keys(cls, lang):
        queryableAttributes = []
        if hasattr(cls, '__queryable_attributes__'):
            settings = get_current_registry().settings
            availableLangs = settings['available_languages'].replace(' ', '|')
            for attr in cls.__queryable_attributes__:
                match = re.search(r'(_(%s))$' % availableLangs, attr)
                if match is not None:
                    # Lang specific attr
                    suffix = '_%s' % lang
                    suffixAttr = match.groups()[0]
                    fallbackMatch = getFallbackLangMatch(
                        cls.__queryable_attributes__,
                        suffix,
                        attr,
                        suffixAttr
                    )
                    if fallbackMatch not in queryableAttributes:
                        queryableAttributes.append(fallbackMatch)
                else:
                    # Not based on lang
                    queryableAttributes.append(attr)
        return queryableAttributes

    def getOrmColumnsNames(self, excludePkey=True):
        primaryKeyColumn = self.__mapper__.get_property_by_column(self.primary_key_column()).key
        geomColumnKey = self.__mapper__.get_property_by_column(self.geometry_column()).key
        geomColumnToReturnKey = self.__mapper__.get_property_by_column(self.geometry_column_to_return()).key
        if excludePkey:
            keysToExclude = (primaryKeyColumn, geomColumnKey, geomColumnToReturnKey)
        else:
            keysToExclude = (geomColumnKey, geomColumnToReturnKey)

        for column in self.__mapper__.columns:
            ormColumnName = self.__mapper__.get_property_by_column(column).key
            if ormColumnName not in keysToExclude:
                yield ormColumnName

    def getAttributesKeys(self):
        attributes = [columnName for columnName in self.getOrmColumnsNames(excludePkey=False)]
        return attributes

    def getAttributes(self, excludePkey=True):
        attributes = {}
        for ormColumnName in self.getOrmColumnsNames(excludePkey=excludePkey):
            attribute = getattr(self, ormColumnName)
            attributes[ormColumnName] = formatAttribute(attribute)
        return self.insertLabel(attributes)

    def insertLabel(self, attributes):
        labelMappedColumnName = self.__mapper__.get_property_by_column(self.label_column()).key
        attributes['label'] = formatAttribute(getattr(self, labelMappedColumnName))
        return attributes


def formatAttribute(attribute):
    if isinstance(attribute, decimal.Decimal):
        return attribute.__float__()
    elif isinstance(attribute, datetime.datetime):
        return attribute.strftime("%d.%m.%Y")
    else:
        return attribute


def esriRest2Shapely(geometry, geometryType):
    try:
        return asShape(geometry)
    except ValueError:
        return geometry


def extentArea(i):
    geom = box(i[0], i[1], i[2], i[3])
    return geom.area


def getFallbackLangMatch(queryableAttrs, suffix, attr, suffixAttr):
    # de and fr at least are defined
    def replaceLast(sourceString, replaceWhat, replaceWith):
        head, sep, tail = sourceString.rpartition(replaceWhat)
        return head + replaceWith + tail

    attrToMatch = replaceLast(attr, suffixAttr, suffix)
    if attrToMatch in queryableAttrs:
        return attrToMatch
    else:
        if suffix in ('_rm', '_en'):
            suffix = '_de'
            attrToMatch = replaceLast(attr, suffixAttr, suffix)
            if attrToMatch in queryableAttrs:
                return attrToMatch
        elif suffix == '_it':
            suffix = '_fr'
            attrToMatch = replaceLast(attr, suffixAttr, suffix)
            if attrToMatch in queryableAttrs:
                return attrToMatch
