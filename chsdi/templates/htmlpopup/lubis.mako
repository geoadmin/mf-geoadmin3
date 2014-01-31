<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <% c['stable_id'] = True %>

<%
import urllib2
import datetime
from xml.dom import minidom

image_bildnummer = c['attributes']['bildnummer']
datenherr = c['attributes']['firma']
datum = datetime.datetime.strptime(c['attributes']['flugdatum'], "%Y%m%d  ").strftime("%d-%m-%Y")

try:
    xml_file = urllib2.urlopen("http://web-iipimage.prod.bgdi.ch/iipimage/iipsrv.fcgi?DeepZoom="+c['attributes']['filename'][12:]+".dzi")
    xmldoc = minidom.parse(xml_file)
    dimensions = xmldoc.getElementsByTagName('Size')
    image_width = dimensions[0].getAttribute('Width')
    image_height = dimensions[0].getAttribute('Height')
except: 
    image_width = None
    image_height = None
%>

%    if image_bildnummer: 
    <tr><td class="cell-left">${_('tt_lubis_ebkey')}</td>   <td>${c['featureId'] or '-'}</td></tr>
%    else:
    <tr><td class="cell-left">${_('tt_lubis_lineId')}</td>   <td>${c['featureId'] or '-'}</td></tr>
%    endif

    <tr><td class="cell-left">${_('tt_lubis_Flugdatum')}</td>    <td>${datum or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_lubis_Filmart')}</td>      <td>${c['attributes']['filmart'] or '-'}</td></tr>

%    if image_height > 1:
       <tr><td class="cell-left">${_('tt_lubis_Quickview')}</td>    <td><a href="/wsgi/static/iipimage/viewer.html?image=${c['attributes']['filename'][12:]}&width=${image_width}&height=${image_height}&title=No%20de%20l%27image&bildnummer=${image_bildnummer}&datenherr=${datenherr}&layer=Photographies%20a%C3%A9riennes%20swisstopo" target="_blank"><img src="http://web-iipimage.prod.bgdi.ch/iipimage/iipsrv.fcgi?FIF=${c['attributes']['filename'][12:]}&WID=150&CVT=jpeg" alt="quickview"></a></td></tr>
%    else:
       <tr><td class="cell-left">${_('tt_lubis_Quickview')}</td>    <td>${_('tt_lubis_noQuickview')}</td></tr>
%    endif
    <tr><td class="cell-left">${_('link')} Toposhop</td>   <td><a href="http://www.toposhop.admin.ch/de/shop/satair/lubis_1?ext=1&pics=${c['featureId']},0,${c['attributes']['ort'].strip()},${c['attributes']['y']},${c['attributes']['x']},nein" target="toposhop">Toposhop</a></td></tr>
<tr>
      <td class="cell-left"></td>
      <td><a href="${c['baseUrl']}/${c['instanceId']}/rest/services/all/MapServer/${c['layerBodId']}/${c['featureId']}/extendedhtmlpopup" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td>
</tr>
</%def>

<%def name="extended_info(c, lang)">

<%
import urllib2
import datetime
from xml.dom import minidom

image_bildnummer = c['attributes']['bildnummer']
datenherr = c['attributes']['firma']
datum = datetime.datetime.strptime(c['attributes']['flugdatum'], "%Y%m%d  ").strftime("%d-%m-%Y")
scan = '-'
orientierung = '-'
if c['attributes']['filename']:
    scan = 'True'
endif
if c['attributes']['orientierung']:
    orientierung = 'True'
endif

try:
    xml_file = urllib2.urlopen("http://web-iipimage.prod.bgdi.ch/iipimage/iipsrv.fcgi?DeepZoom="+c['attributes']['filename'][12:]+".dzi")
    xmldoc = minidom.parse(xml_file)
    dimensions = xmldoc.getElementsByTagName('Size')
    image_width = dimensions[0].getAttribute('Width')
    image_height = dimensions[0].getAttribute('Height')
except: 
    image_width = None
    image_height = None
%>
<head>
    <script type="text/javascript" src="/loader.js"></script>
    <script>
    function init() {
      var image_width = parseInt(${image_width});
      var image_height = parseInt(${image_height});
      var url = "https://web-iipimage.prod.bgdi.ch/iipimage/iipsrv.fcgi?Zoomify=${c['attributes']['filename'][12:]}/";
      var proj = new ol.proj.Projection({
        code: 'ZOOMIFY',
        units: ol.proj.Units.PIXELS,
        extent: [0, 0, image_width, image_height]
      });

      var source = new ol.source.Zoomify({
        url: url,
        size: [image_width, image_height]
      });

      if (url && image_width && image_height) {
        var map = new ga.Map({
          layers: [
            new ol.layer.Tile({
              source: source
            })
          ],
          controls: ol.control.defaults().extend([new ol.control.FullScreen()]),
          renderer: ol.RendererHint.CANVAS,
          target: 'zoomify',
          ol3Logo: false,
          view: new ol.View2D({
            projection: proj,
            center:  [image_width / 2, - image_height / 2],
            zoom: 0
          })
        });
      } else {
        alert('Missing parameters');
      };
    
      // Create a GeoAdmin Map
      var map = new ga.Map({
  
      // Define the div where the map is placed
      target: 'map',
      ol3Logo: false,
  
      // Create a 2D view
      view: new ol.View2D({
     
        // Define the default resolution
        // 10 means that one pixel is 10m width and height
        // List of resolution of the WMTS layers:
        // 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5, 0.25, 0.1
        resolution: 10,
    
        // Define a coordinate CH1903 (EPSG:21781) for the center of the view
        center: [561666.5, 185569.5]
      })
    });

    // Create a background layer
    var lyr1 = ga.layer.create('ch.swisstopo.pixelkarte-grau');
    // Create an overlay layer
    var lyr2 = ga.layer.create('ch.swisstopo.lubis-luftbilder');

    // Add the layers in the map
    map.addLayer(lyr1);
    map.addLayer(lyr2);
    }
    </script>
    <style>
      #zoomify {
        width: 600px;
        height: 300px;
      }
      #map {
        width: 600px;
        height: 300px;
      }
    </style>
  </head>
  <body onload="init()">
%    if image_bildnummer:
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
        <tr><th class="cell-left">${_('link')} Toposhop</th>             <td><a href="http://www.toposhop.admin.ch/de/shop/satair/lubis_1?ext=1&pics=${c['featureId']},0,${c['attributes']['ort'].strip()},${c['attributes']['y']},${c['attributes']['x']},nein" target="toposhop">Toposhop</a></td></tr>
    </table>
%   else:
    <table class="table-with-border kernkraftwerke-extended">
        <tr><th class="cell-left">${_('tt_lubis_lineId')}</th>           <td>${c['featureId'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('tt_lubis_Flugdatum')}</th>        <td>${datum or '-'}</td></tr>
        <tr><th class="cell-left">${_('tt_lubis_Filmart')}</th>          <td>${c['attributes']['filmart'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('link')} Toposhop</th>             <td><a href="http://www.toposhop.admin.ch/de/shop/satair/lubis_1?ext=1&pics=${c['featureId']},0,${c['attributes']['ort'].strip()},${c['attributes']['y']},${c['attributes']['x']},nein" target="toposhop">Toposhop</a></td></tr>
    </table>
%   endif
    <div id="map"></div>
    <br>
    <br>
%    if image_height > 1:
    <tr><td>${_('tt_luftbilderOL')}</td> <td><a href="/wsgi/static/iipimage/viewer.html?image=${c['attributes']['filename'][12:]}&width=${image_width}&height=${image_height}&title=No%20de%20l%27image&bildnummer=${image_bildnummer}&datenherr=${datenherr}&layer=Photographies%20a%C3%A9riennes%20swisstopo" target="_blank" alt="Fullscreen">(fullscreen)</a></td></tr>
    <div id="zoomify"></div>
%    endif
    <tr><td>
  </body>
</%def>
