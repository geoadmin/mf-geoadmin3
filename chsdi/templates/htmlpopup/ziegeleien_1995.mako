<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
       <tr><td class="cell-left">${_('ch.swisstopo.geologie-geotechnik-ziegeleien_1995.ziegeleien')}</td><td>${c['attributes']['ziegeleien'] or '-'}</td></tr>
       <tr><td class="cell-left">${_('produkt')}</td><td>${c['attributes']['produkt'] or '-'}</td></tr>
</%def>
