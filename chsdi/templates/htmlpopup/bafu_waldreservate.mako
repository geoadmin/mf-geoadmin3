<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('SGNr')}</td>                         <td>${c['attributes']['objnummer'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('name')}</td>                         <td>${c['attributes']['name'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('flaeche_ha')}</td>                   <td>${round(c['attributes']['gisflaeche'],2) or '-'}</td></tr>
% if c['attributes']['mcpfe'].strip()== 'MCPFE1.1':
    <tr><td class="cell-left">${_('MCPFE')}</td>                        <td>${_('tt_waldreservate_1_1')}</td></tr>
% elif c['attributes']['mcpfe'].strip()== 'MCPFE1.2':
    <tr><td class="cell-left">${_('MCPFE')}</td>                        <td>${_('tt_waldreservate_1_2')}</td></tr>
% elif c['attributes']['mcpfe'].strip()== 'MCPFE1.3':
    <tr><td class="cell-left">${_('MCPFE')}</td>                        <td>${_('tt_waldreservate_1_3')}</td></tr>
% else:
    <tr><td class="cell-left">${_('MCPFE')}</td>                        <td>-</td></tr>
% endif
</%def>



