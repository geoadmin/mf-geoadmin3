<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('objektname')}</td>        <td>${c['attributes']['em_name'] or '-'}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c['attributes']['em_obj'] or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>        <td>${round(c['attributes']['em_gf']) or '-'}</td></tr>
</%def>

