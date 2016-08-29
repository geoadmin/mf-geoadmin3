describe('ga_time_service', function() {
  var gaTime, gaPermalink, $rootScope, gaDefine;

  describe('gaTime', function() {

    var injectTime = function(timePermalink) {
      inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        gaPermalink = $injector.get('gaPermalink');
        if (timePermalink) {
          gaPermalink.updateParams({time: timePermalink});
        }
        gaTime = $injector.get('gaTime');
        gaDefine = $injector.get('gaDefinePropertiesForLayer');
      });
    };

    describe('#get()', function() {

      it('doesn\'t get the time from permalink', function() {
        injectTime();
        expect(gaTime.get()).to.be(undefined);
      });

      it('gets the time from permalink', function() {
        injectTime(1989);
        expect(gaTime.get()).to.be(1989);
      });

      it('gets a NaN time from permalink', function() {
        injectTime('text');
        expect(gaTime.get()).to.be(undefined);
      });
    });

    describe('#set()', function() {

      beforeEach(function() {
        injectTime();
      });

      it('set time as undefined if NaN', function() {
        gaTime.set('text');
        expect(gaTime.get()).to.be(undefined);
      });

      it('set time as string', function() {
        gaTime.set(1989);
        expect(gaTime.get()).to.be(1989);
      });

      it('set time', function() {
        var spy = sinon.spy($rootScope, '$broadcast');
        gaTime.set('1989');
        expect(gaTime.get()).to.be('1989');
        expect(gaPermalink.getParams().time).to.be('1989');
        expect(spy.calledWith('gaTimeChange', '1989', undefined)).to.be(true);
        spy.reset();

        gaTime.set('1989');
        expect(gaTime.get()).to.be('1989');
        expect(gaPermalink.getParams().time).to.be('1989');
        expect(spy.callCount).to.be(0);
        spy.reset();

        gaTime.set(undefined);
        expect(gaTime.get()).to.be(undefined);
        expect(gaPermalink.getParams().time).to.be(undefined);
        expect(spy.calledWith('gaTimeChange', undefined, '1989')).to.be(true);
        spy.restore();
      });
    });

    describe('#getYearFromTimestamp()', function() {

      beforeEach(function() {
        injectTime();
      });

      it('gets year(integer) from a timestamp(string)', function() {
        expect(gaTime.getYearFromTimestamp(undefined)).to.be(undefined);
        expect(gaTime.getYearFromTimestamp(null)).to.be(undefined);
        expect(gaTime.getYearFromTimestamp('')).to.be(undefined);
        expect(gaTime.getYearFromTimestamp('text')).to.be(undefined);
        expect(gaTime.getYearFromTimestamp(20131201)).to.be(undefined);
        expect(gaTime.getYearFromTimestamp('99991231')).to.be(undefined);
        expect(gaTime.getYearFromTimestamp('current')).to.be(new Date().getFullYear());
        expect(gaTime.getYearFromTimestamp('2011-12-01 00:00:00')).to.be(2011);
      });
    });


    describe('#init()', function() {
       var map;

       var getLayer = function() {
         var layer = new ol.layer.Tile();
         return layer;
       };

       var getTimePreviewLayer = function() {
         var layer = new ol.layer.Tile();
         gaDefine(layer);
         layer.timeEnabled = true;
         layer.preview = true;
         layer.time = '1988';
         return layer;
       };

       var getTimeLayer = function(id, time) {
         var layer = new ol.layer.Tile();
         gaDefine(layer);
         layer.timeEnabled = true;
         layer.id = id;
         layer.time = '1987';
         return layer;
       };


       beforeEach(function() {
         injectTime();
         map = new ol.Map({});
       });

       it('updates status on add/remove of a timeEnabled layer', function() {
         var spy = sinon.spy(gaTime, 'updateStatus');
         gaTime.init(map);
         var l = getTimeLayer();

         map.addLayer(l);
         expect(spy.callCount).to.be(1);
         expect(spy.calledWith([l])).to.be(true);
         spy.reset();

         map.removeLayer(l);
         expect(spy.callCount).to.be(1);
         expect(spy.calledWith([])).to.be(true);
         spy.reset();
       });

       it('doesn\'t update status on add/remove of a preview or non-timeEnabled layer', function() {
         var spy = sinon.spy(gaTime, 'updateStatus');
         gaTime.init(map);

         var l = getLayer();
         var l1 = getTimePreviewLayer();
         map.addLayer(l);
         map.addLayer(l1);
         expect(spy.callCount).to.be(0);

         map.removeLayer(l);
         map.removeLayer(l1);
         expect(spy.callCount).to.be(0);
       });

       it('updates status on property change (time and visible)', function() {
         var spy = sinon.spy(gaTime, 'updateStatus');
         gaTime.init(map);

         var l = getTimeLayer('id');
         var l1 = getTimeLayer('id1');

         map.addLayer(l);
         map.addLayer(l1);
         expect(spy.callCount).to.be(2);
         expect(spy.calledWith([l, l1])).to.be(true);
         spy.reset();

         l.visible = false;
         expect(spy.callCount).to.be(1);
         expect(spy.calledWith([l, l1])).to.be(true);
         spy.reset();

         l1.time = '1876';
         expect(spy.callCount).to.be(1);
         expect(spy.calledWith([l, l1])).to.be(true);
         spy.reset();
       });

       it('doesn\'t update status on property change', function() {
         var spy = sinon.spy(gaTime, 'updateStatus');
         gaTime.init(map);
         var l = getTimeLayer('id');
         var l1 = getTimeLayer('id1');

         map.addLayer(l);
         map.addLayer(l1);
         expect(spy.callCount).to.be(2);
         expect(spy.calledWith([l, l1])).to.be(true);
         spy.reset();

         // same value
         l.time = '1987';
         expect(spy.callCount).to.be(0);
         spy.reset();

         // same value
         l.visible = true;
         expect(spy.callCount).to.be(0);
         spy.reset();

         // time must be a string
         l.time = 1989;
         expect(spy.callCount).to.be(0);
         spy.reset();

         // after the layer is removing
         map.removeLayer(l);
         spy.reset();

         l.time = '1991';
         expect(spy.callCount).to.be(0);
         spy.reset();
       });
    });

    describe('#updateStatus()', function() {
       var map;

       var getTimeLayer = function(id, time) {
         var layer = new ol.layer.Tile();
         gaDefine(layer);
         layer.id = id;
         layer.time = time || '1987';
         layer.timeEnabled = true;
         return layer;
       };

       beforeEach(function() {
         injectTime();
         map = new ol.Map({});
       });

       it('is not allowed to update status', function() {
         expect(gaTime.allowStatusUpdate).to.be(false);
       });

       it('set time depending on all layers\'s time', function() {
         gaTime.allowStatusUpdate = true;
         var l = getTimeLayer();
         var l1 = getTimeLayer('id', '1988');

         gaTime.updateStatus([]);
         expect(gaTime.get()).to.be(undefined);

         // not enough layers
         gaTime.updateStatus([l]);
         expect(gaTime.get()).to.be(undefined);

         // All layers have the same time
         gaTime.updateStatus([l, l]);
         expect(gaTime.get()).to.be(1987);

         // A layer has a different time
         gaTime.updateStatus([l, l1, l]);
         expect(gaTime.get()).to.be(undefined);

         // All visible layers have the same time
         l1.visible = false;
         gaTime.updateStatus([l, l1, l]);
         expect(gaTime.get()).to.be(1987);

         // A layer's time is greater than the current year
         l1.visible = true;
         l1.time = '99993112';
         gaTime.updateStatus([l, l1, l]);
         expect(gaTime.get()).to.be(undefined);
       });
    });
  });
});
