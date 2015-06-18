<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c['stable_id'] = True %>
    <tr>
      <td class="cell-left">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.bwid')}</td>
      <td>${c['attributes']['bwid'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.bwname')}</td>
      <td>${c['attributes']['bwname']}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.groupid')}</td>
      <td>${c['attributes']['groupid'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.qualitaetklasse')}</td>
      <td>${c['attributes']['qualitaetklasse'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.rbdsuname')}</td>
      <td>${c['attributes']['rbdsuname'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.nwunitname')}</td>
      <td>${c['attributes']['nwunitname'] or '-'}</td>
    </tr>
</%def>

<%def name="extended_info(c, lang)">

<table>
  <tr>
      <td class="cell-meta">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.bwid')}</td>
      <td class="cell-meta">${c['attributes']['bwid'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.bwname')}</td>
    <td class="cell-meta">${c['attributes']['bwname'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.groupid')}</td>
    <td class="cell-meta">${c['attributes']['groupid'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.qualitaetklasse')}</td>
    <td class="cell-meta">${c['attributes']['qualitaetklasse']}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.aeussereraspekt')}</td>
    <td class="cell-meta">${c['attributes']['aeussereraspekt'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.yearbw')}</td>
    <td class="cell-meta">${c['attributes']['yearbw'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.ch1903x')}</td>
    <td class="cell-meta">${c['attributes']['ch1903x'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.ch1903y')}</td>
    <td class="cell-meta">${c['attributes']['ch1903y'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.rbdname')}</td>
    <td class="cell-meta">${c['attributes']['rbdname'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.rbdsuname')}</td>
    <td class="cell-meta">${c['attributes']['rbdsuname'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.nwunitname')}</td>
    <td class="cell-meta">${c['attributes']['nwunitname'] or '-'}</td>
  </tr>
    <tr>
    <td class="cell-meta">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.url')}</td>
% if c['attributes']['url']:
    <td class="cell-meta"><a href="${c['attributes']['url'] or '-'}" target="_blank">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.url')}</a></td>
% else:
    <td class="cell-meta">-</td>
% endif
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.kanton')}</td>
    <td class="cell-meta">${c['attributes']['kanton'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.latbw')}</td>
    <td class="cell-meta">${c['attributes']['latbw'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.gewaesserschutz-badewasserqualitaet.lonbw')}</td>
    <td class="cell-meta">${c['attributes']['lonbw'] or '-'}</td>
  </tr>
</table>
</%def>
