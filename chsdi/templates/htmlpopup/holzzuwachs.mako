<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('holzzuwachs')}</td>    <td>${c['attributes']['holzzuwachs'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('holz_region')}</td>    <td>${c['attributes']['wirtschaftsregion'] or '-'}</td></tr>
</%def>

