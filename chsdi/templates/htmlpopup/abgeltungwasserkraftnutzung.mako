<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('tt_ch.bfe.abgeltung-wasserkraftnutzung_name')}</td>                        <td>${c['attributes']['name']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.abgeltung-wasserkraftnutzung_objectnumber')}</td>                <td>${c['featureId'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.abgeltung-wasserkraftnutzung_area')}</td>                        <td>${c['attributes']['area'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.abgeltung-wasserkraftnutzung_perimeter')}</td>                   <td>${c['attributes']['perimeter'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.abgeltung-wasserkraftnutzung_startprotectioncommitment')}</td>   <td>${c['attributes']['startprotectioncommitment'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.abgeltung-wasserkraftnutzung_endprotectioncommitment')}</td>     <td>${c['attributes']['endprotectioncommitment'] or '-'}</td></tr>
</%def>
