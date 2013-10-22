<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
  <tr><td class="cell-left">${_('tt_gemeindetypen_TYP_CODE')}</td>    <td>${c['attributes']['typ_code'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_gemeindetypen_TYP_BEZ_D')}</td>
    % if lang in ('de', 'rm', 'en'):
      <td>${c['attributes']['typ_bez_d'] or '-'}</td>
    % else:
      <td>${c['attributes']['typ_bez_f'] or '-'}</td>
    % endif
  </tr>
	<tr><td class="cell-left">${_('tt_bauzonen_gemeindetypen_BFS_NO')}</td>    <td>${c['attributes']['bfs_no'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_bauzonen_gemeindetypen_NAME')}</td>    <td>${c['attributes']['name_']}</td></tr>
  <tr><td class="cell-left">${_('tt_bauzonen_gemeindetypen_KT_NO')}</td>    <td>${c['attributes']['kt_no'] or '-'}</td></tr>
	<tr><td class="cell-left">${_('tt_bauzonen_gemeindetypen_KT_KZ')}</td>    <td>${c['attributes']['kt_kz'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_gemeindetypen_FLAECHE_HA')}</td>    <td>${int(round(c['attributes']['flaeche_ha'])) or '-'}</td></tr>
</%def>
