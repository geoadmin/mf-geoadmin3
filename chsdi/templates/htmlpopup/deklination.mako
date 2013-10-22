<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
   <tr><td class="cell-left">${_('deklination')}</td><td>${c['attributes']['magne'] or '-'}</td></tr>
</%def>
