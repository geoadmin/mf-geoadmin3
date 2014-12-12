<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
  <tr><td class="cell-left">${_('tt_emission_nacht_tag_lin_nr_dfa')}</td>     <td>${c['attributes']['lin_nr_dfa'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_nacht_tag_linienbeze')}</td>     <td>${c['attributes']['linienbeze'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_von_abkz')}</td>          <td>${c['attributes']['von_abkz'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_von_bpk_bp')}</td>          <td>${c['attributes']['von_bpk_bp'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_bis_abkz')}</td>          <td>${c['attributes']['bis_abkz'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_bis_bpk_bp')}</td>          <td>${c['attributes']['bis_bpk_bp'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_nacht_tag_von_m')}</td>          <td>${c['attributes']['von_m'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_nacht_tag_bis_m')}</td>          <td>${c['attributes']['bis_m'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_nacht_tag_lre_n')}</td>          <td>${c['attributes']['lre_n'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_nacht_tag_k1_n')}</td>          <td>${c['attributes']['k1_n'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_fb1')}</td>          <td>${c['attributes']['fb1'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_nacht_tag_grund1')}</td>          <td>${c['attributes']['grund1'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_fb2')}</td>          <td>${c['attributes']['fb2'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_nacht_tag_grund2')}</td>          <td>${c['attributes']['grund2'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_typ_aender')}</td>          <td>${c['attributes']['typ_aender'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_datum')}</td>          <td>${c['attributes']['datum'] or '-'}</td></tr>
</%def>
