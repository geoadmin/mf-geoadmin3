# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
  <tr><td class="cell-left">${_('objektname')}</td><td>${c['attributes']['bln_name']}</td></tr>
  <tr><td class="cell-left">${_('objektnr')}</td><td>${c['attributes']['bln_obj'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('flaeche_ha')}</td><td>${c['attributes']['bln_fl'] or '-'}</td></tr>
</%def>
