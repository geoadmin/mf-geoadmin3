<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    % if c['attributes']['fm_obj'] and (str(c['attributes']['fm_obj']) != '0'):
        <tr><td class="cell-left">${_('name')}</td>                 <td>${c['attributes']['fm_name'] or '-'}</td></tr>
        <tr><td class="cell-left">${_('tt_wrz_select_obj')}</td>    <td>${c['attributes']['fm_obj'] or '-'}</td></tr>
        <tr><td class="cell-left">${_('typ')}</td>                  <td>${_('tt_bafu_aulav_fm_typ')}</td></tr>
    % endif

    % if c['attributes']['hm_obj'] and (str(c['attributes']['hm_obj']) != '0'):
        <tr><td class="cell-left">${_('name')}</td>                 <td>${c['attributes']['hm_name'] or '-'}</td></tr>
        <tr><td class="cell-left">${_('tt_wrz_select_obj')}</td>    <td>${c['attributes']['hm_obj'] or '-'}</td></tr>
        <tr><td class="cell-left">${_('typ')}</td>                  <td>${_('tt_bafu_aulav_hm_typ')}</td></tr>
    % endif

    % if c['attributes']['wv_obj'] and (str(c['attributes']['wv_obj']) != '0'):
        <tr><td class="cell-left">${_('name')}</td>                 <td>${c['attributes']['wv_name'] or '-'}</td></tr>
        <tr><td class="cell-left">${_('tt_wrz_select_obj')}</td>    <td>${c['attributes']['wv_obj'] or '-'}</td></tr>
        <tr><td class="cell-left">${_('typ')}</td>                  <td>${_('tt_bafu_aulav_wv_typ')}</td></tr>
    % endif
        
    % if c['attributes']['nat_park'] and (str(c['attributes']['nat_park']) != '0'):
        <tr><td class="cell-left">${_('name')}</td>                 <td>${c['attributes']['nat_park'] or '-'}</td></tr>
        <tr><td class="cell-left">${_('tt_wrz_select_obj')}</td>    <td>${c['attributes']['np_name'] or '-'}</td></tr>
        <tr><td class="cell-left">${_('typ')}</td>                  <td>${_('tt_bafu_aulav_nat_park_typ')}</td></tr>
    % endif
</%def>
