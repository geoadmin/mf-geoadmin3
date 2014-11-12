<%inherit file="base.mako"/>
<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('flaeche_ha')}</td>        <td>${"%.2f"%c['attributes']['am_l_fl'] or '-'} ha</td></tr>
    <tr><td class="cell-left">${_('bereich')}</td>           <td>${c['attributes']['am_l_berei'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('name')}</td>              <td>${c['attributes']['am_l_name']}</td></tr>
    <tr><td class="cell-left">${_('gesamtflaeche_ha')}</td>  <td>${"%.2f"%c['attributes']['am_l_gf'] or '-'} ha</td></tr>
    <tr><td class="cell-left">${_('objektnr')}</td>          <td>${c['attributes']['am_l_obj'] or '-'}</td></tr>
</%def>

