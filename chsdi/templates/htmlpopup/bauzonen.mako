<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('nutzung')}</td>
      % if lang == 'de':
           <td>${c['attributes']['nutz_de'] or '-'}</td>
      % elif lang == 'fr':
           <td>${c['attributes']['nutz_fr'] or '-'}</td>
      % endif
    </tr>
    <tr><td width="150">${_('gemeinde')}</td>    <td>${c['value']}</td></tr>
    <tr><td width="150">${_('kanton')}</td>    <td>${c['attributes']['kt_kz'] or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_m2')}</td>    <td>${int(round(c['attributes']['flaeche_qm'])) or '-'}</td></tr>
</%def>
