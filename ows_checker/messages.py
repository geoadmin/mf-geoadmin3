import re

PY_REGEX = r'%\(([a-z]+)\)s'

t = 'green'
f = 'red'
w = 'white'
y = 'yellow'
NC = 'Not checked'

messages = {
    'ALLG-01': {
        t: 'The service fulfills case sensitivity for parameters values',
        f: 'The service does not fulfill case sensitivity for parameters values'
    },
    'ALLG-02': {
        t: 'Requests to your service do not depend on vendor specific parameters',
        f: 'Requests to your service should not depend on vendor specific parameters'
    },
    'ALLG-03': {
        t: 'The service responded to requests, at least by means of an error message',
        f: 'The service did not respond to requests, and did not even send and error message'
    },
    'ALLG-04': {
        t: 'The service uses UTF-08 as character set encoding for XML content',
        f: 'The service does not use UTF-08 as character set encoding for XML content (or encoding not found)'
    },
    'ALLG-05': {
        t: 'OGC %(service)s %(version)s does support OWS Common',
        f: 'OGC %(service)s %(version)s does not support OWS Common'
    },
    'ALLG-06': {
        t: 'The service use ISO 8601:2004 for date and time encoding',
        f: 'The service does not use ISO 8601:2004 for date and time encoding (or date not found)'
    },
    'LANG-01': {
        t: 'The following language code(s) %(code)s has/have been found',
        f: 'No language code found'
    },
    'LANG-02': {},
    'LANG-03': {
        t: "The following language code '%(code)s' has been found in service URL",
        f: 'No language code found in service URL'
    },
    'LANG-04': {
        t: 'The service supports language listing via HTTP 300 status code',
        f: 'The service does not support language listing via HTTP 300 status code'
    },
    'META-01': {},
    'META-02': {},
    'CAPA-01': {
        t: 'The service responded with the right MIME type %(mime_type)s to the GetCapabilities request',
        f: 'The service responded with a wrong MIME type to the GetCapabilities request'
    },
    'CAPA-02': {
        t: 'All information available for the service description',
        f: 'Information on %(descr)s not found'
    },
    'EXCE-01': {
        t: 'The service responded with the right MIME type %(mime_type)s for the Exception Error Report',
        f: 'The service responded with a wrong MIME type for the Exception Error Report'
    },
    'EXCE-02': {
        t: 'The service uses UTF-08 as character set encoding for XML error messages',
        f: 'The service does not use UTF-08 as character set encoding for XML error messages (or encoding not found)'
    },
    'SECU-01': {
        t: 'SECU-01 supported',
        f: 'SECU-01 not supported',
        #w: 'The service does not use HTTPS'
    },
    'SECU-02': {
        t: 'SECU-02 supported',
        f: 'SECU-02 not supported',
        #w: 'The service does not use HTTP Basic Authentication via HTTPS'
    },
    'SECU-03': {
        t: 'SECU-03 supported',
        f: 'SECU-03 not supported'
    },
    'VERS-01': {
        t: 'The following version(s) %(versions)s is/are supported',
        f: 'The following version(s) %(versions)s is/are supported'
    },
    'CRS-01': {
        t: 'The service supports the mandatory reference system CH1903 (EPSG:21781)',
        f: 'The service does not support the mandatory reference system CH1903 (EPSG:21781)'
    },
    'CRS-02': {
        t: 'The service supports the mandatory reference system WGS84-EPSG:4326',
        f: 'The service does not support the mandatory reference system WGS84-EPSG:4326',
        y: 'The service does not support the recommended reference system WGS84-EPSG:4326'
    },
    'CRS-03': {
        t: 'The service does not support the deprecated reference system EPSG:9814',
        f: 'The service supports the deprecated reference system EPSG:9814'
    },
    'CRS-04': {
        t: 'The service supports the reference system NF02 (EPSG:5728)',
        f: 'The service cannot support 3D data, because the reference system NF02 (EPSG:5728) is not supported'
    },
    'CRS-05': {
        t: 'The service supports the recommended reference system CH1903+ (EPSG:2056)',
        f: 'The service does not support the recommended reference system CH1903+ (EPSG:2056)'
    },
    'CRS-06': {
        t: 'The service supports the recommended reference system ETRS89 (EPSG:4258)',
        f: 'The service does not support the recommended reference system ETRS89 (EPSG:4258)'
    },
    'CRS-07': {
        t: 'The service supports the recommended reference system RAN95 (EPSG:5729)',
        f: 'The service does not support the recommended reference system RAN95 (EPSG:5729)'
    },
    'CRS-08': {
        t: 'The service supports the reference system EVRS (EPSG:5730)',
        f: 'The service does not support 3D data, because the reference system EVRS (EPSG:5730) is not supported'
    },
    'CRS-09': {
        t: 'The service supports the recommended reference system EPSG:21782',
        f: 'The service does not support the recommended reference system EPSG:21782'
    },
    'WMS-01': {
        t: 'The services supports the mandatory WMS version 1.1.1',
        f: 'The services does not support the mandatory WMS version 1.1.1'
    },
    'WMS-02': {
        t: 'The services supports the mandatory image formats PNG and JPEG',
        f: 'The services does not support the mandatory image formats PNG and JPEG'
    },
    'WMS-03': {
        t: '',
        f: ''
    },
    'WMS-04': {
        t: 'All information available for the service description',
        f: 'Information on %(descr)s not found'
    },
    'WMS-05': {
        t: 'The services supports the recommended WMS version 1.3.0',
        f: 'The services does not support the recommended WMS version 1.3.0'
    },
    'WMS-06': {
        t: 'The service provides a Legend URL for all styles',
        f: 'The service does not provide a Legend URL for some/all styles'
    },
    'WMS-07': {
        t: 'The service (version 1.3.0) provides a GM03 Metadata URL for all layers',
        f: 'The service (version 1.3.0) does not provide a GM03 Metadata URL for some/all layers'
    },
    'WMS-08': {
        t: 'The service provides the recommended element ech0056:ExternalServiceMetadata linking to full service metadata',
        f: 'The service does not provide the recommended element ech0056:ExternalServiceMetadata linking to full service metadata'
    },
    'WMS-09': {
        t: 'The services supports the recommended GetFeatureInfo request',
        f: 'The services does not support the recommended GetFeatureInfo request'
    },
    'WMS-10': {
        t: 'The service supports MIME type text/xml for the GetFeatureInfo response',
        f: 'The service does not support MIME type text/xml for the GetFeatureInfo response'
    },
    'WMS-11': {
        t: 'The service (version 1.3.0) supports SLD',
        f: 'The service (version 1.3.0) does not support SLD'
    },
    'WMTS-01': {
        t: 'The services supports the mandatory WMTS version 1.0.0',
        f: 'The services does not support the mandatory WMTS version 1.0.0'
    },
    'WMTS-02': {
        t: 'The WMTS implementation is RESTful',
        f: 'The WMTS implementation is not RESTful'
    },
    'WMTS-03': {
        t: 'The service supports the mandatory image formats PNG or JPEG',
        f: 'The service does not support the mandatory image formats PNG or JPEG'
    },
    'WMTS-04': {
        t: 'The service supports the mandatory reference system EPSG:21781',
        f: 'The service does not support the mandatory reference system EPSG:21781'
    },
    'WMTS-05': {
        t: 'The service supports KVP (Key-Value-Pair) encoding',
        f: 'The service does not support KVP (Key-Value-Pair) encoding'
    },
    'WMTS-06': {
        t: 'The service supports the recommended reference system WGS84 (EPSG:4326)',
        f: 'The service does not support the recommended reference system WGS84 (EPSG:4326)'
    },
    'WMTS-07': {
        t: 'The predefined zoom-steps are supported.',
        f: 'The predefined zoom-steps are not supported'
    },
    'WFS-01': {
        t: 'The services supports the mandatory WFS version 1.0.0',
        f: 'The services does not support the mandatory WFS version 1.0.0'
    },
    'WFS-02': {
        t: 'The service supports all mandatory operations',
        f: 'The service does not support the mandatory operation %(operation)s'
    },
    'WFS-03': {
        t: 'The service responded with the right MIME type to the GetCapabilities Request',
        f: 'The service responded with a wrong MIME type'
    },
    'WFS-04': {
        t: 'The services supports the recommended WFS version 1.1.0',
        f: 'The services does not support the recommended WFS version 1.1.0'
    },
    'WFS-05': {
        t: 'The services supports GML 3.2',
        f: 'The services does not support GML 3.2'
    },
    'WFS-06': {
        t: 'The services supports INTERLIS-GML (eCH-0118)',
        f: 'The services does not support INTERLIS-GML (eCH-0118)'
    },
    'WFS-07': {
        t: 'The service provides the recommended element ech0056:ExternalDataMetadata linking to full data metadata',
        f: 'The service does not provide the recommended element ech0056:ExternalDataMetadata linking to full data metadata'
    },
    'WFS-08': {
        t: 'The service provides the recommended element ech0056:ExternalServiceMetadata linking to full service metadata',
        f: 'The service does not provide the recommended element ech0056:ExternalServiceMetadata linking to full service metadata'
    },
    'WCS-01': {
        t: 'The services supports the mandatory WCS version 1.0.0',
        f: 'The services does not support the mandatory WCS version 1.0.0'
    },
    'WCS-02': {
        t: 'The services supports the recommended WCS version 1.1.2',
        f: 'The services does not support the recommended WCS version 1.1.2'
    },
    'CSW-01': {
        t: 'The services supports the mandatory CSW version 2.0.2',
        f: 'The services does not support the mandatory CSW version 2.0.2'
    },
    'CSW-02': {
        t: 'The services supports the mandatory CAT 2-AP ISO Profile',
        f: 'The services does not support the mandatory CAT 2-AP ISO Profile'
    },
    'SLD-01': {
        t: 'The service (version 1.3.0) supports SLD version 1.1.0',
        f: 'The service (version 1.3.0) does not support SLD 1.1.0',
        y: 'The service (version 1.3.0) does not support SLD 1.1.0'
    },
    'WMS-50': {
        t: 'The layer structure in the GetCapabilities document is the same as in the service settings file',
        f: 'The layer structure in the GetCapabilities document is different from that in the service settings file',
        #w: 'Skipped check for WMS-50/51, because WMS-10 failed or no SSURL provided'
    },
    'WMS-51': {
        t: 'The GetFeatureInfo result at the reference position is the same as in the service settings file',
        f: 'The GetFeatureInfo result at the reference position is different from that in the service settings file',
        #w: 'Skipped check for WMS-50/51, because WMS-10 failed or no SSURL provided'
    },
    'WFS-50': {
        t: 'The layer structure in the GetCapabilities document is the same as in the service settings file',
        f: 'The layer structure in the GetCapabilities document is different from that in the service settings file',
        #w: 'Skipped check for WFS-50/51, because no SSURL provided'
    },
    'WFS-51': {
        t: 'The GetFeature result at the reference position is the same as in the service settings file',
        f: 'The GetFeature result at the reference position is different from that in the service settings file',
        #w: 'Skipped check for WFS-50/51, because no SSURL provided'
    },
    'SE-01':{},
    'FE-01':{},
    'POS-01':{},
    'POS-02':{}
}

for rili, status in messages.items():
    if not status.has_key(w):
        messages[rili].update({w:NC})
    if not status.has_key(y) and status.has_key(f):
        messages[rili].update({y:status[f]})


def getMsg(rili, status, data={}, fake=False):
    try:
        msg = messages[rili][status]
        needed_data = re.findall(PY_REGEX, msg)
        if fake:
            for d in needed_data:
                data.update({
                    d:''
                })
        if (needed_data and not data) or (len(needed_data) > len(data)):
            msg = "%s @ %s needs data %s for string \"%s\", got data %s" %(rili, status, needed_data, msg, data)
            raise ValueError(msg)
        if msg:
            return msg % data
        else:
            raise KeyError
    except KeyError:
        #msg = "No Message found (Rili=%(rili)s, Status=%(status)s, Data=%(data)s)" % locals()
        if status:
            return "No '%s' Message for %s" % (status, rili)
        else:
            return "No Error Message for %s. Status=%s" % (rili, status)