<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

<%

  if c['layerBodId'] == 'ch.nagra.aeromagnetische-karte_1500' :
      aeromagnetische_values = 'et_fromatt_1500'
      aeromagnetische_label = 'ch.nagra.aeromagnetische-karte_1500.aeromagnetisme'
  else :
      aeromagnetische_values = 'et_fromatt_1100'
      aeromagnetische_label = 'ch.nagra.aeromagnetische-karte_1100.aeromagnetisme'

%>

    <tr><td class="cell-left">${_(aeromagnetische_label)}</td>
    <td>${c['attributes'][aeromagnetische_values]}</td></tr>

</%def>
