# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="preview()">${c['value'] or '-'}</%def>

<%def name="table_body(c, lang)">
<% c[stable_id] = True %>
    <tr><td width="120">${_('name_terreg')}</td>        <td>${ci['attributes']['name']}</td></tr>
    <tr><td width="120">${_('nummer_terreg')}</td>      <td>${c['featureId'] or '-'}</td></tr>
</%def>
