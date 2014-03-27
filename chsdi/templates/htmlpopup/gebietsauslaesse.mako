<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<%
    kanal = 'kanal_%s' % lang
%>

    <tr><td class="cell-left">${_('tt_ezgnr')}</td>    <td>${c['attributes']['ezgnr'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('klwkp_gwlnr')}</td>          <td>${c['attributes']['gwlnr'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_measure_2')}</td>         <td>${c['attributes']['measure'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ezgflaeche')}</td>         <td>${c['attributes']['gesamtflae'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_anteil_ch')}</td>         <td>${c['attributes']['anteil_ch'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('gewaesser')}</td>         <td>${c['attributes']['gewaessern'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_kanal')}</td>       <td>${c['attributes'][kanal] or '-'}</td></tr>
</%def>

<%def name="extended_info(c, lang)">
<%
    kanal = 'kanal_%s' % lang
%>

    <table class="table-with-border">
        <tr><th class="cell-left">${_('tt_ezgnr')}</th>    <td>${c['attributes']['ezgnr'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('klwkp_gwlnr')}</th>          <td>${c['attributes']['gwlnr'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('tt_measure_2')}</th>         <td>${c['attributes']['measure'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('tt_ezgflaeche')}</th>         <td>${c['attributes']['gesamtflae'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('tt_anteil_ch')}</th>         <td>${c['attributes']['anteil_ch'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('gewaesser')}</th>         <td>${c['attributes']['gewaessern'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('tt_kanal')}</th>       <td>${c['attributes'][kanal] or '-'}</td></tr>
        <tr><th class="cell-left">${_('tt_meanalt')}</th>       <td>${c['attributes']['meanalt'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('tt_maxalt')}</th>       <td>${c['attributes']['maxalt'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('tt_mq_jahr')}</th>       <td>${c['attributes']['mq_jahr'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('tt_feuchtflae')}</th>       <td>${c['attributes']['feuchtflae'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('tt_wasserflae')}</th>       <td>${c['attributes']['wasserflae'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('tt_bebautefl')}</th>       <td>${c['attributes']['bebautefl'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('tt_landwirtsc')}</th>       <td>${c['attributes']['landwirtsc'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('tt_wald_natur')}</th>       <td>${c['attributes']['wald_natur'] or '-'}</td></tr>
    </table>
</%def>
