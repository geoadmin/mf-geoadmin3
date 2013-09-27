<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c['stable_id'] = True %>
    <tr>
      <td width="150">${_('typ')}</td>
      <td>
        % if lang in ('de', 'rm', 'en'):
          ${c['attributes']['name'] or '-'}
        % else:
          ${c['attributes']['nom'] or '-'}
        % endif
      </td>
    </tr>
    <tr>
      <td width="150">${_('flaeche_ha')}</td>
      <td>${int(round(c['attributes']['flaeche_ha'])) or '-'}</td>
    </tr>
</%def>
