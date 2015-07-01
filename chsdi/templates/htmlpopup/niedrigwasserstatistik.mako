<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.titel or '-'}</%def>

<%def name="table_body(c, lang)">
<%
    lang = 'fr' if lang in ('fr', 'it') else 'de'
    hyperlink = 'hyperlink_%s' % lang
%>
<% c['stable_id'] = True %>
<tr><td class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.kennnr')}</td>         <td>${int(c['attributes']['kennnr']) or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.name')}</td>           <td>${c['attributes']['name'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.gebflaeche')}</td>     
  % if c['attributes']['gebflaeche']:
    <td>${round(c['attributes']['gebflaeche'],1) or '-'}</td></tr>
  % else:
    <td>-</td></tr>
  % endif
<tr><td class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.beeinflussung')}</td>  <td>${c['attributes']['beeinflussung'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.genauigkeit')}</td>    <td>${c['attributes']['genauigkeit'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.anz_jahre')}</td>      <td>${c['attributes']['anz_jahre'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.hyperlink')}</td>      <td><a href="${c['attributes'][hyperlink] or '-'}" target="_blank">${c['attributes'][hyperlink] or '-'}</a></td></tr>
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
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.kennnr')}</th>
  % if c['attributes']['kennnr']:
    <td>${int(c['attributes']['kennnr']) or '-'}</td>
  % else:
    <td>-</td>
  % endif
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.name')}</th>
<td>${c['attributes']['name'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.coord_x')}</th>
  % if c['attributes']['coord_x']:
    <td>${int(c['attributes']['coord_x']) or '-'}</td>
  % else:
    <td>-</td>
  % endif
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.coord_y')}</th>
  % if c['attributes']['coord_y']:
    <td>${int(c['attributes']['coord_y']) or '-'}</td>
  % else:
    <td>-</td>
  % endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.gebflaeche')}</th>
  % if c['attributes']['gebflaeche']:
    <td>${round(c['attributes']['gebflaeche'],2) or '-'}</td>
  % else:
    <td>-</td>
  % endif    
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.beginn')}</th>
  % if c['attributes']['beginn']:
    <td>${int(c['attributes']['beginn']) or '-'}</td>
  % else:
    <td>-</td>
  % endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.ende')}</th>
  % if c['attributes']['ende']:
    <td>${int(c['attributes']['ende']) or '-'}</td>
  % else:
    <td>-</td>
  % endif    
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.beeinflussung')}</th>
<td>${c['attributes']['beeinflussung'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.genauigkeit')}</th>
<td>${c['attributes']['genauigkeit'] or '-'}</td>
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.anz_jahre')}</th>
<td>${c['attributes']['anz_jahre'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm1q100')}</th>
% if c['attributes']['nm1q100']:
    <td>${round(c['attributes']['nm1q100'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm1q50')}</th>
% if c['attributes']['nm1q50']:
    <td>${round(c['attributes']['nm1q50'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm1q20')}</th>
% if c['attributes']['nm1q20']:
    <td>${round(c['attributes']['nm1q20'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm1q10')}</th>
% if c['attributes']['nm1q10']:
    <td>${round(c['attributes']['nm1q10'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm1q5')}</th>
% if c['attributes']['nm1q5']:
    <td>${round(c['attributes']['nm1q5'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm1q2')}</th>
% if c['attributes']['nm1q2']:
    <td>${round(c['attributes']['nm1q2'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm7q100')}</th>
% if c['attributes']['nm7q100']:
    <td>${round(c['attributes']['nm7q100'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm7q50')}</th>
% if c['attributes']['nm7q50']:
    <td>${round(c['attributes']['nm7q50'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm7q20')}</th>
% if c['attributes']['nm7q20']:
    <td>${round(c['attributes']['nm7q20'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm7q10')}</th>
% if c['attributes']['nm7q10']:
    <td>${round(c['attributes']['nm7q10'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm7q5')}</th>
% if c['attributes']['nm7q5']:
    <td>${round(c['attributes']['nm7q5'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm7q2')}</th>
% if c['attributes']['nm7q2']:
    <td>${round(c['attributes']['nm7q2'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm14q100')}</th>
% if c['attributes']['nm14q100']:
    <td>${round(c['attributes']['nm14q100'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm14q50')}</th>
% if c['attributes']['nm14q50']:
    <td>${round(c['attributes']['nm14q50'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm14q20')}</th>
% if c['attributes']['nm14q20']:
    <td>${round(c['attributes']['nm14q20'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm14q10')}</th>
% if c['attributes']['nm14q10']:
    <td>${round(c['attributes']['nm14q10'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm14q5')}</th>
% if c['attributes']['nm14q5']:
    <td>${round(c['attributes']['nm14q5'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm14q2')}</th>
% if c['attributes']['nm14q2']:
    <td>${round(c['attributes']['nm14q2'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm30q100')}</th>
% if c['attributes']['nm30q100']:
    <td>${round(c['attributes']['nm30q100'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm30q50')}</th>
% if c['attributes']['nm30q50']:
    <td>${round(c['attributes']['nm30q50'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm30q20')}</th>
% if c['attributes']['nm30q20']:
    <td>${round(c['attributes']['nm30q20'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm30q10')}</th>
% if c['attributes']['nm30q10']:
    <td>${round(c['attributes']['nm30q10'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm30q5')}</th>
% if c['attributes']['nm30q5']:
    <td>${round(c['attributes']['nm30q5'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.nm30q2')}</th>
% if c['attributes']['nm30q2']:
    <td>${round(c['attributes']['nm30q2'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.hydrologie-niedrigwasserstatistik.hyperlink')}</th>
<td colspan="3"><a href="${c['attributes'][hyperlink] or '-'}" target="_blank">${c['attributes'][hyperlink] or '-'}</a></td>
</tr>
</table>
</%def>
