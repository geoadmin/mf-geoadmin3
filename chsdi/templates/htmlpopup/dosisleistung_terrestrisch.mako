<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.titel or '-'}</%def>

<%def name="table_body(c, lang)">
<tr><td class="cell-left">${_('ch.swisstopo.geologie-dosisleistung-terrestrisch.contour')}</td>    <td>${c['attributes']['contour'] or '-'}</td></tr>
</%def>
