<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('datumactu')}</td>    <td>${c['attributes']['biores_ver'] or '-'}</td></tr>
    <tr><td width="150">${_('biorresflaeche')}</td>    <td>${c['attributes']['biores_fl'] or '-'}</td></tr>
    <tr><td width="150">${_('biorestotflaeche')}</td>    <td>${c['attributes']['biores_gf'] or '-'}</td></tr>
    <tr><td width="150">${_('bioresname')}</td>    <td>${c['attributes']['biores_nam'] or '-'}</td></tr>
    <tr><td width="150">${_('bioresnummer')}</td>    <td>${c['attributes']['biores_obj'] or '-'}</td></tr>
</%def>
