<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td class="cell-left">${_('name')}</td><td>${c['attributes']['name'].strip()}</td></tr>
</%def>

