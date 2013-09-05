<%inherit file="base.mako"/>

<%def name="preview()">
    % if c['attributes']['objname'].strip() in ['N_A','N_P']:
        -
    % else:
        ${c['attributes']['objname'] or '-'}
    % endif
</%def>

<%def name="table_body(c,lang)">
    <% c[stable_id] = True %>
    
    <tr><th colspan=2>${_(c['attributes']['objval'])}:</th></tr>
    <tr><td width="150">${_('name')}</td><td>${c['value']}</td></tr>

    % if c['attributes']['objval'].strip() in ['Kraftwerk']:
    <tr><td width="150">${_('typ_kraftwerk')}</td><td>${_(c['attributes']['ppc'] or '-')}</td></tr>
    % endif

    % if c['attributes']['objval'].strip() in ['Verarbeitungsanlage','Deponie','Pumpwerk']:
    <tr><td width="150">${_('typ_produkt')}</td><td>${_(c['attributes']['pro'] or '-')}</td></tr>
    % endif
</%def>

