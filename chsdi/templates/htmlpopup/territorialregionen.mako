# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('name_terreg')}</td>        <td>${c['attributes']['name']}</td></tr>
    <tr><td class="cell-left">${_('nummer_terreg')}</td>      <td>${c['featureId'] or '-'}</td></tr>
</%def>
