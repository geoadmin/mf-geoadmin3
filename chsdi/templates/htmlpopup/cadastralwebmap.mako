# -*- coding: utf-8 -*-


<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <%
      from chsdi.models.vector import getScale
      from chsdi.lib.validation.mapservice import MapServiceValidation
      request = context.get('request')
      defaultExtent = '42000,30000,350000,900000'
      defaultImageDisplay = '400,600,96'
      class CadastralWebMapParams(MapServiceValidation):
          def __init__(self, request):
              self.mapExtent = request.params.get('mapExtent', defaultExtent)
              self.imageDisplay = request.params.get('imageDisplay', defaultImageDisplay)
      params = CadastralWebMapParams(request)
      c['bbox'] = params.mapExtent.bounds
      c['scale']  = getScale(params.imageDisplay, params.mapExtent)
    %>
    % if c['attributes']['ak'] in ['D','I','F','AUT']:
        <tr><td class="cell-left">${_('No info outside CH and FL')}</td><td></td></tr>
    % elif c['attributes']['ak'] == 'AG':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="https://www.ag.ch/app/agisviewer4/v1/html/agisviewer.htm?config=agis_geoportal_fs.json&basemap=base_landeskarten_sw&thema=176&xmin=${c['bbox'][0]}&ymin=${c['bbox'][1]}&xmax=${c['bbox'][2]}&ymax=${c['bbox'][3]}" target="_blank">AG</a></td></tr>
    % elif c['attributes']['ak'] == 'BS':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://www.stadtplan.bs.ch/geoviewer/index.php?theme=258&extent=${','.join(map(str,c['bbox']))}&layers=parzplan_vektor_grau_1000,av_parzellen_labels" target="_blank">BS</a></td></tr>
    % elif c['attributes']['ak'] == 'BE':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://webmap.be-geo.ch/geodaten.php?lang=${lang}&recenter_bbox=${','.join(map(str,c['bbox']))}" target="_blank">BE</a></td></tr>
    % elif c['attributes']['ak'] == 'FR':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://www.geo.fr.ch/index.php?reset_session&linkit=1&switch_id=switch_localisation&layer_select=Adresses,ParcVect,ParcVectnum,GrpMasque,GrpSituation,FondPlanContinu,copyright,Parcellaire,ParcScan&mapsize=0&recenter_bbox=${','.join(map(str,c['bbox']))}" target="_blank">FR</a></td></tr>
    % elif c['attributes']['ak'] == 'GE':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://ge.ch/carte/pro/?mapresources=CADASTRE&extent=${2000000 + c['bbox'][0]},${1000000 + c['bbox'][1]},${2000000 + c['bbox'][2]},${1000000 + c['bbox'][3]}" target="_blank">GE</a></td></tr>
    % elif c['attributes']['ak'] == 'GL':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="https://map.geo.gl.ch/Public?visibleLayers=CH-Rahmen,BBFlaechen_farbig,projektierte%20BBFlaechen,Flaechenelemente_farbig,Linienelemente,Punktelemente,Grundstuecke%20(Parzellen),Liegenschaftsnummern,Grenzpunkte,BB%20Namen,EO%20Namen,Grundbuecher,Hoheitsgrenzpunkte,Fixpunkte%20Kat%201%202%203,Flur-%20und%20Ortsnamen,Lokalisationen,Gebaeudeadressen&startExtent=${c['bbox'][0]},${c['bbox'][1]},${c['bbox'][2]},${c['bbox'][3]}" target="_blank">GL</a></td></tr>
    % elif c['attributes']['ak'] == 'JU':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://mapfish.jura.ch/main/wsgi/theme/Cadastre?&map_x=${(c['bbox'][0] + c['bbox'][2])/2}&map_y=${(c['bbox'][1] + c['bbox'][3])/2}&map_zoom=8" target="_blank">JU</a></td></tr>
    % elif c['attributes']['ak'] == 'SH':
       <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://www.gis.sh.ch/GIS_SH/?idp=1&uid=1&pwd=&map=10&lan=de&typ=3&bmurl=Nav@g@98@u@West@g@${(c['bbox'][0] + c['bbox'][2])/2}@u@Nord@g@${(c['bbox'][1] + c['bbox'][3])/2}@u@B@g@600" target="_blank">SH</a></td></tr>
    % elif c['attributes']['ak'] == 'SZ':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://webmap.sz.ch/BM31_WebMap/?idp=1&uid=3&pwd=&map=4&lan=de&typ=2&bmurl=Nav@g@22@u@West@g@${(c['bbox'][0] + c['bbox'][2])/2}@u@Nord@g@${(c['bbox'][1] + c['bbox'][3])/2}@u@B@g@${c['scale']}&dat=fs@g@0:4ae2e22b77b5091c,c967cd4c6822eee0,e99c56f567e5e97f,39483bcc77f422f5,4b048b83437bf7a9,b3b7203380d15873,bee3f1c60e1a845d,1728eb497f622a93,f78552014874d11f,136b202945b6b1b9,d9cf9214542c77c1,7eb16002e8c2dc47,ec974776a1ceeba0,f897f15fead4f6fd,37fd92a6ed58174e,e1887984e14002b7,f44d637c3584e8d0,e9e2a442eff50877,bc8022b4deccd819,6a214c64af1721ce,eaf8a22a527854e5,0945f4c1d24d86b7,98fa7375c309e508,e934449118c9c6dd,55a6326db48f4bea,e990f36363ef5fc3,4621149cf57bddac,ba256921c07443d2,c6d3efbdb9cc23d0,fe44ed10bed4a1b3,995c9ae4589a187f,a19e8b7259324d5b,2446246ca20351ce,7775ce4adaf02f1b,d23b3744bec5675b,2d9ca26cb61f96e1,1baecfb88f9662f3,be06a6503cc9e520!!" target="_blank">SZ</a></td></tr>
    % elif c['attributes']['ak'] == 'SO':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://www.sogis1.so.ch/sogis/internet/pmapper/somap.php?karte=ortsplan&extent=${','.join(map(str,c['bbox']))}" target="_blank">SO</a></td></tr>
    % elif c['attributes']['ak'] == 'TI':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://www.sitmap.ti.ch/index.php?ct=mue" target="_blank">TI</a></td></tr>
    % elif c['attributes']['ak'] == 'VD':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://www.geo.vd.ch/theme/cadastre_thm?map_x=${(c['bbox'][0] + c['bbox'][2])/2}&map_y=${(c['bbox'][1] + c['bbox'][3])/2}&map_zoom=10" target="_blank">VD</a></td></tr>
    % elif c['attributes']['ak'] == 'TG':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://geo.tg.ch/mapbender/frames/login.php?gui_id=Amtliche%20Vermessung&mb_myBBOX=${','.join(map(str,c['bbox']))}" target="_blank">TG</a></td></tr>
    % elif c['attributes']['ak'] == 'NE':
        <tr><td width="150">${_('link to canton geoportal')}</td><td><a href="http://sitn.ne.ch/theme/cadastre?map_x=${(c['bbox'][0] + c['bbox'][2])/2}&map_y=${(c['bbox'][1] + c['bbox'][3])/2}&map_zoom=10" target="_blank">NE</a></td></tr>
    % elif c['attributes']['ak'] == 'LU':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://www.geo.lu.ch/map/grundbuchplan/?FOCUS=${(c['bbox'][0] + c['bbox'][2])/2}:${(c['bbox'][1] + c['bbox'][3])/2}:${c['scale']}" target="_blank">LU</a></td></tr>
    % elif c['attributes']['ak'] == 'OW':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://map.gis-daten.ch/plan_fuer_grundbuch_bund_ow?xmin=${c['bbox'][0]}&ymin=${c['bbox'][1]}&xmax=${c['bbox'][2]}&ymax=${c['bbox'][3]}" target="_blank">OW</a></td></tr>
    % elif c['attributes']['ak'] == 'NW':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://map.gis-daten.ch/plan_fuer_grundbuch_bund_nw?xmin=${c['bbox'][0]}&ymin=${c['bbox'][1]}&xmax=${c['bbox'][2]}&ymax=${c['bbox'][3]}" target="_blank">NW</a></td></tr>
    % elif c['attributes']['ak'] == 'UR':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://geo.ur.ch/" target="_blank">UR</a></td></tr>
    % elif c['attributes']['ak'] == 'GR':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://geogr.mapserver.ch/shop" target="_blank">GR</a></td></tr>
    % elif c['attributes']['ak'] == 'AI':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://www.ai.ch" target="_blank">AI</a></td></tr>
    % elif c['attributes']['ak'] == 'AR':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://www.ar.ch" target="_blank">AR</a></td></tr>
    % elif c['attributes']['ak'] == 'ZH':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://maps.zh.ch/?topic=AVfarbigwwwZH&scale=${c['scale']}&x=${(c['bbox'][0] + c['bbox'][2])/2}&y=${(c['bbox'][1] + c['bbox'][3])/2}&offlayers=LCOBJPROJ%2Cbezirkslabels" target="_blank">ZH</a></td></tr>
    % elif c['attributes']['ak'] == 'BL':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://geoview.bl.ch/?map_x=${2000000 + (c['bbox'][0] + c['bbox'][2])/2}&map_y=${1000000 + (c['bbox'][1] + c['bbox'][3])/2}&map_zoom=9" target="_blank">BL</a></td></tr>
    % elif c['attributes']['ak'] == 'ZG':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://www.zugmap.ch/zugmap/?idp=1&uid=1&pwd=&map=1&lan=de&typ=3&bmurl=Nav@g@22@u@West@g@${(c['bbox'][0] + c['bbox'][2])/2}@u@Nord@g@${(c['bbox'][1] + c['bbox'][3])/2}@u@B@g@${c['scale']}&dat=fs@g@0:371167b2bf7dfc4b,c7bfc487a7a729d3,9d1d191f82fb57e3,1fb440cdc612de80,4119ae2a85acc4b5,b7b8c26dbec351a9!!" target="_blank">ZG</a></td></tr>
    % elif c['attributes']['ak'] == 'SG':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://www.sg.ch/" target="_blank">AG</a></td></tr>
    % elif c['attributes']['ak'] == 'VS':
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td><a href="http://www.sit-valais.ch/fr/mo-c.html" target="_blnk">VS</a></td></br>
    % elif c['attributes']['ak'] == 'FL':
        <tr><td class="cell-left">${_('link to geoportal')}</td><td><a href="http://geodaten.llv.li/geoshop/public.html?zoombox=${c['bbox'][0]},${c['bbox'][1]},${c['bbox'][2]},${c['bbox'][3]}" target="_blank">${_('FL')}</a></td></tr>
    % else:
        <tr><td class="cell-left">${_('link to canton geoportal')}</td><td>${_('Canton has provided no link to portal')}</td></tr>
    % endif
</%def>
