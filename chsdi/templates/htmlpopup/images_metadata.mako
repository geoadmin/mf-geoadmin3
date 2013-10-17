<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
  <% c['stable_id'] = True %>
	<tr><td class="cell-left">${_('tilenumber')}</td><td>${c['featureId']}</td></tr>
  <tr><td class="cell-left">${_('sheetname')}</td><td>${c['attributes']['lk25_name']}</td></tr>
  <tr><td class="cell-left">${_('Datenstand')}</td><td>${c['attributes']['datenstand'] or '-'}</td></tr>
	<tr><td class="cell-left">${_('Datenbezug')}</td><td><a href="http://www.toposhop.admin.ch/de/shop/products/images/ortho/swissimage/index" target="_blank">${_('Toposhop')}</a></td></tr>
</%def> 
