<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    % if c['attributes']['powercode'] =='P1':
        <tr><td class="cell-left">${_('tt_ch.bakom.leistung')}</td>   <td>${_('tt_bakom_veryweak')}</td></tr>
    % elif c['attributes']['powercode'] =='P2':
        <tr><td class="cell-left">${_('tt_ch.bakom.leistung')}</td>   <td>${_('tt_bakom_weak')}</td></tr>
    % elif c['attributes']['powercode'] =='P3':
        <tr><td class="cell-left">${_('tt_ch.bakom.leistung')}</td>   <td>${_('tt_bakom_middle')}</td></tr>
    % else:
        <tr><td class="cell-left">${_('tt_ch.bakom.leistung')}</td>   <td>${_('tt_bakom_strong')}</td></tr>
    % endif
</%def>
