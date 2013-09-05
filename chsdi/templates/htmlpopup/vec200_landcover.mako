<%inherit file="base.mako"/>

<%def name="preview()">
    % if c['attributes']['objname1'].strip() in ['N_P','N_A']:
        -
    % else:
        ${c['attributes']['objname1'] or '-'}
    % endif
</%def>

<%def name="table_body(c,lang)">
    <% c[stable_id] = True %>
    % if c['attributes']['objval'].strip() in ['Gletscher', 'Stadtzentr', 'Sumpf', 'See', 'Siedl', 'Stausee']:
        <tr><th colspan=2>${_(c['attributes']['objval'])}:</th></tr>
        <tr><td width="150">${_('name_lang1')}</td><td>${c['value']}</td></tr>
    
        %if c['attributes']['objval'].strip() in ['Siedl', 'Stadtzentr']:
            <tr><td width="150">${_('einwohnerzahl_b')}</td><td>
            % if c['attributes']['ppi']:
            ${_(c['attributes']['ppi'])}
            % else:
            -
            % endif
            </td></tr>

            <tr><td width="150">${_('einwohnerzahl_s')}</td><td>
            % if c['attributes']['ppl'] < 0:
            -
            % else:
            ${c['attributes']['ppl'] or '-'}
            % endif
            </td></tr>
        % endif
    % else:
    ${_('No additional information for this object type')}: ${_(c['attributes']['objval'])} 
    % endif
</%def>

