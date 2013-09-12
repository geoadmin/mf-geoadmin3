# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="preview()">${c['value'] or '-'}</%def>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('tt_kkw_name')}</td>         <td>${c['value']}</td></tr>
<tr><td width="150" valign="top"></td><td><a href="${c.path_url}/../${c['attributes']['layer_id']}.html?layer=${c['attributes']['layer_id']}&lang=${lang}" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>
</%def>

<table border="0" cellspacing="0" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">
<tr><td width="100%" valign="top" colspan="2"><h1 class="tooltip_large_titel">${c['value']}</h1></tr>
% if lang =='fr':
    <!-- -------------------------- -->
	
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top" width="30%">${_('tt_kkw_owner')}</td><td width="70"><a href="${c['attributes']['owner'].split('##')[4]}" target="_blank">${c['attributes']['owner'].split('##')[1]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_operator')}</td><td><a href="${c['attributes']['operator'].split('##')[4]}" target="_blank">${c['attributes']['operator'].split('##')[1]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_1')}</td><td><a href="${c['attributes']['enforcement_1'].split('##')[4]}" target="_blank">${c['attributes']['enforcement_1'].split('##')[1]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_2')}</td><td><a href="${c['attributes']['enforcement_2'].split('##')[4]}" target="_blank">${c['attributes']['enforcement_2'].split('##')[1]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_3')}</td><td><a href="${c['attributes']['enforcement_3'].split('##')[4]}" target="_blank">${c['attributes']['enforcement_3'].split('##')[1]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_regulatory')}</td><td><a href="${c['attributes']['regulatory'].split('##')[4]}" target="_blank">${c['attributes']['regulatory'].split('##')[1]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_license')}</td><td>${c['attributes']['license_fr'] or '-'}</td></tr>
    <tr><td valign="top">${_('tt_kkw_gemeinde')}</td><td>${c['attributes']['municipality'] or '-'}</td></tr>
    <tr><td valign="top">${_('tt_kkw_canton')}</td><td>${c['attributes']['canton'] or '-'}</td></tr>
    </td><td>&nbsp;</td></tr>
    <!-- -------------------------- -->

        <%        
            i=c['attributes']['reactors']
            reactorname=[unicode(y) for y in c['attributes']['reactor_name'].split('##')]
            lifephase=[unicode(a) for a in c['attributes']['life_phase_fr'].split('##')]
            type=[unicode(b) for b in c['attributes']['reactor_type_fr'].split('##')]
            cooling=[unicode(z) for z in c['attributes']['cooling_type_fr'].split('##')]
            nominalthermaloutput=[unicode(d) for d in c['attributes']['nominal_thermal_output'].split('##')]
            grosseloutput=[unicode(e) for e in c['attributes']['gross_el_output'].split('##')]
            neteloutput=[unicode(f) for f in c['attributes']['net_el_output'].split('##')]
            contruction=[unicode(g) for g in c['attributes']['construction_phase'].split('##')]
            commissioning=[unicode(h) for h in c['attributes']['commissioning_phase'].split('##')]
            operation=[unicode(n) for n in c['attributes']['operation_phase'].split('##')]
            decontamination=[unicode(j) for j in c['attributes']['decontamination_phase'].split('##')]
            dismantling=[unicode(k) for k in c['attributes']['dismantling_phase'].split('##')]		
        %>
        % for x in xrange(0,i):
            <tr><td valign="top">${_('tt_kkw_reactor_name')}</td><td><h2 stile="bold">${reactorname[x] or '-'}</h2></td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_life_phase')}</td><td width="70">${lifephase[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_reactor_type')}</td><td width="70">${type[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_cooling_type')}</td><td width="70">${cooling[x] or '-'}</td></tr>
            </td><td>&nbsp;</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_nominalthermaloutput')}</td><td width="70">${nominalthermaloutput[x] or '-'} MW</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_grosseloutput')}</td><td width="70">${grosseloutput[x] or '-'} MWe</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_neteloutput')}</td><td width="70">${neteloutput[x] or '-'} MWe</td></tr>
            </td><td>&nbsp;</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_contruction')}</td><td width="70">${contruction[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_commissioning')}</td><td width="70">${commissioning[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_operation')}</td><td width="70">${operation[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_decontamination')}</td><td width="70">${decontamination[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_dismantling')}</td><td width="70">${dismantling[x] or '-'}</td></tr>
            </td><td>&nbsp;</td></tr>
	    % endfor

	<!-- -------------------------- -->	

% elif lang == 'it':
    <!-- -------------------------- -->
	
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top" width="30%">${_('tt_kkw_owner')}</td><td width="70"><a href="${c['attributes']['owner'].split('##')[4]}" target="_blank">${c['attributes']['owner'].split('##')[2]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_operator')}</td><td><a href="${c['attributes']['operator'].split('##')[4]}" target="_blank">${c['attributes']['operator'].split('##')[2]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_1')}</td><td><a href="${c['attributes']['enforcement_1'].split('##')[4]}" target="_blank">${c['attributes']['enforcement_1'].split('##')[2]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_2')}</td><td><a href="${c['attributes']['enforcement_2'].split('##')[4]}" target="_blank">${c['attributes']['enforcement_2'].split('##')[2]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_3')}</td><td><a href="${c['attributes']['enforcement_3'].split('##')[4]}" target="_blank">${c['attributes']['enforcement_3'].split('##')[2]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_regulatory')}</td><td><a href="${c['attributes']['regulatory'].split('##')[4]}" target="_blank">${c['attributes']['regulatory'].split('##')[2]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_license')}</td><td>${c['attributes']['license_it'] or '-'}</td></tr>
    <tr><td valign="top">${_('tt_kkw_gemeinde')}</td><td>${c['attributes']['municipality'] or '-'}</td></tr>
    <tr><td valign="top">${_('tt_kkw_canton')}</td><td>${c['attributes']['canton'] or '-'}</td></tr>
    </td><td>&nbsp;</td></tr>
    <!-- -------------------------- -->

        <%        
            i=c['attributes']['reactors']
            reactorname=[unicode(y) for y in c['attributes']['reactor_name'].split('##')]
            lifephase=[unicode(a) for a in c['attributes']['life_phase_it'].split('##')]
            type=[unicode(b) for b in c['attributes']['reactor_type_it'].split('##')]
            cooling=[unicode(z) for z in c['attributes']['cooling_type_it'].split('##')]
            nominalthermaloutput=[unicode(d) for d in c['attributes']['nominal_thermal_output'].split('##')]
            grosseloutput=[unicode(e) for e in c['attributes']['gross_el_output'].split('##')]
            neteloutput=[unicode(f) for f in c['attributes']['net_el_output'].split('##')]
            contruction=[unicode(g) for g in c['attributes']['construction_phase'].split('##')]
            commissioning=[unicode(h) for h in c['attributes']['commissioning_phase'].split('##')]
            operation=[unicode(n) for n in c['attributes']['operation_phase'].split('##')]
            decontamination=[unicode(j) for j in c['attributes']['decontamination_phase'].split('##')]
            dismantling=[unicode(k) for k in c['attributes']['dismantling_phase'].split('##')]		
        %>
        % for x in xrange(0,i):
            <tr><td valign="top">${_('tt_kkw_reactor_name')}</td><td><h2 stile="bold">${reactorname[x] or '-'}</h2></td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_life_phase')}</td><td width="70">${lifephase[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_reactor_type')}</td><td width="70">${type[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_cooling_type')}</td><td width="70">${cooling[x] or '-'}</td></tr>
            </td><td>&nbsp;</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_nominalthermaloutput')}</td><td width="70">${nominalthermaloutput[x] or '-'} MW</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_grosseloutput')}</td><td width="70">${grosseloutput[x] or '-'} MWe</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_neteloutput')}</td><td width="70">${neteloutput[x] or '-'} MWe</td></tr>
            </td><td>&nbsp;</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_contruction')}</td><td width="70">${contruction[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_commissioning')}</td><td width="70">${commissioning[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_operation')}</td><td width="70">${operation[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_decontamination')}</td><td width="70">${decontamination[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_dismantling')}</td><td width="70">${dismantling[x] or '-'}</td></tr>
            </td><td>&nbsp;</td></tr>
	    % endfor

	<!-- -------------------------- -->	

% elif lang =='en':
    <!-- -------------------------- -->
	
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top" width="30%">${_('tt_kkw_owner')}</td><td width="70"><a href="${c['attributes']['owner'].split('##')[4]}" target="_blank">${c['attributes']['owner'].split('##')[3]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_operator')}</td><td><a href="${c['attributes']['operator'].split('##')[4]}" target="_blank">${c['attributes']['operator'].split('##')[3]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_1')}</td><td><a href="${c['attributes']['enforcement_1'].split('##')[4]}" target="_blank">${c['attributes']['enforcement_1'].split('##')[3]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_2')}</td><td><a href="${c['attributes']['enforcement_2'].split('##')[4]}" target="_blank">${c['attributes']['enforcement_2'].split('##')[3]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_3')}</td><td><a href="${c['attributes']['enforcement_3'].split('##')[4]}" target="_blank">${c['attributes']['enforcement_3'].split('##')[3]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_regulatory')}</td><td><a href="${c['attributes']['regulatory'].split('##')[4]}" target="_blank">${c['attributes']['regulatory'].split('##')[3]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_license')}</td><td>${c['attributes']['license_en'] or '-'}</td></tr>
    <tr><td valign="top">${_('tt_kkw_gemeinde')}</td><td>${c['attributes']['municipality'] or '-'}</td></tr>
    <tr><td valign="top">${_('tt_kkw_canton')}</td><td>${c['attributes']['canton'] or '-'}</td></tr>
    </td><td>&nbsp;</td></tr>
    <!-- -------------------------- -->

        <%        
            i=c['attributes']['reactors']
            reactorname=[unicode(y) for y in c['attributes']['reactor_name'].split('##')]
            lifephase=[unicode(a) for a in c['attributes']['life_phase_en'].split('##')]
            type=[unicode(b) for b in c['attributes']['reactor_type_en'].split('##')]
            cooling=[unicode(z) for z in c['attributes']['cooling_type_en'].split('##')]
            nominalthermaloutput=[unicode(d) for d in c['attributes']['nominal_thermal_output'].split('##')]
            grosseloutput=[unicode(e) for e in c['attributes']['gross_el_output'].split('##')]
            neteloutput=[unicode(f) for f in c['attributes']['net_el_output'].split('##')]
            contruction=[unicode(g) for g in c['attributes']['construction_phase'].split('##')]
            commissioning=[unicode(h) for h in c['attributes']['commissioning_phase'].split('##')]
            operation=[unicode(n) for n in c['attributes']['operation_phase'].split('##')]
            decontamination=[unicode(j) for j in c['attributes']['decontamination_phase'].split('##')]
            dismantling=[unicode(k) for k in c['attributes']['dismantling_phase'].split('##')]		
        %>
        % for x in xrange(0,i):
            <tr><td valign="top">${_('tt_kkw_reactor_name')}</td><td><h2 stile="bold">${reactorname[x] or '-'}</h2></td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_life_phase')}</td><td width="70">${lifephase[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_reactor_type')}</td><td width="70">${type[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_cooling_type')}</td><td width="70">${cooling[x] or '-'}</td></tr>
            </td><td>&nbsp;</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_nominalthermaloutput')}</td><td width="70">${nominalthermaloutput[x] or '-'} MW</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_grosseloutput')}</td><td width="70">${grosseloutput[x] or '-'} MWe</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_neteloutput')}</td><td width="70">${neteloutput[x] or '-'} MWe</td></tr>
            </td><td>&nbsp;</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_contruction')}</td><td width="70">${contruction[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_commissioning')}</td><td width="70">${commissioning[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_operation')}</td><td width="70">${operation[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_decontamination')}</td><td width="70">${decontamination[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_dismantling')}</td><td width="70">${dismantling[x] or '-'}</td></tr>
            </td><td>&nbsp;</td></tr>
	    % endfor

	<!-- -------------------------- -->	

% else:
    <!-- -------------------------- -->
	
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top" width="30%">${_('tt_kkw_owner')}</td><td width="70"><a href="${c['attributes']['owner'].split('##')[4]}" target="_blank">${c['attributes']['owner'].split('##')[0]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_operator')}</td><td><a href="${c['attributes']['operator'].split('##')[4]}" target="_blank">${c['attributes']['operator'].split('##')[0]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_1')}</td><td><a href="${c['attributes']['enforcement_1'].split('##')[4]}" target="_blank">${c['attributes']['enforcement_1'].split('##')[0]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_2')}</td><td><a href="${c['attributes']['enforcement_2'].split('##')[4]}" target="_blank">${c['attributes']['enforcement_2'].split('##')[0]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_3')}</td><td><a href="${c['attributes']['enforcement_3'].split('##')[4]}" target="_blank">${c['attributes']['enforcement_3'].split('##')[0]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_regulatory')}</td><td><a href="${c['attributes']['regulatory'].split('##')[4]}" target="_blank">${c['attributes']['regulatory'].split('##')[0]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_license')}</td><td>${c['attributes']['license_de'] or '-'}</td></tr>
    <tr><td valign="top">${_('tt_kkw_gemeinde')}</td><td>${c['attributes']['municipality'] or '-'}</td></tr>
    <tr><td valign="top">${_('tt_kkw_canton')}</td><td>${c['attributes']['canton'] or '-'}</td></tr>
    </td><td>&nbsp;</td></tr>
    <!-- -------------------------- -->

        <%        
            i=c['attributes']['reactors']
            reactorname=[unicode(y) for y in c['attributes']['reactor_name'].split('##')]
            lifephase=[unicode(a) for a in c['attributes']['life_phase_de'].split('##')]
            type=[unicode(b) for b in c['attributes']['reactor_type_de'].split('##')]
            cooling=[unicode(z) for z in c['attributes']['cooling_type_de'].split('##')]
            nominalthermaloutput=[unicode(d) for d in c['attributes']['nominal_thermal_output'].split('##')]
            grosseloutput=[unicode(e) for e in c['attributes']['gross_el_output'].split('##')]
            neteloutput=[unicode(f) for f in c['attributes']['net_el_output'].split('##')]
            contruction=[unicode(g) for g in c['attributes']['construction_phase'].split('##')]
            commissioning=[unicode(h) for h in c['attributes']['commissioning_phase'].split('##')]
            operation=[unicode(n) for n in c['attributes']['operation_phase'].split('##')]
            decontamination=[unicode(j) for j in c['attributes']['decontamination_phase'].split('##')]
            dismantling=[unicode(k) for k in c['attributes']['dismantling_phase'].split('##')]		
        %>
        % for x in xrange(0,i):
            <tr><td valign="top">${_('tt_kkw_reactor_name')}</td><td><h2 stile="bold">${reactorname[x] or '-'}</h2></td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_life_phase')}</td><td width="70">${lifephase[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_reactor_type')}</td><td width="70">${type[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_cooling_type')}</td><td width="70">${cooling[x] or '-'}</td></tr>
            </td><td>&nbsp;</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_nominalthermaloutput')}</td><td width="70">${nominalthermaloutput[x] or '-'} MW</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_grosseloutput')}</td><td width="70">${grosseloutput[x] or '-'} MWe</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_neteloutput')}</td><td width="70">${neteloutput[x] or '-'} MWe</td></tr>
            </td><td>&nbsp;</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_contruction')}</td><td width="70">${contruction[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_commissioning')}</td><td width="70">${commissioning[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_operation')}</td><td width="70">${operation[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_decontamination')}</td><td width="70">${decontamination[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_dismantling')}</td><td width="70">${dismantling[x] or '-'}</td></tr>
            </td><td>&nbsp;</td></tr>
	    % endfor

	<!-- -------------------------- -->	
	
% endif
     </td><td>&nbsp;</td></tr>
</table>
<img src="https://dav0.bgdi.admin.ch/bfe_pub/images_kkw/plant${c['attributes']['facility_stabil_id']}.jpg" alt="" width="635px" />
Bild copyright ENSI
</%def>
