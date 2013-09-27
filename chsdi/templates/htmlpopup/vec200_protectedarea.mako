<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td width="150">${_('name')}</td><td>${c['attributes']['name'].strip()}</td></tr>
</%def>

