<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
       <tr><td class="cell-left" valign="top">${_('gesteinsgr')}</td><td>${c['attributes']['gesteinsgr'] or '-'}</td></tr>
       <tr><td class="cell-left">${_('gestein')}</td><td>${c['attributes']['gestein'] or '-'}</td></tr>
</%def>
