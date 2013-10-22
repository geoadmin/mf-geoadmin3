<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('flaeche_ha')}</td>         <td>${round(c['attributes']['tww_fl'],2) or '-'}</td></tr>
    <tr><td class="cell-left">${_('gesamtflaeche_ha')}</td>          <td>${round(c['attributes']['tww_gf'],2) or '-'}</td></tr>
    <tr><td class="cell-left">${_('objektname')}</td>         <td>${c['attributes']['tww_name'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('objektnr')}</td>          <td>${c['attributes']['tww_obj'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('teilobjektnr')}</td>          <td>${c['attributes']['tww_tobj'] or '-'}</td></tr>
</%def>

