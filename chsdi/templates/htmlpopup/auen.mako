<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('name')}</td>           <td>${c['attributes']['au_name']}</td></tr>
    <tr><td class="cell-left">${_('objektnr')}</td>       <td>${c['attributes']['au_obj'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('typ')}</td>            <td>${c['attributes']['au_objtyp'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('flaeche_ha')}</td>     <td>${c['attributes']['au_fl'] or '-'}</td></tr>
</%def>

