<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
   <tr><td class="cell-left">${_('contour_totalintensitaet')}</td><td>${c['attributes']['contour'] or '-'}</td></tr>
</%def>
