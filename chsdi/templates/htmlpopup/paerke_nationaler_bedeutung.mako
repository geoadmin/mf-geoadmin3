<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('objektname')}</td>         <td>${c['attributes']['park_name'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('objektnr')}</td>           <td>${int(c['attributes']['park_nr']) or '-'}</td></tr>
    <tr><td class="cell-left">${_('status')}</td>             <td>${c['attributes']['park_statu'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('flaeche_ha')}</td>         <td>${int(c['attributes']['park_fl']) or '-'}</td></tr>
    <tr><td class="cell-left">${_('gesamtflaeche_ha')}</td>   <td>${int(c['attributes']['park_gf']) or '-'}</td></tr>
</%def>

