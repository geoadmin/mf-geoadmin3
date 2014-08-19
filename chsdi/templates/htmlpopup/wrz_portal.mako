<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('tt_wrz_portal_name')}</td>           <td>${c['attributes']['wrz_name'] or '-'} (${_('wrz_obj')} ${c['attributes']['wrz_obj'] or '-'})</td></tr>
    <tr><td class="cell-left">${_('tt_wrz_portal_schutz')}</td>         <td>${c['attributes']['schutzstatus'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_wrz_portal_best')}</td>           <td>${c['attributes']['bestimmung'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_wrz_portal_schutzzeit')}</td>     <td>${c['attributes']['schutzzeit'] or '-'}</td></tr>
% if  c['attributes']['grundlage'].strip() !='':
    <tr><td class="cell-left">${_('tt_wrz_portal_grundlage')}</td>      <td>${c['attributes']['grundlage'] or '-'}</td></tr>
% else:
    <tr><td class="cell-left">${_('tt_wrz_portal_grundlage')}</td>      <td>-</td></tr>
% endif    
% if  c['attributes']['beschlussjahr'].strip() in ('0',''):
    <tr><td class="cell-left">${_('tt_wrz_portal_beschluss')}</td>      <td>-</td></tr>
% else:
    <tr><td class="cell-left">${_('tt_wrz_portal_beschluss')}</td>      <td>${c['attributes']['beschlussjahr'] or '-'}</td></tr>
% endif    
% if  c['attributes']['zusatzinformation'].strip() !='':
    <tr><td class="cell-left">${_('tt_wrz_portal_zusatz')}</td>         <td>${c['attributes']['zusatzinformation'] or '-'}</td></tr>
% else:
    <tr><td class="cell-left">${_('tt_wrz_portal_zusatz')}</td>         <td>-</td></tr>
% endif    
    <tr><td class="cell-left">${_('tt_wrz_portal_kanton')}</td>         <td>${c['attributes']['kanton'] or '-'}</td></tr>
</%def>

