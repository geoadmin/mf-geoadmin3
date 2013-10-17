<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
       <tr><td class="cell-left">${_('stoff')}</td><td>${c['attributes']['stoff'] or '-'}</td></tr>
</%def>
