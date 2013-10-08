<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('objektname')}</td>         <td>${c['featureId']}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c['attributes']['wv_obj'] or '-'}</td></tr>
    <tr><td width="150">${_('kategorie')}</td>         <td>${c['attributes']['wv_kat'] or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>          <td>${round(c['attributes']['wv_fl']) or '-'}</td></tr>
    <tr><td width="150">${_('gesamtflaeche_ha')}</td>         <td>${round(c['attributes']['wv_gf']) or '-'}</td></tr>
</%def>

