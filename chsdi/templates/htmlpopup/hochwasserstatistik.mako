<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% 
    c['kenn_nr'] = True
    if lang == ('de') : 
        url = 'url_de'
    elif lang == ('fr') : 
        url = 'url_fr'
    elif lang == ('it') : 
        url = 'url_fr'
    elif lang == ('en') :
        url = 'url_de'
    else :
        url = 'url_de' 
%>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-hochwasserstatistik.name')}</td>
      <td>${c['attributes']['name'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-hochwasserstatistik.einzugsgebietsflaeche')}</td>
      <td>${c['attributes']['einzugsgebietsflaeche'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-hochwasserstatistik.dimension')}</td>
      <td>${c['attributes']['dimension'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-hochwasserstatistik.kenn_nr')}</td>
      <td>${c['attributes']['kenn_nr'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-hochwasserstatistik.statj_tot')}</td>
      <td>${c['attributes']['statj_tot'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-hochwasserstatistik.regimename')}</td>
      <td>${c['attributes']['regimename'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-hochwasserstatistik.url')}</td>
      <td><a href="${c['attributes'][url] or '-'}" target="_blank">${_('ch.bafu.hydrologie-hochwasserstatistik.url')}</a></td>
    </tr>
</%def>


<%def name="extended_info(c, lang)">
<%
    c['kenn_nr'] = True
    if lang == ('de') :
        url = 'url_de'
    elif lang == ('fr') :
        url = 'url_fr'
    elif lang == ('it') :
        url = 'url_fr'
    elif lang == ('en') :
        url = 'url_de'
    else :
        url = 'url_de'
%>

<table>
  <tr>
      <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.name')}</td>
      <td class="cell-meta">${c['attributes']['name'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.coordX')}</td>
    <td class="cell-meta">${c['attributes']['x_koord'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.coordY')}</td>
    <td class="cell-meta">${c['attributes']['y_koord'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.einzugsgebietsflaeche')}</td>
    <td class="cell-meta">${c['attributes']['einzugsgebietsflaeche'] or '-'}</td>
  </tr> 
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.dimension')}</td>
    <td class="cell-meta">${c['attributes']['dimension'] or '-'}</td>
  </tr> 
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.kenn_nr')}</td>
    <td class="cell-meta">${c['attributes']['kenn_nr'] or '-'}</td>
  </tr>  
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.statj_anf')}</td>
    <td class="cell-meta">${c['attributes']['statj_anf'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.statj_end')}</td>
    <td class="cell-meta">${c['attributes']['statj_end'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.statj_tot')}</td>
    <td class="cell-meta">${c['attributes']['statj_tot'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.hq2')}</td>
    <td class="cell-meta">${c['attributes']['hq2'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.hq5')}</td>
    <td class="cell-meta">${c['attributes']['hq5'] or '-'}</td>
  </tr>
    <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.hq10')}</td>
    <td class="cell-meta">${c['attributes']['hq10'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.hq30')}</td>
    <td class="cell-meta">${c['attributes']['hq30'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.hq50')}</td>
    <td class="cell-meta">${c['attributes']['hq50'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.hq100')}</td>
    <td class="cell-meta">${c['attributes']['hq100'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.hq300')}</td>
    <td class="cell-meta">${c['attributes']['hq2'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.mittlerehoehe')}</td>
    <td class="cell-meta">${c['attributes']['mittlerehoehe'] or '-'}</td>
  </tr>
  <tr>
   <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.regimename')}</td>
   <td class="cell-meta">${c['attributes']['regimename'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.url')}</td>
    <td class="cell-meta"><a href="${c['attributes'][url] or '-'}" target="_blank">${_('ch.bafu.hydrologie-hochwasserstatistik.url')}</a></td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwasserstatistik.urlhq')}</td>
    <td class="cell-meta"><a href="${c['attributes']['urlhqpdf'] or '-'}" target="_blank">PDF</a></td>
  </tr>
</table>
</%def>
