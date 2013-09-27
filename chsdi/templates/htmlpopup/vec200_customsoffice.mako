<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <% c[stable_id] = True %>
    <tr><td width="150">${_('name')}</td><td>${c['attributes']['objname']}</td></tr>
</%def>
