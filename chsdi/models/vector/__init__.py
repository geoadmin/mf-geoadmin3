# -*- coding: utf-8 -*-

from sys import maxsize
from shapely.geometry import asShape
from geoalchemy import WKBSpatialElement, functions

from papyrus.geo_interface import GeoInterface
from geojson import Feature
from chsdi.esrigeojsonencoder import loads
from shapely.geometry import asShape


def getScale(imageDisplay, mapExtent):
    inchesPerMeter = 1.0 / 0.0254
    imgPixelPerInch = imageDisplay[2]
    imgPixelWidth = imageDisplay[0]
    bounds = mapExtent.bounds

    mapMeterWidth = abs(bounds[0] - bounds[2])
    imgMeterWidth = (imgPixelWidth / imgPixelPerInch) * inchesPerMeter

    resolution = imgMeterWidth / mapMeterWidth
    scale = 1 / resolution

    return scale

def getToleranceMeters(imageDisplay, mapExtent, tolerance):
    bounds = mapExtent.bounds
    mapMeterWidth = abs(bounds[0] - bounds[2])
    imgPixelWidth = imageDisplay[0]

    toleranceMeters = (mapMeterWidth / imgPixelWidth) * tolerance
    return toleranceMeters


class Vector(GeoInterface):
    __minscale__ = 0
    __maxscale__ = maxsize
    attributes = {}

    @property
    def srid(self):
        return self.geometry_column().type.srid

    @property
    def __geo_interface__(self):
        feature = self.__read__()
        shape = None
        try:
            shape = asShape(feature.geometry)
        except:
            pass
        return Feature(
            id=self.id,
            geometry=feature.geometry,
            bbox=shape.bounds if shape else None,
            properties=feature.properties,
            # For ESRI
            layerId=self.__esriId__,
            layerBodId=self.__bodId__,
            layerName='',
            featureId=self.id,
            geometryType=feature.type
        )

    @property
    def __interface__(self):
        return {
            "layerId": self.__esriId__,
            "layerBodId": self.__bodId__,
            "layerName": '',
            "featureId": self.id,
            "attributes": self.getAttributes()
        }

    @classmethod
    def queryable_attributes(cls):
        if hasattr(cls, '__queryable_attributes__'):
            return [cls.__table__.columns[col] for col in cls.__queryable_attributes__]
        else:
            return [None]

    @classmethod
    def geometry_column(cls):
        return cls.__table__.columns['the_geom']

    @classmethod
    def primary_key_column(cls):
        return cls.__table__.primary_key

    @classmethod
    def geom_filter(cls, geometry, geometryType, imageDisplay, mapExtent, tolerance):
        myFilter = None
        tolerance_meters = getToleranceMeters(imageDisplay, mapExtent, tolerance)
        scale = getScale(imageDisplay, mapExtent)
        if scale is None or (scale >= cls.__minscale__ and scale <= cls.__maxscale__):
            geom = esriRest2Shapely(geometry, geometryType)
            wkb_geometry = WKBSpatialElement(buffer(geom.wkb), 21781)
            geom_column = cls.geometry_column()
            myFilter = functions.within_distance(geom_column, wkb_geometry, tolerance_meters)
        return myFilter

    def getAttributes(self):
        attributes = dict()
        fid_column = self.primary_key_column().name
        geom_column = self.geometry_column().name
        for column in self.__table__.columns:
            columnName = str(column.key)
            if columnName not in (fid_column, geom_column) and hasattr(self, columnName):
                attribute = getattr(self, columnName)
                if attribute.__class__.__name__ == 'Decimal':
                    attributes[columnName] = attribute.__float__()
                elif attribute.__class__.__name__ == 'datetime':
                    attributes[columnName] = attribute.strftime("%d.%m.%Y")
                else:
                    attributes[columnName] = attribute
        return attributes


def esriRest2Shapely(geometry, geometryType):

    try:
        return asShape(geometry)
    except ValueError:
        return geometry
