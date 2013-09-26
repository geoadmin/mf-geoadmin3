# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c[stable_id] = True %>
    <tr><td width="150">${_('nummer')}</td>             <td>${c['featureId']}</td></tr>
	<tr><td width="150">${_('zaehlstelle')}</td>        <td>${c['attributes']['zaehlstellen_bezeichnung']}</td></tr>
    <tr><td width="150">${_('physischvirtuell')}</td>   <td>${c['attributes']['zst_physisch_virtuell'] or '-'}</td></tr>
	<tr><td width="150">${_('messstellentyp')}</td>     <td>${c['attributes']['messstellentyp'] or '-'}</td></tr>
    <tr><td width="150">${_('oeffentlich')}</td>        <td><a href="http://doc.vde.admin.ch/out/public/${c['featureId'] or '-'}.html" target="_blank">${_('linkzurbeschreibung')}</a></td></tr>
	<tr><td width="150">${_('intern')}</td>             <td><a href="http://doc.vde.admin.ch/out/intern/${c['featureId'] or '-'}.html" target="_blank">${_('linkzurbeschreibung')}</a></td></tr>
</%def>
