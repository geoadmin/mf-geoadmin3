<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('tt_emission_lin_nr_dfa')}</td>         <td>${c['attributes']['lin_nr_dfa'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_emission_von_m')}</td>          <td>${int(round(c['attributes']['von_m'])) or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_emission_bis_m')}</td>         <td>${int(round(c['attributes']['bis_m'])) or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_emission_lre_t')}</td>         <td>${c['attributes']['lre_t'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_emission_lre_n')}</td>         <td>${c['attributes']['lre_n'] or '-'}</td></tr>
</%def>

