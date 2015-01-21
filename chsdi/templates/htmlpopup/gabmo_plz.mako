<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('ch.swisstopo-vd.ortschaftenverzeichnis_plz.plz')}</td>    <td>${c['attributes']['plz'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('zusziff')}</td>
        % if len(str(c['attributes']['zusziff'])) == 1:
        <td>${'0' + str(c['attributes']['zusziff'])}</td>
        % else:
        <td>${c['attributes']['zusziff'] or '00'}</td>
        % endif
        </tr>
    <tr><td class="cell-left">${_('langtext')}</td>    <td>${c['attributes']['langtext']}</td></tr>
</%def>
