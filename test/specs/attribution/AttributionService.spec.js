/* eslint-disable max-len */
describe('ga_attribution_service', function() {

  describe('gaAttribution', function() {
    var gaAttribution, gaUrlUtils, $translate, def, lang = 'somelang';
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
      },
      'layerVtWithAttr': {
        bodId: 'layerVtWithAttr',
        attribution: '<a>Some text</a>'
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

      inject(function($injector) {
        def = $injector.get('$q').defer();
        gaAttribution = $injector.get('gaAttribution');
        gaUrlUtils = $injector.get('gaUrlUtils');
        $translate = $injector.get('$translate');
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

      // If attribution already exists in the cache of the service, don't
      // fill the cache
      var spy = sinon.spy(gaUrlUtils, 'isValid');
      gaAttribution.getHtmlFromLayer(olLayer);
      expect(spy.callCount).to.be(1);
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
      // WMS
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
      host = 'public.geo.admin.ch';
      attrib = gaAttribution.getHtmlFromLayer(olLayer);
      expect(attrib).to.eql(getThirdPartyAttrib(host));
      attrib = gaAttribution.getHtmlFromLayer(olLayer, true);
      expect(attrib).to.eql(getThirdPartyAttrib(host));
      attrib = gaAttribution.getTextFromLayer(olLayer);
      expect(attrib).to.eql(host);

      // local file
      olLayer = {url: 'blob:https://mf-geoadmin3.dev.bgdi.ch/1152348a-7743-4363-83f0-1860dbba5012'};
      host = 'User local file';
      attrib = gaAttribution.getHtmlFromLayer(olLayer);
      expect(attrib).to.eql(getThirdPartyAttrib(host));
      attrib = gaAttribution.getHtmlFromLayer(olLayer, true);
      expect(attrib).to.eql(getThirdPartyAttrib(host));
      attrib = gaAttribution.getTextFromLayer(olLayer);
      expect(attrib).to.eql(host);

      // VectorTile
      olLayer = {externalStyleUrl: 'http://public.geo.admin.ch/idsfdsf'};
      host = 'public.geo.admin.ch';
      attrib = gaAttribution.getHtmlFromLayer(olLayer);
      expect(attrib).to.eql(getThirdPartyAttrib(host));
      attrib = gaAttribution.getHtmlFromLayer(olLayer, true);
      expect(attrib).to.eql(getThirdPartyAttrib(host));
      attrib = gaAttribution.getTextFromLayer(olLayer);
      expect(attrib).to.eql(undefined);

      // VectorTile 2
      olLayer = {
        bodId: 'layerVtWithAttr',
        externalStyleUrl: 'http://public.geo.admin.ch/idsfdsf'
      };
      host = 'public.geo.admin.ch';
      var expectedAttrib = '<a>Some text</a>, ' +
      '<span class="ga-warning-tooltip">public.geo.admin.ch</span>';
      attrib = gaAttribution.getHtmlFromLayer(olLayer);
      expect(attrib).to.eql(expectedAttrib);
      attrib = gaAttribution.getHtmlFromLayer(olLayer, true);
      expect(attrib).to.eql(expectedAttrib);
      attrib = gaAttribution.getTextFromLayer(olLayer);
      expect(attrib).to.eql('<a>Some text</a>');
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
