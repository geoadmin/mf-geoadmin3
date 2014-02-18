<%inherit file="base.mako"/>
<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
       <tr><td width="150" valign="top">${_('gesteinsgr')}</td><td>${c.feature.gesteinsgr or '-'}</td></tr>
       <tr><td width="150">${_('gestein')}</td><td>${c.feature.gestein or '-'}</td></tr>
</%def>
