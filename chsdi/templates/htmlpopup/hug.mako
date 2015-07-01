<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-untersuchungsgebiete.name')}</td>
      <td>${c['attributes']['name'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-untersuchungsgebiete.regimetyp')}</td>
      <td>${c['attributes']['regimtyp'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-untersuchungsgebiete.df')}</td>
      <td>${c['attributes']['df'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-untersuchungsgebiete.sc')}</td>
      <td>${c['attributes']['sc'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-untersuchungsgebiete.shape_area')}</td>
      <td>${c['attributes']['shape_area'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-untersuchungsgebiete.url')}</td>
      <td><a href="${c['attributes']['hyperlink'] or '-'}" target="_blank">${_('ch.bafu.hydrologie-untersuchungsgebiete.url')}</a></td>
    </tr>
</%def>


<%def name="extended_info(c, lang)">

<table>
  <tr>
      <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.name')}</td>
      <td class="cell-meta">${c['attributes']['name'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.max_hoe')}</td>
    <td class="cell-meta">${c['attributes']['max_hoe'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.min_hoe')}</td>
    <td class="cell-meta">${c['attributes']['min_hoe'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.mit_hoe')}</td>
    <td class="cell-meta">${c['attributes']['mit_hoe'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.station')}</td>
    <td class="cell-meta">${c['attributes']['station'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.regimetyp')}</td>
    <td class="cell-meta">${c['attributes']['regimtyp'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.df')}</td>
    <td class="cell-meta">${c['attributes']['df'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.sc')}</td>
    <td class="cell-meta">${c['attributes']['sc'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.ms')}</td>
    <td class="cell-meta">${c['attributes']['ms'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.mp')}</td>
    <td class="cell-meta">${c['attributes']['mp'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.antws_tot')}</td>
    <td class="cell-meta">${c['attributes']['antws_tot'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.antogr')}</td>
    <td class="cell-meta">${c['attributes']['antogr'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.antwiack')}</td>
    <td class="cell-meta">${c['attributes']['antwiack'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.antweid')}</td>
    <td class="cell-meta">${c['attributes']['antweid'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.antunpr')}</td>
    <td class="cell-meta">${c['attributes']['antunpr'] or '-'}</td>
  </tr>
    <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.antgeb')}</td>
    <td class="cell-meta">${c['attributes']['antgeb'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.antindu')}</td>
    <td class="cell-meta">${c['attributes']['antindu'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.antgew_ms')}</td>
    <td class="cell-meta">${c['attributes']['antgew_ms'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.antveg_los_ov')}</td>
    <td class="cell-meta">${c['attributes']['antveg_los_ov'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.antv_ab86')}</td>
    <td class="cell-meta">${c['attributes']['antv_ab86'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.shape_area')}</td>
% if c['attributes']['shape_area']:    
    <td class="cell-meta">${round(c['attributes']['shape_area'],2) or '-'}</td>
% else:
    <td>-</td>
% endif
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-untersuchungsgebiete.url')}</td>
    <td class="cell-meta"><a href="${c['attributes']['hyperlink'] or '-'}" target="_blank">${_('ch.bafu.hydrologie-untersuchungsgebiete.url')}</a></td>
  </tr>
</table>
</%def>
