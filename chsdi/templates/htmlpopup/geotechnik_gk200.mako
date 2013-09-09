<%inherit file="base.mako"/>

<%def name="preview()">${c['attributes']['file_name'] or '-'}</%def>

<%def name="table_body(c,lang)">
<%
    PDF_Link = 'https://dav0.bgdi.admin.ch/kogis_web/downloads/geologie/geotechnik/' + c['attributes']['file_name'] + '_' + lang + '.pdf'
%>
    <tr><td colspan="3">&nbsp;</tr>
    <tr>
      <td>${_('Legend')}</td>
      <td width="20">&nbsp;</td>
      <td><a href="${PDF_Link}" target="_blank">${_('tt_geotechnik_gk200')}</a></td>
    </tr>
    <tr><td colspan="3">&nbsp;</tr>
</%def>
