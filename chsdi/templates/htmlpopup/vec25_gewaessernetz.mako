<%inherit file="base.mako"/>

<%def name="preview()">${c['attributes']['objectval'] or '-'} ${_('typ')}</%def>

<%def name="table_body(c,lang)">
    <tr><td width="150">${_('gewissnr')}</td>       <td>${c['attributes']['gewissnr'] or '-'}</td></tr>
    <tr><td width="150">${_('name')}</td>       <td>${c['attributes']['name'] or '-'}</td></tr>
    <tr><td width="150">${_('typ')}</td>       <td>${c['value'] or '-'}</td></tr>
    <tr><td width="150">${_('laenge_m')}</td><td>${int(round(c['attributes']['length'])) or '-'} m</td></tr>
</%def>
