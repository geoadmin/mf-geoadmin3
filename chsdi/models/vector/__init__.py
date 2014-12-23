# -*- coding: utf-8 -*-

from sys import maxsize
import datetime
import decimal
from shapely import wkb
from shapely.geometry import asShape
from shapely.geometry import box
from sqlalchemy.orm.util import class_mapper
from sqlalchemy.orm.properties import ColumnProperty
from geoalchemy import Geometry, WKBSpatialElement, functions

import geojson
from papyrus.geo_interface import GeoInterface
from chsdi.esrigeojsonencoder import loads
from shapely.geometry import asShape


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
                    else:
                        geom = wkb.loads(str(val.geom_wkb))
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
        if minScale is not None and maxScale is not None and toleranceMeters != 0.0:
            scale = getScale(imageDisplay, mapExtent)
        if minResolution is not None and maxResolution is not None and toleranceMeters != 0.0:
            resolution = getResolution(imageDisplay, mapExtent)
        if (scale is None or (scale > cls.__minscale__ and scale <= cls.__maxscale__)) and \
           (resolution is None or (resolution > cls.__minresolution__ and resolution <= cls.__maxresolution__)):
            geom = esriRest2Shapely(geometry, geometryType)
            wkbGeometry = WKBSpatialElement(buffer(geom.wkb), 21781)
            geomColumn = cls.geometry_column()
            geomFilter = functions.within_distance(geomColumn, wkbGeometry, toleranceMeters)
            return geomFilter
        return None

    @classmethod
    def get_column_by_name(cls, columnName):
        if columnName in cls.__mapper__.columns:
            return cls.__mapper__.columns.get(columnName)
        return None

    def _get_attributes_columns(self):
        primaryKeyColumn = self.primary_key_column()
        geomColumn = self.geometry_column()
        geomColumnToReturn = self.geometry_column_to_return()
        for column in self.__mapper__.columns:
            if column.key not in (primaryKeyColumn.key, geomColumn.key, geomColumnToReturn.key):
                yield column

    def getAttributesKeys(self):
        attributes = [column.key for column in self._get_attributes_columns()]
        return attributes

    def getAttributes(self):
        attributes = {}
        for column in self._get_attributes_columns():
            ormColumnName = self.__mapper__.get_property_by_column(column).key
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
