<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('objektname')}</td>         <td>${c['attributes']['sb_name'] or '-'}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c['attributes']['sb_obj'] or '-'}</td></tr>
    <tr><td width="150">${_('kanton')}</td>         <td>${c['attributes']['sb_kt'] or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>          <td>${c['attributes']['sb_fl'] or '-'}</td></tr>
    <tr><td width="150">${_('gesamtflaeche_ha')}</td>         <td>${c['attributes']['sb_gf'] or '-'}</td></tr>
</%def>
