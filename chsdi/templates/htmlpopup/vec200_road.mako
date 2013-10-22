<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('construct')}</td><td>${c['attributes']['construct'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('typ')}</td><td>${c['attributes']['objval']}</td></tr>
    <tr><td class="cell-left">${_('toll')}</td><td>${c['attributes']['toll'] or '-'}</td></tr>
</%def>

