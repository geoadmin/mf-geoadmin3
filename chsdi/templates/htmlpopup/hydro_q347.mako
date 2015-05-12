<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.titel or '-'}</%def>

<%def name="table_body(c, lang)">
<% c['stable_id'] = True %>
<tr><td class="cell-left">${_('ch_bafu_hydrologie_q347.BilanzID')}</td>     <td>${c['attributes']['bilanzid']}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_hydrologie_q347.BasisID')}</td>      <td>${c['attributes']['basisid']}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_hydrologie_q347.lhg')}</td>          <td>${c['attributes']['lhg']}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_hydrologie_q347.gewaesser')}</td>    <td>${c['attributes']['gewaesser']}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_hydrologie_q347.flaeche')}</td>      <td>${c['attributes']['flaeche']}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_hydrologie_q347.QP')}</td>           <td>${c['attributes']['qp']}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_hydrologie_q347.P')}</td>            <td>${c['attributes']['p']}</td></tr>
</%def>

<%def name="extended_info(c, lang)">
<table class="table-with-border kernkraftwerke-extended">
<tr>
<td width="25%">&nbsp;</td>
<td width="20%">&nbsp;</td>
<td width="25%">&nbsp;</td>
<td width="30%" >&nbsp;</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_q347.BilanzID')}</th>
<td>${c['attributes']['bilanzid'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_q347.ID')}</th>
<td>${c['attributes']['id_q347'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_q347.BasisID')}</th>
<td>${c['attributes']['basisid'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_q347.lhg')}</th>
<td>${c['attributes']['lhg'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_q347.gewaesser')}</th>
<td>${c['attributes']['gewaesser'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_q347.flaeche')}</th>
<td>${round(c['attributes']['flaeche'],1) or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_q347.Q_84_93')}</th>
<td>${c['attributes']['q_84_93'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_hydrologie_q347.QP')}</th>
<td>${int(c['attributes']['qp']) or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_q347.P')}</th>
% if c['attributes']['p'] != None:
    <td>${c['attributes']['p'] or '-'}</td>
% else:
    <td>-</td>
% endif
<th class="cell-left">${_('ch_bafu_hydrologie_q347.Qmod')}</th>
% if c['attributes']['qmod'] != None:
    <td>${int(c['attributes']['qmod']) or '-'}</td>
% else:
    <td>-</td>
% endif
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_hydrologie_q347.bemerkung')}</th>
% if c['attributes']['bemerkung'] != None:
    <td>${c['attributes']['bemerkung'] or '-'}</td>
% else:
    <td>-</td>
% endif
<th class="cell-left">&nbsp;</th>
<td>&nbsp;</td>
</tr>
</table>
</%def>
