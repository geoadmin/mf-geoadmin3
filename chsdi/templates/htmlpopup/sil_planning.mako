<%inherit file="base.mako"/>

#<%def name="preview()">
#   % if lang == 'de' or lang == 'rm' or lang == 'en':
#   ${c['attributes']['plname_de'] or '-'}
#   % elif lang == 'fr':
#   ${c['attributes']['plname_fr'] or '-'}
#   % elif lang == 'it':
#   ${c['attributes']['plname_it'] or '-'}
#   % endif
#</%def>

<%def name="table_body(c, lang)">
<% c[stable_id] = True %>
    <tr><td width="150">${_('tt_sachplan_planning_name')}</td>    <td>${c['value']}</td></tr>
    <tr><td width="150">${_('tt_sachplan_planning_typ')}</td>
      % if lang == 'de' or lang == 'rm' or lang == 'en':
           <td>${c['attributes']['measuretype_text_de'] or '-'}</td>
      % elif lang == 'fr':
           <td>${c['attributes']['measuretype_text_fr'] or '-'}</td>
	  % elif lang == 'it':
           <td>${c['attributes']['measuretype_text_it'] or '-'}</td>   
      % endif
    </tr>
	<tr><td width="150">${_('tt_sachplan_planning_coordstand')}</td>
      % if lang == 'de' or lang == 'rm' or lang == 'en':
           <td>${c['attributes']['coordinationlevel_text_de'] or '-'}</td>
      % elif lang == 'fr':
           <td>${c['attributes']['coordinationlevel_text_fr'] or '-'}</td>
	  % elif lang == 'it':
           <td>${c['attributes']['coordinationlevel_text_it'] or '-'}</td>   
      % endif
    </tr>
	<tr><td width="150">${_('tt_sachplan_planning_planungstand')}</td>
      % if lang == 'de' or lang == 'rm' or lang == 'en':
           <td>${c['attributes']['planningstatus_text_de'] or '-'}</td>
      % elif lang == 'fr':
           <td>${c['attributes']['planningstatus_text_fr'] or '-'}</td>
	  % elif lang == 'it':
           <td>${c['attributes']['planningstatus_text_it'] or '-'}</td>   
      % endif
    </tr>
	<tr><td width="150">${_('tt_sachplan_planning_von')}</td> <td>${c['attributes']['validfrom'] or '-'}</td></tr>
	<tr><td width="150">${_('tt_sachplan_planning_bis')}</td> <td>${c['attributes']['validuntil'] or '-'}</td></tr>
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
    <tr><td width="150">${_('tt_sachplan_planning_ueberanlage')}</td>
      % if lang == 'de' or lang == 'rm' or lang == 'en':
           <td>${c['value']}</td>
      % elif lang == 'fr':
           <td>${c['attributes']['facname_fr'] or '-'}</td>
          % elif lang == 'it':
           <td>${c['attributes']['facname_it'] or '-'}</td>
      % endif
    </tr>

</%def>
