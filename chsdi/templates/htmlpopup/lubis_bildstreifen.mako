<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('tt_bildstreifen_ebkey')}</td>   <td>${c['featureId']}</td></tr>
    <tr><td class="cell-left">${_('tt_bildstreifen_Flugdatum')}</td>    <td>${c['attributes']['flugdatum']}</td></tr>
    <tr><td class="cell-left">${_('tt_luftbilder_Filmart')}</td>      <td>${c['attributes']['filmart']}</td></tr>

</%def>
