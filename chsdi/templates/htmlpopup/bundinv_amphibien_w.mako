<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('name')}</td>    <td>${(c['attributes']['am_g_name']) or '-'}</td></tr>
    <tr><td class="cell-left">${_('objektnr')}</td>    <td>${c['featureId']}</td></tr>
</%def>
