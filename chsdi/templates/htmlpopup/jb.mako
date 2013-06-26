# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
  <tr><td width="150">${_('objektname')}</td><td>${c['value']}</td></tr>
  <tr><td width="150">${_('objektnr')}</td><td>${c['attributes']['jb_obj'] or '-'}</td></tr>
  <tr><td width="150">${_('kategorie')}</td><td>${c['attributes']['jb_kat'] or '-'}</td></tr>
  <tr><td width="150">${_('flaeche_ha')}</td><td>${c['attributes']['jb_fl'] or '-'}</td></tr>
  <tr><td width="150">${_('gesamtflaeche_ha')}</td><td>${c['attributes']['jb_gf'] or '-'}</td></tr>
</%def>
