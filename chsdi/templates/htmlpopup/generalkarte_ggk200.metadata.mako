<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <% c['stable_id'] = True %>
	<tr><td class="cell-left">${_('ch.swisstopo.geologie-generalkarte-ggk200.metadata.nr')}</td> <td>${c['attributes']['nr'] or '-'}</td></tr>
	<tr><td class="cell-left">${_('ch.swisstopo.geologie-generalkarte-ggk200.metadata.titel')}</td> <td>${c['attributes']['titel'] or '-'}</td></tr>
	<tr><td class="cell-left">${_('ch.swisstopo.geologie-generalkarte-ggk200.metadata.autor')}</td> <td>${c['attributes']['autor'].replace('&dagger;',u"\u2020")}</td></tr>
	<tr><td class="cell-left">${_('ch.swisstopo.geologie-generalkarte-ggk200.metadata.jahr')}</td> <td>${c['attributes']['jahr'] or '-'}</td></tr>
</%def>
