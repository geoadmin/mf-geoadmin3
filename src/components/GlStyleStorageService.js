goog.provide('ga_glstylestorage_service');

goog.require('ga_publicstorage_service');

(function() {

  var module = angular.module('ga_glstylestorage_service', [
    'ga_publicstorage_service'
  ]);

  /**
   * This service can create/read/write/delete a glStyle on public s3 bucket.
   */
  module.provider('gaGlStyleStorage', function() {
    this.$get = function($http, $q, gaPublicStorage) {
      var endPoint = '/gl-styles';
      var contentType = 'application/json';

      var GlStyleStorage = function() {

        this.get = function(fileId) {
          return gaPublicStorage.get(endPoint, fileId);
        };

        this.getFileIdFromFileUrl = function(fileUrl) {
          return gaPublicStorage.getFileIdFromFileUrl(fileUrl);
        };

        this.getFileUrlFromAdminId = function(adminId) {
          return gaPublicStorage.getFileUrlFromAdminId(endPoint, adminId);
        };

        this.save = function(id, content) {
          return gaPublicStorage.save(endPoint, id, content, contentType);
        };

        this.del = function(adminId) {
          return gaPublicStorage.del(endPoint, adminId);
        };

      };
      return new GlStyleStorage();
    };
  });
})();
