<%inherit file="base.mako"/>

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
%>
  <title>Luftfahrthindernisse</title>
  <script type="text/javascript" src="//api3.geo.admin.ch/loader.js"></script>
<body>
<div class="zsborder">
  <table border="0px" cellspacing="0px" cellpadding="2px" width="100%">
    <tr>
      <td width="50%">&nbsp;</td>
      <td width="50%">&nbsp;</td>
    </tr>
    <tr>
      <td class="cell-left" colspan="2">
        <div style="float: left; font-weight: bold; font-size: 14px;">${_('tt_ch.bazl.registrationnummer')}: ${attr['registrationnumber']}</div>
        <div style="float: right; text-align: right; padding-right: 16px;">${_('tt_ch.bazl.hindernisart')}: ${attr['obstacletype']}</div>
      </td>
    </tr>
     <tr>
     <td></td>
     </tr>
    <tr bgcolor="#EFEFEF">
      <th style="text-align:left" colspan="2">${_('status')}: ${attr['state']}</th>
    </tr>
    <tr>
      <td class="cell-meta-one" style="padding-left: 200px" colspan="2">${_('tt_ch.bazl.startofconstruction')}: ${startofconstruction or '-'}</td>
    </tr>
    <tr>
      <td class="cell-meta-one" style="padding-left: 200px" colspan="2">${_('tt_ch.bazl.abortionaccomplished')}: ${attr['duration'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-meta-one" style="padding-left: 200px" colspan="2">${_('tt_bazl_abortion')}: ${abortionaccomplished}</td>
    </tr>
    <tr bgcolor="#EFEFEF">
      <th style="text-align:left" colspan="2">${_('tt_ch.bazl.geometriedaten')}:</th>
    </tr>
    <tr>
      <td class="cell-meta-one" style="padding-left: 200px" colspan="2">${_('tt_ch.bazl.maxheight')}: ${attr['maxheightagl']}</td></tr>
    </tr>
    <tr>
      <td class="cell-meta-one" style="padding-left: 200px" colspan="2">${_('tt_ch.bazl.elevation')}: ${attr['topelevationamsl']}</td>
    </tr>
    <tr>
      <td class="cell-meta-one" style="padding-left: 200px" colspan="2">${_('tt_ch.bazl.totallength')}: ${attr['totallength']}</td>
    </tr>

% if bbox == True and attr['geomtype'] != 'line':
    <tr bgcolor="#EFEFEF">
      <th style="text-align:left" colspan="2">${_('Bounding Box - Coordinates')} [CH1903]:</th>
    </tr>
    <tr>
      <td class="cell-meta-one" style="padding-left: 200px" colspan="2">${_('est')}=${c['bbox'][0]}    ${_('nord')}=${c['bbox'][1]}</td>
    </tr>
    <tr>
      <td class="cell-meta-one" style="padding-left: 200px" colspan="2">${_('est')}=${c['bbox'][0]}    ${_('nord')}=${c['bbox'][3]}</td>
    </tr>
    <tr>
      <td class="cell-meta-one" style="padding-left: 200px" colspan="2">${_('est')}=${c['bbox'][2]}    ${_('nord')}=${c['bbox'][1]}</td>
    </tr>
    <tr>
      <td class="cell-meta-one" style="padding-left: 200px" colspan="2">${_('est')}=${c['bbox'][2]}    ${_('nord')}=${c['bbox'][3]}</td>
    </tr>

% else:
    <tr bgcolor="#EFEFEF">
      <th style="text-align:left" colspan="2">${_('Coordinates')} [CH1903]:</th>
    </tr>
    <tr>
      <td class="cell-meta-one" style="padding-left: 200px" colspan="2">${_('est')}=${c['bbox'][0]}    ${_('nord')}=${c['bbox'][1]}</td>
    </tr>
  % if attr['geomtype'] == 'line':
      <tr>
        <td class="cell-meta-one" style="padding-left: 200px" colspan="2">${_('est')}=${c['bbox'][2]}    ${_('nord')}=${c['bbox'][3]}</td>
      </tr>
  % endif
% endif
    <tr bgcolor="#EFEFEF">
      <th style="text-align:left" colspan="2">${_('tt_ch.bazl.markierung')}:</th>
    </tr>
    <tr>
      <td class="cell-meta-one" style="padding-left: 200px" colspan="2">${sanctiontext}</td>
    </tr>
    <tr bgcolor="#EFEFEF">
      <th style="text-align:left" colspan="2">${_('tt_ch.bazl.kartnummer')}: ${attr['lk100']}</th>
    </tr>
  </table>
</div>
<div class="chsdi-map-container table-with-border" style="width: 100%; height: 400px;">
  <div id="map${id}"></div>
</div>

  <script type="text/javascript">
    function showhide (id) {
       var e = document.getElementById(id);
       if(e.style.display == 'block')
          e.style.display = 'none';
       else
          e.style.display = 'block';
    }
    function init${id}() {
      // Create a GeoAdmin Map
      var map = new ga.Map({
      // Define the div where the map is placed
        target: 'map${id}',
        ol3Logo: false,
        tooltip: false,
        view: new ol.View2D({
          // Define the default resolution
          // 10 means that one pixel is 10m width and height
          // 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5, 0.25, 0.1
          resolution: 10,
          center : [(${c['bbox'][0]}+${c['bbox'][2]})/2,(${c['bbox'][1]}+${c['bbox'][3]})/2]

        }),
        controls: ol.control.defaults({zoom: false,attribution: false}),  
        interactions: ol.interaction.defaults({doubleClickZoom: false, dragPan: false, mouseWheelZoom: false})
      });

      var lyr1 = ga.layer.create('ch.swisstopo.pixelkarte-grau');
      var lyr2 = ga.layer.create('org.epsg.grid_21781');
      var lyr3 = ga.layer.create('org.epsg.grid_4326');
      var lyr4 = ga.layer.create('ch.bazl.luftfahrthindernis');

      map.addLayer(lyr1); 
      //map.addLayer(lyr2); 
      //map.addLayer(lyr3);
      //map.addLayer(lyr4);    
      
      var source2 = new ol.source.ImageWMS({
        params: {
          'LAYERS': 'org.epsg.grid_21781'
        },
        ratio: 1,
        url: '${wms_url}'
      });

      var layer2 = new ol.layer.Image({
        source: source2
      });
      map.addLayer(layer2);

      var source3 = new ol.source.ImageWMS({
        params: {
          'LAYERS': 'org.epsg.grid_4326'
        },
        ratio: 1,
        url: '${wms_url}'
      });

      var layer3 = new ol.layer.Image({
        source: source3
      });
      map.addLayer(layer3);

      var source4 = new ol.source.ImageWMS({
        params: {
          'LAYERS': 'ch.bazl.luftfahrthindernis'
        },
        ratio: 1,
        url: '${wms_url}'
      });

      var layer4 = new ol.layer.Image({
        source: source4
      });
      map.addLayer(layer4);


      map.highlightFeature('ch.bazl.luftfahrthindernis', '${c['featureId']}');

    } 
    init${id}();
  </script>
  <style>
    .ol-zoom {
      display: none;
    }
  </style>
  <div style="font-size:12px; text-align:justify;">${_('tt_ch.bazl_longtext')} <br>${_('date')}: ${datenstand}</div>
</body>
</%def>
