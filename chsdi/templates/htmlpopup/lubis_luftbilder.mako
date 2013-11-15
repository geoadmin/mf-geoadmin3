<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('tt_bildstreifen_ebkey')}</td>   <td>${c['attributes']['bildnummer']}</td></tr>
    <tr><td class="cell-left">${_('tt_bildstreifen_Flugdatum')}</td>    <td>${c['attributes']['flugdatum']}</td></tr>
    <tr><td class="cell-left">${_('tt_luftbilder_Filmart')}</td>      <td>${c['attributes']['filmart']}</td></tr>
% if c['attributes']['ort'] is not None:
    <tr><td class="cell-left">${_('link')} Toposhop</td>   <td><a href="http://www.toposhop.admin.ch/de/shop/satair/lubis_1?ext=1&pics=${c['featureId']},0,${c['attributes']['ort'].strip()},${c['attributes']['y']},${c['attributes']['x']},nein" target="toposhop">Toposhop</a></td></tr>
% endif
</%def>
