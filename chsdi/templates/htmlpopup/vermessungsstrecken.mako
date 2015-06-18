<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.titel or '-'}</%def>

<%def name="table_body(c, lang)">
<tr><td class="cell-left">${_('ch.bafu.wasserbau-vermessungsstrecken.gewaessernummer')}</td>    <td>${c['attributes']['gewaessernummer'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.wasserbau-vermessungsstrecken.streckenid')}</td>         <td>${c['attributes']['streckenid'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.wasserbau-vermessungsstrecken.bezeichnung')}</td>        <td>${c['attributes']['bezeichnung'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.wasserbau-vermessungsstrecken.gwlnr')}</td>              <td>${c['attributes']['gwlnr'] or '-'}</td></tr>
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
<th class="cell-left">${_('ch.bafu.wasserbau-vermessungsstrecken.routeid')}</th>
<td>${c['attributes']['routeid'] or '-'}</td>
<th class="cell-left">${_('ch.bafu.wasserbau-vermessungsstrecken.gewaessernummer')}</th>
<td>${c['attributes']['gewaessernummer'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.wasserbau-vermessungsstrecken.bemerkung')}</th>
<td>${c['attributes']['bemerkung'] or '-'}</td>
<th class="cell-left">${_('ch.bafu.wasserbau-vermessungsstrecken.anfangsmass')}</th>
% if c['attributes']['anfangsmass']:
    <td>${round(c['attributes']['anfangsmass'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.wasserbau-vermessungsstrecken.endmass')}</th>
% if c['attributes']['endmass']:
    <td>${round(c['attributes']['endmass'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
<th class="cell-left">${_('ch.bafu.wasserbau-vermessungsstrecken.streckenid')}</th>
<td>${c['attributes']['streckenid'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.wasserbau-vermessungsstrecken.bezeichnung')}</th>
<td>${c['attributes']['bezeichnung'] or '-'}</td>
<th class="cell-left">${_('ch.bafu.wasserbau-vermessungsstrecken.laenge_km')}</th>
% if c['attributes']['laenge_km']:
    <td>${round(c['attributes']['laenge_km'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.wasserbau-vermessungsstrecken.anzahl_profile')}</th>
<td>${c['attributes']['anzahl_profile'] or '-'}</td>
<th class="cell-left">${_('ch.bafu.wasserbau-vermessungsstrecken.aufnahme_intervall')}</th>
<td>${c['attributes']['aufnahme_intervall'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.wasserbau-vermessungsstrecken.aufnahme_letzte')}</th>
<td>${c['attributes']['aufnahme_letzte'] or '-'}</td>
<th class="cell-left">${_('ch.bafu.wasserbau-vermessungsstrecken.gwlnr')}</th>
<td>${c['attributes']['gwlnr'] or '-'}</td>
</tr>
</table>
</%def>
