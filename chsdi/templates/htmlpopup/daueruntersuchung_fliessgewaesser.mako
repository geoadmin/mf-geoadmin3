<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<%
    if lang == ('de') :
        url = 'hyperlink_d'
    elif lang == ('fr') :
        url = 'hyperlink_f'
    elif lang == ('it') :
        url = 'hyperlink_f'
    elif lang == ('en') :
        url = 'hyperlink_d'
    else :
        url = 'hyperlink_d'
%>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.name')}</td>
      <td>${c['attributes']['name'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.betriebsbeginn')}</td>
      <td>${c['attributes']['betriebsbeginn'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.stationierung')}</td>
      <td>${c['attributes']['stationierung'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.flussgebiet')}</td>
      <td>${c['attributes']['flussgebiet'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.einzugsgebietsflaeche')}</td>
      <td>${c['attributes']['einzugsgebietsflaeche'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.hyperlink')}</td>
      <td><a href="${c['attributes'][url] or '-'}" target="_blank">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.hyperlink')}</a></td>
    </tr>
</%def>


<%def name="extended_info(c, lang)">
<%
    if lang == ('de') :
        url = 'hyperlink_d'
    elif lang == ('fr') :
        url = 'hyperlink_f'
    elif lang == ('it') :
        url = 'hyperlink_f'
    elif lang == ('en') :
        url = 'hyperlink_d'
    else :
        url = 'hyperlink_d'
%>

<table>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.name')}</td>
    <td class="cell-meta">${c['attributes']['name'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.betriebsbeginn')}</td>
    <td class="cell-meta">${c['attributes']['betriebsbeginn'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.stationierung')}</td>
    <td class="cell-meta">${c['attributes']['stationierung'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.flussgebiet')}</td>
    <td class="cell-meta">${c['attributes']['flussgebiet'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.einzugsgebietsflaeche')}</td>
    <td class="cell-meta">${c['attributes']['einzugsgebietsflaeche'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.rechtswert')}</td>
    <td class="cell-meta">${c['attributes']['rechtswert'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.hochwert')}</td>
    <td class="cell-meta">${c['attributes']['hochwert'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.mittlerehoehe')}</td>
    <td class="cell-meta">${c['attributes']['mittlerehoehe'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.hoehe')}</td>
    <td class="cell-meta">${c['attributes']['hoehe'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.vergletscherung')}</td>
    <td class="cell-meta">${c['attributes']['vergletscherung'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.hyperlink')}</td>
    <td class="cell-meta"><a href="${c['attributes'][url] or '-'}" target="_blank">${_('ch.bafu.hydrologie-daueruntersuchung_fliessgewaesser.hyperlink')}</a></td>
  </tr>
</table>
</%def>
