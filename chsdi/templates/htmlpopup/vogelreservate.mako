<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('objektname')}</td>         <td>${c['attributes']['wv_name']}</td></tr>
    <tr><td class="cell-left">${_('objektnr')}</td>          <td>${c['attributes']['wv_obj'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('kategorie')}</td>         <td>${c['attributes']['wv_kat'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('flaeche_ha')}</td>          <td>${round(c['attributes']['wv_fl']) or '-'}</td></tr>
    <tr><td class="cell-left">${_('gesamtflaeche_ha')}</td>         <td>${round(c['attributes']['wv_gf']) or '-'}</td></tr>
</%def>

