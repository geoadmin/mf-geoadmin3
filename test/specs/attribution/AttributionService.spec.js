describe('ga_attribution_service', function() {
  describe('gaAttribution', function() {
    var gaAttribution, def, gaLang, lang = 'somelang';
    var bodAttribTemplate = '<a target="new" href="{{Url}}">{{Text}}</a>';
    var bodAttribTemplateNoLink = '{{Text}}';
    var thirdPartyAttribTemplate = '<span class="ga-warning-tooltip">{{Text}}</span>';
    var layersConfig = {
      'layer': {
        bodId: 'layer',
        attribution: 'Some text',
        attributionUrl: 'http://foo.com/bar.html',
        config3d: 'layer3d'
      },
      'layerNoLink': {
        bodId: 'layerNoLink',
        attribution: 'Some text',
        attributionUrl: 'just.some.stuff',
        config3d: 'layer3dNoLink'
      }

    };
    var layersConfig3d = {
      'layer3d': {
        bodId: 'layer',
        attribution: 'Some 3d text',
        attributionUrl: 'http://foo3d.com/bar.html'
      },
      'layer3dNoLink': {
        bodId: 'layerNoLink',
        attribution: 'Some 3d text',
        attributionUrl: 'just.some.stuff'
      }
    };

    var getBodAttrib = function(config) {
      return bodAttribTemplate.replace('{{Text}}', config.attribution).
          replace('{{Url}}', config.attributionUrl);
    };

    var getBodAttribNoLink = function(config) {
      return bodAttribTemplateNoLink.replace('{{Text}}', config.attribution);
    };

    var getThirdPartyAttrib = function(text) {
      return thirdPartyAttribTemplate.replace('{{Text}}', text);
    };

    beforeEach(function() {
      module(function($provide) {
        $provide.value('gaLayers', {
          loadConfig: function() {
            return def.promise;
          },
          getLayer: function(bodId) {
            return layersConfig[bodId];
          },
          getLayerProperty: function(bodId, prop) {
            return layersConfig[bodId][prop];
          },
          getConfig3d: function(config) {
            return layersConfig3d[config.config3d];
          }
        });

        $provide.value('gaLang', {
          get: function() {
            return lang;
          },
          set: function(newLang) {
            lang = newLang;
            $translate.use(newLang);
          }
        });
      });

      inject(function(_gaAttribution_, _gaLang_, $q) {
        def = $q.defer();
        gaAttribution = _gaAttribution_;
        gaLang = _gaLang_;
      });
      def.resolve();
    });

    it('gets attribution of bod layer', function() {
      var olLayer = {bodId: 'layer'};
      var layerConfig = layersConfig['layer'];
      var layerConfig3d = layersConfig3d['layer3d'];
      var attrib = gaAttribution.getHtmlFromLayer(olLayer);
      expect(attrib).to.eql(getBodAttrib(layerConfig));
      attrib = gaAttribution.getHtmlFromLayer(olLayer, true);
      expect(attrib).to.eql(getBodAttrib(layerConfig3d));
      attrib = gaAttribution.getTextFromLayer(olLayer);
      expect(attrib).to.eql(layerConfig.attribution);
    });

    it('gets attribution of bod layer with no link', function() {
      var olLayer = {bodId: 'layerNoLink'};
      var layerConfig = layersConfig['layerNoLink'];
      var layerConfig3d = layersConfig3d['layer3dNoLink'];
      var attrib = gaAttribution.getHtmlFromLayer(olLayer);
      expect(attrib).to.eql(getBodAttribNoLink(layerConfig));
      attrib = gaAttribution.getHtmlFromLayer(olLayer, true);
      expect(attrib).to.eql(getBodAttribNoLink(layerConfig3d));
      attrib = gaAttribution.getTextFromLayer(olLayer);
      expect(attrib).to.eql(layerConfig.attribution);
    });

    it('gets attribution of external (third party) layer', function() {
      var olLayer = {url: 'http://foo.ch/admin/wms'};
      var host = 'foo.ch';
      var attrib = gaAttribution.getHtmlFromLayer(olLayer);
      expect(attrib).to.eql(getThirdPartyAttrib(host));
      attrib = gaAttribution.getHtmlFromLayer(olLayer, true);
      expect(attrib).to.eql(getThirdPartyAttrib(host));
      attrib = gaAttribution.getTextFromLayer(olLayer);
      expect(attrib).to.eql(host);

      // public.geo.admin.ch
      olLayer = {url: 'http://public.geo.admin.ch/idsfdsf'};
      var host = 'public.geo.admin.ch';
      var attrib = gaAttribution.getHtmlFromLayer(olLayer);
      expect(attrib).to.eql(getThirdPartyAttrib(host));
      attrib = gaAttribution.getHtmlFromLayer(olLayer, true);
      expect(attrib).to.eql(getThirdPartyAttrib(host));
      attrib = gaAttribution.getTextFromLayer(olLayer);
      expect(attrib).to.eql(host);
    });

    it('gets attribution of external (but admin) layer', function() {
      var olLayer = {url: 'http://wms.geo.admin.ch/wms'};
      var host = 'wms.geo.admin.ch';
      var attrib = gaAttribution.getHtmlFromLayer(olLayer);
      expect(attrib).to.eql(host);
      attrib = gaAttribution.getHtmlFromLayer(olLayer, true);
      expect(attrib).to.eql(host);
      attrib = gaAttribution.getTextFromLayer(olLayer);
      expect(attrib).to.eql(host);
    });

    it('doesn\'t get attribution for local layer (dnd)', function() {
      var olLayer = {url: 'my_kml_file_kml'};
      var attrib = gaAttribution.getHtmlFromLayer(olLayer);
      expect(attrib).to.eql(undefined);
      attrib = gaAttribution.getHtmlFromLayer(olLayer, true);
      expect(attrib).to.eql(undefined);
      attrib = gaAttribution.getTextFromLayer(olLayer);
      expect(attrib).to.eql(undefined);
    });
  });
});
