<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('wsname')}</td>    <td>${c['attributes']['nom'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('wsnummer')}</td>    <td>${c['attributes']['no_surface'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('wstyp')}</td>    <td>${c['attributes']['ty_surface'] or '-'}</td></tr>
</%def>

