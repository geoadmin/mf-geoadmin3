<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td width="150">${_('laenge_m')}</td>          <td>${int(round(c['attributes']['length'])) or '-'}</td></tr>
</%def>
