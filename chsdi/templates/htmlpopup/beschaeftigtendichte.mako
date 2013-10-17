<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('beschaeftigte_ha')}</td>   <td>${int(round(c['attributes']['empt_ha'])) or '-'}</td></tr>
    <tr><td class="cell-left">${_('stand')}</td>              <td>${int(round(c['attributes']['stand'])) or '-'}</td></tr>
</%def>
