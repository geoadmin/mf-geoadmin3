<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c[stable_id] = True %>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_wastanumber')}</td>             <td>${c['featureId'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_name')}</td>                    <td>${c['attributes']['name']}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_location')}</td>                <td>${c['attributes']['location'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_canton')}</td>                  <td>${c['attributes']['canton'] or '-'}</td></tr>
% if lang=='it':
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplantoperationalstatus_de')}</td><td>${c['attributes']['hydropowerplantoperationalstatus_it'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplanttype')}</td>     <td>${c['attributes']['hydropowerplanttype_it'] or '-'}</td></tr>
% elif ang=='fr':
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplantoperationalstatus_de')}</td><td>${c['attributes']['hydropowerplantoperationalstatus_fr'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplanttype')}</td>     <td>${c['attributes']['hydropowerplanttype_fr'] or '-'}</td></tr>
% else:
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplantoperationalstatus_de')}</td><td>${c['attributes']['hydropowerplantoperationalstatus_de'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplanttype')}</td>     <td>${c['attributes']['hydropowerplanttype_de'] or '-'}</td></tr>
% endif
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_beginningofoperation')}</td>    <td>${c['attributes']['beginningofoperation'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_endofoperation')}</td>          <td>${c['attributes']['endofoperation'] or '-'}</td></tr>
</%def>
