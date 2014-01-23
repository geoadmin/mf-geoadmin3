# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    % if c['attributes']['nbofprovider'] > 0:
        <%
            aliasarr = c['attributes']['alias'].split(';')
            urlarr = c['attributes']['fdaurl'].split(';')
            aliasdict = dict(zip(aliasarr, urlarr))
        %>
        % for key in sorted(aliasdict.iterkeys(), key=unicode.lower):
            <tr><td><a href="${aliasdict[key] or '-'}" target="_blank">${key or '-'}</a></td></tr>
	    % endfor
    % else:
        <tr><td> - </td></tr>
	% endif
</%def>
