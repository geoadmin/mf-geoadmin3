<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c[stable_id] = True %>
    % if lang == 'de' or lang == 'rm' or lang == 'en':
        <tr><td width="150">${_('tt_sachplan_facility_name')}</td>          <td>${c['attributes']['facname_de'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_facility_anlageart')}</td>     <td>${c['attributes']['fackind_text_de'] or '-'}</td></tr>
	    <tr><td width="150">${_('tt_sachplan_facility_anlagestatus')}</td>  <td>${c['attributes']['facstatus_text_de'] or '-'}</td></tr>
    % elif lang == 'fr':
        <tr><td width="150">${_('tt_sachplan_facility_name')}</td>          <td>${c['attributes']['facname_fr'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_facility_anlageart')}</td>     <td>${c['attributes']['fackind_text_fr'] or '-'}</td>
        <tr><td width="150">${_('tt_sachplan_facility_anlagestatus')}</td>  <td>${c['attributes']['facstatus_text_fr'] or '-'}</td></tr>
    % elif lang == 'it':
        <tr><td width="150">${_('tt_sachplan_facility_name')}</td>          <td>${c['attributes']['facname_it'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_facility_anlageart')}</td>     <td>${c['attributes']['fackind_text_it'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_facility_anlagestatus')}</td>  <td>${c['attributes']['facstatus_text_it'] or '-'}</td></tr>
    % endif
    <tr><td width="150">${_('tt_sachplan_facility_beschlussdatum')}</td>    <td>${c['attributes']['validfrom'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_sachplan_beschreibung')}</td>               <td>${c['attributes']['description'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_sachplan_weitereinfo')}</td>
    % if c['attributes']['web'] is None:
        <td> - </td>i</tr>
    % else:
        <td><a href="${c['attributes']['web'] or '-'}" target="_blank">${_('tt_sachplan_objektblatt')}</a></td></tr>
    %endif
    % if lang == 'de' or lang == 'rm' or lang == 'en':
        <tr><td width="150">${_('tt_sachplan_facility_uberobjekt')}</td>    <td>${c['attributes']['objname_text_de'] or '-'}</td></tr>
    % elif lang == 'fr':
        <tr><td width="150">${_('tt_sachplan_facility_uberobjekt')}</td>    <td>${c['attributes']['objname_text_fr'] or '-'}</td></tr>
    % elif lang == 'it':
        <tr><td width="150">${_('tt_sachplan_facility_uberobjekt')}</td>    <td>${c['attributes']['objname_text_it'] or '-'}</td></tr>
    % endif
</%def>
