<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<%
    import datetime

    try:
        date_start = datetime.datetime.strptime(c['attributes']['startprotectioncommitment'].strip(), "%Y-%m-%d").strftime("%d.%m.%Y")
    except:
        date_start = '-'

    try:
        date_end = datetime.datetime.strptime(c['attributes']['endprotectioncommitment'].strip(), "%Y-%m-%d").strftime("%d.%m.%Y")
    except:
        date_end = '-'

%>

<% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('ch.bfe.abgeltung-wasserkraftnutzung.name')}</td>                        <td>${c['attributes']['name']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.abgeltung-wasserkraftnutzung_objectnumber')}</td>                <td>${c['featureId'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.abgeltung-wasserkraftnutzung_area')}</td>                        <td>${c['attributes']['area'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.abgeltung-wasserkraftnutzung_perimeter')}</td>                   <td>${c['attributes']['perimeter'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.abgeltung-wasserkraftnutzung_startprotectioncommitment')}</td>   <td>${date_start}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.abgeltung-wasserkraftnutzung_endprotectioncommitment')}</td>     <td>${date_end}</td></tr>
</%def>
