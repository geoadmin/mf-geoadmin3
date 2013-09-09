<%inherit file="base.mako"/>
<%def name="preview()">${c['featureId'] or '-'}</%def>

<%def name="table_body(c,lang)">
       <tr><td width="150" valign="top">${_('ziegeleien')}</td><td>${c['attributes']['ziegeleien'] or '-'}</td></tr>
       <tr><td width="150">${_('produkt')}</td><td>${c['attributes']['produkt'] or '-'}</td></tr>
</%def>
