<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
<%
    webDavHost = request.registry.settings['webdav_host']
    url_pdf = webDavHost + '/kogis_web/downloads/geologie/geotechnik/' + c['attributes']['legend']
%>
    <tr><td colspan="3">&nbsp;</tr>
    <tr>
      <td>${_('Legend')}</td>
      <td width="20">&nbsp;</td>
      <td><a href="${url_pdf}" target="_blank">${_('tt_geotechnik_gk200')}</a> - ${c['attributes']['area_name'] or '-'}</td>
    </tr>
    <tr><td colspan="3">&nbsp;</tr>
</%def>
