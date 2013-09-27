<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
       <tr><td width="150" valign="top">${_('gesteinsgr')}</td><td>${c['attributes']['gesteinsgr'] or '-'}</td></tr>
       <tr><td width="150">${_('gestein')}</td><td>${c['attributes']['gestein'] or '-'}</td></tr>
</%def>
