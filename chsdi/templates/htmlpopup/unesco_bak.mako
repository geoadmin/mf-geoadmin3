# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<%
    surface_ha = int(float(c['attributes']['bgdi_surface']) / 10000) 
%>

    <tr><td width="150">${_('bak_unesco_weltkulturerbe_name')}</td>     <td>${c['attributes']['bgdi_name'] or '-'}</td></tr>
    <tr><td width="150">${_('bak_unesco_weltkulturerbe_flaeche')}</td>  <td>${surface_ha}</td></tr>
</%def>
