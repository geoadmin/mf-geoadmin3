<%inherit file="base.mako"/>

<%def name="preview()">${_('feature')}</%def>

<%def name="table_body(c,lang)">
    <tr><td width="150">${_('flaeche_ha')}</td><td>${int(round(c['attributes']['area'])) or '-'} ha</td></tr>
    <tr><td width="150">${_('perimeter_m')}</td>    <td>${int(round(c['attributes']['perimeter'])) or '-'} m</td></tr>
</%def>
