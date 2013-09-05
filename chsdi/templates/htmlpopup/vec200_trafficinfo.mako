<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <% c[stable_id] = True %>
    <tr><td width="150">${_('name')}</td><td>${c['value']}</td></tr>
    <tr><td width="150">${_('typ')}</td><td>${c['attributes']['objval'] or '-'}</td></tr>
</%def>
