# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c['stable_id'] = True %>
  <tr><td class="cell-left">${_('nummer')}</td>             <td>${c['featureId']}</td></tr>
	<tr><td class="cell-left">${_('zaehlstelle')}</td>        <td>${c['attributes']['zaehlstellen_bezeichnung']}</td></tr>
  <tr><td class="cell-left">${_('physischvirtuell')}</td>   <td>${c['attributes']['zst_physisch_virtuell'] or '-'}</td></tr>
	<tr><td class="cell-left">${_('messstellentyp')}</td>     <td>${c['attributes']['messstellentyp'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('oeffentlich')}</td>        <td><a href="http://doc.vde.admin.ch/out/public/${c['featureId'] or '-'}.html" target="_blank">${_('linkzurbeschreibung')}</a></td></tr>
	<tr><td class="cell-left">${_('intern')}</td>             <td><a href="http://doc.vde.admin.ch/out/intern/${c['featureId'] or '-'}.html" target="_blank">${_('linkzurbeschreibung')}</a></td></tr>
</%def>
