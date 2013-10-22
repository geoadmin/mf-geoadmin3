<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('konf_objekt')}</td><td>${c['attributes']['fco']}</td></tr>
    <tr><td class="cell-left">${_('lage_objekt')}</td><td>${_(c['attributes']['loc'] or '-')}</td></tr>
    <tr><td class="cell-left">${_('typ_transpo_produkt')}</td><td>
    % if c['attributes']['pro'].strip() in ['Null / No Value']:
    -
    % else:
    ${_(c['attributes']['pro'] or '-')}
    % endif
    </td></tr>
</%def>

