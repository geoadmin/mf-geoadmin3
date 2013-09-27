<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <% c['stable_id'] = True %>
    <tr><td width="150" valign="top">${_('kartenblattname')}</td><td>${c['attributes']['titel']}</td></tr>
    <tr><td width="150">${_('kartenblattnummer')}</td><td>${c['attributes']['grat25'] or '-'}</td></tr>
    <tr><td width="150">${_('atlassheetnumber')}</td><td>${c['featureId']}</td></tr>
    <tr><td width="150">${_('ausgabejahr')}</td><td>${int(c['attributes']['jahr'])}</td></tr>
	<tr><td width="150"></td><td valign="top"><a href="http://www.geologieviewer.ch/legenden/${c['featureId']}.png" target="_blank">${_('linkzurlegende')}</a></td></tr>
</%def>
