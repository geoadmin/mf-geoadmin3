<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c['stable_id'] = True %>
<tr><td
class="cell-left">${_('ch.bafu.mittlere-abfluesse.mqn_jahr')}</td>
  % if c['attributes']['mqn_jahr'] != None:
       <td>${round(c['attributes']['mqn_jahr'],2)}</td></tr>
  % else:
       <td>-</td></tr>
  % endif 
<tr><td class="cell-left">${_('ch.bafu.mittlere-abfluesse.regimetyp')}</td><td>${c['attributes']['regimetyp'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.mittlere-abfluesse.regimenummer')}</td><td>${c['attributes']['regimenummer'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.mittlere-abfluesse.abflussvar')}</td><td>${c['attributes']['abflussvar'] or '-'}</td></tr>
</%def>

<%def name="extended_info(c, lang)">
<% c['stable_id'] = True %>
<%
    lang = 'fr' if lang in ('fr', 'it') else 'de'
%>

<table class="table-with-border kernkraftwerke-extended">
<colgroup>
  <col width=60%>
  <col width=40%>
</colgroup>
<tr>
<th class="cell-left">${_('ch.bafu.mittlere-abfluesse.mqn_jahr')}</th>
  % if c['attributes']['mqn_jahr'] != None:
<td>${round(c['attributes']['mqn_jahr'],2) or '-'}</td>
  % else:
<td>-</td>
  % endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.mittlere-abfluesse.mqn_jan')}</th>
  % if c['attributes']['mqn_jan'] != None:
<td>${round(c['attributes']['mqn_jan'],2) or '-'}</td>
  % else:
<td>-</td>
  % endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.mittlere-abfluesse.mqn_feb')}</th>
  % if c['attributes']['mqn_feb'] != None:
<td>${round(c['attributes']['mqn_feb'],2) or '-'}</td>
  % else:
<td>-</td>
  % endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.mittlere-abfluesse.mqn_mar')}</th>
  % if c['attributes']['mqn_mar'] != None:
<td>${round(c['attributes']['mqn_mar'],2) or '-'}</td>
  % else:
<td>-</td>
  % endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.mittlere-abfluesse.mqn_apr')}</th>
  % if c['attributes']['mqn_apr'] != None:
<td>${round(c['attributes']['mqn_apr'],2) or '-'}</td>
  % else:
<td>-</td>
  % endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.mittlere-abfluesse.mqn_mai')}</th>
  % if c['attributes']['mqn_mai'] != None:
<td>${round(c['attributes']['mqn_mai'],2) or '-'}</td>
  % else:
<td>-</td>
  % endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.mittlere-abfluesse.mqn_jun')}</th>
  % if c['attributes']['mqn_jun'] != None:
<td>${round(c['attributes']['mqn_jun'],2) or '-'}</td>
  % else:
<td>-</td>
  % endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.mittlere-abfluesse.mqn_jul')}</th>
  % if c['attributes']['mqn_jul'] != None:
<td>${round(c['attributes']['mqn_jul'],2) or '-'}</td>
  % else:
<td>-</td>
  % endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.mittlere-abfluesse.mqn_aug')}</th>
  % if c['attributes']['mqn_aug'] != None:
<td>${round(c['attributes']['mqn_aug'],2) or '-'}</td>
  % else:
<td>-</td>
  % endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.mittlere-abfluesse.mqn_sep')}</th>
  % if c['attributes']['mqn_sep'] != None:
<td>${round(c['attributes']['mqn_sep'],2) or '-'}</td>
  % else:
<td>-</td>
  % endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.mittlere-abfluesse.mqn_okt')}</th>
  % if c['attributes']['mqn_okt'] != None:
<td>${round(c['attributes']['mqn_okt'],2) or '-'}</td>
  % else:
<td>-</td>
  % endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.mittlere-abfluesse.mqn_nov')}</th>
  % if c['attributes']['mqn_nov'] != None:
<td>${round(c['attributes']['mqn_nov'],2) or '-'}</td>
  % else:
<td>-</td>
  % endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.mittlere-abfluesse.mqn_dez')}</th>
  % if c['attributes']['mqn_dez'] != None:
<td>${round(c['attributes']['mqn_dez'],2) or '-'}</td>
  % else:
<td>-</td>
  % endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.mittlere-abfluesse.regimetyp')}</th>
<td>${c['attributes']['regimetyp'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.mittlere-abfluesse.regimenummer')}</th>
  % if c['attributes']['regimenummer'] != None:
<td>${c['attributes']['regimenummer'] or '-'}</td>
  % else:
<td>-</td>
  % endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.mittlere-abfluesse.abflussvar')}</th>
  % if c['attributes']['abflussvar'] != None:
<td>${c['attributes']['abflussvar'] or '-'}</td>
  % else:
<td>-</td>
  % endif
</tr>
</table>
</%def>
