<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('wsname')}</td>    <td>${c['attributes']['nom'] or '-'}</td></tr>
    <tr><td width="150">${_('wsnummer')}</td>    <td>${c['attributes']['no_surface'] or '-'}</td></tr>
    <tr><td width="150">${_('wstyp')}</td>    <td>${c['attributes']['ty_surface'] or '-'}</td></tr>
</%def>

