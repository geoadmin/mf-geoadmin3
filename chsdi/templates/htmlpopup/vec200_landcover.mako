<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <% c['stable_id'] = True %>
    % if c['attributes']['objval'].strip() in ['Gletscher', 'Stadtzentr', 'Sumpf', 'See', 'Siedl', 'Stausee']:
        <tr><th colspan=2>${_(c['attributes']['objval'])}:</th></tr>
        <tr><td class="cell-left">${_('name_lang1')}</td><td>
         % if c['attributes']['objname1'].strip() in ['N_P','N_A']:
             - 
         % else:   
             ${c['attributes']['objname1'] or '-'}
         % endif     
         </td></tr>
        %if c['attributes']['objval'].strip() in ['Siedl', 'Stadtzentr']:
            <tr><td class="cell-left">${_('einwohnerzahl_b')}</td><td>
            % if c['attributes']['ppi']:
            ${_(c['attributes']['ppi'])}
            % else:
            -
            % endif
            </td></tr>

            <tr><td class="cell-left">${_('einwohnerzahl_s')}</td><td>
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

