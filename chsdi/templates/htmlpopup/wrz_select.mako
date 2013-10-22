<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('tt_wrz_select_name')}</td>              <td>${c['attributes']['jb_name'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_wrz_select_obj')}</td>               <td>${c['attributes']['jb_obj'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_wrz_select_schutz')}</td>            <td>${c['attributes']['schutzstatus'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_wrz_select_best')}</td>              <td>${c['attributes']['bestimmung'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_wrz_select_schutzzeit')}</td>        <td>${c['attributes']['schutzzeit'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_wrz_select_grundlage')}</td>         <td>${c['attributes']['grundlage'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_wrz_select_zusatz')}</td>            <td>${c['attributes']['zusatzinformation'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_wrz_select_kanton')}</td>            <td>${c['attributes']['kanton'] or '-'}</td></tr>
</%def>

