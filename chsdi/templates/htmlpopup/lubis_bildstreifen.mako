<%inherit file="base.mako"/>
<%namespace name="lubis_map" file="../lubis_map.mako"/>

<%!
import datetime
import urllib
import urllib2
from pyramid.url import route_url
import chsdi.lib.helpers as h
import markupsafe
%>

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
<%
loader_url = h.make_agnostic(route_url('ga_api', request))
%>
<title>${_('tt_lubis_ebkey')}: ${c['featureId']}</title>
<body onload="init()">

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
        <tr><th class="cell-left">${_('tt_firmen_Link ')}</th>              <td><a href="mailto:geodata@swisstopo.ch?subject=${_('tt_firmen_Link ')} ebkey:${c['featureId']}">geodata@swisstopo.ch</a></td></tr>
% endif
</table>

  <div class="chsdi-map-container table-with-border" >
    <div id="map"></div>
  </div>

  <script type="text/javascript" src="${loader_url}"></script>
  <script type="text/javascript">
    function init() {
      // Create a GeoAdmin Map
      var map = new ga.Map({
        // Define the div where the map is placed
        target: 'map',
        ol3Logo: false,
        view: new ol.View2D({
          // Define the default resolution
          // 10 means that one pixel is 10m width and height
          // List of resolution of the WMTS layers:
          // 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5, 0.25, 0.1
          resolution: 10
        })
      });
      // set extent and zoom to extent
      var x_coords = [${c['attributes']['toposhop_start_x']},${c['attributes']['toposhop_end_x']}]
      var y_coords = [${c['attributes']['toposhop_start_y']},${c['attributes']['toposhop_end_y']}]
      x_coords.sort()
      y_coords.sort()
      map.getView().fitExtent([x_coords[0],y_coords[0],x_coords[1],y_coords[1]],map.getSize())

      // Create a background layer
      var lyr1 = ga.layer.create('ch.swisstopo.pixelkarte-grau');
      // Create an overlay layer
      var lyr2 = ga.layer.create('${c['layerBodId']}');

      // Add the layers in the map
      map.addLayer(lyr1);
      map.addLayer(lyr2);

      map.highlightFeature('${c['layerBodId']}', '${c['featureId']}');
      map.recenterFeature('${c['layerBodId']}', '${c['featureId']}');
    }
  </script>

</body>

</%def>
