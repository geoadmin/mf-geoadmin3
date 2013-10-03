<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('name')}</td>    <td>${(c['attributes']['am_g_name']) or '-'}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>    <td>${c['featureId']}</td></tr>
</%def>
