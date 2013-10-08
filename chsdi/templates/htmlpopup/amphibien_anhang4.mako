<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('objektname')}</td>         <td>${c['attributes']['name'] or '-'}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c['attributes']['obnr'] or '-'}</td></tr>
</%def>

