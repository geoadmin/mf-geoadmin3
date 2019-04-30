goog.provide('ga_mapbox_style_storage_service');

goog.require('ga_publicstorage_service');

(function() {

  var module = angular.module('ga_mapbox_style_storage_service', [
    'ga_publicstorage_service'
  ]);

  /**
   * This service can create/read/write/delete a glStyle on public s3 bucket.
   */
  module.provider('gaMapboxStyleStorage', function() {
    this.$get = function($http, $q, gaPublicStorage) {
      var endPoint = '/gl-styles';
      var contentType = 'application/json';

      var MapboxStyleStorage = function() {

        this.get = function(fileId) {
          return gaPublicStorage.get(endPoint, fileId);
        };

        this.getFileIdFromFileUrl = function(fileUrl) {
          return gaPublicStorage.getFileIdFromFileUrl(fileUrl);
        };

        this.getFileUrlFromAdminId = function(adminId) {
          return gaPublicStorage.getFileUrlFromAdminId(endPoint, endPoint,
              adminId);
        };

        this.save = function(id, content) {
          return gaPublicStorage.save(endPoint, endPoint, id, content,
              contentType);
        };

        this.del = function(adminId) {
          return gaPublicStorage.del(endPoint, adminId);
        };

      };
      return new MapboxStyleStorage();
    };
  });
})();
