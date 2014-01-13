<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.titel or '-'}</%def>

<%def name="table_body(c, lang)">
<%
    lang = lang if lang in ('fr','it') else 'de'
    format = 'formate_%s' % lang
%>
    <tr><td class="cell-left">${_('safety_zone')}</td><td>${c['attributes']['zone_name']}</td></tr>
    <tr><td class="cell-left">${_('geometry_type')}</td><td>${c['attributes']['zonetype_%s' % lang]}</td></tr>
    <tr><td class="cell-left">${_('originator')}</td><td>${c['attributes']['originator']}</td></tr>
    <tr><td class="cell-left">${_('kanton')}</td><td>${c['attributes']['canton']}</td></tr>
    <tr><td width="170"></td><td><a href="${c['baseUrl']}rest/services/all/MapServer/${c['layerBodId']}/${c['featureId']}/extendedhtmlpopup" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>
</%def>

<%def name="extended_info(c, lang)"> 

<%
    lang = lang if lang in ('fr','it') else 'de'
    format = 'formate_%s' % lang
%>
  <table>
    <tr><td class="cell-align-left">${_('safety_zone')}</td><td>${c['attributes']['zone_name']}</td></tr>
    <tr><td class="cell-align-left">${_('geometry_type')}</td><td>${c['attributes']['zonetype_%s' % lang]}</td></tr>
    <tr><td class="cell-align-left">${_('originator')}</td><td>${c['attributes']['originator']}</td></tr>
    <tr><td class="cell-align-left">${_('kanton')}</td><td>${c['attributes']['canton']}</td></tr>
<%
    municipality = c['attributes']['municipality']
    if municipality is not None:
        nb_municipality = ", ".join(c['attributes']['municipality'].split(','))
        i = 0
    else:
        municipality = 0
%>
    <tr><td class="cell-align-left">${_('municipality')}</td><td>${nb_municipality}</td></tr>
    <tr><td class="cell-align-left">${_('bazlrechtstatus')}</td><td>${c['attributes']['legalstatus_%s' % lang]}</td></tr>
    <tr><td class="cell-align-left">${_('approval_date')}</td><td>${c['attributes']['approval_date']}</td></tr>  
   
<%
     weblink = c['attributes']['weblink']
     if weblink:
      weblink = c['attributes']['weblink'].split('##')
      doctitle = c['attributes']['title'].split('##')
      nb=len(weblink)
      doctitle_new = []
      weblink_new = []
      todel = []
      i = 0
      while i < nb:
        if weblink[i] not in weblink_new:
          weblink_new.append(weblink[i])
          doctitle_new.append(doctitle[i])
        endif
        i = i+1

      arr_len = len(weblink_new)

     else:
      weblink_nb = 0
%>
% for i in range(arr_len):
<tr><td class="cell-align-left">${_('tt_document')}</td> <td><a href=${weblink_new[i]}  target="_blank">${doctitle_new[1]}<a/></td></tr>
% endfor
</table>
</%def>
