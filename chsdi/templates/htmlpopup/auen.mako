<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('name')}</td>           <td>${c['featureId']}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>       <td>${c['attributes']['au_obj'] or '-'}</td></tr>
    <tr><td width="150">${_('typ')}</td>            <td>${c['attributes']['au_objtyp'] or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>     <td>${c['attributes']['au_fl'] or '-'}</td></tr>
</%def>

