<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td width="150">${_('flaeche_m2')}</td><td>${int(round(c['attributes']['area'])) or '-'} m2</td></tr>
    <tr><td width="150">${_('perimeter_m')}</td>    <td>${int(round(c['attributes']['perimeter'])) or '-'} m</td></tr>
</%def>
