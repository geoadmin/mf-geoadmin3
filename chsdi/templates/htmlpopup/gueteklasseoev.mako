<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
  <tr>
    <td width="150">${_('klasse')}</td>
    <td>${c['value']}</td>
  </tr>
</%def>
