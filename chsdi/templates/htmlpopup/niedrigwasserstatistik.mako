<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.titel or '-'}</%def>

<%def name="table_body(c, lang)">
<%
    lang = 'fr' if lang in ('fr', 'it') else 'de'
    hyperlink = 'hyperlink_%s' % lang
%>
<% c['stable_id'] = True %>
<tr><td class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.KennNr')}</td>         <td>${int(c['attributes']['kennnr'])}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NAME')}</td>           <td>${c['attributes']['name']}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.GEBFLAECHE')}</td>     <td>${round(c['attributes']['gebflaeche'],1)}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.Beeinflussung')}</td>  <td>${c['attributes']['beeinflussung']}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.Genauigkeit')}</td>    <td>${c['attributes']['genauigkeit']}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.Anz_Jahre')}</td>      <td>${c['attributes']['anz_jahre']}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.hyperlink')}</td>      <td><a href="${c['attributes'][hyperlink] or '-'}" target="_blank">${c['attributes'][hyperlink] or '-'}</a></td></tr>
</%def>

<%def name="extended_info(c, lang)">
<%
    lang = 'fr' if lang in ('fr', 'it') else 'de'
    hyperlink = 'hyperlink_%s' % lang
%>

<table class="table-with-border kernkraftwerke-extended">
<tr>
<td width="20%">&nbsp;</td>
<td width="30%">&nbsp;</td>
<td width="20%">&nbsp;</td>
<td width="30%" >&nbsp;</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.KennNr')}</th>
<td>${int(c['attributes']['kennnr']) or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NAME')}</th>
<td>${c['attributes']['name'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.KOORDX')}</th>
<td>${int(c['attributes']['coord_x']) or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.KOORDY')}</th>
<td>${int(c['attributes']['coord_y']) or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.GEBFLAECHE')}</th>
<td>${round(c['attributes']['gebflaeche'],2) or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.Beginn')}</th>
<td>${int(c['attributes']['beginn']) or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.Ende')}</th>
<td>${int(c['attributes']['ende']) or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.Beeinflussung')}</th>
<td>${c['attributes']['beeinflussung'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.Genauigkeit')}</th>
<td>${c['attributes']['genauigkeit'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.Anz_Jahre')}</th>
<td>${c['attributes']['anz_jahre'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM1Q100')}</th>
<td>${c['attributes']['nm1q100'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM1Q50')}</th>
<td>${c['attributes']['nm1q50'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM1Q20')}</th>
<td>${c['attributes']['nm1q20'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM1Q10')}</th>
<td>${c['attributes']['nm1q10'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM1Q5')}</th>
<td>${c['attributes']['nm1q5'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM1Q2')}</th>
<td>${c['attributes']['nm1q2'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM7Q100')}</th>
<td>${c['attributes']['nm7q100'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM7Q50')}</th>
<td>${c['attributes']['nm7q50'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM7Q20')}</th>
<td>${c['attributes']['nm7q20'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM7Q10')}</th>
<td>${c['attributes']['nm7q10'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM7Q5')}</th>
<td>${c['attributes']['nm7q5'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM7Q2')}</th>
<td>${c['attributes']['nm7q2'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM14Q100')}</th>
<td>${c['attributes']['nm14q100'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM14Q50')}</th>
<td>${c['attributes']['nm14q50'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM14Q20')}</th>
<td>${c['attributes']['nm14q20'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM14Q10')}</th>
<td>${c['attributes']['nm14q10'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM14Q5')}</th>
<td>${c['attributes']['nm14q5'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM14Q2')}</th>
<td>${c['attributes']['nm14q2'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM30Q100')}</th>
<td>${c['attributes']['nm30q100'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM30Q50')}</th>
<td>${c['attributes']['nm30q50'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM30Q20')}</th>
<td>${c['attributes']['nm30q20'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM30Q10')}</th>
<td>${c['attributes']['nm30q10'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM30Q5')}</th>
<td>${c['attributes']['nm30q5'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.NM30Q2')}</th>
<td>${c['attributes']['nm30q2'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_niedrigwasserstatistik.hyperlink')}</th>
<td><a href="${c['attributes'][hyperlink] or '-'}" target="_blank">${c['attributes'][hyperlink] or '-'}</a></td>
<th class="cell-left">&nbsp;</th>
<td>&nbsp;</td>
</tr>
</table>
</%def>
