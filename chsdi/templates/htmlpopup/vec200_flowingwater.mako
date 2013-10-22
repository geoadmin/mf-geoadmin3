<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <% c[stable_id] = True %>
    <tr><td class="cell-left">${_('schiffbarkeit')}</td><td>
    % if c['attributes']['exs'] == 'Not applicable':
    ${_('No')}
    % elif c['attributes']['exs'] == 'Naviguable and opera':
    ${_('Yes')}
    % else:
    -
    % endif
    </td></tr>
    
    <tr><td class="cell-left">${_('hydrografische_herkunft')}</td><td>
    % if c['attributes']['hoc']:
    ${_(c['attributes']['hoc'])}
    % else:
    -
    % endif
    </td></tr>
    <tr><td class="cell-left">${_('name')}</td>
    % if c['attributes']['name'].strip()== 'N_P':
      <td>-</td>
    % else:
      <td>${c['attributes']['name'].strip()}</td>
    % endif
    </tr>
</%def>

