<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <% c[stable_id] = True %>
    <tr><td width="150">${_('city_name')}</td><td>${c['value']}</td></tr>
    <tr><td width="150">${_('einwohnerzahl')}</td><td>
    % if c['attributes']['ppi']:
    ${_(c['attributes']['ppi'])}
    % else:
    -
    % endif
    </td></tr>
</%def>

