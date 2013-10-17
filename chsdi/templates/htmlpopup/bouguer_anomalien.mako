<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
   <tr><td class="cell-left">${_('et_fromatt_bouguer')}</td><td>${c['attributes']['et_fromatt'] or '-'}</td></tr>
</%def>
