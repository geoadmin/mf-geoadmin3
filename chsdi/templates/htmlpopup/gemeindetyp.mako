<%inherit file="base.mako"/>

<%def name="preview()">
      % if lang == 'de' or lang == 'en' or lang == 'rm':
           ${c['value'] or '-'}
      % elif lang == 'fr' or lang == 'it':
           ${c['attributes']['nom'] or '-'}
      % endif
</%def>

<%def name="table_body(c, lang)">
<% c[stable_id] = True %>
    <tr><td width="150">${_('typ')}</td><td>${c['value']}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>    <td>${int(round(c['attributes']['flaeche_ha'])) or '-'}</td></tr>
</%def>
