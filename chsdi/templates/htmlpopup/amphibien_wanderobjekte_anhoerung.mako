<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('obj_nr')}</td>      <td>${c['attributes']['obj_nr'] or '-' }</td></tr>
    <tr><td class="cell-left">${_('obj_name')}</td>    <td>${c['attributes']['obj_name'] or '-'}</td></tr> 
</%def>
