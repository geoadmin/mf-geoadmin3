describe('ga_seo_service', function() {
  var gaSeo;
  var url = 'https://map.geo.admin.ch/?lang=fr&topic=luftbilder&bgLayer=ch.swisstopo.pixelkarte-grau&layers=ch.swisstopo.lubis-luftbilder_schwarzweiss,ch.swisstopo.lubis-luftbilder_farbe&layers_timestamp=99991231,99991231&catalogNodes=1179,1180,1186&X=262400.58&Y=708049.38&zoom=2&layers_visibility=true,false';

  describe('gaSeo', function() {
    var spy;
    var injectSeo = function(useEscapeFrag) {
      inject(function($injector) {
        var params = {
          Y: '200000',
          X: '300000',
          zoom: 15
        };

        if (useEscapeFrag) {
          params._escaped_fragment_ = '';
        } else {
          params.layers = 'somelayer1,somelayer2';
        }
        var gaPermalink = $injector.get('gaPermalink');
        sinon.stub(gaPermalink, 'getParams').returns(params);
        sinon.stub(gaPermalink, 'getHref').returns(url);
        spy = sinon.spy(gaPermalink, 'deleteParam');
        gaSeo = $injector.get('gaSeo');
      });
    };

    describe('without _escaped_fragment_ param', function() {

      beforeEach(function() {
        injectSeo(false);
      });

      describe('#getLinkAtStart()', function() {

        beforeEach(function() {
          inject(function($injector) {
          });
        });

        it('gets the permalink at start', function() {
          expect(gaSeo.getLinkAtStart()).to.be(url);
        });
      });

      describe('#isActive()', function() {
        it('returns false', function() {
          expect(gaSeo.isActive()).to.be(false);
        });
      });

      describe('#getLayers()', function() {
        it('gets the layers from the permalink', function() {
          expect(gaSeo.getLayers()).to.eql([
            'somelayer1',
            'somelayer2'
          ]);
        });
      });

      describe('#getYXZoom()', function() {
        it('gets the map info from the permalink', function() {
          expect(gaSeo.getYXZoom()).to.eql({
            Y: '200000',
            X: '300000',
            zoom: 15
          });
        });
      });
    });

    describe('with _escaped_fragment_ param and layers empty', function() {

      beforeEach(function() {
        injectSeo(true);
      });

      describe('#isActive()', function() {
        it('returns true if \'_escaped_fragment_\' exists then this param is removed', function() {
          expect(gaSeo.isActive()).to.be(true);
          expect(spy.calledWith('_escaped_fragment_')).to.be(true);
        });
      });

      describe('#getLayers()', function() {
        it('gets an empty array', function() {
          expect(gaSeo.getLayers()).to.eql([]);
        });
      });
    });
  });
});
