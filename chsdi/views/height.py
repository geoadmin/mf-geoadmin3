# -*- coding: utf-8 -*-

from chsdi.lib.validation.height import HeightValidation
from chsdi.lib.raster.georaster import GeoRaster

from pyramid.view import view_config

# cache of GeoRaster instances in function of the layer name
_rasters = {}


class Height(HeightValidation):

    def __init__(self, request):
        super(Height, self).__init__()
        if 'easting' in request.params:
            self.lon = request.params.get('easting')
        else:
            self.lon = request.params.get('lon')
        if 'northing' in request.params:
            self.lat = request.params.get('northing')
        else:
            self.lat = request.params.get('lat')
        if 'layers' in request.params:
            self.layers = request.params.get('layers')
        elif 'elevation_model' in request.params:
            self.layers = request.params.get('elevation_model')
        else:
            self.layers = ['DTM25']
        self.request = request

    @view_config(route_name='height', renderer='jsonp', http_cache=0)
    def height(self):
        rasters = [self._get_raster(layer) for layer in self.layers]
        alt = self._filter_alt(rasters[0].getVal(self.lon, self.lat))

        return {'height': str(alt)}

    def _get_raster(self, layer):
        result = _rasters.get(layer, None)
        if not result:
            result = GeoRaster(self._get_raster_files()[layer])
            _rasters[layer] = result
        return result

    def _get_raster_files(self):
        """Returns the raster filename in function of its layer name"""
        base_path = 'bund/swisstopo/'
        return {
            'DTM25': self.request.registry.settings[
                'data_path'] + base_path + 'dhm25_25_matrix/mm0001.shp',
            'DTM2': self.request.registry.settings[
                'data_path'] + base_path + 'swissalti3d/2m/index.shp',
            'COMB': self.request.registry.settings[
                'data_path'] + base_path +
            'swissalti3d/kombo_2m_dhm25/index.shp'
        }

    def _filter_alt(self, alt):
        if alt is not None and alt > 0.0:
            # 10cm accuracy is enough for altitudes
            return round(alt * 10.0) / 10.0
        else:
            return None
