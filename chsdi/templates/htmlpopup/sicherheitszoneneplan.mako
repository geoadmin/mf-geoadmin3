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
    <tr><td width="170"></td><td><a href="http://mf-chsdi3.dev.bgdi.ch/ltboj/rest/services/all/MapServer/${c['layerBodId']}/${c['featureId']}/extendedhtmlpopup" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>
</%def>

<%def name="extended_info(c, lang)"> 

<%
    lang = lang if lang in ('fr','it') else 'de'
    format = 'formate_%s' % lang
%>
  <table>
    <tr><td class="cell-left">${_('safety_zone')}</td><td>${c['attributes']['zone_name']}</td></tr>
    <tr><td class="cell-left">${_('geometry_type')}</td><td>${c['attributes']['zonetype_%s' % lang]}</td></tr>
    <tr><td class="cell-left">${_('originator')}</td><td>${c['attributes']['originator']}</td></tr>
    <tr><td class="cell-left">${_('kanton')}</td><td>${c['attributes']['canton']}</td></tr>
    <tr><td class="cell-left">${_('municipality')}</td><td>${c['attributes']['municipality']}</td></tr>
    <tr><td class="cell-left">${_('bazlrechtstatus')}</td><td>${c['attributes']['legalstatus_%s' % lang]}</td></tr>
    <tr><td class="cell-left">${_('approval_date')}</td><td>${c['attributes']['approval_date']}</td></tr>  
<%
  ''' if attirbute.weblink is not None:
      weblink = attribute.weblink.split('##')
      doctitle = attribute.title.split('##')
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
   '''
%>
<%doc>
% for i in range(arr_len):
 <tr><td class="cell-left">${_('weblink')}</td><td>${c['attributes']['weblink']}</td></tr>
% endfor
</%doc>
</table>
</%def>
