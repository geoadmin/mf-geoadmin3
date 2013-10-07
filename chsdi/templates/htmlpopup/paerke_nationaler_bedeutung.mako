<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('objektname')}</td>         <td>${c['attributes']['park_name'] or '-'}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>           <td>${int(c['attributes']['park_nr']) or '-'}</td></tr>
    <tr><td width="150">${_('status')}</td>             <td>${c['attributes']['park_statu'] or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>         <td>${c['attributes']['park_fl'] or '-'}</td></tr>
    <tr><td width="150">${_('gesamtflaeche_ha')}</td>   <td>${c['attributes']['park_gf'] or '-'}</td></tr>
</%def>

