# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr>
      <td class="cell-left-large">${_('tezgnr40')}</td>
      <td>${c['attributes']['teilezgnr'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left-large">${_('klwkp_gwlnr')}</td>
      <td>${c['attributes']['gwlnr'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left-large">${_('tt_measure')}</td>
      <td>${c['attributes']['measure'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left-large">${_('tt_endmeasure')}</td>
      <td>${c['attributes']['endmeasure'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left-large">${_('gewaesser')}</td>
      <td>${c['attributes']['name'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left-large">${_('tt_regimenr')}</td>
      <td>${c['attributes']['regimenr'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left-large">${_('tt_regimetyp')}</td>
      <td>${c['attributes']['regimetyp'] or '-'}</td>
    </tr>
</%def>
