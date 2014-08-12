<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('SGNr')}</td>                         <td>${int(round(c['attributes']['sg_nr'])) or '-'}</td></tr>
    <tr><td class="cell-left">${_('name')}</td>                         <td>${c['attributes']['name'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('flaeche_ha')}</td>                   <td>${round(c['attributes']['gisflaeche'],2) or '-'}</td></tr>
% if c['attributes']['mcpfe'].strip()== 'e1':
    <tr><td class="cell-left">${_('MCPFE')}</td>                        <td>${_('tt_pronatura_e1')}</td></tr>
% elif c['attributes']['mcpfe'].strip()== 'e2':
    <tr><td class="cell-left">${_('MCPFE')}</td>                        <td>${_('tt_pronatura_e2')}</td></tr>
% elif c['attributes']['mcpfe'].strip()== 'e3':
    <tr><td class="cell-left">${_('MCPFE')}</td>                        <td>${_('tt_pronatura_e3')}</td></tr>
% else:
    <tr><td class="cell-left">${_('MCPFE')}</td>                        <td>-</td></tr>
% endif
</%def>

