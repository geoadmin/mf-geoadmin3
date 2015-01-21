<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<%
    lang = lang if lang in ('fr', 'it') else 'de'
    standorttyp = 'standorttyp_%s' % lang
    statusaltlv = 'statusaltlv_%s' % lang
    untersuchungsstand = 'untersuchungsstand_%s' % lang
    arr_untersuchungsstand = c['attributes'][untersuchungsstand].split('##')
    arr_len = len(arr_untersuchungsstand)
    str_output = ''
    for i in range(arr_len):
        str_output = str_output + arr_untersuchungsstand[i] + '<br />' if  i < (arr_len-1) else str_output + arr_untersuchungsstand[i]
    endfor

%>

    <tr><td class="cell-left">${_('ch.bazl.kataster-belasteter-standorte-zivilflugplaetze.katasternummer')}</td>                        <td>${c['attributes']['katasternummer'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch_bav_kataster_belasteter_standorte_oev_standorttyp')}</td>                           <td>${c['attributes'][standorttyp] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch_bazl_kataster_belasteter_standorte_zivflpl_beurteilung')}</td>                           <td>${c['attributes'][statusaltlv] or '-'}</td></tr>
    <tr><td class="cell-left" valign="top">${_('tt_ch_bav_kataster_belasteter_standorte_oev_untersuchungsstand_2')}</td>     <td>${_(str_output)|n}</td></tr> 
    <tr><td class="cell-left">${_('tt_ch_bav_kataster_belasteter_standorte_oev_beschreibung')}</td>                          <td><a href="${c['attributes']['url'] or '-'}" target="_blank">${_('tt_ch_bav_kataster_belasteter_standorte_oev_katasterauszug')}</a></td></tr>
    <tr><td>&nbsp;</td>                                                                                                      <td>&nbsp;</td></tr>
</%def>
