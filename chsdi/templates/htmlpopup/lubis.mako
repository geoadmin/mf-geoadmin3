<%inherit file="base.mako"/>
<%namespace name="iipimage" file="../iipimage.mako"/>

<%!
import datetime
import urllib
import urllib2
from pyramid.url import route_url
from xml.dom import minidom
import chsdi.lib.helpers as h

def get_image_size(filename):
    width = 1
    height = 1

    if filename:
        try:
            file = urllib2.urlopen("http://web-iipimage.prod.bgdi.ch/iipimage/iipsrv.fcgi?DeepZoom=" + filename + ".dzi")
            xmldoc = minidom.parse(file)
            dimensions = xmldoc.getElementsByTagName('Size')
            width = dimensions[0].getAttribute('Width')
            height = dimensions[0].getAttribute('Height')
        except: 
            width = 1
            height = 1

    return (width, height)

def date_to_str(datum):
    return datetime.datetime.strptime(datum.strip(), "%Y%m%d").strftime("%d-%m-%Y")

def get_quickview_url(request, params):
    f = {
        'image': params[0],
        'width': params[1],
        'height': params[2],
        'title': params[3].encode('utf8'),
        'bildnummer': params[4],
        'datenherr': params[5].encode('utf8'),
        'layer': params[6].encode('utf8')
    }
    return h.make_agnostic(route_url('iipimage', request)) + '?' + urllib.urlencode(f)
%>

<%def name="table_body(c, lang)">
<% c['stable_id'] = True %>

<%
datum = date_to_str(c['attributes']['flugdatum'])
image_size = get_image_size(c['attributes']['filename'])
params = (
    c['attributes']['filename'], 
    image_size[0], 
    image_size[1], 
    _('tt_lubis_ebkey'),
    c['attributes']['bildnummer'],
    c['attributes']['firma'],
    fullName)
quickview_url = get_quickview_url(request, params)
%>
<tr>
  <td class="cell-left">${_('tt_lubis_ebkey')}</td>
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
% if image_height > 2:
<tr>
  <td class="cell-left">${_('tt_lubis_Quickview')}</td>
  <td>
    <a href="${quickview_url}" target="_blank"><img src="http://web-iipimage.prod.bgdi.ch/iipimage/iipsrv.fcgi?FIF=${c['attributes']['filename']}&WID=150&CVT=jpeg" alt="quickview"></a>
  </td>
</tr>
% else:
<tr>
  <td class="cell-left">${_('tt_lubis_Quickview')}</td>
  <td>${_('tt_lubis_noQuickview')}</td>
</tr>
% endif
<tr>
% if 'contact_web' not in c['attributes']:
  <td class="cell-left">${_('link')} Toposhop</td>
  <a href="http://www.toposhop.admin.ch/de/shop/satair/lubis_1?ext=1&pics=${c['featureId']},0,${c['attributes']['ort'].strip()},${c['attributes']['y']},${c['attributes']['x']},nein" target="toposhop">Toposhop</a>
% else:
  <th class="cell-left">${_('tt_lubis_bildorder')}</th>
  <td>${c['attributes']['contact']} <br /> ${c['attributes']['contact_email']} <br /><a href="${c['attributes']['contact_web']}" target="_blank">${c['attributes']['contact_web']}</a></td>
% endif
</tr>
<tr>
  <td class="cell-left"></td>
  <td>
    <a href="${c['baseUrl']}/${c['instanceId']}/rest/services/all/MapServer/${c['layerBodId']}/${c['featureId']}/extendedHtmlPopup" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a>
  </td>
</tr>
</%def>


<%def name="extended_info(c, lang)">
<%
loader_url = h.make_agnostic(route_url('ga_api', request))
orientierung = '-'
scan = '-'
filename = c['attributes']['filename']
if filename:
    scan = 'True'
endif
if c['attributes']['orientierung']:
    orientierung = 'True'
endif

datum = date_to_str(c['attributes']['flugdatum'])
image_size = get_image_size(c['attributes']['filename'])
image_width =  image_size[0];
image_height = image_size[1];

params = (
    filename, 
    image_width, 
    image_height, 
    _('tt_lubis_ebkey'),
    c['attributes']['bildnummer'],
    c['attributes']['firma'],
    fullName)
quickview_url = get_quickview_url(request, params)
%>
<body onload="init()">
  <table class="table-with-border kernkraftwerke-extended">
    <tr><th class="cell-left">${_('tt_lubis_ebkey')}</th>            <td>${c['featureId'] or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_Flugdatum')}</th>        <td>${datum or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_ort')}</th>              <td>${c['attributes']['ort'] or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_massstab')}</th>         <td>1:${c['attributes']['massstab'] or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_x')}</th>                <td>${c['attributes']['x'] or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_y')}</th>                <td>${c['attributes']['y'] or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_Filmart')}</th>          <td>${c['attributes']['filmart'] or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_originalsize')}</th>     <td>${c['attributes']['originalsize'] or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_scan')}</th>             <td>${scan or '-'}</td></tr>
    <tr><th class="cell-left">${_('tt_lubis_orientierung')}</th>     <td>${orientierung or '-'}</td></tr>
% if 'contact_web' not in c['attributes']:
    <tr class="chsdi-no-print">
      <th class="cell-left">${_('link')} Toposhop</th>
      <td><a href="http://www.toposhop.admin.ch/de/shop/satair/lubis_1?ext=1&pics=${c['featureId']},0,${c['attributes']['ort'].strip()},${c['attributes']['y']},${c['attributes']['x']},nein" target="toposhop">Toposhop</a></td>
    </tr>
% else:
    <tr>
      <th class="cell-left">${_('tt_lubis_bildorder')}</th>
      <td>${c['attributes']['contact']} <br /> ${c['attributes']['contact_email']} <br /><a href="${c['attributes']['contact_web']}" target="_blank">${c['attributes']['contact_web']}</a></td>
    </tr>
% endif
  </table>
  <div class="chsdi-map-container table-with-border" >
    <div id="map"></div>
  </div>
  <br>
% if image_height > 2:
  <span class="chsdi-no-print">${_('tt_luftbilderOL')}<a href="${quickview_url}" target="_blank" alt="Fullscreen">(fullscreen)</a></span>
  <div class="chsdi-map-container table-with-border">
    <div id="zoomify"></div>
  </div>
% endif
  <script type="text/javascript" src="${loader_url}"></script>
  <script type="text/javascript">
    function init() {
      // Create a GeoAdmin Map
      var map = new ga.Map({
        // Define the div where the map is placed
        target: 'map',
        ol3Logo: false,
        view: new ol.View2D({
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


% if image_width > 2:
      ${iipimage.init_map(c['attributes']['filename'], image_width, image_height, 'zoomify')}
% endif

    }
  </script>
</body>
</%def>
