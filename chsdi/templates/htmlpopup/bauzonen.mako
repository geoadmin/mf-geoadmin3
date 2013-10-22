<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('nutzung')}</td>
      % if lang in ('de', 'rm', 'en'):
           <td>${c['attributes']['nutz_de'] or '-'}</td>
      % else:
           <td>${c['attributes']['nutz_fr'] or '-'}</td>
      % endif
    </tr>
    <tr><td class="cell-left">${_('gemeinde')}</td>    <td>${c['attributes']['name']}</td></tr>
    <tr><td class="cell-left">${_('kanton')}</td>    <td>${c['attributes']['kt_kz'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('flaeche_m2')}</td>    <td>${int(round(c['attributes']['flaeche_qm'])) or '-'}</td></tr>
</%def>
