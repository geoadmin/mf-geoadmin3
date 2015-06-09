<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<%
    lang = lang if lang in ('fr','it') else 'de'
%>
    <tr><td class="cell-left">${_('ch.bafu.vec25-gewaessernetz_2000.gwlnr')}</td>       <td>${c['attributes']['gwlnr']}</td></tr>
    <tr><td class="cell-left">${_('ch.bafu.vec25-gewaessernetz_2000.gewissnr')}</td>    <td>${c['attributes']['gewissnr'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.bafu.vec25-gewaessernetz_2000.name')}</td>        <td>${c['attributes']['name'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.bafu.vec25-gewaessernetz_2000.objectval')}</td>   <td>${c['attributes']['objectval'] or '-'}</td></tr>
</%def>
