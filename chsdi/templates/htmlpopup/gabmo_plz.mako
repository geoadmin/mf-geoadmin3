<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <% c[stable_id] = True %>
    <tr><td width="150">${_('plz')}</td>    <td>${c['attributes']['plz'] or '-'}</td></tr>
    <tr><td width="150">${_('zusziff')}</td>
        % if len(str(c['attributes']['zusziff'])) == 1:
        <td>${'0' + str(c['attributes']['zusziff'])}</td>
        % else:
        <td>${c['attributes']['zusziff'] or '00'}</td>
        % endif
        </tr>
    <tr><td width="150">${_('langtext')}</td>    <td>${c['attributes']['langtext']}</td></tr>
</%def>
