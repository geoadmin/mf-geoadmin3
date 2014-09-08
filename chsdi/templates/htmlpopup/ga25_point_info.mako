<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td class="cell-left">${_('geocover_id_geol')}</td><td>${c['attributes']['id_geol'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('geocover_description')}</td><td>${c['attributes']['description'] or '-'}</td></tr>
</%def>
