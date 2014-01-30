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
    <tr><td class="cell-left">${_('tt_bildstreifen_ebkey')}</td>   <td>${c['attributes']['bildnummer']}</td></tr>
%    else:
    <tr><td class="cell-left">${_('tt_bildstreifen_ebkey')}</td>   <td>${c['featureId']}</td></tr>
%    endif

    <tr><td class="cell-left">${_('tt_bildstreifen_Flugdatum')}</td>    <td>${datum}</td></tr>
    <tr><td class="cell-left">${_('tt_luftbilder_Filmart')}</td>      <td>${c['attributes']['filmart']}</td></tr>

%    if image_height > 1:
       <tr><td class="cell-left">${_('tt_bildstreifen_Quickview')}</td>    <td><a href="/wsgi/static/iipimage/viewer.html?image=${c['attributes']['filename'][12:]}&width=${image_width}&height=${image_height}&title=No%20de%20l%27image&bildnummer=${image_bildnummer}&datenherr=${datenherr}&layer=Photographies%20a%C3%A9riennes%20swisstopo" target="_blank"><img src="http://web-iipimage.prod.bgdi.ch/iipimage/iipsrv.fcgi?FIF=${c['attributes']['filename'][12:]}&WID=150&CVT=jpeg" alt="quickview"></a></td></tr>
%    else:
       <tr><td class="cell-left">${_('tt_bildstreifen_Quickview')}</td>    <td>${_('tt_bildstreifen_noQuickview')}</td></tr>
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
    <script type="text/javascript" src="http://api3.geo.admin.ch/loader.js"></script>
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
          target: 'map',
          ol3Logo: false,
          view: new ol.View2D({
            projection: proj,
            center:  [image_width / 2, - image_height / 2],
            zoom: 0
          })
        });
      } else {
        alert('Missing parameters');
      }
    }
    </script>
    <style>
      #map {
        width: 600px;
        height: 300px;
      }
    </style>
  </head>
  <body onload="init()">
    <table class="table-with-border kernkraftwerke-extended">
        <tr><th class="cell-left">${_('tt_bildstreifen_ebkey')}</th>          <td>${c['attributes']['bildnummer']}</td></tr>
        <tr><th class="cell-left">${_('tt_bildstreifen_Flugdatum')}</th>    <td>${datum}</td></tr>
        <tr><th class="cell-left">${_('tt_bildstreifen_ort')}</th>    <td>${c['attributes']['ort']}</td></tr>
        <tr><th class="cell-left">${_('tt_luftbilder_Filmart')}</th>      <td>${c['attributes']['filmart']}</td></tr>
        <tr><th class="cell-left">${_('tt_bildstreifen_scan')}</th>    <td>?????????</td></tr>
        <tr><th class="cell-left">${_('tt_bildstreifen_orientierung')}</th>    <td>${c['attributes']['orientierung']}</td></tr>
        <tr><th class="cell-left">${_('tt_bildstreifen_bildgrosse')}</th>    <td>${c['attributes']['originalsize']}</td></tr>
    </table>
    <div id="map"></div>
  </body>
</%def>
