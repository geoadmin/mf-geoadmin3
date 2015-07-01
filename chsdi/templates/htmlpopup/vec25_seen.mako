<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('ch.bafu.vec25-seen.name')}</td>                  <td>${c['attributes']['name']}</td></tr>
    <tr><td class="cell-left">${_('ch.bafu.vec25-seen.seetyp')}</td>                <td>${c['attributes']['seetyp'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.bafu.vec25-seen.seeflaeche_km2')}</td>        <td>${c['attributes']['seeflaeche_km2'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.bafu.vec25-seen.inhalt_see_mio_m3')}</td>     <td>${c['attributes']['inhalt_see_mio_m3'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.bafu.vec25-seen.tiefe_see_m')}</td>           <td>${c['attributes']['tiefe_see_m'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.bafu.vec25-seen.hoehenlage_muem')}</td>       <td>${c['attributes']['hoehenlage_muem'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.bafu.vec25-seen.gwlnr')}</td>                 <td>${c['attributes']['gwlnr'] or '-'}</td></tr>
</%def>

<%def name="extended_info(c, lang)">
<table class="table-with-border kernkraftwerke-extended">
<tr>
<th width="25%"class="cell-left">${_('ch.bafu.vec25-seen.gewaesserkennzahl')}</th>
<td width="25%">${c['attributes']['gewaesserkennzahl'] or '-'}</td>
<th width="25%"class="cell-left">${_('ch.bafu.vec25-seen.name')}</th>
<td width="25%">${c['attributes']['name'] or '-'}</td>
</tr>
<th class="cell-left">${_('ch.bafu.vec25-seen.seetyp')}</th>
<td>${c['attributes']['seetyp'] or '-'}</td>
<th class="cell-left">${_('ch.bafu.vec25-seen.natur_mit')}</th>
<td>${c['attributes']['natur_mit'] or '-'}</td>
</tr>
<th class="cell-left">${_('ch.bafu.vec25-seen.ausgleichsbecken')}</th>
<td>${c['attributes']['ausgleichsbecken'] or '-'}</td>
<th class="cell-left">${_('ch.bafu.vec25-seen.reguliert')}</th>
<td>${c['attributes']['reguliert'] or '-'}</td>
</tr>
<th class="cell-left">${_('ch.bafu.vec25-seen.seeflaeche_km2')}</th>
<td>${round(c['attributes']['seeflaeche_km2'],2) or '-'}</td>
<th class="cell-left">${_('ch.bafu.vec25-seen.inhalt_see_mio_m3')}</th>
<td>${round(c['attributes']['inhalt_see_mio_m3'],2) or '-'}</td>
</tr>
<th class="cell-left">${_('ch.bafu.vec25-seen.nutzinhalt_mio_m3')}</th>
<td>${round(c['attributes']['nutzinhalt_mio_m3'],2) or '-'}</td>
<th class="cell-left">${_('ch.bafu.vec25-seen.tiefe_see_m')}</th>
<td>${c['attributes']['tiefe_see_m'] or '-'}</td>
</tr>
<th class="cell-left">${_('ch.bafu.vec25-seen.hoehenlage_muem')}</th>
<td>${c['attributes']['hoehenlage_muem'] or '-'}</td>
<th class="cell-left">${_('ch.bafu.vec25-seen.uferlaenge_m')}</th>
<td>${c['attributes']['uferlaenge_m'] or '-'}</td>
</tr>
<th class="cell-left">${_('ch.bafu.vec25-seen.gwlnr')}</th>
<td>${c['attributes']['gwlnr'] or '-'}</td>
<th class="cell-left">&nbsp;</th>
<td>&nbsp;</td>
</tr>

</table>
</%def>
