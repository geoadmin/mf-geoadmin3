<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('holz_region')}</td>    <td>${c['attributes']['wirtschaft'] or '-'}</td></tr>
    <tr><td width="150">${_('totholz')}</td>    <td>${c['attributes']['totholzvol'] or '-'}</td></tr>
</%def>

