goog.provide('ga_glstyle_service');

(function() {
  var module = angular.module('ga_glstyle_service', []);

  module.provider('gaGlStyle', function() {
    this.$get = function($http, $q, $window) {
      var GlStyle = function() {
        /**
         * Stores the original style
         * @private {Object}
         */
        this.styleCache_ = null;

        /**
         * A list of mutually inclusive active filters on the layers
         * Example: [['propName', 'comparator', 'propVal']]
         * @private {Array<Array<string, string, string>>}
         */
        this.filters_ = [];

        /**
         * A list of style editions such as layout
         * or paint properties on the layers
         * @private
         */
        this.edits_ = [];

        this.get = function(styleUrl) {
          var that = this;
          return $http.get(styleUrl, {
            cache: true
          }).then(function(response) {
            that.styleCache_ = response.data;
            return response.data;
          }, function(res) {
            $window.console.error('Unable to load the style from ' + styleUrl +
                ' response status is ' + res.status);
          });
        };

        this.getSpriteData = function(spriteUrl) {
          return $http.get(spriteUrl, { cache: true }).then(function(res) {
            return res.data;
          }, function(res) {
            $window.console.error('Unable to load ' + spriteUrl +
                ' response status is ' + res.status);
          });
        };

        this.getSpriteDataFromGlStyle = function(glStyle) {
          var spriteUrl = glStyle.sprite + '.json'
          return this.getSpriteData(spriteUrl);
        };

        this.cloneStyle = function() {
          var newStyle = {};
          angular.copy(this.styleCache_, newStyle);
          return newStyle;
        };

        this.applyFiltersAndEdits_ = function(newStyle) {
          var that = this;
          var layers = [];
          newStyle.layers.forEach(function(layer) {
            var addLayer = true;
            that.filters_.forEach(function(filter) {
              var propertyName = filter[0];
              var comparator = filter[1];
              var propertyValue = filter[2];
              var layerProperty = layer[propertyName];
              if (layerProperty) {
                if (comparator === '==') {
                  addLayer = addLayer && layerProperty !== propertyValue;
                } else if (comparator === '!=') {
                  addLayer = addLayer && layerProperty === propertyValue;
                }
              }
            });
            if (addLayer) {
              that.edits_.forEach(function(edit) {
                var editPropertyName = edit[0];
                var editPropertyValue = edit[1];
                var editLayerProperty = layer[editPropertyName];
                if (editLayerProperty &&
                    editLayerProperty === editPropertyValue) {
                  var editStyle = edit[2];
                  if (!layer[editStyle[0]]) {
                    layer[editStyle[0]] = {};
                  }
                  layer[editStyle[0]][editStyle[1]] = editStyle[2];
                }
              });
              layers.push(layer);
            }
          });
          return layers;
        };

        this.filter = function(filters) {
          var newStyle = this.cloneStyle();
          this.filters_ = this.filters_.concat(filters);
          var layers = this.applyFiltersAndEdits_(newStyle);
          newStyle.layers = layers;
          return newStyle;
        };

        this.edit = function(edits) {
          var newStyle = this.cloneStyle();
          this.edits_ = this.edits_.concat(edits);
          var layers = this.applyFiltersAndEdits_(newStyle);
          newStyle.layers = layers;
          return newStyle;
        };

        this.resetEdits = function() {
          var newStyle = this.cloneStyle();
          this.edits_ = [];
          var layers = this.applyFiltersAndEdits_(newStyle);
          newStyle.layers = layers;
          return newStyle;
        };

        this.resetFilters = function() {
          var newStyle = this.cloneStyle();
          this.filters_ = [];
          var layers = this.applyFiltersAndEdits_(newStyle);
          newStyle.layers = layers;
          return newStyle;
        };

        /**
         * Remove all filters and edits
         */
        this.reset = function() {
          this.filters_ = [];
          this.edits_ = [];
          return this.styleCache_;
        };
      };
      return new GlStyle();
    };
  });
})();
