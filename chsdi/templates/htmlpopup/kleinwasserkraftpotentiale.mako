<%inherit file="base.mako"/>

#<%def name="preview()">${c['attributes']['gwlnr'] or '-'}</%def>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('klwkp_kwprometer')}</td>    <td>${"%.3f" %c['attributes']['kwprometer'] or '-'}</td></tr>
    <tr><td width="150">${_('laenge_m')}</td>    <td>${int(round(c['attributes']['laenge'])) or '-'}</td></tr>
    <tr><td width="150">${_('klwkp_gwlnr')}</td>    <td>${c['value']}</td></tr>
</%def>
