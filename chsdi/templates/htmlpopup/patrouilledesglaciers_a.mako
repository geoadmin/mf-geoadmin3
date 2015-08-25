<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

    <tr><td class="cell-left">${_('ch.vbs.patrouilledesglaciers-a_rennen.name')}</td>                                            
	<td>${c['attributes']['name'] or '-'}</td></tr>

</%def>

