<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

    <tr><td class="cell-left">${_('ch.vbs.retablierungsstellen.name')}</td>                                            
	<td>${c['attributes']['name'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.vbs.retablierungsstellen.url')}</td>
    <td><a href="${c['attributes']['url'] or '-'}" target="_blank">${_('ch.vbs.retablierungsstellen.url')}</a></td></tr>
</%def>

