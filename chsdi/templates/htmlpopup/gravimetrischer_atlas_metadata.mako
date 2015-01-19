<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.titel or '-'}</%def>

<%def name="table_body(c, lang)">
<%
    lang = 'fr' if lang in ('fr','it') else 'de'
    format = 'formate_%s' % lang
%>
    <tr><td class="cell-left">${_('ch.swisstopo.geologie-gravimetrischer_atlas.metadata.id')}</td>             <td>${c['featureId']}</td></tr> 
    <tr><td class="cell-left">${_('ch.swisstopo.geologie-gravimetrischer_atlas.metadata.titel')}</td>          <td>${c['attributes']['titel']}</td></tr>
    <tr><td class="cell-left">${_('ausgabejahr')}</td>    <td>${c['attributes']['jahr']}</td></tr>
    <tr><td class="cell-left">${_('autor')}</td>          <td>${c['attributes']['autor']}</td></tr>
    <tr><td class="cell-left">${_('format_de')}</td>            <td>${c['attributes'][format]}</td></tr>

</%def>
