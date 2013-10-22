<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<%
    typ = 'typ2_%s' % lang
    typ_supp = 'typ2_fr' if lang == 'it' else 'typ2_%s' % lang
    typ_supp = 'typ2_de' if lang == 'rm' else typ_supp 
    fluss = 'flussgb_%s' % lang
    fluss_supp = 'flussgb_fr' if lang == 'it' else 'flussgb_%s' % lang
    fluss_supp = 'flussgb_de' if lang == 'rm' else fluss_supp
%>
    <tr><td width="230">${_('tezgnr40')}</td>       <td>${c['attributes']['teilezgnr'] or '-'}</td></tr>
    <tr><td>${_('klwkp_gwlnr')}</td>                <td>${c['attributes']['gwlnr'] or '-'}</td></tr>
    <tr><td>${_('tt_measure_2')}</td>               <td>${c['attributes']['measure'] or '-'}</td></tr>
    <tr><td>${_('teilezgfla')}</td>                 <td>${c['attributes']['teilezgfla'] or '-'}</td></tr>
    <tr><td>${_('tt_ezgflaeche')}</td>              <td>${c['attributes']['ezgflaeche'] or '-'}</td></tr>
    <tr><td>${_('typ')}</td>                        <td>${c['attributes'][typ] or c['attributes'][typ_supp] or '-'}</td></tr>
    <tr><td>${_('tt_flussgb')}</td>                 <td>${c['attributes'][fluss] or c['attributes'][fluss_supp] or '-'}</td></tr>
</%def>

