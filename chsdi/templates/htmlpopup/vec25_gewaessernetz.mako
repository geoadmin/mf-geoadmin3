<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td width="150">${_('gewissnr')}</td>       <td>${c['attributes']['gewissnr'] or '-'}</td></tr>
    <tr><td width="150">${_('name')}</td>       <td>${c['attributes']['name'] or '-'}</td></tr>
    <tr><td width="150">${_('typ')}</td>       <td>${c['attributes']['objectval'] or '-'}</td></tr>
    <tr><td width="150">${_('laenge_m')}</td><td>${int(round(c['attributes']['length'])) or '-'} m</td></tr>
</%def>
