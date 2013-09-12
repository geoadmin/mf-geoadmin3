<%inherit file="base.mako"/>

<%def name="preview()">${c['featureId'] or '-'}</%def>

<%def name="table_body(c, lang)">
    <% c[stable_id] = True %>
    <tr><td width="150">${_('name')}</td>   <td>${c['featureId']}</td></tr>
    <tr><td width="150">${_('url')}</td>    <td><a target="_blank" href="http://${c['attributes']['url']}">${_('url') or '-'}</a></td></tr>
</%def>
