<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <% c['stable_id'] = True %>
    
    <tr><th colspan=2>${_(c['attributes']['objval'])}:</th></tr>
    <tr><td class="cell-left">${_('name')}</td><td>
    % if c['attributes']['objname'].strip() in ['N_A','N_P']:
        -
    % else:
        ${c['attributes']['objname'] or '-'}
    % endif
    </td></tr>
    % if c['attributes']['objval'].strip() in ['Kraftwerk']:
    <tr><td class="cell-left">${_('typ_kraftwerk')}</td><td>${_(c['attributes']['ppc'] or '-')}</td></tr>
    % endif

    % if c['attributes']['objval'].strip() in ['Verarbeitungsanlage','Deponie','Pumpwerk']:
    <tr><td class="cell-left">${_('typ_produkt')}</td><td>${_(c['attributes']['pro'] or '-')}</td></tr>
    % endif
</%def>

