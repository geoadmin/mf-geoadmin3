<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
   <tr><td class="cell-left">${_('ch.swisstopo.geologie-eiszeit-lgm.ads_name')}</td><td>${c['attributes']['ads_name'] or '-'}</td></tr>
</%def>
