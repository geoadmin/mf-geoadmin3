# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
<%
  Key_To_Translate_85 = 'bfs_noas04_' + str(c['attributes']['id_arealstatistik_85'])
  Key_To_Translate_97 = 'bfs_noas04_' + str(c['attributes']['id_arealstatistik_97'])
  Key_To_Translate_09 = 'bfs_noas04_' + str(c['attributes']['id_arealstatistik_09'])
%>


    <tr><td class="cell-left-large">${_('fj85')}</td>                   <td>${c['attributes']['fj85'] or '-'}</td></tr>
    <tr><td class="cell-left-large">${_('id_arealstatistik_85')}</td>   <td>${_(Key_To_Translate_85)}</td></tr>
    <tr><td class="cell-left-large">${_('fj97')}</td>                   <td>${c['attributes']['fj97'] or '-'}</td></tr>
    <tr><td class="cell-left-large">${_('id_arealstatistik_97')}</td>   <td>${_(Key_To_Translate_97)}</td></tr>
    <tr><td class="cell-left-large">${_('fj09')}</td>                   <td>${c['attributes']['fj09'] or '-'}</td></tr>
    <tr><td class="cell-left-large">${_('id_arealstatistik_09')}</td>   <td>${_(Key_To_Translate_09)}</td></tr>
</%def>
