<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('holz_region')}</td>    <td>${c['attributes']['wirtschaft'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('totholz')}</td>    <td>${c['attributes']['totholzvol'] or '-'}</td></tr>
</%def>

