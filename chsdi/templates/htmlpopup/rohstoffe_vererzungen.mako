<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
       <tr><td width="150" valign="top">${_('rohstoff')}</td><td>${c['attributes']['rohstoff'] or '-'}</td></tr>
       <tr><td width="150">${_('name_ads')}</td><td>${c['attributes']['name_ads'] or '-'}</td></tr>
</%def>
