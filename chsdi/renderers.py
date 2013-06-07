# -*- coding: utf-8 -*-

from papyrus.renderers import GeoJSON

from chsdi.esrigeojsonencoder import dumps as esri_dumps


class EsriJSON(GeoJSON):
    def __init__(self, jsonp_param_name='callback'):
        GeoJSON.__init__(self)
        self.jsonp_param_name = jsonp_param_name
        
        
    def __call__(self, info):
        def _render(value, system):
            if isinstance(value, (list, tuple)):
                value = self.collection_type(value)
            ret = esri_dumps(value)
            request = system.get('request')
            if request is not None:
                response = request.response
                ct = response.content_type
                if ct == response.default_content_type:
                    callback = request.params.get(self.jsonp_param_name)
                    if callback is None:
                        response.content_type = 'application/json'
                    else:
                        response.content_type = 'text/javascript'
                        ret = '%(callback)s(%(json)s);' % {'callback': callback,
                                                           'json': ret}
            return ret
        return _render

class CSVRenderer(object):
    def __init__(self, info):
        pass

    def __call__(self, value, system):
        import csv
        import StringIO
        fout = StringIO.StringIO()
        writer = csv.writer(fout, delimiter=';', quoting=csv.QUOTE_ALL)
        
        writer.writerow(value['headers'])
        writer.writerows(value['rows'])

        resp = system['request'].response
        resp.content_type = 'text/csv'
        resp.content_disposition = 'attachment;filename="profile.csv"'
        return fout.getvalue()
