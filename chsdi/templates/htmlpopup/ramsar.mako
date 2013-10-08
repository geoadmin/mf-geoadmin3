<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <% c['stable_id'] = True %>
    <tr><td width="150">${_('objektname')}</td>         <td>${c['attributes']['ra_name'] or '-'}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c['attributes']['ra_obj'] or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>          <td>${c['attributes']['ra_fl'] or '-'}</td></tr>
    <tr><td width="150">${_('gesamtflaeche_ha')}</td>         <td>${c['attributes']['ra_gf'] or '-'}</td></tr>
</%def>

