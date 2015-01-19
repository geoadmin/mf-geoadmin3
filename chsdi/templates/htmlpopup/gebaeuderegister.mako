# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('ch.bfs.gebaeude_wohnungs_register.egid')}</td>       <td>${c['attributes']['egid'] or '-'}</td></tr>
    % if c['attributes']['strname1'] <> '':
    <tr><td class="cell-left">${_('ch.bfs.gebaeude_wohnungs_register.strname1')}</td>    <td>${c['attributes']['strname1']}</td></tr>
    % else:
    <tr><td class="cell-left">${_('ch.bfs.gebaeude_wohnungs_register.strname1')}</td>    <td>${c['attributes']['deinr'] or '-'}</td></tr>
    % endif
    <tr><td class="cell-left">${_('ch.bfs.gebaeude_wohnungs_register.deinr')}</td>         <td>${c['attributes']['deinr'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.bfs.gebaeude_wohnungs_register.plz4')}</td>        <td>${c['attributes']['plz4'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.bfs.gebaeude_wohnungs_register.plzname')}</td>        <td>${c['attributes']['plzname'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.bfs.gebaeude_wohnungs_register.gdename')}</td>   <td>${c['attributes']['gdename'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('bfsnr')}</td>      <td>${c['attributes']['gdenr'] or '-'}</td></tr>
</%def>
