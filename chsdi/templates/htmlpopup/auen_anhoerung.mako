<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('obj_nr')}</td>      <td>${c['attributes']['obj_nr']}</td></tr>
    <tr><td class="cell-left">${_('obj_name')}</td>    <td>${c['attributes']['obj_name'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('flaeche_hm')}</td>     <td>${c['attributes']['flaeche'] or '-'}</td></tr>
</%def>
