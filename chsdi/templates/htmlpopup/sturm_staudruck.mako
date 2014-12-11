<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

<%

  if c['layerBodId'] == 'ch.bafu.sturm-staudruck_30' :			
      staudruck_values = 'staudruck_30'
  elif c['layerBodId'] == 'ch.bafu.sturm-staudruck_50' :
      staudruck_values = 'staudruck_50'
  elif c['layerBodId'] == 'ch.bafu.sturm-staudruck_100' :
      staudruck_values = 'staudruck_100'
  else :
      staudruck_values = 'staudruck_300'

%>

    <tr><td class="cell-left">${_('Staudruck')}</td>                                            
	<td>${c['attributes'][staudruck_values] or '-'}</td></tr>

</%def>

