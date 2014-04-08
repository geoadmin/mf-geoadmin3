<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
  <tr><td class="cell-left">${_('tt_shb_objekt')}</td>     <td>${c['attributes']['objekt'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_shb_objtyp')}</td>     <td>${c['attributes']['obtyp'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_shb_ort')}</td>        <td>${c['attributes']['ort'] or '-'}</td></tr>
</%def>

<%def name="extended_info(c, lang)">
<%
    objteil = c['attributes']['objektteil'].split('##')
    alter =  c['attributes']['age'].split('##')
    gesteinart =  c['attributes']['gestart'].split('##')
    referenz =  c['attributes']['referenz'].split('##')
    link =  c['attributes']['hyperlink'].split('##')
    bemerkung =  c['attributes']['bemerkung'].split('##')
    abbauort =  c['attributes']['abbauort'].split('##')

    arr_len = len(objteil)
%>

    <table class="table-with-border">
    <tr><td width="100%" valign="top" colspan="2"><h1 class="tooltip_large_titel">${_('tt_shb_objekt')}</h1></tr>
    <tr><td width="150">${_('tt_shb_objekt')}</td>    <td>${c['attributes']['objekt']}</td></tr>
    <tr><td width="150">${_('tt_shb_objtyp')}</td>    <td>${c['attributes']['obtyp'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_shb_ort')}</td>       <td>${c['attributes']['ort'] or '-'}</td></tr>
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>

% for i in range(arr_len):
    <tr><td valign="top"><h1 stile="bold">${_('tt_shb_objteil')}</h1></td><td><h2 stile="bold">${objteil[i] or '-'}</h2></td></tr>
    <tr><td width="150">${_('tt_shb_alter')}</td>     <td>${alter[i] or '-'}</td></tr>
    <tr><td width="150">${_('tt_shb_gart')}</td>      <td>${gesteinart[i] or '-'}</td></tr>
    <tr><td width="150">${_('tt_shb_ref')}</td>       <td>${referenz[i] or '-'}</td></tr>
    <tr><td width="150">${_('tt_shb_abbauort')}</td>  <td>${abbauort[i] or '-'}</td></tr>
    <tr><td width="150">${_('tt_shb_bemerkung')}</td> <td>${bemerkung[i] or '-'}</td></tr>
    <tr><td width="150">${_('tt_shb_link')}</td>      <td><a href=${link[i]} target="_blank">PDF</a></td></tr>
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
% endfor
  </table>
</%def>
