<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('objektname')}</td>         <td>${c['featureId']}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>           <td>${c['attributes']['hm_obj'] or '-'}</td></tr>
    <tr><td width="150">${_('typ')}</td>                <td>${c['attributes']['hm_typ'] or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>         <td>${c['attributes']['hm_fl'] or '-'}</td></tr>
    <tr><td width="150">${_('kartiereinheit')}</td>     <td>${c['attributes']['hm_ke'] or '-'}</td></tr>
</%def>

