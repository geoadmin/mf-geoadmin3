# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <% c['stable_id'] = True %>
    <tr>
      <td class="cell-left">${_('kkw')}</td>
      <td>${c['attributes']['name']}</td></tr>
    <tr>
      <td class="cell-left">${_('kkw')}>${_('zone')}</td>
      <td>${c['attributes']['zone'] or '-'}</td></tr>
    <tr>
      <td class="cell-left">${_('sektor')}</td>
      <td>${c['attributes']['sektor'] or '-'}</td>
    </tr>
</%def>
