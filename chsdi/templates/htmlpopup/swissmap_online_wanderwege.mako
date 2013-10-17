<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td class="cell-left">nr</td><td>${c['featureId']}</td></tr>
    <tr><td class="cell-left">hikingtype</td><td>${c['attributes']['hikingtype'] or '-'}</td></tr>
    <tr><td class="cell-left">bridgetype</td><td>${c['attributes']['bridgetype'] or '-'}</td></tr>
    <tr><td class="cell-left">tunneltype</td><td>${c['attributes']['tunneltype'] or '-'}</td></tr>
</%def>
