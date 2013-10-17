<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td class="cell-left">${_('flaeche_ha')}</td><td>${int(round(c['attributes']['area'])) or '-'} ha</td></tr>
    <tr><td class="cell-left">${_('perimeter_m')}</td>    <td>${int(round(c['attributes']['perimeter'])) or '-'} m</td></tr>
</%def>
