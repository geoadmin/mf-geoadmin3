<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<%
    lang = lang
    kanal = 'kanal_%s' % lang
%>

    <tr><td width="150">${_('tt_ezgnr')}</td>    <td>${c['attributes']['ezgnr'] or '-'}</td></tr>
    <tr><td>${_('klwkp_gwlnr')}</td>          <td>${c['attributes']['gwlnr'] or '-'}</td></tr>
    <tr><td>${_('tt_measure_2')}</td>         <td>${c['attributes']['measure'] or '-'}</td></tr>
    <tr><td>${_('tt_ezgflaeche')}</td>         <td>${c['attributes']['gesamtflae'] or '-'}</td></tr>
    <tr><td>${_('tt_anteil_ch')}</td>         <td>${c['attributes']['anteil_ch'] or '-'}</td></tr>
    <tr><td>${_('gewaesser')}</td>         <td>${c['attributes']['gewaessern'] or '-'}</td></tr>
    <tr><td>${_('tt_kanal')}</td>       <td>${c['attributes'][kanal] or '-'}</td></tr>
</%def>

