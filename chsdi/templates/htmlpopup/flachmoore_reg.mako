<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
   <tr><td width="150">${_('objektname')}</td>         <td>${c['attributes']['fmreg_name'] or '-'}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c['attributes']['fmreg_obj'] or '-'}</td></tr>
    <tr><td width="150">${_('gesamtflaeche_ha')}</td>         <td>${c['attributes']['fmreg_gf'] or '-'}</td></tr>
</%def>

