<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('name')}</td>    <td><b>${c['attributes']['name'] or '-'}</b></td></tr>
    <tr><td class="cell-left">${_('objektart')}</td>    <td>${c['attributes']['objektart'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('sprachcode')}</td>    <td>${c['attributes']['sprachcode'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('namen_typ')}</td>    <td>${c['attributes']['namen_typ'] or '-'}</td></tr>
</%def>

