<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('klwkp_kwprometer')}</td>       <td>${"%.3f" %c['attributes']['kwprometer'] or '-'}</td></tr>
    <tr><td width="150">${_('laenge_m')}</td>               <td>${int(round(c['attributes']['laenge'])) or '-'}</td></tr>
    <tr><td width="150">${_('klwkp_gwlnr')}</td>            <td>${c['attributes']['gwlnr']}</td></tr>
</%def>
