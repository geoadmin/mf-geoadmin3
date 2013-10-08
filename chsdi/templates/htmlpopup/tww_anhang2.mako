<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('objektname')}</td>         <td>${c['attributes']['tww_name'] or '-'}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c['attributes']['tww_obj'] or '-'}</td></tr>
    <tr><td width="150">${_('teilobjektnr')}</td>          <td>${c['attributes']['tww_tobj'] or '-'}</td></tr>
</%def>

