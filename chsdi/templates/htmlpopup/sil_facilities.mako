<%inherit file="base.mako"/>

#<%def name="preview()">
#   % if lang == 'de' or lang == 'rm' or lang == 'en':
#   ${c['attributes']['facname_de'] or '-'}
#   % elif lang == 'fr':
#   ${c['attributes']['facname_fr'] or '-'}
#   % elif lang == 'it':
#   ${c['attributes']['facname_it'] or '-'}
#   % endif
#</%def>

<%def name="table_body(c, lang)">
<% c[stable_id] = True %>
    <tr><td width="150">${_('tt_sachplan_facility_name')}</td>    <td>${c['value']}</td></tr>
    <tr><td width="150">${_('tt_sachplan_facility_anlageart')}</td>
      % if lang == 'de' or lang == 'rm' or lang == 'en':
           <td>${c['attributes']['fackind_text_de'] or '-'}</td>
      % elif lang == 'fr':
           <td>${c['attributes']['fackind_text_fr'] or '-'}</td>
	  % elif lang == 'it':
           <td>${c['attributes']['fackind_text_it'] or '-'}</td>   
      % endif
    </tr>
	<tr><td width="150">${_('tt_sachplan_facility_anlagestatus')}</td>
      % if lang == 'de' or lang == 'rm' or lang == 'en':
           <td>${c['attributes']['facstatus_text_de'] or '-'}</td>
      % elif lang == 'fr':
           <td>${c['attributes']['facstatus_text_fr'] or '-'}</td>
	  % elif lang == 'it':
           <td>${c['attributes']['facstatus_text_it'] or '-'}</td>   
      % endif
    </tr>
	<tr><td width="150">${_('tt_sachplan_facility_beschlussdatum')}</td> <td>${c['attributes']['validfrom'] or '-'}</td></tr>
	<tr><td width="150">${_('tt_sachplan_beschreibung')}</td>
      % if lang == 'de' or lang == 'rm' or lang == 'en':
           <td>${c['attributes']['description_text_de'] or '-'}</td>
      % elif lang == 'fr':
           <td>${c['attributes']['description_text_fr'] or '-'}</td>
	  % elif lang == 'it':
           <td>${c['attributes']['description_text_it'] or '-'}</td>   
      % endif
    </tr>
	<tr><td width="150">${_('tt_sachplan_weitereinfo')}</td> 
      % if c['attributes']['document_web'] is None:
           <td> - </td>
      % else:
           <td><a href="${c['attributes']['document_web'] or '-'}" target="_blank">${_('tt_sachplan_objektblatt')}</a></td>
      %endif
    </tr>
	<tr><td width="150">${_('tt_sachplan_facility_uberobjekt')}</td>
      % if lang == 'de' or lang == 'rm' or lang == 'en':
           <td>${c['attributes']['objectname_de'] or '-'}</td>
      % elif lang == 'fr':
           <td>${c['attributes']['objectname_fr'] or '-'}</td>
	  % elif lang == 'it':
           <td>${c['attributes']['objectname_it'] or '-'}</td>   
      % endif
    </tr>      
</%def>
