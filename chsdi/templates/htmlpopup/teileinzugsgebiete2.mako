<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<%
    typ = 'typ2_%s' % lang
    fluss = 'flussgb_%s' % lang
%>
    <tr>
      <td class="cell-left">${_('tezgnr40')}</td>
      <td>${c['attributes']['teilezgnr'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('klwkp_gwlnr')}</td>
      <td>${c['attributes']['gwlnr'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('tt_measure_2')}</td>
      <td>${c['attributes']['measure'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('teilezgfla')}</td>
      <td>${c['attributes']['teilezgfla'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('tt_ezgflaeche')}</td>
      <td>${c['attributes']['ezgflaeche'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('typ')}</td>
      <td>${c['attributes'][typ] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('tt_flussgb')}</td>
      <td>${c['attributes'][fluss] or '-'}</td>
    </tr>
</%def>

