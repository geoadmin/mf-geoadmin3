# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

<% 
    lang = 'fr' if lang in ('fr', 'it') else 'de'
    typ = 'typ_%s' % lang
    bauwtyp = 'bauwtyp_%s' % lang
    
%>

    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_bauwerke_bauwnr')}</td>             <td>${c['attributes']['bauwnr']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_bauwerke_bauwtyp')}</td>            <td>${c['attributes'][bauwtyp]}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_bauwerke_bauwhoehe')}</td>          <td>${c['attributes']['bauwhoehe']}</td></tr>
</%def>

<%def name="extended_info(c, lang)">

<%
    lang = 'fr' if lang in ('fr', 'it') else 'de'
    typ = 'typ_%s' % lang

%>

<table>

    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_bauwerke_mass')}</td>               <td>${c['attributes']['mass']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_bauwerke_rechtswert')}</td>         <td>${c['attributes']['rechtswert']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_bauwerke_hochwert')}</td>           <td>${c['attributes']['hochwert']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_bauwerke_abschnr')}</td>            <td>${c['attributes']['abschnr']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_bauwerke_bemerkung')}</td>          <td>${c['attributes']['bemerkung']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_bauwerke_notizen')}</td>            <td>${c['attributes']['notizen']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_bauwerke_datum')}</td>              <td>${c['attributes']['datum']}</td></tr>

</table>

</%def>





