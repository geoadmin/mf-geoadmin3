<%inherit file="base.mako"/>
<%namespace name="lubis_map" file="../lubis_map.mako"/>

<%!
import datetime
import urllib
import urllib2
from pyramid.url import route_url
import chsdi.lib.helpers as h
import markupsafe

def br(text):
    return text.replace('\n', markupsafe.Markup('<br />'))

tileUrlBasePath = 'http://aerialimages0.geo.admin.ch/tiles'


def determinePreviewUrl(ebkey):

    def getPreviewImageUrl(ebkey):
        return tileUrlBasePath + '/' + ebkey + '/quickview.jpg'

    def getZeroTileUrl(ebkey):
        return tileUrlBasePath + '/' + ebkey + '/0/0/0.jpg'

    class HeadRequest(urllib2.Request):
        def get_method(self):
            return 'HEAD'

    def testForUrl(url):
        response = None
        try:
            request = HeadRequest(url)
            request.add_header('Referer', 'http://admin.ch')
            response = urllib2.urlopen(request)

        finally:
            if response:
                if response.getcode() != 200:
                    url = ""
                response.close()
            else:
                url = ""
            return url


    #testing these 2 url could be done more python like
    url = testForUrl(getPreviewImageUrl(ebkey))
    if url == "":
        url = testForUrl(getZeroTileUrl(ebkey))
    return h.make_agnostic(url)


def imagesize_from_metafile(ebkey):
    import xml.etree.ElementTree as etree
    width = None
    height = None
    metaurl = tileUrlBasePath + '/' + ebkey + '/tilemapresource.xml'
    response = None
    try:
        request = urllib2.Request(metaurl)
        request.add_header('Referer', 'http://admin.ch')
        response = urllib2.urlopen(request)
        if response.getcode() == 200:
            xml = etree.parse(response).getroot()
            bb = xml.find('BoundingBox')
            if bb != None:
                width = abs(int(float(bb.get('maxy'))) - int(float(bb.get('miny'))))
                height = abs(int(float(bb.get('maxx'))) - int(float(bb.get('minx'))))
    except:
        pass
    finally:
        if response:
            response.close()

    return (width, height)


def date_to_str(datum):
    try:
        return datetime.datetime.strptime(datum.strip(), "%Y%m%d").strftime("%d-%m-%Y")
    except:
        return request.translate('None') + request.translate('Datenstand')

def get_viewer_url(request, params):
    f = {
        'width': params[0],
        'height': params[1],
        'title': params[2].encode('utf8'),
        'bildnummer': params[3],
        'datenherr': params[4].encode('utf8'),
        'layer': params[5].encode('utf8'),
        'lang': params[6],
        'rotation': params[7]
    }
    return h.make_agnostic(route_url('luftbilder', request)) + '?' + urllib.urlencode(f)

%>

<%def name="table_body(c, lang)">
<%

tt_lubis_ebkey = c['layerBodId'] + '.' + 'id'
lang = lang if lang in ('fr','it','en') else 'de'
c['stable_id'] = True

if c['layerBodId'] == 'ch.swisstopo.lubis-luftbilder_farbe':
    imgtype = 1
elif c['layerBodId'] == 'ch.swisstopo.lubis-luftbilder_infrarot':
    imgtype = 2
else:
    imgtype = 0
endif

toposhopscan = 'nein'
if c['attributes']['filename'] :
    toposhopscan = 'ja'
preview_url = determinePreviewUrl(c['featureId'])

image_width = c['attributes']['image_width'] if 'image_width' in  c['attributes'] else None
image_height = c['attributes']['image_height'] if 'image_height' in c['attributes'] else None

if image_width == None or image_height == None:
  wh = imagesize_from_metafile(c['featureId'])
  image_width = wh[0]
  image_height = wh[1]

datum = date_to_str(c['attributes']['flugdatum'])
params = (
    image_width,
    image_height,
    _('ch.swisstopo.lubis-luftbilder-dritte-kantone.ebkey'),
    c['featureId'],
    c['attributes']['firma'],
    c['layerBodId'],
    lang,
    c['attributes']['rotation'] if 'rotation' in  c['attributes'] else 0)
viewer_url = get_viewer_url(request, params)
%>
<tr>
  <td class="cell-left">${_(tt_lubis_ebkey)}</td>
  <td>${c['featureId'] or '-'}</td>
</tr>
<tr>
  <td class="cell-left">${_('tt_lubis_Flugdatum')}</td>
  <td>${datum or '-'}</td>
</tr>
<tr>
  <td class="cell-left">${_('tt_lubis_Filmart')}</td>
  <td>${c['attributes']['filmart'] or '-'}</td>
</tr>

% if preview_url != "" and image_width != None:
<tr>
  <td class="cell-left">${_('tt_lubis_Quickview')}</td>
  <td>
    <a href="${viewer_url}" target="_blank"><img src="${preview_url}" alt="quickview"></a>
  </td>
</tr>
% else:
<tr>
  <td class="cell-left">${_('tt_lubis_Quickview')}</td>
  <td>${_('tt_lubis_noQuickview')}</td>
</tr>
% endif

% if 'contact_web' not in c['attributes'] and c['attributes']['ort'] is not None:
<tr>
  <th class="cell-left">${_('link')} Toposhop</th>
  <td><a href="http://www.toposhop.admin.ch/${lang}/shop/satair/lubis_1?ext=1&pics=${c['featureId']},${imgtype},${c['attributes']['ort'].strip()},${c['attributes']['x']},${c['attributes']['y']},${toposhopscan}" target="toposhop">Toposhop</a></td>
</tr>
% endif
% if 'contact_web' in c['attributes']:
<tr>
  <th class="cell-left">${_('tt_lubis_bildorder')}</th>
  <td>
    ${c['attributes']['contact'] | br } 
    <br/> 
    ${c['attributes']['contact_email']} 
    <br/>

% if  c['attributes']['contact_web'] != '-':
    <a href="${c['attributes']['contact_web']}" target="_blank">
% endif

    ${c['attributes']['contact_web']}

% if  c['attributes']['contact_web'] != '-':
    </a>
% endif

  </td>
</tr>
% endif
</%def>


<%def name="extended_info(c, lang)">
<%
c['stable_id'] = True
if c['layerBodId'] == 'ch.swisstopo.lubis-luftbilder_farbe':
    imgtype = 1
elif c['layerBodId'] == 'ch.swisstopo.lubis-luftbilder_infrarot':
    imgtype = 2
else:
    imgtype = 0
endif

preview_url = determinePreviewUrl(c['featureId'])

filesize_mb = '-'
toposhopscan = 'nein'
filename = c['attributes']['filename']
if filename:
    filesize_mb = c['attributes']['filesize_mb']
    toposhopscan = 'ja'
endif
orientierung = '-'
if c['attributes']['orientierung']:
    orientierung = 'True'
endif

datum = date_to_str(c['attributes']['flugdatum'])
image_width =  c['attributes']['image_width'] if 'image_width' in  c['attributes'] else None
image_height = c['attributes']['image_height'] if 'image_height' in c['attributes'] else None
image_rotation = c['attributes']['rotation'] if 'rotation' in c['attributes'] else 0

if image_width == None or image_height == None:
  wh = imagesize_from_metafile(c['featureId'])
  image_width = wh[0]
  image_height = wh[1]

params = (
    image_width, 
    image_height, 
    _('tt_lubis_ebkey'),
    c['featureId'],
    c['attributes']['firma'],
    c['layerBodId'],
    lang,
    image_rotation)
viewer_url = get_viewer_url(request, params)
%>
<title>${_('tt_lubis_ebkey')}: ${c['featureId']}</title>
<body onload="init()">
  <table class="table-with-border kernkraftwerke-extended">
    <tr><th class="cell-left">${_('tt_lubis_ebkey')}</th>            <td>${c['featureId'] or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_inventarnummer')}</th>   <td>${c['attributes']['inventarnummer'] or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_Flugdatum')}</th>        <td>${datum or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_flughoehe')}</th>        <td>${c['attributes']['flughoehe'] or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_massstab')}</th>         <td>1:${c['attributes']['massstab'] or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_y')}</th>                <td>${c['attributes']['x'] or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_x')}</th>                <td>${c['attributes']['y'] or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_Filmart')}</th>          <td>${c['attributes']['filmart'] or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_originalsize')}</th>     <td>${c['attributes']['originalsize'] or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_filesize_mb')}</th>      <td>${filesize_mb or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_bildpfad')}</th>         <td>${filename or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_orientierung')}</th>     <td>${orientierung or '-'}</td></tr>
% if 'contact_web' not in c['attributes'] and c['attributes']['ort'] is not None:
  <tr class="chsdi-no-print">
    <th class="cell-left">${_('link')} Toposhop</th>
    <td><a href="http://www.toposhop.admin.ch/${lang}/shop/satair/lubis_1?ext=1&pics=${c['featureId']},${imgtype},${c['attributes']['ort'].strip()},${c['attributes']['x']},${c['attributes']['y']},${toposhopscan}" target="toposhop">Toposhop</a></td>
  </tr>
% endif
% if 'contact_web' in c['attributes']:
  <tr class="chsdi-no-print">
    <th class="cell-left">${_('tt_lubis_bildorder')}</th>
    <td>${c['attributes']['contact'] | br } <br /> ${c['attributes']['contact_email']} <br /><a href="${c['attributes']['contact_web']}" target="_blank">${c['attributes']['contact_web']}</a></td>
  </tr>
% endif
  </table>
  <div class="chsdi-map-container table-with-border" >
    <div id="map"></div>
  </div>
  <br>

% if preview_url != "" and image_width != None:
  <span class="chsdi-no-print">${_('tt_luftbilderOL')}<a href="${viewer_url}" target="_blank" alt="Fullscreen">(fullscreen)</a></span>
  <div class="chsdi-map-container table-with-border">
    <div id="lubismap"></div>
  </div>
% endif

  <script type="text/javascript">
    function init() {
      // Create a GeoAdmin Map
      var map = new ga.Map({
        // Define the div where the map is placed
        target: 'map',
        tooltip: false,
        view: new ol.View({
          // Define the default resolution
          // 10 means that one pixel is 10m width and height
          // List of resolution of the WMTS layers:
          // 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5, 0.25, 0.1
          resolution: 10,
          // Define a coordinate CH1903 (EPSG:21781) for the center of the view
          center: [${c['attributes']['x']},${c['attributes']['y']}]
        })
      });

      // Create a background layer
      var lyr1 = ga.layer.create('ch.swisstopo.pixelkarte-grau');
      // Create an overlay layer
      var lyr2 = ga.layer.create('${c['layerBodId']}');

      // Add the layers in the map
      map.addLayer(lyr1);
      map.addLayer(lyr2);

      map.highlightFeature('${c['layerBodId']}', '${c['featureId']}');
      map.recenterFeature('${c['layerBodId']}', '${c['featureId']}');

% if preview_url != "" and image_width != None:
     ${lubis_map.init_map(c['featureId'], image_width, image_height, image_rotation, 'lubismap')}
%endif

    }
  </script>

</body>
</%def>
