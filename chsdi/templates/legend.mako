# -*- coding: utf-8 -*-

<%
  c = pageargs['layer']
  hasLegend = pageargs['hasLegend']
  host = request.host_url + request.uscript_name
  lang = request.lang
  pdf_legends = ('ch.swisstopo.geologie-eiszeit-lgm-raster', 'ch.swisstopo.geologie-geologische_karte',
                    'ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen',
                    'ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet',
                    'ch.swisstopo.geologie-tektonische_karte', 'ch.astra.ivs-gelaendekarte',
                    'ch.astra.ausnahmetransportrouten', 'ch.bazl.luftfahrtkarten-icao',
                    'ch.bazl.segelflugkarte', 'ch.kantone.cadastralwebmap-farbe',
                    'ch.swisstopo.swisstlm3d-karte')
  if c['idBod'] in pdf_legends:
      legend_url_pdf = host + '/static/images/legends/' + c['idBod'] + '_' + lang + '_big.pdf'
  else:
      legend_url_pdf = False
  legend_url = host + '/static/images/legends/' + c['idBod'] + '_' + lang + '.png'
  times = c['attributes']['dataStatus']
%>
<div class="legend-container">
<div class="legend-header">
  <p class='bod-title'><span>${c['fullName']}</span> (${c['attributes']['dataOwner']})</p>
  <p class='office-provider'>${c['attributes']['inspireUpperName']} -> ${c['attributes']['inspireName']}</p>
  <p class='legend-abstract'>${c['attributes']['abstract'] or ''}</p>
</div>
<div class="legend-footer">
% if hasLegend:
  <br>
  <span>${_('Legend')}</span><br>
% if legend_url_pdf:
  <a href="${legend_url_pdf}" target="_blank"><img src="${legend_url}"></img></a><br> 
% else:
  <img src=${legend_url} alt="layer legend img"/><br><br>
% endif
% endif
  <span>${_('Information')}</span><br>
  <table>
    <tr><td>${_('geobasisdatensatz')}</td> <td>${c['attributes']['bundCollection'] or '-'}</td></tr>
    <tr><td>${_('Gueltiger Massstabsbereich')}</td> <td>${c['attributes']['scaleLimit']}</td></tr>
    <tr><td>${_('Metadaten')}</td>
% if c['idGeoCat']:
  % if lang in ('de', 'rm'):
      <td><a target="_blank" href="http://www.geocat.ch/geonetwork/srv/deu/metadata.show?uuid=${c['idGeoCat']}&currTab=simple">
  % elif lang in ('fr', 'it'):
      <td><a target="_blank" href="http://www.geocat.ch/geonetwork/srv/fra/metadata.show?uuid=${c['idGeoCat']}&currTab=simple">
  % else:
      <td><a target="_blank" href="http://www.geocat.ch/geonetwork/srv/eng/metadata.show?uuid=${c['idGeoCat']}&currTab=simple">
  % endif
      ${_('layer_geocat_text')}</a></td>
% else:
      <td>-</td>
% endif
    </tr>
    <tr>
    <td>${_('Datenbezug')}</td>
% if c['attributes']['downloadUrl']:
      <td><a href="${c['attributes']['downloadUrl']}" target="new">${_('layer_url_download_text')}</a></td>
% else:
      <td>-</td>
% endif
    </tr>
    <tr>
      <td>${_('Thematisches Geoportal')}</td>
% if c['attributes']['urlApplication']:
      <td><a href="${c['attributes']['urlApplication']}" target="new">${_('layer_url_portal_text')}</a></td>
% else:
      <td>-</td>
% endif
    </tr>
    <tr>
      <td>${_('WMS Dienst')}</td>
% if c['attributes']['wmsUrlResource']:
      <td><a href="${c['attributes']['wmsUrlResource']}" target="new">${_('wms_resource_text')}</a></td>
% else:
      <td>-</td>
% endif
    </tr>
    <tr>
      <td>${_('Datenstand')}</td>
% if times:
  % if len(times) == 4:
      <td>${times}</td>
  % elif len(times) == 6:
      <td>${times[4:]}.${times[:4]}</td>
  % elif len(times) == 8:
      <td>${times[6:]}.${times[4:6]}.${times[:4]}</td>
  % elif len(times) == 9:
      <td>${times}</td>
  % elif len(times) ==13:
      <td>${times[4:6]}.${times[:4]}-${times[11:]}.${times[7:11]}</td>
  % elif len(times) ==17:
      <td>${times[6:8]}.${times[4:6]}.${times[:4]}-${times[15:]}.${times[13:15]}.${times[9:13]}</td>
  % endif
% else:
      <td>-</td>
% endif
    </tr>    
  </table>
</div>
</div>
