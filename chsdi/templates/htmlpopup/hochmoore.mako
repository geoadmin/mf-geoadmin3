<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('objektname')}</td>         <td>${c['attributes']['hm_name']}</td></tr>
    <tr><td class="cell-left">${_('objektnr')}</td>           <td>${c['attributes']['hm_obj'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('typ')}</td>                <td>${c['attributes']['hm_typ'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('flaeche_ha')}</td>         <td>${c['attributes']['hm_fl'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('kartiereinheit')}</td>     <td>${c['attributes']['hm_ke'] or '-'}</td></tr>
</%def>

