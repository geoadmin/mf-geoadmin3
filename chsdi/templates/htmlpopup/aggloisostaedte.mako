<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('name')}</td><td>${c['value']}</td></tr>
    <tr><td width="150">${_('klasse')}</td>
      % if lang == 'de':
           <td>${c['attributes']['klasse_de'] or '-'}</td>
      % elif lang == 'fr':
           <td>${c['attributes']['klasse_fr'] or '-'}</td>
      % endif
    </tr>
    <tr><td width="150">${_('flaeche_ha')}</td>    <td>${int(round(c['attributes']['flaeche_ha'])) or '-'}</td></tr>
</%def>
