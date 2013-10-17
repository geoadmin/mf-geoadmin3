# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('beschreibung')}</td>   <td>${c['attributes']['zkob']}</td></tr>
    <tr><td class="cell-left">${_('x')}</td>              <td>${c['attributes']['x'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('y')}</td>              <td>${c['attributes']['y'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('gemeinde')}</td>       <td>${c['attributes']['gemeinde'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('kanton')}</td>         <td>${c['attributes']['kt_kz'] or '-'}</td></tr>
</%def>
