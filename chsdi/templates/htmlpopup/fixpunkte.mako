<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<%
    nummer = c['layerBodId'] + '.' + 'id'
%>
    <% c['stable_id'] = True %>
	<tr><td class="cell-left">${_(nummer)}</td>         <td>${c['featureId']}</td></tr>
<!--	
    <tr><td class="cell-left">${_('name')}</td>           <td>${c['attributes']['punktname'] or '-'}</td></tr> 
-->
	<tr><td class="cell-left">${_('status_fp')}</td>      <td>${c['attributes']['status'] or '-'}</td></tr>
	<tr><td class="cell-left">${_('fp_Y03_X03')}</td>     <td>${c['attributes']['y03'] or '-'} / ${c['attributes']['x03'] or '-'}</td></tr>
	<tr><td class="cell-left">${_('fp_E95_N95')}</td>     <td>${c['attributes']['e95'] or '-'} / ${c['attributes']['n95'] or '-'}</td></tr>
	<tr><td class="cell-left">${_('fp_H02')}</td>         <td>${c['attributes']['h02'] or '-'}</td></tr>
<!--	
    <tr><td class="cell-left">${_('zugang')}</td>         <td>${c['attributes']['zugang'] or '-'}</td></tr> 
-->
	<tr><td class="cell-left">${_('protokoll')}</td>      <td><a href="${c['attributes']['url'] or '-'}" target="_blank">${_('protokoll')}</a></td></tr>
</%def>
