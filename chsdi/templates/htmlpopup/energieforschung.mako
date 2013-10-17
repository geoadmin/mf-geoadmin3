<%inherit file="base.mako"/> 

<%def name="table_body(c, lang)">
<% 
    c['stable_id'] = True
    lang = lang if lang != 'rm' else 'de'
    title = 'titel_%s' % lang
    beschreibung = 'beschreibung_%s' % lang
    projektstatus = 'projektstatus_%s' % lang
%>
    <tr><td class="cell-left">${_('tt_ch.bfe.energieforschung_projekttitel')}</td>   <td>${c['attributes'][title] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.energieforschung_beschreibung')}</td>   <td>${c['attributes'][beschreibung] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.energieforschung_projektstatus')}</td>  <td>${c['attributes'][projektstatus] or '-'}</td></tr>

% if 'schlussbericht' in c['attributes']:
    <tr><td class="cell-left">${_('tt_ch.bfe.energieforschung_schlussbericht')}</td>              <td><a href="${c['attributes']['schlussbericht']}" target="_blank">${_('tt_ch.bfe.energieforschung_schlussbericht')}</a></td></tr>
% endif

<tr><td class="cell-left">${_('tt_ch.bfe.energieforschung_kontaktperson')}</td>      <td>${c['attributes']['kontaktperson_bfe'] or '-'}</td></tr>
</%def>
