<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
<% c[stable_id] = True %> 
<tr><td width="150">${_('bfsnr')}</td><td>${int(round(c['attributes']['id'])) or '-'}</td></tr>
<tr><td width="150">${_('name')}</td><td>${c['attributes']['name']}</td></tr>
<tr><td width="150">${_('flaeche_ha')}</td><td>${int(round(c['attributes']['flaeche'])) or '-'} ha</td></tr>
</%def>
