# -*- coding: utf-8 -*-

from sys import maxint
from shapely.geometry import asShape
from geoalchemy import WKBSpatialElement, functions

from papyrus.geo_interface import GeoInterface
from geojson import Feature
from chsdi.esrigeojsonencoder import loads
from shapely.geometry import asShape

def getScale(imageDisplay, mapExtent):
    inches_per_meter = 1.0/0.0254
    dots_per_inch = imageDisplay[2]
    pixel_width = imageDisplay[0]
    bounds = mapExtent.bounds
    meter_width = abs(bounds[0] - bounds[2])
    inches_per_pixel = (meter_width*inches_per_meter)/pixel_width
    resolution = meter_width/(pixel_width*dots_per_inch*inches_per_pixel)
    scale = resolution*inches_per_meter*dots_per_inch
    return scale
    

class Vector(GeoInterface):
    __minscale__ = 0
    __maxscale__ = maxint
    attributes = {}

    @property
    def srid(self):
        return self.geometry_column().type.srid

    @property
    def __geo_interface__(self):
        feature = self.__read__()
        display_column = self.display_field().name
        layername = ''
        shape = None
        try: 
           shape = asShape(feature.geometry)
        except:
            pass
        return Feature(
            id = self.id, 
            geometry = feature.geometry,
            bbox = shape.bounds if shape else None,
            properties = feature.properties,
            # For ESRI
            layerId = self.__esriId__,
            layerBodId = self.__bodId__,
            layerName =  layername,
            featureId = self.id,
            value = getattr(self, display_column) if display_column != '' else '',
            displayFieldName = display_column,
            geometryType = feature.type
            )

    @property
    def __interface__(self):
        display_column = self.display_field().name
        return {
            "layerId" : self.__esriId__, 
            "layerBodId": self.__bodId__,
            "layerName" : "",
            "featureId": self.id,
            "value": getattr(self, display_column) if display_column != '' else '',
            "displayFieldName" : display_column,
            "attributes": self.getAttributes(display_column)
            }

    @classmethod
    def display_field(cls):
        return cls.__table__.columns[cls.__displayFieldName__] if cls.__displayFieldName__ is not None else ''

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
        tolerance = tolerance*0.0254
        scale = getScale(imageDisplay, mapExtent)
        if scale is None or (scale >= cls.__minscale__ and scale <= cls.__maxscale__): 
            geom = esriRest2Shapely(geometry, geometryType)
            wkb_geometry = WKBSpatialElement(buffer(geom.wkb), 21781)
            geom_column = cls.geometry_column()
            myFilter = functions.within_distance(geom_column, wkb_geometry, tolerance)
        return myFilter

    def getAttributes(self, display_column):
        attributes = dict()
        fid_column = self.primary_key_column().name
        geom_column = self.geometry_column().name
        for column in self.__table__.columns:
            columnName = str(column.key)
            if columnName not in (fid_column, geom_column, display_column) and hasattr(self, columnName):
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
        return  asShape(geometry)
    except ValueError:
        return geometry

