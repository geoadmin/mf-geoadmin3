# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="preview()">${c['featureId']}</%def>

<%def name="table_body(c, lang)">
	% if c['value'] > 0:
    <tr>
        <%        
            i=c['value']
            aliasarr=[unicode(a) for a in c['attributes']['alias'].split(';')]
            urlarr=[unicode(b) for b in c['attributes']['fdaurl'].split(';')]
        %>
        % for x in xrange(0,i):
                <td><a href="${urlarr[x] or '-'}" target="_blank">${aliasarr[x] or '-'}</a></td></tr>
	    % endfor
    % else:
       <td> - </td>
	% endif
</%def>
