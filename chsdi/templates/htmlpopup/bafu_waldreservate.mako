<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('ch.bafu.waldreservate.objnummer')}</td>                         <td>${c['attributes']['objnummer'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.bafu.waldreservate.name')}</td>                         <td>${c['attributes']['name'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.bafu.waldreservate.gisflaeche')}</td>                   <td>${round(c['attributes']['gisflaeche'],2) or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.bafu.waldreservate.gisteilobjekt')}</td>                   <td>${round(c['attributes']['gisteilobjekt'],2) or '-'}</td></tr>
% if c['attributes']['mcpfe'].strip()== 'MCPFE1.1':
    <tr><td class="cell-left">${_('ch.bafu.waldreservate.mcpfe')}</td>                        <td>${_('ch.bafu.waldreservate.waldreservate_1_1')}</td></tr>
% elif c['attributes']['mcpfe'].strip()== 'MCPFE1.2':
    <tr><td class="cell-left">${_('ch.bafu.waldreservate.mcpfe')}</td>                        <td>${_('ch.bafu.waldreservate.waldreservate_1_2')}</td></tr>
% elif c['attributes']['mcpfe'].strip()== 'MCPFE1.3':
    <tr><td class="cell-left">${_('ch.bafu.waldreservate.mcpfe')}</td>                        <td>${_('ch.bafu.waldreservate.waldreservate_1_3')}</td></tr>
% else:
    <tr><td class="cell-left">${_('ch.bafu.waldreservate.mcpfe')}</td>                        <td>-</td></tr>
% endif
</%def>



