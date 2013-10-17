<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('zielhafen')}</td><td>
        % if c['attributes']['detn'].strip() in ['N_A','N_P']:
        -
        % else:
        ${c['attributes']['detn'] or '-'}
        % endif
    </td></tr>
    <tr><td class="cell-left">${_('jahrezeitenrythmus')}</td><td>${_(c['attributes']['rsu'])}</td></tr>
    <tr><td class="cell-left">${_('nutzungsart_verbindung')}</td><td>${_(c['attributes']['use'])}</td></tr>
</%def>
