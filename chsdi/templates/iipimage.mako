<%def name="init_map(filename, width, height, target)">
        var width = parseInt(${width});
        var height = parseInt(${height});
        var url = "//web-iipimage.prod.bgdi.ch/iipimage/iipsrv.fcgi?Zoomify=${filename}/";
        var mapIipimage = new ol.Map({
          layers: [
            new ol.layer.Tile({
              source: new ol.source.Zoomify({
                url: url,
                size: [width, height],
                tierSizeCalculation: 'truncated'
              })
            })
          ],
          controls: ol.control.defaults().extend([new ol.control.FullScreen()]),
          renderer: 'canvas',
          target: ${target},
          ol3Logo: false,
          view: new ol.View2D({
            projection: new ol.proj.Projection({
              code: 'ZOOMIFY',
              units: 'pixels',
              extent: [0, 0, width, height]
            })
          })
        });
        mapIipimage.getView().fitExtent([0, -height, width, 0], mapIipimage.getSize());
</%def>

