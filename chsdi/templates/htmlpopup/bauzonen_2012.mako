<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
  <tr><td class="cell-left">${_('tt_bauzonen_CH_Code_HN')}</td>    <td>${c['attributes']['ch_code_hn'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_bauzonen_CH_BEZ_D')}</td>
    % if lang in ('de', 'rm', 'en'):
      <td>${c['attributes']['ch_bez_d'] or '-'}</td>
    % else:
      <td>${c['attributes']['ch_bez_f'] or '-'}</td>
    % endif
  </tr>
	<tr><td class="cell-left">${_('tt_bauzonen_gemeindetypen_BFS_NO')}</td>    <td>${c['attributes']['bfs_no'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_bauzonen_gemeindetypen_NAME')}</td>    <td>${c['attributes']['name_']}</td></tr>
  <tr><td class="cell-left">${_('tt_bauzonen_gemeindetypen_KT_NO')}</td>    <td>${c['attributes']['kt_no'] or '-'}</td></tr>
	<tr><td class="cell-left">${_('tt_bauzonen_gemeindetypen_KT_KZ')}</td>    <td>${c['attributes']['kt_kz'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_bauzonen_FLAECHE')}</td>    <td>${int(round(c['attributes']['flaeche'])) or '-'}</td></tr>
</%def>
