<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('tt_bildstreifen_ebkey')}</td>   <td>${c['featureId']}</td></tr>
    <tr><td class="cell-left">${_('tt_bildstreifen_Flugdatum')}</td>    <td>${c['attributes']['flugdatum']}</td></tr>
    <tr><td class="cell-left">${_('tt_luftbilder_Filmart')}</td>      <td>${c['attributes']['filmart']}</td></tr>
    <tr><td class="cell-left">${_('link')} Toposhop</td>   <td><a href="http://www.toposhop.admin.ch/de/shop/satair/lubis_1?ext=1&bs=${c['featureId']},${c['attributes']['toposhop_date']},${c['attributes']['toposhop_length']},${c['attributes']['resolution']},${c['attributes']['toposhop_start_x']},${c['attributes']['toposhop_start_y']},${c['attributes']['toposhop_end_x']},${c['attributes']['toposhop_end_y']}" target="toposhop">Toposhop</a></td></tr>

</%def>
