<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
   <tr><td class="cell-left">${_('objektname')}</td>         <td>${c['attributes']['fmreg_name'] or '-'}</td></tr>
   <tr><td class="cell-left">${_('objektnr')}</td>          <td>${c['attributes']['fmreg_obj'] or '-'}</td></tr>
   <tr><td class="cell-left">${_('gesamtflaeche_ha')}</td>         <td>${c['attributes']['fmreg_gf'] or '-'}</td></tr>
</%def>

