goog.provide('ga_gl_style_service');
(function() {
  var module = angular.module('ga_gl_style_service', []);

  module.provider('gaGLStyle', function() {
    this.$get = function($http, $q, $window) {
      var GLStyle = function() {

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
            var msg =
              'Unable to load the style from ' +
              styleUrl +
              ' response status is ' +
              res.status;
            $window.console.error(msg);
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
            $window.console.error(
                'Unable to load ' +
                spriteUrl +
                ' response status is ' +
                res.status);
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

        this.filter = function(filters) {
          var that = this;
          var layers = [];
          var newStyle = this.cloneStyle();
          this.filters_ = this.filters_.concat(filters);
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
            if (addLayer) layers.push(layer);
          });
          newStyle.layers = layers;
          return newStyle;
        };

        this.edit = function(edits) {
          var newStyle = this.cloneStyle();
          this.edits_ = this.edits_.concat(edits);
          // TODO apply filters and edits logic here and return a new object
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
      return new GLStyle();
    };
  });
})();
