<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('kartenblattname')}</td><td>${c['attributes']['titel']}</td></tr>
    <tr><td class="cell-left">${_('kartenblattnummer')}</td><td>${c['attributes']['grat25'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('atlassheetnumber')}</td><td>${c['featureId']}</td></tr>
    <tr><td class="cell-left">${_('ausgabejahr')}</td><td>${int(c['attributes']['jahr'])}</td></tr>
	  <tr><td class="cell-left"></td><td><a href="http://www.geologieviewer.ch/legenden/${c['featureId']}.png" target="_blank">${_('linkzurlegende')}</a></td></tr>
</%def>
