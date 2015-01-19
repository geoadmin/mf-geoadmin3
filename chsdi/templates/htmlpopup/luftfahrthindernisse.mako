<%inherit file="base.mako"/>
<%!
from pyramid.url import route_url
%>

<%def name="table_body(c,lang)">
<%
  attr = c['attributes'] 

  if attr['sanctiontext'] == 'VOID':
    sanctiontext = '-'
  else:
    sanctiontext = attr['sanctiontext']
%>
<tr><td class="cell-left">${_('tt_ch.bazl.registrationnummer')}</td>      <td>${c['attributes']['registrationnumber']}</td></tr>
<tr><td class="cell-left">${_('tt_ch.bazl.kartnummer')}</td>              <td>${c['attributes']['lk100']}</td></tr>
<tr><td class="cell-left">${_('tt_ch.bazl.hindernisart')}</td>            <td>${c['attributes']['obstacletype']}</td></tr>
<tr><td class="cell-left">${_('status')}</td>                             <td>${c['attributes']['state']}</td></tr>
<tr><td class="cell-left">${_('tt_ch.bazl.maxheight')}</td>               <td>${c['attributes']['maxheightagl']}</td></tr>
<tr><td class="cell-left">${_('tt_ch.bazl.elevation')}</td>               <td>${c['attributes']['topelevationamsl']}</td></tr>
<tr><td class="cell-left">${_('tt_ch.bazl.totallength')}</td>             <td>${c['attributes']['totallength']}</td></tr>
<tr><td class="cell-left">${_('tt_ch.bazl.startofconstruction')}</td>     <td>${c['attributes']['startofconstruction'] or '-'}</td></tr>
<tr><td class="cell-left">${_('tt_ch.bazl.abortionaccomplished')}</td>    <td>${c['attributes']['duration'] or '-'}</td></tr>
<tr><td class="cell-left">${_('tt_ch.bazl.markierung')}</td>              <td>${sanctiontext}</td></tr>
</%def>
<%def name="extended_info(c, lang)">
<%
  c['last'] = False
  wms_url = 'http://' + request.registry.settings['wmshost']
  attr = c['attributes'] 
  startofconstruction = str(attr['startofconstruction'].day) + '.' + str(attr['startofconstruction'].month) + '.' + str(attr['startofconstruction'].year)
  datenstand = str(attr['bgdi_created'].day) + '.' + str(attr['bgdi_created'].month) + '.' + str(attr['bgdi_created'].year)

  if attr['bbox'][0] !=  attr['bbox'][2]:
    bbox = True
  else:
    bbox = False

  if attr['abortionaccomplished'] is not None:
     abortionaccomplished = str(attr['abortionaccomplished'].day) + '.' + str(attr['abortionaccomplished'].month) + '.' + str(attr['abortionaccomplished'].year)
  else:
     abortionaccomplished = '-'

  if attr['sanctiontext'] == 'VOID':
    sanctiontext = '-'
  else:
    sanctiontext = attr['sanctiontext']
  
  id = attr['featureId']
  geometry = c['geometry']

%>
<style type="text/css">
  /*  Smartphones portrait (320px) et landscape (480px) */
  td {
    padding-left: 200px;
    text-align: left;
  }
  @media (max-width: 480px) {
    td {
      padding-left: 20px;
    }
  }
</style>
<div class="zsborder">
  <table border="0px" cellspacing="0px" cellpadding="2px" width="100%">
    <tr>
      <td width="50%">&nbsp;</td>
      <td width="50%">&nbsp;</td>
    </tr>
    <tr>
      <th class="cell-left" colspan="2" style="background-color: #FFFFFF;">
        <div style="float: left; text-align: left; font-weight: bold; font-size: 14px;">${_('tt_ch.bazl.registrationnummer')}: ${attr['registrationnumber']}</div>
        <div style="float: right; text-align: right; padding-right: 16px;">${_('tt_ch.bazl.hindernisart')}: ${attr['obstacletype']}</div>
      </th>
    </tr>
     <tr>
     <td></td>
     </tr>
    <tr bgcolor="#EFEFEF">
      <th style="text-align:left" colspan="2">${_('status')}: ${attr['state']}</th>
    </tr>
    <tr>
      <td class="cell-meta-one" colspan="2">${_('tt_ch.bazl.startofconstruction')}: ${startofconstruction or '-'}</td>
    </tr>
    <tr>
      <td class="cell-meta-one" colspan="2">${_('tt_ch.bazl.abortionaccomplished')}: ${attr['duration'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-meta-one" colspan="2">${_('tt_bazl_abortion')}: ${abortionaccomplished}</td>
    </tr>
    <tr bgcolor="#EFEFEF">
      <th style="text-align:left" colspan="2">${_('tt_ch.bazl.geometriedaten')}:</th>
    </tr>
    <tr>
      <td class="cell-meta-one" colspan="2">${_('tt_ch.bazl.maxheight')}: ${attr['maxheightagl']}</td></tr>
    </tr>
    <tr>
      <td class="cell-meta-one" colspan="2">${_('tt_ch.bazl.elevation')}: ${attr['topelevationamsl']}</td>
    </tr>
    <tr>
      <td class="cell-meta-one" colspan="2">${_('tt_ch.bazl.totallength')}: ${attr['totallength']}</td>
    </tr>

% if bbox == True and attr['geomtype'] != 'line':
    <tr bgcolor="#EFEFEF">
      <th style="text-align:left" colspan="2">${_('Bounding Box - Coordinates')} [CH1903]:</th>
    </tr>
    <tr>
      <td class="cell-meta-one" colspan="2">${_('est')}=${c['bbox'][0]}    ${_('nord')}=${c['bbox'][1]}</td>
    </tr>
    <tr>
      <td class="cell-meta-one" colspan="2">${_('est')}=${c['bbox'][0]}    ${_('nord')}=${c['bbox'][3]}</td>
    </tr>
    <tr>
      <td class="cell-meta-one" colspan="2">${_('est')}=${c['bbox'][2]}    ${_('nord')}=${c['bbox'][1]}</td>
    </tr>
    <tr>
      <td class="cell-meta-one" colspan="2">${_('est')}=${c['bbox'][2]}    ${_('nord')}=${c['bbox'][3]}</td>
    </tr>

% else:
    <tr bgcolor="#EFEFEF">
      <th style="text-align:left" colspan="2">${_('Coordinates')} [CH1903]:</th>
    </tr>
    <tr>
      <td class="cell-meta-one" colspan="2">${_('est')}=${c['bbox'][0]}    ${_('nord')}=${c['bbox'][1]}</td>
    </tr>
  % if attr['geomtype'] == 'line':
      <tr>
        <td class="cell-meta-one" colspan="2">${_('est')}=${c['bbox'][2]}    ${_('nord')}=${c['bbox'][3]}</td>
      </tr>
  % endif
% endif
    <tr bgcolor="#EFEFEF">
      <th style="text-align:left" colspan="2">${_('tt_ch.bazl.markierung')}:</th>
    </tr>
    <tr>
      <td class="cell-meta-one" colspan="2">${sanctiontext}</td>
    </tr>
    <tr bgcolor="#EFEFEF">
      <th style="text-align:left" colspan="2">${_('tt_ch.bazl.kartnummer')}: ${attr['lk100']}</th>
    </tr>
  </table>
</div>
<div class="chsdi-map-container table-with-border" style="width: 100%; height: 400px;">
  <div id="map${id}"></div>
</div>
<div style="font-size:12px; text-align:justify;">${_('tt_ch.bazl_longtext')} <br>${_('date')}: ${datenstand}</div>
<script type="text/javascript">
  function init${id}() {
    var map = new ga.Map({
      target: 'map${id}',
      layers: [
        ga.layer.create('ch.swisstopo.pixelkarte-grau'),
        new ol.layer.Image({
           source: new ol.source.ImageWMS({
             params:{'LAYERS':'org.epsg.grid_21781,org.epsg.grid_4326,ch.bazl.luftfahrthindernis'},
             ratio: 1,
             url: '${wms_url}'
           })
        })
      ],
      view: new ol.View({
        resolution: 10,
        center : [(${c['bbox'][0]}+${c['bbox'][2]})/2,(${c['bbox'][1]}+${c['bbox'][3]})/2]
      }),
      tooltip: false,
      controls: ol.control.defaults({
        zoom: false,
        attribution: false
      }),  
      interactions: ol.interaction.defaults({
        doubleClickZoom: false,
        dragPan: false,
        mouseWheelZoom: false
      })
    });
    var geomJson;

    // TO FIX: Sometimes the parsing fails
    // ex: http://mf-chsdi3.dev.bgdi.ch/ltteo/rest/services/all/MapServer/ch.bazl.luftfahrthindernis/7316/extendedHtmlPopup 
    try {
      geomJson = JSON.parse("${geometry['coordinates']}".replace(/\(/g,'[').replace(/\)/g,']'));
    } catch(e) {
    }
    if (geomJson) {
      var feat = {
        "type": "Feature",
        "geometry": {
          "type": "${geometry['type']}",
          "coordinates": geomJson
        }
      };
      var parser = new ol.format.GeoJSON();
      var vectorSource = new ol.source.Vector({
        projection: map.getView().getProjection(),
        features: parser.readFeatures(feat)
      });
      var vector = new ol.layer.Vector({
        opacity: 0.75,
        source: vectorSource,
        style: function(feature, resolution) {
          return [new ol.style.Style({
            fill: new ol.style.Fill({color: '#ffff00'}),
            stroke: new ol.style.Stroke({color: '#ff8000', width: 3}),
            image: new ol.style.Circle({
              radius: 10,
              fill: new ol.style.Fill({color:'#ffff00'}),
              stroke: new ol.style.Stroke({color: '#ff8000', width: 3})
            })
          })];
        }
      });
      map.addLayer(vector);

      map.getView().fitGeometry(vectorSource.getFeatures()[0].getGeometry(), map.getSize(), {
        minResolution: 10
      });
    }
  }
  $(document).ready(init${id});
</script>
</%def>
