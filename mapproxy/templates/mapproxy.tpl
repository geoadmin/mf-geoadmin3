services:
  # comment out unneeded services
  demo:
  kml:
  #tms:

  wmts:
     restful: true
     kvp: false
     restful_template: /1.0.0/{Layer}/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.{Format}

  wms:
    srs: ['EPSG:4326', 'EPSG:21781', 'EPSG:4258', 'EPSG:3857', 'EPSG:2056']
    image_formats: ['image/jpeg', 'image/png']
    md:
      # metadata used in capabilities documents
      title: GeoAdmin MapProxy WMS
      abstract: GeoAdmin geodata
      online_resource: http://api3.geo.admin.ch/mapproxy/service?
      contact:
        person: webgis@swisstopo.ch
        organization: Bundesamt für Landestopografie swisstopo
        address: Seftigenstrasse 264
        city: Wabern
        postcode: 3084
        country: Schweiz
        phone: +41 (0)31 / 963 21 11
        fax: +41 (0)31 / 963 24
        email: webgis@swisstopo.ch
      access_constraints: 'License'
      fees: 'This service cant be used without permission'

layers:
  - name: osm
    title: OpenStreetMap
    sources: [osm_cache]
  - name: "ch.kantone.cadastralwebmap-farbe_current"
    title: "CadastralWebMap"
    sources: [ch.kantone.cadastralwebmap-farbe_wms_cache]
    dimensions:
       Time:
          default: "current"
          values: ["current"]

sources:
  osm_tms:
    type: tile
    grid: global_mercator_osm
    url: http://c.tile.openstreetmap.org/%(tms_path)s.png
    coverage:
      bbox: [420000,30000,900000,350000]
      bbox_srs: EPSG:21781
  ch.kantone.cadastralwebmap-farbe_wms_source:
    type: wms
    wms_opts:
      version: 1.1.1
    supported_srs: ['EPSG:21781']
    req:
      url: http://wms.cadastralwebmap.ch/WMS
      layers: cm_wms
  boundaries_source:
    type: wms
    req:
      url: http://wms.geo.admin.ch
      layers: ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill

caches:
  ch.kantone.cadastralwebmap-farbe_wms_cache:
     disable_storage: true
     format: image/png
     meta_size: [1, 1]
     grids: [epsg_21781, epsg_4258, epsg_4326, epsg_2056, epsg_3857]
     sources: [ch.kantone.cadastralwebmap-farbe_wms_source]
  osm_cache:
    grids: [global_mercator_osm]
    sources: [osm_tms]
    disable_storage: true
    concurrent_tile_creators: 4
    watermark:
      text: '@ OpenStreetMap contributors'
      font_size: 14
      opacity: 100
      color: [0,0,0]


grids:
  epsg_21781:
    res: [4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5,0.25,0.1]
    bbox: [420000,30000,900000,350000]
    bbox_srs: EPSG:21781
    srs: EPSG:21781
    origin: nw
    stretch_factor: 1.0
  swisstopo-swissimage:
    res: [4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5,0.25]
    bbox: [420000,30000,900000,350000]
    bbox_srs: EPSG:21781
    srs: EPSG:21781
    origin: nw
    stretch_factor: 1.0
  swisstopo-pixelkarte:
    res: [4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5]
    threshold_res: [900,700,400,200,90,40,15]
    bbox: [420000,30000,900000,350000]
    bbox_srs: EPSG:21781
    srs: EPSG:21781
    origin: nw
    stretch_factor: 1.0
  global_mercator_osm:
    base: GLOBAL_MERCATOR
    num_levels: 18
    origin: nw
  #lowres_mercator:
  epsg_3857:
    base: GLOBAL_MERCATOR
    num_levels: 18
    origin: nw
  #lowres_etrs89:
  epsg_4258:
    # defintion from ech 0056
    res: [1.40625000,0.00549316,0.70312500,0.00274658,0.35156250,0.00137329,0.17578125,0.00068664,0.08789062,0.00034332,0.04394531,0.00017166,0.02197266,0.00008583,0.01098633,0.00004292,0.00002146,0.00001073,0.00000536,0.00000268,0.00000134,0.00000067]
    bbox: [420000,30000,900000,350000]
    bbox_srs: EPSG:21781
    srs: EPSG:4258
    origin: nw
    stretch_factor: 1.0
  #lowres_wgs84:
  epsg_4326:
    # defintion from ech 0056
    res: [
         #  res            level     scale @90.7 DPI
            0.0359326114, #  0    14285714.28571429
            0.0336868232, #  1    13392857.14285714
            0.0314410349, #  2    12500000.00000000
            0.0269494585, #  3    10714285.71428571
            0.0247036703, #  4     9821428.57142857
            0.0224578821, #  5     8928571.42857143
            0.0202120939, #  6     8035714.28571429
            0.0179663057, #  7     7142857.14285714
            0.0157205175, #  8     6250000.00000000
            0.0134747293, #  9     5357142.85714286
            0.0112289411, # 10     4464285.71428571
            0.0089831528, # 11     3571428.57142857
            0.0067373646, # 12     2678571.42857143
            0.0058390493, # 13     2321428.57142857
            0.0044915764, # 14     1785714.28571429
            0.0022457882, # 15      892857.14285714
            0.0008983153, # 16      357142.85714286
            0.0004491576, # 17      178571.42857143
            0.0001796631, # 18       71428.57142857
            0.0000898315, # 19       35714.28571429
            0.0000449158, # 20       17857.14285714
            0.0000224579, # 21        8928.57142857
            0.0000179663, # 22        7142.85714286
            0.0000134747, # 23        5357.14285714
            0.0000089832, # 24        3571.42857143
            0.0000044916, # 25        1785.71428571
            0.0000022458, # 26         892.85714286
            0.0000008983, # 27         357.14285714
            0.00000001,
            0.000000001,
    ]
    bbox: [420000,30000,900000,350000]
    bbox_srs: EPSG:21781
    srs: EPSG:4326
    origin: nw
    stretch_factor: 1.0
  #lowres_lv95:
  epsg_2056:
    res: [4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5,0.25,0.1]
    bbox: [2420000.0, 1030000.0, 2900000.0, 1350000.0]
    bbox_srs: EPSG:2056
    srs: EPSG:2056
    origin: nw
    stretch_factor: 1.0

globals:
  cache:
    # use parallel requests to the WMTS sources
    concurrent_tile_creators: 32
  image:
      resampling_method: bicubic
      # for 24bits PNG
      paletted: false
      formats:
         image/png:
             mode: RGBA 
             transparent: true
         image/jpeg:
             mode: RGB 
             encoding_options:
                 jpeg_quality: 88

  srs:
    # Custom proj_lib definitions
    # Deactivate until mf-chsdi3/issues/1302 is solved 
    proj_data_dir: ./proj_data
    # for North/East ordering (default for geographic)
    axis_order_ne:  ['EPSG:4326', 'EPSG:4258', 'EPSG:3857']
    # for East/North ordering (default for projected)
    axis_order_en: ['EPSG:21781', 'EPSG:2056'] 

