<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">

    <style type="text/css">
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
      }
    </style>
    <title>CHSDI 3</title>
  </head>
  <body>
      <h1 id="title">Python translations</h1>
          <a href="testi18n?lang=de">Default to de</a> <br>
          <a href="testi18n?lang=en">En to en</a> <br>
          <a href="testi18n?lang=toto">If not in available languages to de</a> <br>
      <h1 id="title">Services</h1>
      <h2 id="loaderjs">Loader js</h2>
          <a href="uncached_loader.js">Link to api</a> <br>
          <a href="uncached_loader.js?lang=fr">Link to api in french</a> <br>
          <a href="uncached_loader.js?mode=debug">Link to api in debug mode</a> <br>
      <h3>Apache only links (does not work with pserve)</h3>
          <a href="loader.js">Link to api</a> <br>
          <a href="loader.js?lang=fr">Link to api in french</a> <br>
          <a href="loader.js?mode=debug">Link to api in debug mode</a> <br>
      <h2 id="sitemap">Sitemap Service</h2>
          <a href="sitemap?content=index">Index page</a> <br>
          <a href="sitemap?content=base">Base page</a> <br>
          <a href="sitemap?content=topics">Topics page</a> <br>
          <a href="sitemap?content=layers">Layers page</a> <br>
          <a href="sitemap?content=addresses">Address index page</a> <br>
          <a href="sitemap?content=addresses_33">Sample address index</a> <br>
      <h2 id="checkers">Checkers</h2>
          <a href="checker">Checker for home page</a> <br>
          <a href="checker_dev">Checker for dev page</a> <br> 
      <h2 id="qrcode">QRCode service</h2>
          <a href="qrcodegenerator?url=http://s.geo.admin.ch/e83c57af1">QRCode service</a> <br>
      <h2 id="shorten">Shorten url</h2>
          <a href="shorten.json?url=https:%2F%2Fmf-geoadmin3.int.bgdi.ch%2F%3FX%3D164565.22%26Y%3D620538.74%26zoom%3D2%26lang%3Den%26topic%3Dlubis%26bgLayer%3Dch.swisstopo.pixelkarte-grau%26catalogNodes%3D1179,1180,1184,1186%26layers%3Dch.swisstopo.lubis-bildstreifen">Shorten Example</a> <br>
          <a href="shorten/5f9f3359d3">Shorten link redirection</a> <br>
      <h2 id="mapservices">Map Services</h2> 
          <h3>Mapservice (Layer metadata)</h3>
          <a href="rest/services/ech/MapServer">Topic (ech)</a> <br>
          <a href="rest/services/ech/MapServer?searchText=bern">Topic with fulltext search on the column "volltextsuche, bod id and geocat id"</a> <br>
          <h3>Identify</h3>
          <a href="rest/services/ech/MapServer/identify?geometryType=esriGeometryEnvelope&geometry=545000,145000,555000,155000&imageDisplay=500,600,96&mapExtent=548945.5,147956,549402,148103.5&tolerance=1&layers=all:ch.bafu.bundesinventare-bln">Identify using an envelope (bbox)</a> <br>
          <a href="rest/services/ech/MapServer/identify?geometryType=esriGeometryPoint&geometry=653246,173129&imageDisplay=500,600,96&mapExtent=548945.5,147956,549402,148103.5&tolerance=5&layers=all:ch.bafu.bundesinventare-bln">Identify using a simple point and a tolerance of 5 pixels</a> <br>
          <a href='rest/services/ech/MapServer/identify?geometryType=esriGeometryPoint&geometry={"x":653246,"y":173129,"spatialReference":{"wkid":21781}}&imageDisplay=500,600,96&mapExtent=548945.5,147956,549402,148103.5&tolerance=5&layers=all:ch.bafu.bundesinventare-bln'>Identify using a complexe point  {x:, y:, spatialReference: } </a> <br>
          <a href='rest/services/ech/MapServer/identify?geometryType=esriGeometryEnvelope&geometry=630000,245000,645000,265000&imageDisplay=500,600,96&mapExtent=548945.5,147956,549402,148103.5&tolerance=5&layers=all:ch.bafu.bundesinventare-bln'>Identify using an bbox= </a> <br>
          <a href='rest/services/all/MapServer/identify?geometryType=esriGeometryPoint&geometry=630853.809670509,170647.93120352627&geometryFormat=geojson&imageDisplay=1920,734,96&mapExtent=134253.80967050896,-21102.06879647367,1382253.8096705088,455997.9312035263&tolerance=5&layers=all:ch.swisstopo.zeitreihen&timeInstant=1936'>Identify using time instant on layer zeitreihen</a> <br>
          <a href='rest/services/ech/MapServer/identify?geometryType=esriGeometryPolygon&geometry={"rings"%20:%20[[%20[630000,%20245000],%20[645000,245000],%20[645000,265000],%20[630000,265000],%20[630000,%20245000]%20]],"spatialReference"%20:%20{"wkid"%20:%2021781}}&imageDisplay=500,600,96&mapExtent=548945.5,147956,549402,148103.5&tolerance=1&layers=all:ch.bafu.bundesinventare-bln'>Identify using a polygon</a> <br>
          <a href="rest/services/ech/MapServer/identify?geometryType=esriGeometryEnvelope&geometry=630000,245000,645000,265000&imageDisplay=500,600,96&layers=all:ch.bafu.bundesinventare-bln&mapExtent=548945.5,147956,549402,148103.5&tolerance=1">Identify (default to esri geojson)</a> <br>
          <a href="rest/services/ech/MapServer/identify?geometryFormat=geojson&geometryType=esriGeometryEnvelope&geometry=630000,245000,645000,265000&imageDisplay=500,600,96&layers=all:ch.bafu.bundesinventare-bln&mapExtent=548945.5,147956,549402,148103.5&tolerance=1">Identify (requesting geometryFormat=geojson)</a> <br>
          <a href="rest/services/inspire/MapServer/identify?geometryType=esriGeometryEnvelope&geometry=630000,245000,645000,265000&imageDisplay=500,350,96&mapExtent=545132.87362333,147068.69380758,550132.87362333,150568.69380758&tolerance=1&searchText=AG 19.0.3&layers=all:ch.astra.ivs-nat">Identify on mutiple queryable attributes</a> <br>
          <a href="rest/services/ech/MapServer/identify?geometryType=esriGeometryEnvelope&geometry=630000,245000,645000,265000&imageDisplay=500,350,96&mapExtent=545132.87362333,147068.69380758,550132.87362333,150568.69380758&tolerance=1&layers=all&callback=cb">Identify - example with callback</a> <br>
          <a href="/rest/services/ech/MapServer/identify?geometryType=esriGeometryEnvelope&geometry=630000,245000,645000,265000&imageDisplay=500,600,96&mapExtent=545132.87362333,147068.69380758,550132.87362333,150568.69380758&tolerance=1&layers=all&returnGeometry=false">Identify - without geometry</a> <br>
          <a href="/rest/services/api/MapServer/identify?geometry=618953,170093&geometryType=esriGeometryPoint&imageDisplay=1920,576,96&layers=all:ch.bav.kataster-belasteter-standorte-oev.oereb&mapExtent=671164.31244,253770,690364.31244,259530&tolerance=5&geometryFormat=interlis">Identify - geometryFormat=interlis on Oereb layers</a>
          <h3>Indentify: with query</h3>
          <a href="/rest/services/api/MapServer/identify?geometryType=esriGeometryEnvelope&geometry=502722.0065086734,36344.074765040714,745822.0065086735,253444.07476504074&imageDisplay=0,0,0&mapExtent=0,0,0,0&tolerance=0&layers=all:ch.bazl.luftfahrthindernis&returnGeometry=true&geometryFormat=geojson&where=obstacletype=%27Antenna%27">Query 'ch.bazl.luftfahrthindernis' for 'Antenna' with a bbox</a> <br>
          <a href="/rest/services/api/MapServer/identify?layers=all:ch.bazl.luftfahrthindernis&returnGeometry=true&geometryFormat=geojson&where=obstacletype=%27Antenna%27">Query 'ch.bazl.luftfahrthindernis' for 'Antenna'</a> <br>
          <a href="rest/services/api/MapServer/ch.bazl.luftfahrthindernis/attributes/obstacletype">Get some values for attribute 'obstacletype'</a> <br>
          <h3>Get the attributes of layer</h3>
          <a href="/rest/services/ech/MapServer/ch.swisstopo.geologie-gravimetrischer_atlas.metadata">Returns all the attributes of the layer ch.swisstopo.geologie-gravimetrischer_atlas.metadata</a>
          <h3>Find</h3>
          <a href="rest/services/ech/MapServer/find?layer=ch.bafu.bundesinventare-bln&searchText=Lavaux&searchField=bln_name&returnGeometry=false">Find Lavaux in the field bln_name of the layer ch.bafu.bundesinventare-bln</a> <br>
          <a href="/rest/services/ech/MapServer/find?layer=ch.are.agglomerationen_isolierte_staedte&searchText=15&searchField=flaeche_ha">Find 15 in field flaeche_ha of layer ch.are.agglomerationen_isolierte_staedte (pre-infix match)</a> <br>
          <a href="/rest/services/ech/MapServer/find?layer=ch.bafu.bundesinventare-bln&searchText=1740.478&searchField=bln_fl&returnGeometry=false&contains=false">Find a exact match for 1740.478 in the field bln_fl</a>
          <h3>Releases Service</h3>
          <a href="rest/services/ech/MapServer/ch.swisstopo.zeitreihen/releases?mapExtent=611399.9999999999,158650,690299.9999999999,198150&imageDisplay=500,500,96">Zeitreihen Layer</a> <br>
          <a
          href="rest/services/ech/MapServer/ch.swisstopo.zeitreihen/releases?mapExtent=647570.722,187429.722,653229.277,183690.277&imageDisplay=800,530,96">Zeitreihen
          Layer2</a> <br>

          <h3>Varia</h3>
          <a href="rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/362">Get Feature with id 362</a> <br>
          <a href="rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/362/htmlPopup">Html Popup Ex 1</a> <br>
          <a href="rest/services/ech/MapServer/ch.bafu.bundesinventare-jagdbanngebiete/1/htmlPopup?lang=fr&callback=cb">Html Popup Ex 2 with callback</a> <br>
          <a href="rest/services/ech/MapServer/ch.astra.ivs-reg_loc/54967/htmlPopup">Html Popup Ex 3</a> <br>
          <a href="rest/services/ech/MapServer/ch.kantone.cadastralwebmap-farbe/11/htmlPopup?imageDisplay=600,400,96&mapExtent=573090.125,142393.0625,573097.625,142400.5625">Html popup Ex 4 cadastral web map</a> <br>
          <a href="rest/services/ech/MapServer/ch.bakom.radio-fernsehsender/5/extendedHtmlPopup?imageDisplay=600,400,96&mapExtent=573090.125,142393.0625,573097.625,142400.5625">Extended html content Ex 1</a> <br>
          <a href="rest/services/ech/MapServer/ch.bfe.energieforschung/4/extendedHtmlPopup?imageDisplay=600,400,96&mapExtent=573090.125,142393.0625,573097.625,142400.5625">Extended html content Ex 2 with images</a> <br>
          <a href="rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/legend">Get Legend Ex 1</a> <br>
          <a href="rest/services/ech/MapServer/ch.bafu.bundesinventare-jagdbanngebiete/legend?lang=fr&callback=cb">Get Legend Ex 2 with callback</a> <br>
          <a href="rest/services/height?easting=600000&northing=200000">Height example</a> <br>
          <a href='rest/services/profile.json?geom={"type"%3A"LineString"%2C"coordinates"%3A[[550050%2C206550]%2C[556950%2C204150]%2C[561050%2C207950]]}&elevation_models=DTM25,DTM2'>Profile in json format</a> <br>
          <a href='rest/services/profile.csv?geom={"type"%3A"LineString"%2C"coordinates"%3A[[550050%2C206550]%2C[556950%2C204150]%2C[561050%2C207950]]}&elevation_models=DTM25,DTM2'>Profile in csv format</a> <br>
          <a href='rest/services/inspire/1.0.0/WMTSCapabilities.xml'>WMTS capabilities inspire</a> <br>

      <h2>Topic Listing</h2>
          <a href='rest/services'>List all the available topics</a> <br>

      <h2>Layers Configuration</h2>
          <a href='rest/services/ech/MapServer/layersConfig'>Get the layers configuration for topic ech</a> <br>
          <a href='rest/services/all/MapServer/layersConfig'>Get the layers configuration for all topics</a> <br>
          
      <h2>Ogcproxy</h2>
          <a href="ogcproxy?url=http%3A%2F%2Fmapserver1.gr.ch%2Fwms%2Fadmineinteilung%3FSERVICE%3DWMS%26REQUEST%3DGetCapabilities%26VERSION%3D1.3.0">Get Capabilities using ogcproxy</a>
      <h2>MapProxy</h2>
          <h3>Mapproxy sevices</h3>
          <a href="mapproxy/demo">MapProxy demo</a><br>
          <a href="mapproxy/wmts/1.0.0/WMTSCapabilities.xml">MapProxy WMS</a><br>
          <a href="mapproxy/wmts/1.0.0/WMTSCapabilities.xml">MapProxy WMTS</a><br>
          
          <h3>Raw GetCapabilities (Pyramid pur)</h3>
          <a href="rest/services/api/1.0.0/WMTSCapabilities.xml">GetCapabilities for EPSG:21781</a><br />
          <a href="rest/services/api/1.0.0/WMTSCapabilities.xml?epsg=4326">GetCapabilities for EPSG:4326</a><br />
          <a href="rest/services/api/1.0.0/WMTSCapabilities.xml?epsg=4258">GetCapabilities for EPSG:4258</a><br />
          <a href="rest/services/api/1.0.0/WMTSCapabilities.xml?epsg=2056">GetCapabilities for EPSG:2056</a><br />
          <a href="rest/services/api/1.0.0/WMTSCapabilities.xml?epsg=3857">GetCapabilities for EPSG:3857</a><br />
          <h3>GetCapabilities via apache (don't test with 'localhost')</h3>
          <a href="1.0.0/WMTSCapabilities.xml">GetCapabilities for EPSG:21781</a><br />
          <a href="1.0.0/WMTSCapabilities.EPSG.4326.xml">GetCapabilities for EPSG:4326</a><br />
          <a href="1.0.0/WMTSCapabilities.EPSG.4258.xml">GetCapabilities for EPSG:4258</a><br />
          <a href="1.0.0/WMTSCapabilities.EPSG.2056.xml">GetCapabilities for EPSG:2056</a><br />
          <a href="1.0.0/WMTSCapabilities.EPSG.3857.xml">GetCapabilities for EPSG:3857</a><br />
          <div style="display: block">
          <img src="../mapproxy/wmts/1.0.0/ch.swisstopo.pixelkarte-farbe_20120809/default/20120809/epsg_4258/9/3/2.jpeg" width="256" height="256">
          </div>

      <h2>CatalogService (non ESRI)</h2>
          <a href="rest/services/blw/CatalogServer?callback=callback">Catalog for topic 'blw'</a>
      <h2>Lubis Viewer</h2>
          <a href="luftbilder/viewer.html?layer=Images+aériennes+swisstopo+n+%2F+b&title=No+de+l%27image&height=5952&width=5954&bildnummer=19460400270631&datenherr=swisstopo&x=3770.73&y=3384.70&zoom=1&rotation=0">Link to Lubis full screen Viewer</a>

      <h2>Search</h2>
      <h3>Layers Search (type=layers)</h3>
          <a href="rest/services/inspire/SearchServer?searchText=wand&type=layers">Search for layers only</a> <br>
          <a href="rest/services/inspire/SearchServer?searchText=bois&type=layers&lang=fr">Search for layers only (lang fr)</a> <br>
      <h3>Locations Search (type=locations)</h3>
      <h4>Locations (no bounding box)</h4>
          <a href="rest/services/inspire/SearchServer?searchText=wasser&type=locations">Search for 'Wasser' in SwissSearch in Inpsire</a> <br>
          <a
          href="rest/services/blw/SearchServer?searchText=wasser&type=locations">Search for 'Wasser' in SwissSearch in Blw</a> <br>
      <h3>Feature Search (type=featuresearch)</h3>
      <h4>Features (bounding box for features only)</h4>
          <a href="rest/services/inspire/SearchServer?searchText=vd
          446&features=ch.astra.ivs-reg_loc&type=featuresearch&bbox=551306.5625,167918.328125,551754.125,168514.625">Search for
          features in ch.astra.ivs-reg_loc (without bbox, features within the bbox)</a> <br>
      <h4>Features and time </h4>
          <a
          href="rest/services/inspire/SearchServer?searchText=19810590048970&features=ch.swisstopo.lubis-luftbilder_farbe&type=featuresearch&bbox=542199.5,206799.5,542200.5,206800.5&timeInstant=1981&timeEnabled=true">Search for features
          in ch.swisstopo.lubis-luftbilder_farbe with timeInstant parameter (1 result)</a> <br>
          <a
          href="rest/services/inspire/SearchServer?searchText=19810590048970&features=ch.swisstopo.lubis-luftbilder_farbe&type=featuresearch&bbox=542199.5,206799.5,542200.5,206800.5&timeInstant=1981&timeEnabled=true">Search for features
          in ch.swisstopo.lubis-luftbilder_farbe with timeStamps parameter (1 result)</a> <br>
          <a
          href="rest/services/inspire/SearchServer?searchText=19810590048970&features=ch.swisstopo.lubis-luftbilder_farbe&type=featuresearch&bbox=542199.5,206799.5,542200.5,206800.5&timeStamps=1953&timeEnabled=true">Search for features
          in ch.swisstopo.lubis-luftbilder_farbe with time parameter (no  results)</a> <br>
          <a
          href="rest/services/inspire/SearchServer?searchText=19&features=ch.swisstopo.lubis-luftbilder_farbe&type=featuresearch&bbox=568465,187823,606865,201423&timeInstant=1998&timeEnabled=true">Search for features
          in ch.swisstopo.lubis-luftbilder_farbe
          with time parameter (several  results)</a> <br>
          <a href="rest/services/inspire/SearchServer?features=ch.bafu.hydrologie-gewaesserzustandsmessstationen&type=featuresearch&searchText=4331">Search for features using that matches a given searchText in their search fields</a> <br>
      <h3>Feature identify (type=featureidentify) only bbox search, no search text)</h3>
          <a href="rest/services/inspire/SearchServer?features=ch.astra.ivs-reg_loc&type=featureidentify&bbox=551306.5625,167918.328125,551754.125,168514.625">Search for features in ch.astra.ivs-reg_loc (only features within the bbox)</a> <br>
      <h2>Attributes values</h2>
      <a href="rest/services/api/MapServer/ch.bazl.luftfahrthindernis/attributes/obstacletype">Possible values for attribute 'obstacletype' of layer 'ch.bazl.luftfahrthindernis'</a><br />
      <a href="rest/services/api/MapServer/ch.bazl.luftfahrthindernis/attributes/startofconstruction">Possible values for attribute 'startofconstruction' of layer 'ch.bazl.luftfahrthindernis'</a><br />
      <h2>Attributes description</h2>
      <a href="rest/services/api/MapServer/ch.bazl.luftfahrthindernis">Attributes of layer 'ch.bazl.luftfahrthindernis'</a><br />
      <br/>
      <br/>
  </body>
</html>
