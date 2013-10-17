<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('name')}</td><td>${c['attributes']['objname']}</td></tr>
</%def>
