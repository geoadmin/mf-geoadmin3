<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c[stable_id] = True %>
    <tr><td width="150">${_('tt_sachplan_facility_name')}</td>                  <td>${c['attributes']['facname_de']}</td></tr>
    % if lang == 'de' or lang == 'rm' or lang == 'en':
        <tr><td width="150">${_('tt_sachplan_facility_anlageart')}</td>         <td>${c['attributes']['fackind_text_de'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_facility_anlagestatus')}</td>      <td>${c['attributes']['facstatus_text_de'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_facility_beschlussdatum')}</td>    <td>${c['attributes']['validfrom'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_beschreibung')}</td>               <td>${c['attributes']['description_text_de'] or '-'}</td></tr>
    % elif lang == 'fr':
        <tr><td width="150">${_('tt_sachplan_facility_anlageart')}</td>         <td>${c['attributes']['fackind_text_fr'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_facility_anlagestatus')}</td>      <td>${c['attributes']['facstatus_text_fr'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_facility_beschlussdatum')}</td>    <td>${c['attributes']['validfrom'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_beschreibung')}</td>               <td>${c['attributes']['description_text_fr'] or '-'}</td></tr>
	% elif lang == 'it':
        <tr><td width="150">${_('tt_sachplan_facility_anlageart')}</td>         <td>${c['attributes']['fackind_text_it'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_facility_anlagestatus')}</td>      <td>${c['attributes']['facstatus_text_it'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_facility_beschlussdatum')}</td>    <td>${c['attributes']['validfrom'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_beschreibung')}</td>               <td>${c['attributes']['description_text_it'] or '-'}</td></tr>
    % endif
    % if c['attributes']['document_web'] is None:
        <tr><td width="150">${_('tt_sachplan_weitereinfo')}</td>                <td> - </td></tr>
    % else:
        <tr><td width="150">${_('tt_sachplan_weitereinfo')}</td>                <td><a href="${c['attributes']['document_web'] or '-'}" target="_blank">${_('tt_sachplan_objektblatt')}</a></td></tr>
    %endif
    % if lang == 'de' or lang == 'rm' or lang == 'en':
        <tr><td width="150">${_('tt_sachplan_facility_uberobjekt')}</td>        <td>${c['attributes']['objectname_de'] or '-'}</td></tr>
    % elif lang == 'fr':
        <tr><td width="150">${_('tt_sachplan_facility_uberobjekt')}</td>        <td>${c['attributes']['objectname_fr'] or '-'}</td></tr>
	% elif lang == 'it':
        <tr><td width="150">${_('tt_sachplan_facility_uberobjekt')}</td>        <td>${c['attributes']['objectname_it'] or '-'}</td></tr>
    % endif
</%def>
