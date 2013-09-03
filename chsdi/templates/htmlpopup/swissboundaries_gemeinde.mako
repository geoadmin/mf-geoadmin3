# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c[stable_id] = True %> 
<tr><td width="150">${_('bfsnr')}</td><td>${int(round(c['attributes']['id'])) or '-'}</td></tr>
<tr><td width="150">${_('name')}</td><td>${c['value']}</td></tr>
<tr><td width="150">${_('flaeche_ha')}</td><td>${int(round(c['attributes']['gemflaeche'])) or '-'} ha</td></tr>
<tr><td width="150">${_('perimeter_m')}</td><td>${int(round(c['attributes']['perimeter'])) or '-'} m</td></tr>
</%def>
