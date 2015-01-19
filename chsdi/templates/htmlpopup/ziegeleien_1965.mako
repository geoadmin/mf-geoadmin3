<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td class="cell-left">${_('ch.swisstopo.geologie-geotechnik-ziegeleien_1965.ziegelei')}</td><td>${c['attributes']['ziegelei'] or '-'}</td></tr>
</%def>
