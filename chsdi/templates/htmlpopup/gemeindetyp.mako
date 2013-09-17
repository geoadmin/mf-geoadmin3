<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr>
      <td width="150">${_('typ')}</td>
      <td>${c['value'] or '-'}</td>
    </tr>
    <tr>
      <td width="150">${_('flaeche_ha')}</td>
      <td>${int(round(c['attributes']['flaeche_ha'])) or '-'}</td>
    </tr>
</%def>
