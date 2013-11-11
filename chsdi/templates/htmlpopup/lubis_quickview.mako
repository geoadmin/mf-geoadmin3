<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('tt_Bildnummer')}</td>   <td>${c['attributes']['bildnummer']}</td></tr>
    <tr><td class="cell-left">${_('tt_Flugdatum')}</td>    <td>${c['attributes']['flugdatum']}</td></tr>
    <tr><td class="cell-left">${_('tt_Filmart')}</td>      <td>${c['attributes']['filmart']}</td></tr>
    <tr><td class="cell-left">${_('tt_Quickview')}</td>   <td>${c['attributes']['bildnummer']}</td></tr>
</%def>
