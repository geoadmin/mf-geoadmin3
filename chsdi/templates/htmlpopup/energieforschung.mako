<%inherit file="base.mako"/> 

<%def name="table_body(c, lang)">
<% c[stable_id] = True %>
% if lang =='fr':
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projekttitel')}</td>   <td>${c['attributes']['titel_fr'] or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_beschreibung')}</td>   <td>${c['attributes']['beschreibung_fr'] or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projektstatus')}</td>  <td>${c['attributes']['projektstatus_fr'] or '-'}</td></tr>

% elif lang == 'it':
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projekttitel')}</td>   <td>${c['attributes']['titel_it'] or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_beschreibung')}</td>   <td>${c['attributes']['beschreibung_it'] or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projektstatus')}</td>  <td>${c['attributes']['projektstatus_it'] or '-'}</td></tr>

% elif lang =='en':
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projekttitel')}</td>   <td>${c['attributes']['titel_en'] or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_beschreibung')}</td>   <td>${c['attributes']['beschreibung_en'] or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projektstatus')}</td>  <td>${c['attributes']['projektstatus_en'] or '-'}</td></tr>

% else:
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projekttitel')}</td>   <td>${c['attributes']['titel_de'] or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_beschreibung')}</td>   <td>${c['attributes']['beschreibung_de'] or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projektstatus')}</td>  <td>${c['attributes']['projektstatus_de'] or '-'}</td></tr>
% endif

% if c['attributes']['schlussbericht']:
    <tr><td width="150">${_('tt_ch.bfe.energieforschung_schlussbericht')}</td>              <td><a href="${c['attributes']['schlussbericht']}" target="_blank">${_('tt_ch.bfe.energieforschung_schlussbericht')}</a></td></tr>
% endif

<tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_kontaktperson')}</td>      <td>${c['attributes']['kontaktperson_bfe'] or '-'}</td></tr>
</%def>
