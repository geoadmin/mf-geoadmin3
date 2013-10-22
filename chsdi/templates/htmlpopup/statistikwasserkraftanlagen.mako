<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% 
    c['stable_id'] = True
    lang = lang if lang in ('fr','it') else 'de'
    hydropowerplantoperationalstatus = 'hydropowerplantoperationalstatus_%s' % lang
    hydropowerplanttype = 'hydropowerplanttype_%s' % lang
%>
    <tr><td class="cell-left">${_('tt_ch.bfe.statistik-wasserkraftanlagen_wastanumber')}</td>                         <td>${c['featureId'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.statistik-wasserkraftanlagen_name')}</td>                                <td>${c['attributes']['name']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.statistik-wasserkraftanlagen_location')}</td>                            <td>${c['attributes']['location'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.statistik-wasserkraftanlagen_canton')}</td>                              <td>${c['attributes']['canton'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplantoperationalstatus_de')}</td> <td>${c['attributes'][hydropowerplantoperationalstatus] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplanttype')}</td>                 <td>${c['attributes'][hydropowerplanttype] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.statistik-wasserkraftanlagen_beginningofoperation')}</td>                <td>${c['attributes']['beginningofoperation'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.statistik-wasserkraftanlagen_endofoperation')}</td>                      <td>${c['attributes']['endofoperation'] or '-'}</td></tr>
</%def>
