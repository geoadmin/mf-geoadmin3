<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <% c['stable_id'] = True %>
    <tr><td width="150">${_('zielhafen')}</td><td>
        % if c['attributes']['detn'].strip() in ['N_A','N_P']:
        -
        % else:
        ${c['attributes']['detn'] or '-'}
        % endif
    </td></tr>
    <tr><td width="150">${_('jahrezeitenrythmus')}</td><td>${_(c['attributes']['rsu'])}</td></tr>
    <tr><td width="150">${_('nutzungsart_verbindung')}</td><td>${_(c['attributes']['use'])}</td></tr>
</%def>
