<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td class="cell-left">${_('ziegeleien')}</td><td>${c['attributes']['ziegelei'] or '-'}</td></tr>
</%def>
