<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_abschnitte_abschnr')}</td>      <td>${c['attributes']['arc_id'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_strahler')}</td>                                          <td>${c['attributes']['floz'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_dist_source')}</td>                                       <td>${c['attributes']['main_len'] or '-'}</td></tr>

</%def>
