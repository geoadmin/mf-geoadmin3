<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.titel or '-'}</%def>

<%def name="table_body(c, lang)">
<% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('ch_bafu_gee-kla.nummer')}</td>                   <td>${c['featureId']}</td></tr>
    <tr><td class="cell-left">${_('ch_bafu_gee-kla.name')}</td>                     <td>${c['attributes']['name']}</td></tr>
    <tr><td class="cell-left">${_('ch_bafu_gee-kla.ort')}</td>                      <td>${c['attributes']['ort'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch_bafu_gee-kla.vsa_kategorie')}</td>            <td>${c['attributes']['vsa_kategorie'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch_bafu_gee-kla.ausbaugroesse_egw')}</td>        <td>${c['attributes']['ausbaugroesse_egw'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch_bafu_gee-kla.abwasseranteil_q347')}</td>      <td>${round(c['attributes']['abwasseranteil_q347'],3) or '-'}</td></tr>
</%def>

<%def name="extended_info(c, lang)">
  <table class="table-with-border kernkraftwerke-extended">
    <tr>
      <td width="25%">&nbsp;</td>
      <td width="20%">&nbsp;</td>
      <td width="25%">&nbsp;</td>
      <td width="30%" >&nbsp;</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.nummer')}</th>
      <td>${c['featureId'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.name')}</th>
      <td>${c['attributes']['name'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.rechtswert')}</th>
      <td>${c['attributes']['rechtswert'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.hochwert')}</th>
      <td>${c['attributes']['hochwert'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.hoehe')}</th>
      <td>${c['attributes']['hoehe'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.adresse')}</th>
      <td>${c['attributes']['adresse'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.plz')}</th>
      <td>${c['attributes']['plz'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.ort')}</th>
      <td>${c['attributes']['ort'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.tel_nr')}</th>
      <td>${c['attributes']['tel_nr'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.vorfluterbez')}</th>
      <td>${c['attributes']['vorfluterbez'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.name_vorfluter')}</th>
      <td>${c['attributes']['name_vorfluter'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.gewiss_nr')}</th>
      <td>${c['attributes']['gewiss_nr'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.reinigungstyp')}</th>
      <td>${c['attributes']['reinigungstyp'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.abw_tagesmittel')}</th>
      <td>${c['attributes']['abw_tagesmittel'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.abw_tagesspitze')}</th>
      <td>${c['attributes']['abw_tagesspitze'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.spitzenbelastung_regen')}</th>
      <td>${c['attributes']['spitzenbelastung_regen'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.rohabwasser_tag')}</th>
      <td>${c['attributes']['rohabwasser_tag'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.frischschlamm_tag')}</th>
      <td>${c['attributes']['frischschlamm_tag'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.stabilisierter_schlamm_tag')}</th>
      <td>${c['attributes']['stabilisierter_schlamm_tag'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.bsb5anteil')}</th>
      <td>${c['attributes']['bsb5anteil'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.bsb5absolut')}</th>
      <td>${c['attributes']['bsb5absolut'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.csbanteil')}</th>
      <td>${c['attributes']['csbanteil'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.csbabsolut')}</th>
      <td>${c['attributes']['csbabsolut'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.docanteil')}</th>
      <td>${c['attributes']['docanteil'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.docabsolut')}</th>
      <td>${c['attributes']['docabsolut'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.nh4_nanteil')}</th>
      <td>${c['attributes']['nh4_nanteil'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.nh4_nabsolut')}</th>
      <td>${c['attributes']['nh4_nabsolut'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.nh4_n_ganzjaehrig')}</th>
      <td>${c['attributes']['nh4_n_ganzjaehrig'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.nanteil')}</th>
      <td>${c['attributes']['nanteil'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.nabsolut')}</th>
      <td>${c['attributes']['nabsolut'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.n_abwassertemperatur')}</th>
      <td>${c['attributes']['n_abwassertemperatur'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.gesamtpanteil')}</th>
      <td>${c['attributes']['gesamtpanteil'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.gesamtpabsolut')}</th>
      <td>${c['attributes']['gesamtpabsolut'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.gesamt_ungel_stoffe_absolut')}</th>
      <td>${c['attributes']['gesamt_ungel_stoffe_absolut'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.andere_stoffe')}</th>
      <td>${c['attributes']['andere_stoffe'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.kanton')}</th>
      <td>${c['attributes']['kanton'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.vsa_kategorie')}</th>
      <td>${c['attributes']['vsa_kategorie'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.ausbaugroesse_egw')}</th>
      <td>${c['attributes']['ausbaugroesse_egw'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.anzahl_nat_einwohner')}</th>
      <td>${c['attributes']['anzahl_nat_einwohner'] or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.jahr_nat_einwohner')}</th>
      <td>${c['attributes']['jahr_nat_einwohner'] or '-'}</td>
    </tr>
    <tr>
      <th class="cell-left">${_('ch_bafu_gee-kla.abwasseranteil_q347')}</th>
      <td>${round(c['attributes']['abwasseranteil_q347'],3) or '-'}</td>
      <th class="cell-left">${_('ch_bafu_gee-kla.gwlnr')}</th>
      <td>${c['attributes']['gwlnr'] or '-'}</td>
    </tr>
  </table>
</%def>
