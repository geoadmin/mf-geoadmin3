# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('tt_kkw_name')}</td>          <td>${c['attributes']['name']}</td></tr>
</%def>

<%def name="extended_info(c, lang)">
    <%
        lang_i = {'de':0, 'fr':1, 'it':2, 'en':3}.get(lang, 0)
        link_i = 4
        operator = c['attributes']['operator'].split('##')
        enforcement_1 = c['attributes']['enforcement_1'].split('##')
        enforcement_2 = c['attributes']['enforcement_2'].split('##')
        enforcement_3 = c['attributes']['enforcement_3'].split('##')
        regulatory = c['attributes']['regulatory'].split('##')
        license = [c['attributes']['license_de'], c['attributes']['license_fr'], c['attributes']['license_it'], c['attributes']['license_en']]
        reactor_name = c['attributes']['reactor_name'].split('##')
        life_phase = [c['attributes']['life_phase_de'], c['attributes']['life_phase_fr'], c['attributes']['life_phase_it'], c['attributes']['life_phase_en']]
        reactor_type = [c['attributes']['reactor_type_de'], c['attributes']['reactor_type_fr'], c['attributes']['reactor_type_it'], c['attributes']['reactor_type_en']]
        cooling_type = [c['attributes']['cooling_type_de'], c['attributes']['cooling_type_fr'], c['attributes']['cooling_type_it'], c['attributes']['cooling_type_en']]
        life_phase = map(lambda x: x.split('##'), life_phase)
        reactor_type = map(lambda x: x.split('##'), reactor_type)
        cooling_type = map(lambda x: x.split('##'), cooling_type)
        nominal_thermal_output = c['attributes']['nominal_thermal_output'].split('##');
        gross_el_output = c['attributes']['gross_el_output'].split('##');
        net_el_output = c['attributes']['net_el_output'].split('##');
        construction_phase = c['attributes']['construction_phase'].split('##');
        commissioning_phase = c['attributes']['commissioning_phase'].split('##');
        operation_phase = c['attributes']['operation_phase'].split('##');
        decontamination_phase = c['attributes']['decontamination_phase'].split('##');
        dismantling_phase = c['attributes']['dismantling_phase'].split('##');

    %>
    <script>
        $(document).ready(function(){
            $('.thumbnail-container').on('click', function (event) {
              event = event || window.event;
                event.preventDefault();
              var target = event.target || event.srcElement,
                link = target.src ? target.parentNode : target,
                options = {index: link, event: event},
                links = this.getElementsByTagName('a');
              blueimp.Gallery(links, options);
            });
        });
    </script>
    <table class="table-with-border kernkraftwerke-extended">
        <tr><th class="cell-left">${_('tt_kkw_name')}</th>          <td>${c['attributes']['name']}</td></tr>
        <tr><th class="cell-left">${_('tt_kkw_operator')}</th>      <td><a href='${operator[link_i]}'>${operator[lang_i]}</a></td></tr>
        <tr><th class="cell-left">${_('tt_kkw_enforcement_1')}</th>      <td><a href='${enforcement_1[link_i]}'>${enforcement_1[lang_i]}</a></td></tr>
        <tr><th class="cell-left">${_('tt_kkw_enforcement_2')}</th>      <td><a href='${enforcement_2[link_i]}'>${enforcement_2[lang_i]}</a></td></tr>
        <tr><th class="cell-left">${_('tt_kkw_enforcement_3')}</th>      <td><a href='${enforcement_3[link_i]}'>${enforcement_3[lang_i]}</a></td></tr>
        <tr><th class="cell-left">${_('tt_kkw_regulatory')}</th>      <td><a href='${regulatory[link_i]}'>${regulatory[lang_i]}</a></td></tr>
        <tr><th class="cell-left">${_('tt_kkw_license')}</th>      <td>${license[lang_i]}</td></tr>
        <tr><th class="cell-left">${_('tt_kkw_gemeinde')}</th>      <td>${c['attributes']['municipality']}</td></tr>
        <tr><th class="cell-left">${_('tt_kkw_canton')}</th>      <td>${c['attributes']['canton']}</td></tr>

    % for reactor_i in xrange(0, c['attributes']['reactors']):
        <tr></tr>
        <tr><th class="cell-left">${_('tt_kkw_reactor_name')}</th>      <td><strong>${reactor_name[reactor_i]}</strong></td></tr>
        <tr><th class="cell-left">${_('tt_kkw_life_phase')}</th>      <td>${life_phase[lang_i][reactor_i]}</td></tr>
        <tr><th class="cell-left">${_('tt_kkw_reactor_type')}</th>      <td>${reactor_type[lang_i][reactor_i]}</td></tr>
        <tr><th class="cell-left">${_('tt_kkw_cooling_type')}</th>      <td>${cooling_type[lang_i][reactor_i]}</td></tr>
        <tr><th class="cell-left">${_('tt_kkw_nominalthermaloutput')}</th>      <td>${nominal_thermal_output[reactor_i]} MW</td></tr>
        <tr><th class="cell-left">${_('tt_kkw_grosseloutput')}</th>      <td>${gross_el_output[reactor_i]} MWe</td></tr>
        <tr><th class="cell-left">${_('tt_kkw_neteloutput')}</th>      <td>${net_el_output[reactor_i]} MWe</td></tr>
        <tr><th class="cell-left">${_('tt_kkw_contruction')}</th>      <td>${construction_phase[reactor_i]}</td></tr>
        <tr><th class="cell-left">${_('tt_kkw_operation')}</th>      <td>${operation_phase[reactor_i]}</td></tr>
        <tr><th class="cell-left">${_('tt_kkw_decontamination')}</th>      <td>${decontamination_phase[reactor_i]}</td></tr>
    % endfor
    </table>
    <div class="thumbnail-container">
        <div class="thumbnail">
            <a href="http://www.bfe-gis.admin.ch/bilder/ch.bfe.kernkraftwerke/plant${c['featureId']}.jpg">
                <img class="image" src="http://www.bfe-gis.admin.ch/bilder/ch.bfe.kernkraftwerke/plant${c['featureId']}.jpg" />
            </a>
            Bild copyright ENSI
        </div>
    </div>
    <div id="blueimp-gallery" class="blueimp-gallery blueimp-gallery-controls">
      <div class="slides"></div>
      <div class="title">${c['attributes']['name'] or ''}</div>
      <a class="prev">&lsaquo;</a>
      <a class="next">&rsaquo;</a>
      <a class="close">x</a>
      <a class="play-pause"></a>
      <ol class="indicator"></ol>
    </div>
</%def>

