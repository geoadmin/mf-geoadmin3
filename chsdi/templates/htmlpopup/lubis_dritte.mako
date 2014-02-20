<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <% c['stable_id'] = True %>

<%
import urllib2
import datetime
from xml.dom import minidom

if c['attributes']['bildnummer']:
    image_bildnummer = c['attributes']['bildnummer']
endif
datenherr = c['attributes']['firma']
datum = datetime.datetime.strptime(c['attributes']['flugdatum'].strip(), "%Y%m%d").strftime("%d-%m-%Y")
image_width = 1
image_height = 1
chsdihost = '//' + request.registry.settings['host']

if c['attributes']['filename']:
    try:
        xml_file = urllib2.urlopen("http://web-iipimage.prod.bgdi.ch/iipimage/iipsrv.fcgi?DeepZoom="+c['attributes']['filename'][12:]+".dzi")
        xmldoc = minidom.parse(xml_file)
        dimensions = xmldoc.getElementsByTagName('Size')
        image_width = dimensions[0].getAttribute('Width')
        image_height = dimensions[0].getAttribute('Height')
    except: 
        image_width = 1
        image_height = 1
endif
%>

    <tr><td class="cell-left">${_('tt_lubis_ebkey')}</td>   <td>${c['featureId'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_lubis_Flugdatum')}</td>    <td>${datum or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_lubis_Filmart')}</td>      <td>${c['attributes']['filmart'] or '-'}</td></tr>

%    if image_height > 2:
       <tr><td class="cell-left">${_('tt_lubis_Quickview')}</td>    <td><a href="${chsdihost}/main/wsgi/static/iipimage/viewer.html?image=${c['attributes']['filename'][12:]}&width=${image_width}&height=${image_height}&title=${_('tt_lubis_ebkey')}&bildnummer=${image_bildnummer}&datenherr=${datenherr}&layer=${fullName}" target="_blank"><img src="http://web-iipimage.prod.bgdi.ch/iipimage/iipsrv.fcgi?FIF=${c['attributes']['filename'][12:]}&WID=150&CVT=jpeg" alt="quickview"></a></td></tr>
%    else:
       <tr><td class="cell-left">${_('tt_lubis_Quickview')}</td>    <td>${_('tt_lubis_noQuickview')}</td></tr>
%    endif
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

if c['attributes']['bildnummer']:
    image_bildnummer = c['attributes']['bildnummer']
endif
datenherr = c['attributes']['firma']
datum = datetime.datetime.strptime(c['attributes']['flugdatum'].strip(), "%Y%m%d").strftime("%d-%m-%Y")
orientierung = '-'
image_width = 1
image_height = 1
filenamee = c['attributes']['filename']
scan = '-'
chsdihost = '//' + request.registry.settings['host']

if c['attributes']['filename']: 
    scan = 'True'
endif
if c['attributes']['orientierung']:
    orientierung = 'True'
endif

if c['attributes']['filename']:
    try:
        xml_file = urllib2.urlopen("http://web-iipimage.prod.bgdi.ch/iipimage/iipsrv.fcgi?DeepZoom="+c['attributes']['filename'][12:]+".dzi")
        xmldoc = minidom.parse(xml_file)
        dimensions = xmldoc.getElementsByTagName('Size')
        image_width = dimensions[0].getAttribute('Width')
        image_height = dimensions[0].getAttribute('Height')
    except: 
        image_width = 1
        image_height = 1
endif
%>
<head>
    <script type="text/javascript" src="${chsdihost}/loader.js"></script>
    <script>
    function init() {
% if image_width > 2:
        var image_width = parseInt(${image_width});
        var image_height = parseInt(${image_height});
        var url = "https://web-iipimage.prod.bgdi.ch/iipimage/iipsrv.fcgi?Zoomify=${c['attributes']['filename'][12:]}/";
      
        var proj = new ol.proj.Projection({
          code: 'ZOOMIFY',
          extent: [0, 0, image_width, image_height]
        });

        var source = new ol.source.Zoomify({
          url: url,
          size: [image_width, image_height]
        });

        if (url && image_width && image_height) {
          var map = new ol.Map({
            layers: [
              new ol.layer.Tile({
                source: source
              })
            ],
            controls: ol.control.defaults().extend([new ol.control.FullScreen()]),
            renderer: 'canvas',
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
% endif
    
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

    }
    </script>
    <style>
      #zoomify, #map {
        width: 100%;
        height: 300px;
      }
      .htmlpopup-container {
        width: 60%;      
      }
    </style>
  </head>
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
        <tr><th class="cell-left">${_('tt_lubis_bildorder')}</th>        <td>${c['attributes']['contact']} <br /> ${c['attributes']['contact_email']} <br /><a href="${c['attributes']['contact_web']}" target="_blank">${c['attributes']['contact_web']}</a></td></tr>
    </table>
    <div id="map"></div>
    <br>
    <br>
%    if image_height > 2:
    <tr><td>${_('tt_luftbilderOL')}</td> <td><a href="${chsdihost}/main/wsgi/static/iipimage/viewer.html?image=${c['attributes']['filename'][12:]}&width=${image_width}&height=${image_height}&title=${_('tt_lubis_ebkey')}&bildnummer=${image_bildnummer}&datenherr=${datenherr}&layer=${fullName}" target="_blank" alt="Fullscreen">(fullscreen)</a></td></tr>
    <div id="zoomify"></div>
%    endif
    <tr><td>
  </body>
</%def>
