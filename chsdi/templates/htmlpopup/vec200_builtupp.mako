<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('city_name')}</td><td>${c['attributes']['objname']}</td></tr>
    <tr><td class="cell-left">${_('einwohnerzahl')}</td><td>
    % if c['attributes']['ppi']:
    ${_(c['attributes']['ppi'])}
    % else:
    -
    % endif
    </td></tr>
</%def>

