# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
  <tr><td width="150">${_('objektname')}</td><td>${c['value']}</td></tr>
  <tr><td width="150">${_('objektnr')}</td><td>${c['attributes']['bln_obj'] or '-'}</td></tr>
  <tr><td width="150">${_('flaeche_ha')}</td><td>${c['attributes']['bln_fl'] or '-'}</td></tr>
</%def>
