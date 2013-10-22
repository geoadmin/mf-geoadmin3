<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td class="cell-left">${_('gewissnr')}</td>       <td>${c['attributes']['gewissnr'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('name')}</td>       <td>${c['attributes']['name'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('typ')}</td>       <td>${c['attributes']['objectval'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('laenge_m')}</td><td>${int(round(c['attributes']['length'])) or '-'} m</td></tr>
</%def>
