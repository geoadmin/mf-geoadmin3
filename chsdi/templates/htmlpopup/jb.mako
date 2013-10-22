# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
  <tr><td class="cell-left">${_('objektname')}</td><td>${c['attributes']['jb_name']}</td></tr>
  <tr><td class="cell-left">${_('objektnr')}</td><td>${c['attributes']['jb_obj'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('kategorie')}</td><td>${c['attributes']['jb_kat'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('flaeche_ha')}</td><td>${c['attributes']['jb_fl'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('gesamtflaeche_ha')}</td><td>${c['attributes']['jb_gf'] or '-'}</td></tr>
</%def>
