<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('tt_wrz_portal_name')}</td>           <td>${c['attributes']['wrz_name'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_wrz_portal_obj')}</td>            <td>${c['attributes']['wrz_obj'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_wrz_portal_schutz')}</td>         <td>${c['attributes']['schutzstatus'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_wrz_portal_best')}</td>           <td>${c['attributes']['bestimmung'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_wrz_portal_schutzzeit')}</td>     <td>${c['attributes']['schutzzeit'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_wrz_portal_grundlage')}</td>      <td>${c['attributes']['grundlage'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_wrz_portal_beschluss')}</td>      <td>${c['attributes']['beschlussjahr'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_wrz_portal_zusatz')}</td>         <td>${c['attributes']['zusatzinformation'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_wrz_portal_kanton')}</td>         <td>${c['attributes']['kanton'] or '-'}</td></tr>
</%def>

