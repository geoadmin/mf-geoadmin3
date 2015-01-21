<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
       <tr><td class="cell-left">${_('rohstoff')}</td><td>${c['attributes']['rohstoff'] or '-'}</td></tr>
       <tr><td class="cell-left">${_('ch.swisstopo.geologie-rohstoffe-vererzungen.name_ads')}</td><td>${c['attributes']['name_ads'] or '-'}</td></tr>
</%def>
