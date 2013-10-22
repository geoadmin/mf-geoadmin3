<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('datumactu')}</td>    <td>${c['attributes']['biores_ver'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('biorresflaeche')}</td>    <td>${c['attributes']['biores_fl'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('biorestotflaeche')}</td>    <td>${c['attributes']['biores_gf'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('bioresname')}</td>    <td>${c['attributes']['biores_nam'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('bioresnummer')}</td>    <td>${c['attributes']['biores_obj'] or '-'}</td></tr>
</%def>
