<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

<%

  if c['layerBodId'] == 'ch.bafu.sturm-boeenspitzen_30' :			
      boeenspitzen_ms_values = 'boenspitzen_ms_30'
      boeenspitzen_kmh_values = 'boenspitzen_kmh_30'
  elif c['layerBodId'] == 'ch.bafu.sturm-boeenspitzen_50' :
      boeenspitzen_ms_values = 'boenspitzen_ms_50'
      boeenspitzen_kmh_values = 'boenspitzen_kmh_50'
  elif c['layerBodId'] == 'ch.bafu.sturm-boeenspitzen_100' :
      boeenspitzen_ms_values = 'boenspitzen_ms_100'
      boeenspitzen_kmh_values = 'boenspitzen_kmh_100'
  else :
      boeenspitzen_ms_values = 'boenspitzen_ms_300'
      boeenspitzen_kmh_values = 'boenspitzen_kmh_300'

%>

    <tr><td class="cell-left">${_('Boeenspitzen_ms')}</td>                                            
      	<td>${c['attributes'][boeenspitzen_ms_values] or '-'}</td></tr>
    <tr><td class="cell-left">${_('Boeenspitzen_kmh')}</td>
        <td>${c['attributes'][boeenspitzen_kmh_values] or '-'}</td></tr>


</%def>

