<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

    <tr><td class="cell-left">${_('ch.sgpk.maechtigkeit-lockergesteine.epaisseur')}</td>                                            
	<td>${round(c['attributes']['maechtigkeit'],2)}</td></tr>

</%def>

