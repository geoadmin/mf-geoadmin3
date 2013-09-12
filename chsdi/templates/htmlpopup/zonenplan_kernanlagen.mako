# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="preview()">${c['value']  or '-'}</%def>

<%def name="table_body(c, lang)">
    <% c[stable_id] = True %>
    <tr><td width="100" valign="top">${_('kkw')}</td>   <td>${c['value']}</td></tr>
    <tr><td width="100">${_('zone')}</td>               <td>${c['attributes']['zone'] or '-'}</td></tr>
    <tr><td width="100">${_('sektor')}</td>             <td>${c['attributes']['sektor'] or '-'}</td></tr>
</%def>
