# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    % if c['attributes']['nbofprovider'] > 0:
        <%        
            i=c['attributes']['nbofprovider']
            aliasarr=[unicode(a) for a in c['attributes']['alias'].split(';')]
            urlarr=[unicode(b) for b in c['attributes']['fdaurl'].split(';')]
        %>
        % for x in xrange(0,i):
            <tr><td><a href="${urlarr[x] or '-'}" target="_blank">${aliasarr[x] or '-'}</a></td></tr>
	    % endfor
    % else:
        <tr><td> - </td></tr>
	% endif
</%def>
