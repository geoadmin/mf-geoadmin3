services:
  # comment out unneeded services
  demo:
  kml:
  tms:
      origin: 'sw'
      use_grid_names: true

  wmts:
     restful: true
     kvp: false
     restful_template: /1.0.0/{Layer}/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.{Format}

  wms:
    srs: ['EPSG:4326', 'CRS:84', 'EPSG:21781', 'EPSG:4258', 'EPSG:3857', 'EPSG:2056']
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
    num_levels: 20
    origin: nw
  #lowres_etrs89:
  epsg_4258:
    base: 'GLOBAL_GEODETIC'
    srs: EPSG:4258
    res: [0.7031250000000000000000,0.3515625000000000000000, 0.1757812500000000000000, 0.0878906250000000000000,0.0439453125000000000000, 0.0219726562500000000000, 0.0109863281250000000000, 0.0054931640625000000000, 0.0027465820312500000000, 0.0013732910156250000000, 0.0006866455078125000000, 0.0003433227539062500000, 0.0001716613769531250000, 0.0000858306884765625000, 0.0000429153442382812000, 0.0000214576721191406000, 0.0000107288360595703000, 0.0000053644180297851600, 0.0000026822090148925800]
    bbox: [-180.0,-90, 180.0, 90.0]
    bbox_srs: EPSG:4326
    origin: nw
    stretch_factor: 1.0
  #lowres_wgs84:
  epsg_4326:
    base: 'GLOBAL_GEODETIC'
    srs: EPSG:4326
    res: [0.7031250000000000000000,0.3515625000000000000000, 0.1757812500000000000000, 0.0878906250000000000000,0.0439453125000000000000, 0.0219726562500000000000, 0.0109863281250000000000, 0.0054931640625000000000, 0.0027465820312500000000, 0.0013732910156250000000, 0.0006866455078125000000, 0.0003433227539062500000, 0.0001716613769531250000, 0.0000858306884765625000, 0.0000429153442382812000, 0.0000214576721191406000, 0.0000107288360595703000, 0.0000053644180297851600, 0.0000026822090148925800]
    bbox: [-180.0,-90, 180.0, 90.0]
    bbox_srs: EPSG:4326
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
    proj_data_dir: ./proj_data
    # for North/East ordering (default for geographic)
    axis_order_ne:  ['EPSG:4326', 'EPSG:4258', 'EPSG:3857']
    # for East/North ordering (default for projected)
    axis_order_en: ['EPSG:21781', 'EPSG:2056'] 

