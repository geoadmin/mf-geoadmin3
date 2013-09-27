<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <% c[stable_id] = True %>
    <tr><td width="150">${_('construct')}</td><td>${c['attributes']['construct'] or '-'}</td></tr>
    <tr><td width="150">${_('typ')}</td><td>${c['attributes']['objval']}</td></tr>
    <tr><td width="150">${_('toll')}</td><td>${c['attributes']['toll'] or '-'}</td></tr>
</%def>
