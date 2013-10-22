<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
       <tr><td class="cell-left">${_('ziegeleien')}</td><td>${c['attributes']['ziegelei_2'] or '-'}</td></tr>
</%def>
