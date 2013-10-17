<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('objektname')}</td>         <td>${c['attributes']['ra_name'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('objektnr')}</td>          <td>${c['attributes']['ra_obj'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('flaeche_ha')}</td>          <td>${c['attributes']['ra_fl'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('gesamtflaeche_ha')}</td>         <td>${c['attributes']['ra_gf'] or '-'}</td></tr>
</%def>

