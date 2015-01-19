<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
       <tr><td class="cell-left">${_('ch.swisstopo.geologie-geotechnik-ziegeleien_1907.ziegelei_2')}</td><td>${c['attributes']['ziegelei_2'] or '-'}</td></tr>
</%def>
