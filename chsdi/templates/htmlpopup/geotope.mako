<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
<tr><td class="cell-left">${_('name')}</td><td>${c['attributes']['nom'] or '-'}</td></tr>
<tr><td class="cell-left">${_('nummer')}</td><td>${c['attributes']['nummer'] or '-'}</td></tr>
<%
    webDavHost = request.registry.settings['webdav_host']
    url_pdf = webDavHost + '/kogis_web/downloads/geologie/geotope/geotope-CH_' + c['attributes']['fix_id'] + '.pdf'
%>
<tr><td class="cell-left">${_('link2dok')}</td>    <td><a href="${url_pdf}" target="_blank">Link</a></td></tr>
</%def>
