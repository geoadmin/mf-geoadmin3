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
         * Stores the original sprites
         * @private {Object}
         */
        this.spriteCache_ = null;

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
          var defer = $q.defer();
          $http.get(styleUrl, { cache: true }).then(function(response) {
            that.styleCache_ = response.data;
            var spriteUrl = that.styleCache_.sprite + '.json';
            that.getSprite(spriteUrl).then(function(styleData) {
              defer.resolve(styleData);
            });
          }, function(res) {
            that.styleCache_ = null;
            that.spriteCache_ = null;
            $window.console.error('Unable to load the style from ' + styleUrl +
                ' response status is ' + res.status);
            defer.reject(res);
          });
          return defer.promise;
        };

        this.getSprite = function(spriteUrl) {
          var that = this;
          return $http.get(spriteUrl, { cache: true }).then(function(res) {
            that.spriteCache_ = res.data;
            return {
              style: that.styleCache_,
              sprite: that.spriteCache_
            };
          }, function(res) {
            that.spriteCache_ = null;
            $window.console.error('Unable to load ' + spriteUrl +
                ' response status is ' + res.status);
            // failing to load sprite is ok for now...
            return {
              style: that.styleCache_,
              sprite: that.spriteCache_
            };
          });
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
                  var editStyle = edit[2].split('|');
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
          return {
            style: newStyle,
            sprite: this.spriteCache_
          };
        };

        this.edit = function(edits) {
          var newStyle = this.cloneStyle();
          this.edits_ = this.edits_.concat(edits);
          var layers = this.applyFiltersAndEdits_(newStyle);
          newStyle.layers = layers;
          return {
            style: newStyle,
            sprite: this.spriteCache_
          };
        };

        this.resetEdits = function() {
          var newStyle = this.cloneStyle();
          this.edits_ = [];
          var layers = this.applyFiltersAndEdits_(newStyle);
          newStyle.layers = layers;
          return {
            style: newStyle,
            sprite: this.spriteCache_
          }
        };

        this.resetFilters = function() {
          var newStyle = this.cloneStyle();
          this.filters_ = [];
          var layers = this.applyFiltersAndEdits_(newStyle);
          newStyle.layers = layers;
          return {
            style: newStyle,
            sprite: this.spriteCache_
          }
        };

        /**
         * Remove all filters and edits
         */
        this.reset = function() {
          this.filters_ = [];
          this.edits_ = [];
          return {
            style: this.styleCache_,
            sprite: this.spriteCache_
          };
        };
      };
      return new GlStyle();
    };
  });
})();
