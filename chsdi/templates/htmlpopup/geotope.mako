<%inherit file="base.mako"/>
<%def name="preview()">${c['value'] or '-'}</%def>

<%def name="table_body(c,lang)">
<tr><td width="150">${_('name')}</td><td>${c['value'] or '-'}</td></tr>
<tr><td width="150">${_('nummer')}</td><td>${c['attributes']['nummer'] or '-'}</td></tr>
<tr><td width="150">${_('link2dok')}</td>    <td><a href="https://dav0.bgdi.admin.ch/kogis_web/downloads/geologie/geotope/geotope-CH_${c['attributes']['fix_id']}.pdf" target="_blank">Link</a></td></tr>
</%def>
