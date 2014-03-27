<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
  <tr><td class="cell-left">${_('tt_emission_lin_nr_dfa')}</td>     <td>${c['attributes']['lin_nr_dfa'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_von_m')}</td>          <td>${int(round(c['attributes']['von_m'])) or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_bis_m')}</td>          <td>${int(round(c['attributes']['bis_m'])) or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_lre_t')}</td>          <td>${c['attributes']['lre_t'] or '-'}</td></tr>
  <tr><td class="cell-left">${_('tt_emission_lre_n')}</td>          <td>${c['attributes']['lre_n'] or '-'}</td></tr>
</%def>

<%def name="extended_info(c, lang)">
	<table class="table-with-border">
    ${row(_('tt_emission_lin_nr_dfa'), c['attributes']['lin_nr_dfa'])}
    ${row(_('tt_emission_linienbeze'), c['attributes']['linienbeze'])}
    ${row(_('tt_emission_von_abkz'), c['attributes']['von_abkz'])}
    ${row(_('tt_emission_von_bpk_bp'), c['attributes']['von_bpk_bp'])}
    ${row(_('tt_emission_bis_abkz'), c['attributes']['bis_abkz'])}
    ${row(_('tt_emission_bis_bpk_bp'), c['attributes']['bis_bpk_bp'])}
    ${row(_('tt_emission_von_m'), c['attributes']['von_m'])}
    ${row(_('tt_emission_bis_m'), c['attributes']['bis_m'])}
    ${row(_('tt_emission_lre_t'), c['attributes']['lre_t'])}
    ${row(_('tt_emission_lre_n'), c['attributes']['lre_n'])}
    ${row(_('tt_emission_k1_t'), c['attributes']['k1_t'])}
    ${row(_('tt_emission_k1_n'), c['attributes']['k1_n'])}
    ${row(_('tt_emission_fb1'), c['attributes']['fb1'])}
    ${row(_('tt_emission_grund1'), c['attributes']['grund1'])}
    ${row(_('tt_emission_fb2'), c['attributes']['fb2'])}
    ${row(_('tt_emission_grund2'), c['attributes']['grund2'])}
    ${row(_('tt_emission_typ_aender'), c['attributes']['typ_aender'])}
    ${row(_('tt_emission_datum'), c['attributes']['datum'])}
  </table>
</%def>

<%def name="row(label, value)">
  <tr>
	  <th class="cell-left">
      ${label}
    </th>
    <td class="cell-left">
      ${value}
    </td>
  </tr>
</%def>
