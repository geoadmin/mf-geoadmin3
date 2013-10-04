<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<%
    typ = 'typ2_%s' % lang
    fluss = 'flussgb_%s' % lang
%>
    <tr><td width="230">${_('tezgnr40')}</td>       <td>${c['attributes']['teilezgnr'] or '-'}</td></tr>
    <tr><td>${_('klwkp_gwlnr')}</td>                <td>${c['attributes']['gwlnr'] or '-'}</td></tr>
    <tr><td>${_('tt_measure_2')}</td>               <td>${c['attributes']['measure'] or '-'}</td></tr>
    <tr><td>${_('teilezgfla')}</td>                 <td>${c['attributes']['teilezgfla'] or '-'}</td></tr>
    <tr><td>${_('tt_ezgflaeche')}</td>              <td>${c['attributes']['ezgflaeche'] or '-'}</td></tr>
    <tr><td>${_('typ')}</td>                        <td>${c['attributes'][typ] or '-'}</td></tr>
    <tr><td>${_('tt_flussgb')}</td>                 <td>${c['attributes'][fluss] or '-'}</td></tr>
</%def>

