<%inherit file="base.mako"/>
<%def name="table_body(c, lang)">
    <tr><td width="150">${_('flaeche_ha')}</td>        <td>${"%.2f"%c['attributes']['am_l_fl'] or '-'} ha</td></tr>
    <tr><td width="150">${_('bereich')}</td>           <td>${c['attributes']['am_l_berei'] or '-'}</td></tr>
    <tr><td width="150">${_('name')}</td>              <td>${c['attributes']['am_l_name']}</td></tr>
    <tr><td width="150">${_('gesamtflaeche_ha')}</td>  <td>${"%.2f"%c['attributes']['am_l_gf'] or '-'} ha</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c['featureId'] or '-'}</td></tr>
</%def>

