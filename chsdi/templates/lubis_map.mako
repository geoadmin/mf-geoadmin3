<%def name="init_map(ebkey, width, height, rotation, target)">
        var TILE_SIZE = 256;
        var MAX_INSTANCES = 4;
        var curInstance = MAX_INSTANCES;
        var width = parseInt(${width});
        var height = parseInt(${height});
        var rotation= parseInt(${rotation if rotation != 'None' and rotation is not None else 0}) * Math.PI / 180;

        var url = '//aerialimages{curInstance}.geo.admin.ch/tiles/${ebkey}/';
        var resolutions = [1]; // 1 is the min resolution of the pyramid (for all images)
        var curResolution = resolutions[0];
        var maxResolution = Math.max(width, height) / TILE_SIZE;
        
        while (curResolution < maxResolution) {
          curResolution *= 2;
          resolutions.unshift(curResolution);
        }

        var lubisMap = new ol.Map({
          layers: [
            new ol.layer.Tile({
              preload: 0,
              source: new ol.source.TileImage({
                crossOrigin: null,
                tileGrid: new ol.tilegrid.TileGrid({
                  origin: [0, 0],
                  resolutions: resolutions
                }),
                tileUrlFunction: function(tileCoord, pixelRatio, projection) {
                  var coords = tileCoord;
                  if (coords[0] < 0 || coords[1] < 0 || coords[2] < 0) {
                    return undefined;
                  }
                  var factor = this.getTileGrid().getTileSize() * this.getTileGrid().getResolutions()[coords[0]];
                  if (coords[1] * factor > width || coords[2] * factor > height) {
                    return undefined;
                  }

                  curInstance = (++curInstance > MAX_INSTANCES) ? 0 : curInstance;
                  return url.replace('{curInstance}', curInstance) + tileCoord.join('/') + ".jpg";
                }
              })
            })
          ],
          controls: ol.control.defaults().extend([new ol.control.FullScreen()]),
          renderer: 'canvas',
          target: ${target},
          logo: false,
          view: new ol.View({
            projection: new ol.proj.Projection({
              code: 'PIXELS',
              units: 'pixels',
              extent: [0, 0, TILE_SIZE * resolutions[0], TILE_SIZE * resolutions[0]] // max extent of the pyramid at zoom level 0
            }),
            maxZoom: resolutions.length + 1 // The min resolution of the pyramid is 1, so we add 2 client zoom equivalent to resolutions 0.5 and 0.25
          })
        });
        lubisMap.getView().fitExtent([0, 0, width, height], lubisMap.getSize());
        lubisMap.getView().setRotation(rotation);
</%def>

