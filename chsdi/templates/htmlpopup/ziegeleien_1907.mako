<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
       <tr><td width="150" valign="top">${_('ziegeleien')}</td><td>${c['attributes']['ziegelei_2'] or '-'}</td></tr>
</%def>
