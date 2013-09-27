# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <% c['stable_id'] = True %>
    <tr><td width="150">${_('beschreibung')}</td>   <td>${c['attributes']['zkob']}</td></tr>
    <tr><td width="150">${_('x')}</td>              <td>${c['attributes']['x'] or '-'}</td></tr>
    <tr><td width="150">${_('y')}</td>              <td>${c['attributes']['y'] or '-'}</td></tr>
    <tr><td width="150">${_('gemeinde')}</td>       <td>${c['attributes']['gemeinde'] or '-'}</td></tr>
    <tr><td width="150">${_('kanton')}</td>         <td>${c['attributes']['kt_kz'] or '-'}</td></tr>
</%def>
