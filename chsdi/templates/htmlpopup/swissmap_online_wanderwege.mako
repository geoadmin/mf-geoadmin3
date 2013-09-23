<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td width="150">nr</td><td>${c['featureId']}</td></tr>
    <tr><td width="150">hikingtype</td><td>${c['attributes']['hikingtype'] or '-'}</td></tr>
    <tr><td width="150">bridgetype</td><td>${c['attributes']['bridgetype'] or '-'}</td></tr>
    <tr><td width="150">tunneltype</td><td>${c['attributes']['tunneltype'] or '-'}</td></tr>
</%def>
