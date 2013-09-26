# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c[stable_id] = True %>
    % if lang == 'de' or lang == 'rm' or lang == 'en':
        <tr><td width="150">${_('tt_sachplan_planning_name')}</td>          <td>${c['attributes']['measurename_de'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_planning_typ')}</td>           <td>${c['attributes']['measuretype_text_de'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_planning_coordstand')}</td>    <td>${c['attributes']['coordinationlevel_text_de'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_planning_coordstand')}</td>    <td>${c['attributes']['coordinationlevel_text_de'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_planning_planungstand')}</td>  <td>${c['attributes']['planningstatus_text_de'] or '-'}</td></tr>
    % elif lang == 'fr':
        <tr><td width="150">${_('tt_sachplan_planning_name')}</td>          <td>${c['attributes']['measurename_fr'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_planning_typ')}</td>           <td>${c['attributes']['measuretype_text_fr'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_planning_coordstand')}</td>    <td>${c['attributes']['coordinationlevel_text_fr'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_planning_coordstand')}</td>    <td>${c['attributes']['coordinationlevel_text_fr'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_planning_planungstand')}</td>  <td>${c['attributes']['planningstatus_text_fr'] or '-'}</td></tr>
    % elif lang == 'it':
        <tr><td width="150">${_('tt_sachplan_planning_name')}</td>          <td>${c['attributes']['measurename_it'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_planning_typ')}</td>           <td>${c['attributes']['measuretype_text_it'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_planning_coordstand')}</td>    <td>${c['attributes']['coordinationlevel_text_it'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_planning_coordstand')}</td>    <td>${c['attributes']['coordinationlevel_text_it'] or '-'}</td></tr>
        <tr><td width="150">${_('tt_sachplan_planning_planungstand')}</td>  <td>${c['attributes']['planningstatus_text_it'] or '-'}</td></tr>
    % endif
    <tr><td width="150">${_('tt_sachplan_planning_von')}</td>               <td>${c['attributes']['validfrom'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_sachplan_planning_bis')}</td>               <td>${c['attributes']['validuntil'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_sachplan_beschreibung')}</td>               <td>${c['attributes']['description'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_sachplan_weitereinfo')}</td>
    % if c['attributes']['web'] is None:
        <tr><td width="150">${_('tt_sachplan_weitereinfo')}</td>            <td> - </td></tr>
    % else:
        <tr><td width="150">${_('tt_sachplan_weitereinfo')}</td>            <td><a href="${c['attributes']['web'] or '-'}" target="_blank">${_('tt_sachplan_objektblatt')}</a></td></tr>
    %endif
    % if lang == 'de' or lang == 'rm' or lang == 'en':
        <tr><td width="150">${_('tt_sachplan_planning_ueberanlage')}</td>   <td>${c['attributes']['facname_de'] or '-'}</td></tr>
    % elif lang == 'fr':
        <tr><td width="150">${_('tt_sachplan_planning_ueberanlage')}</td>   <td>${c['attributes']['facname_fr'] or '-'}</td></tr>
    % elif lang == 'it':
        <tr><td width="150">${_('tt_sachplan_planning_ueberanlage')}</td>   <td>${c['attributes']['facname_it'] or '-'}</td></tr>
    % endif
</%def>
