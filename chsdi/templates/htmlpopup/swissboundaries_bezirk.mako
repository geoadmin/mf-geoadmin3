<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
<% c['stable_id'] = True %> 
<tr><td class="cell-left">${_('bfsnr')}</td><td>${int(round(c['featureId'])) or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill.name')}</td><td>${c['attributes']['name']}</td></tr>
<tr><td class="cell-left">${_('flaeche_ha')}</td><td>${int(round(c['attributes']['flaeche'])) or '-'} ha</td></tr>
</%def>
