<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('tt_lubis_lineId')}</td>          <td>${c['featureId']}</td></tr>
    <tr><td class="cell-left">${_('tt_lubis_Flugdatum')}</td>       <td>${c['attributes']['flugdatum']}</td></tr>
    <tr><td class="cell-left">${_('tt_lubis_auflosung')}</td>       <td>${c['attributes']['resolution']}</td></tr>
% if   c['attributes']['gsd'] == 0.25 or c['attributes']['gsd'] == 0.5:
    <tr><td class="cell-left">${_('link')} Toposhop</td>            <td><a href="http://www.toposhop.admin.ch/de/shop/satair/lubis_1?ext=1&bs=${c['featureId']},${c['attributes']['toposhop_date']},${c['attributes']['toposhop_length']},${c['attributes']['resolution']},${c['attributes']['toposhop_start_x']},${c['attributes']['toposhop_start_y']},${c['attributes']['toposhop_end_x']},${c['attributes']['toposhop_end_y']}" target="toposhop">Toposhop</a></td></tr>
% else:
    <tr><td class="cell-left">${_('tt_firmen_Link ')}</td>          <td><a href="mailto:geodata@swisstopo.ch?subject=${_('tt_firmen_Link ')} ebkey:${c['featureId']}">geodata@swisstopo.ch</a></td></tr>
% endif    
</%def>

<%def name="extended_info(c, lang)">

    <table class="table-with-border kernkraftwerke-extended">
        <tr><th class="cell-left">${_('tt_lubis_lineId')}</th>              <td>${c['featureId']}</td></tr>
        <tr><th class="cell-left">${_('tt_lubis_Flugdatum')}</th>           <td>${c['attributes']['flugdatum']}</td></tr>
        <tr><th class="cell-left">${_('tt_lubis_auflosung')}</th>           <td>${c['attributes']['resolution']}</td></tr>
        <tr><th class="cell-left">${_('tt_lubis_y1')}</th>                  <td>${c['attributes']['toposhop_start_x'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('tt_lubis_x1')}</th>                  <td>${c['attributes']['toposhop_start_y'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('tt_lubis_y2')}</th>                  <td>${c['attributes']['toposhop_end_x'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('tt_lubis_x2')}</th>                  <td>${c['attributes']['toposhop_end_y'] or '-'}</td></tr>
        <tr><th class="cell-left">${_('tt_lubis_linielaenge')}</th>         <td>${c['attributes']['toposhop_length'] or '-'}</td></tr>
% if   c['attributes']['gsd'] == 0.25 or c['attributes']['gsd'] == 0.5:
        <tr><th class="cell-left">${_('link')} Toposhop</th>                <td><a href="http://www.toposhop.admin.ch/de/shop/satair/lubis_1?ext=1&bs=${c['featureId']},${c['attributes']['toposhop_date']},${c['attributes']['toposhop_length']},${c['attributes']['resolution']},${c['attributes']['toposhop_start_x']},${c['attributes']['toposhop_start_y']},${c['attributes']['toposhop_end_x']},${c['attributes']['toposhop_end_y']}" target="toposhop">Toposhop</a></td></tr>
% else:
<tr><td class="cell-left">${_('tt_firmen_Link ')}</td>                      <td><a href="mailto:geodata@swisstopo.ch?subject=${_('tt_firmen_Link ')} ebkey:${c['featureId']}">geodata@swisstopo.ch</a></td></tr>
% endif

</table>

</%def>
