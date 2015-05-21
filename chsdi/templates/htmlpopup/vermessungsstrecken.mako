<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.titel or '-'}</%def>

<%def name="table_body(c, lang)">
<% c['stable_id'] = True %>
<tr><td class="cell-left">${_('ch_bafu_wasserbau_vermessungsstrecken.gewaessernummer')}</td>    <td>${c['attributes']['gewaessernummer']}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_wasserbau_vermessungsstrecken.streckenid')}</td>         <td>${c['attributes']['streckenid']}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_wasserbau_vermessungsstrecken.bezeichnung')}</td>        <td>${c['attributes']['bezeichnung']}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_wasserbau_vermessungsstrecken.gwlnr')}</td>              <td>${c['attributes']['gwlnr']}</td></tr>
</%def>

<%def name="extended_info(c, lang)">
<%
    lang = 'fr' if lang in ('fr', 'it') else 'de'
    url_uebersicht = 'url_uebersicht_%s' % lang
%>

<table class="table-with-border kernkraftwerke-extended">
<tr>
<td width="20%">&nbsp;</td>
<td width="30%">&nbsp;</td>
<td width="20%">&nbsp;</td>
<td width="30%" >&nbsp;</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_wasserbau_vermessungsstrecken.routeid')}</th>
<td>${c['attributes']['routeid'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_wasserbau_vermessungsstrecken.gewaessernummer')}</th>
<td>${c['attributes']['gewaessernummer'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_wasserbau_vermessungsstrecken.bemerkung')}</th>
<td>${c['attributes']['bemerkung'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_wasserbau_vermessungsstrecken.anfangsmass')}</th>
<td>${c['attributes']['anfangsmass'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_wasserbau_vermessungsstrecken.endmass')}</th>
<td>${c['attributes']['endmass'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_wasserbau_vermessungsstrecken.streckenid')}</th>
<td>${c['attributes']['streckenid'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_wasserbau_vermessungsstrecken.bezeichnung')}</th>
<td>${c['attributes']['bezeichnung'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_wasserbau_vermessungsstrecken.laenge_km')}</th>
<td>${c['attributes']['laenge_km'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_wasserbau_vermessungsstrecken.anzahl_profile')}</th>
<td>${c['attributes']['anzahl_profile'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_wasserbau_vermessungsstrecken.aufnahme_intervall')}</th>
<td>${c['attributes']['aufnahme_intervall'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_wasserbau_vermessungsstrecken.aufnahme_letzte')}</th>
<td>${c['attributes']['aufnahme_letzte'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_wasserbau_vermessungsstrecken.gwlnr')}</th>
<td>${c['attributes']['gwlnr'] or '-'}</td>
</tr>
</table>
</%def>
