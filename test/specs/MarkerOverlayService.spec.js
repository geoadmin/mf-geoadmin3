describe('ga_marker_overlay_service', function() {

  describe('gaMarkerOverlay', function() {
    var gaStyleFactory, gaMapUtils, gaMarkerOverlay, map;
    var pt = [0, 1];
    var extentPoint = [0, 1 , 0, 1];
    var extent = [0, 1, 2, 3];

    beforeEach(function() {
      inject(function($injector) {
        gaStyleFactory = $injector.get('gaStyleFactory');
        gaMapUtils = $injector.get('gaMapUtils');
        gaMarkerOverlay = $injector.get('gaMarkerOverlay');
      });
      map = new ol.Map({});
      map.getView().setZoom(4);
    });

    describe('#add()', function() {

      it('initializes the map', function() {
        gaMarkerOverlay.add(map, [0, 1]);
        var layer = map.getLayers().item(0);
        expect(layer.getSource().getFeatures().length).to.be(1);
        expect(layer.getStyle()).to.be(gaStyleFactory.getStyle('marker'));
        expect(layer.getSource().getFeatures()[0].getGeometry().getCoordinates()).to.eql(pt);

        // Init visibility
        expect(layer.getVisible());
      });

      it('doesn\'t add 2 markers or 2 layers', function() {
        gaMarkerOverlay.add(map, pt);
        var layer = map.getLayers().item(0);
        expect(layer.getSource().getFeatures().length).to.be(1);

        gaMarkerOverlay.add(map, [4, 5], false, extent);
        expect(map.getLayers().getLength()).to.be(1);
        layer = map.getLayers().item(0);
        expect(layer.getSource().getFeatures().length).to.be(1);
      });

      it('always show the layer', function() {
        // data with point extent
        map.getView().setZoom(4);
        gaMarkerOverlay.add(map, pt, true);
        var layer = map.getLayers().item(0);
        expect(layer.getVisible()).to.be(true);

        map.getView().setZoom(9);
        gaMarkerOverlay.add(map, pt, true);
        expect(layer.getVisible()).to.be(true);

        // data with big extent
        map.getView().setZoom(4);
        gaMarkerOverlay.add(map, pt, true, extent);
        layer = map.getLayers().item(0);
        expect(layer.getVisible()).to.be(true);

        map.getView().setZoom(9);
        gaMarkerOverlay.add(map, pt, true, extent);
        layer = map.getLayers().item(0);
        expect(layer.getVisible()).to.be(true);
      });

      it('show/hide the layer depending on zoom level', function() {
        // data with big extent
        map.getView().setZoom(4);
        gaMarkerOverlay.add(map, pt, false, extent);
        layer = map.getLayers().item(0);
        expect(layer.getVisible()).to.be(true);

        map.getView().setZoom(9);
        gaMarkerOverlay.add(map, pt, false, extent);
        layer = map.getLayers().item(0);
        expect(layer.getVisible()).to.be(false);
      });
    });

    describe('#setVisibility()', function() {
      it('show/hide the layer depending on zoom level', function() {
        // data with point extent
        gaMarkerOverlay.add(map, pt);
        var layer = map.getLayers().item(0);
        gaMarkerOverlay.setVisibility(5);
        expect(layer.getVisible()).to.be(true);
        gaMarkerOverlay.setVisibility(6);
        expect(layer.getVisible()).to.be(true);
        gaMarkerOverlay.setVisibility(7);
        expect(layer.getVisible()).to.be(true);


        // data with big extent
        gaMarkerOverlay.add(map, pt, false, extent);
        gaMarkerOverlay.setVisibility(5);
        expect(layer.getVisible()).to.be(true);
        gaMarkerOverlay.setVisibility(6);
        expect(layer.getVisible()).to.be(true);
        gaMarkerOverlay.setVisibility(7);
        expect(layer.getVisible()).to.be(false);
      });
    });

    describe('#removeMarker()', function() {

      it('removes the marker', function() {
        gaMarkerOverlay.add(map, pt, false, extent);
        var layer = map.getLayers().item(0);
        expect(layer.getSource().getFeatures().length).to.be(1);
        gaMarkerOverlay.remove(map);
        expect(layer.getSource().getFeatures().length).to.be(0);
      });
    });
  });
});
