<%inherit file="base.mako"/>

<%def name="preview()">${c['featureId'] or '-'}</%def>

<%def name="table_body(c,lang)">
   <tr><td width="150" valign="top">${_('contour')}</td><td>${c['attributes']['contour'] or '-'}</td></tr>
</%def>
