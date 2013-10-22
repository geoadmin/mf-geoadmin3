<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
  <tr>
    <td class="cell-left">${_('klasse')}</td>
    <td>
      % if lang in ('de', 'rm', 'en'):
        ${c['attributes']['klasse_de']}
      % else:
        ${c['attributes']['klasse_fr']}
      % endif
    </td>
  </tr>
</%def>
