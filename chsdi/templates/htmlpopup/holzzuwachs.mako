<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('holzzuwachs')}</td>    <td>${c['attributes']['holzzuwachs'] or '-'}</td></tr>
    <tr><td width="150">${_('holz_region')}</td>    <td>${c['attributes']['wirtschaftsregion'] or '-'}</td></tr>
</%def>

