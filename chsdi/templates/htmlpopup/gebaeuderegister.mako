# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

##<%def name="preview()">${c.feature.strname1 or '-'} ${c.feature.deinr or '-'}</%def>
<%def name="preview()">${c['value'] or '-'}</%def>

<%def name="table_body(c, lang)">
    <% c[stable_id] = True %>
    <tr><td width="150">${_('egid')}</td>       <td>${c['attributes']['egid'] or '-'}</td></tr>
    <tr><td width="150">${_('strasse')}</td>    <td>${c['value'] or '-'}</td></tr>
    <tr><td width="150">${_('nr')}</td>         <td>${c['attributes']['deinr'] or '-'}</td></tr>
    <tr><td width="150">${_('plz')}</td>        <td>${c['attributes']['plz4'] or '-'}</td></tr>
    <tr><td width="150">${_('ort')}</td>        <td>${c['attributes']['plzname'] or '-'}</td></tr>
    <tr><td width="150">${_('gemeinde')}</td>   <td>${c['attributes']['gdename'] or '-'}</td></tr>
    <tr><td width="150">${_('bfsnr')}</td>      <td>${c['attributes']['gdenr'] or '-'}</td></tr>
</%def>
