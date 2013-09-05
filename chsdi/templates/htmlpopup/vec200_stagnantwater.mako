<%inherit file="base.mako"/>

<%def name="preview()">
    % if c['attributes']['name'].strip() in ['N_P','A_P']:
        -
    % else:
        ${c['attributes']['name'] or '-'}
    % endif
</%def>

<%def name="table_body(c,lang)">
    <% c[stable_id] = True %>
    <tr><td width="150">${_('name')}</td><td>${c['value']}</td></tr>
 
    <tr><td width="150">${_('hoehe_see')}</td><td>
    % if c['attributes']['seesph'] < 0:
    -
    % else:
    ${c['attributes']['seesph'] or '-'}
    % endif
    </td></tr>
</%def>

