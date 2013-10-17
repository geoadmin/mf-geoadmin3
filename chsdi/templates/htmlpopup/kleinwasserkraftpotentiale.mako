<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('klwkp_kwprometer')}</td>       <td>${"%.3f" %c['attributes']['kwprometer'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('laenge_m')}</td>               <td>${int(round(c['attributes']['laenge'])) or '-'}</td></tr>
    <tr><td class="cell-left">${_('klwkp_gwlnr')}</td>            <td>${c['attributes']['gwlnr']}</td></tr>
</%def>
