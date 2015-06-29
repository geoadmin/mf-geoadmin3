# -*- coding: utf-8 -*-

<%inherit file="base.mako"/> 

<%def name="table_body(c, lang)">
<tr>
<td class="cell-left">${_('windenergieanlage')}</td>
<td>${c['attributes']['fac_name'] or '-'}</td>
</tr>
<tr>
  <td class="cell-left">${_('typ')}</td>
 % if lang=='fr':
  <td>${c['attributes']['fac_type_fr'] or '-'}</td>
 % elif lang=='it':
  <td>${c['attributes']['fac_type_it'] or '-'}</td>
 % else:
  <td>${c['attributes']['fac_type_de'] or '-'}</td>
 %endif 
  </td>
</tr>
</%def>

<%def name="extended_info(c, lang)">
<title>${_('ch.bfe.windenergieanlagen')}</title>
<body onload="init()">
<div class="zsborder">
<%
 import xml.etree.ElementTree as ET
 if c['attributes']['fac_xml_prod'] != None:
   tree = ET.fromstring(c['attributes']['fac_xml_prod'])
   productions = []
   for prod in tree:
     year=prod[0].text
     kwh = prod[1].text
     productions.append((year,kwh))

 treeturb = ET.fromstring(c['attributes']['turbines'].encode('utf-8'))
 turbs = []
 for tur in treeturb:
     turid=tur[0].text
     name=tur[1].text
     alti=tur[2].text 
     leis = tur[3].text
     bauj = tur[4].text
     manu = tur[5].text
     mode = tur[6].text
     roto = tur[7].text
     hoeh = tur[8].text
     statde=tur[9].text
     statfr=tur[10].text
     statit=tur[11].text
     turbs.append((manu,mode,roto,hoeh,leis,bauj,statde,statfr,statit))
%>
<%
   import locale
   locale.setlocale(locale.LC_ALL, 'fr_CH.utf-8')
%>   
<h3>${_('windenergieangaben')}</h3>
<table class="table-with-border kernkraftwerke-extended" cellpadding="5">
  <tr>
    <th class="cell-meta">
      ${_('tt_ch.bfe.abgeltung-wasserkraftnutzung_name')}
    </th>
    <td>
      ${c['attributes']['fac_name']}
    </td>
  </tr>
  <tr>
    <th class="cell-meta">${_('windenergiebetreiber')}</th>
    <td>
      ${c['attributes']['fac_operator']}
    </td>
  </tr>
  <tr>
    <th class="cell-meta">${_('website')}</th>
      % if c['attributes']['fac_website'] == None:
         <td>-</td>
      % else:
         <td><a target="_blank" href="${c['attributes']['fac_website']}">${c['attributes']['fac_website']}</a></td>
      % endif
  </tr>
  <tr>
    <th class="cell-meta">${_('installierteleistung')}</th>
      % if c['attributes']['fac_power'] == None:
         <td>-</td>
      % else:
         % if str(c['attributes']['fac_power'])[-1:] == "0":
            <td>${str(c['attributes']['fac_power'])[:len(str(c['attributes']['fac_power']))-2] or '-'} kW</td>
         % else:   
            <td>${c['attributes']['fac_power'] or '-'} kW</td>
         % endif
      % endif
  </tr>
</table>
<h3> ${_('produktionsdaten')}</h3>
% if c['attributes']['fac_xml_prod'] != None:
<table class="table-with-border kernkraftwerke-extended" cellpadding="5">
  <tr>
    <th class="cell-meta">
      ${_('tt_emission_datum')}
    </th>
    <th class="cell-meta">
      ${_('produktion')}
    </th>
  </tr>
% for production in productions:
      <tr><td>${production[0]}</td><td>${locale.format('%d',int(production[1]),1)} kWh</td></tr>
% endfor
</table>
<table class="table-with-border kernkraftwerke-extended" cellpadding="5">
<tr style="max-width: 100%;height: auto;"><img class="image"
src="http://www.bfe-gis.admin.ch/bilder/ch.bfe.windenergieanlagen/chart_${c['attributes']['fac_initial']}.png" alt=""/></tr>
</table>
% else:
<h3> - </h3>
% endif
<h3> ${_('windturbinenangaben')}</h3>       
<table class="table-with-border kernkraftwerke-extended" cellpadding="1">
   <colgroup>
      <col width=13%>
      <col width=12%>
      <col width=16%>
      <col width=13%>
      <col width=13%>
      <col width=14%>
      <col width=19%>
   </colgroup>
<tr>
  <th class="cell-meta">${_('hersteller')}</th>
  <th class="cell-meta">${_('modell')}</th>
  <th class="cell-meta">${_('rotordurchmesser')}</th>
  <th class="cell-meta">${_('nabenhoehe')}</th>
  <th class="cell-meta">${_('installierteleistung')}</th>
  <th class="cell-meta">${_('baujahr_de_fr')}</th>
  <th class="cell-meta">${_('statut')}</th>
</tr>
% if lang=='fr':
% for tu in turbs:
      <tr><td>${tu[0]}</td><td>${tu[1]}</td><td>${tu[2]} m</td><td>${tu[3]} m</td><td>${tu[4]} kW</td><td>${tu[5]}</td><td>${tu[7]}</td></tr>
% endfor
% elif lang=='it':
% for tu in turbs:
      <tr><td>${tu[0]}</td><td>${tu[1]}</td><td>${tu[2]} m</td><td>${tu[3]} m</td><td>${tu[4]} kW</td><td>${tu[5]}</td><td>${tu[8]}</td></tr>
% endfor
% else:
% for tu in turbs:
      <tr><td>${tu[0]}</td><td>${tu[1]}</td><td>${tu[2]} m</td><td>${tu[3]} m</td><td>${tu[4]} kW</td><td>${tu[5]}</td><td>${tu[6]}</td></tr>
% endfor
% endif
</table>
<br>
<table class="table-with-border kernkraftwerke-extended" cellpadding="5">
<tr><td id="image" align="center"><img width=100% height= auto class="image"
src="http://www.bfe-gis.admin.ch/bilder/ch.bfe.windenergieanlagen/img_${c['attributes']['fac_initial']}.jpg"
alt=""/></td>
<td id="map" height=400px></td>
</tr>
</table>
</div>
   <script type="text/javascript">
     function init() {
       // Create a GeoAdmin Map
       var map = new ga.Map({
       // Define the div where the map is placed
           target: 'map',
           view: new ol.View({
           // Define the default resolution
           // 10 means that one pixel is 10m width and height
           // List of resolution of the WMTS layers:
           // 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5, 0.25, 0.1
           resolution: 10,
           // Define a coordinate CH1903 (EPSG:21781) for the center of the view
           center: [${c['attributes']['fac_y']},${c['attributes']['fac_x']}]
           }),
           tooltip: false,
//           interactions: ol.interaction.defaults({doubleClickZoom: false, dragPan: false, mouseWheelZoom: false})
       });

       var lyr = ga.layer.create('ch.swisstopo.pixelkarte-farbe');
       var lyr2 = ga.layer.create('ch.bfe.windenergieanlagen');

       map.addLayer(lyr); map.addLayer(lyr2);
     }
   </script>
</body>
</%def>
