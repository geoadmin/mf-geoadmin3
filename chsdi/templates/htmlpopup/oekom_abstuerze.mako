# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

<% 

    lang = 'fr' if lang in ('fr', 'it') else 'de'
    typ = 'typ_%s' % lang
    absttyp = 'absttyp_%s' % lang
    abstmat = 'abstmat_%s' % lang

%>

    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_abstuerze_abstnr')}</td>             <td>${c['attributes']['abstnr']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_abstuerze_absttyp')}</td>            <td>${c['attributes'][absttyp]}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_abstuerze_abstmat')}</td>            <td>${c['attributes'][abstmat]}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_abstuerze_absthoehe')}</td>          <td>${c['attributes']['absthoehe']}</td></tr>
</%def>

<%def name="extended_info(c, lang)">

<%

    lang = 'fr' if lang in ('fr', 'it') else 'de'
    typ = 'typ_%s' % lang
  
%>

<table>

    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_abstuerze_bemerkung')}</td>          <td>${c['attributes']['bemerkung']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_abstuerze_mass')}</td>               <td>${c['attributes']['mass']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_abstuerze_rechtswert')}</td>         <td>${c['attributes']['rechtswert']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_abstuerze_hochwert')}</td>           <td>${c['attributes']['hochwert']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_abstuerze_abschnr')}</td>            <td>${c['attributes']['abschnr']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_abstuerze_notizen')}</td>            <td>${c['attributes']['notizen']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.oekomorphologie-f_abstuerze_datum')}</td>              <td>${c['attributes']['datum']}</td></tr>

</table>

</%def>

