<%inherit file="base.mako"/>

<%def name="preview()">${c['attributes']['lk_name'] or '-'}</%def>

<%def name="table_body(c,lang)">
    <% c[stable_id] = True %>
	<tr><td width="150">${_('tilenumber')}</td><td>${c['featureId']}</td></tr>
    <tr><td width="150">${_('sheetname')}</td><td>${c['value']}</td></tr>
    <tr><td width="150">${_('Datenstand')}</td><td>${c['attributes']['release'] or '-'}</td></tr>
	<tr><td width="150">${_('Datenbezug')}</td><td><a href="http://www.toposhop.admin.ch/shop/products/maps/national/digital/pixelWizardEntryPoint?wizardMap=Pixel500" target="_blank">${_('Toposhop')}</a></td></tr>
</%def>

