goog.provide('ga_filestorage_service');

goog.require('ga_publicstorage_service');

(function() {

  var module = angular.module('ga_filestorage_service', [
    'ga_publicstorage_service'
  ]);

  /**
   * This service can create/read/write/delete a KML on public s3 bucket.
   */
  module.provider('gaFileStorage', function() {
    this.$get = function($http, $q, gaPublicStorage) {
      var endPoint = '/api/kml/admin';
      var publicEndPoint = '/kml/files';
      var contentType = 'application/vnd.google-earth.kml+xml';

      var FileStorage = function() {

        // Get the file from a fileId
        this.get = function(fileId) {
          return gaPublicStorage.get(publicEndPoint, fileId);
        };

        // Get a fileId from a fileUrl
        this.getFileIdFromFileUrl = function(fileUrl) {
          return gaPublicStorage.getFileIdFromFileUrl(fileUrl);
        };

        // Get the accessible url of the file from an adminId
        this.getFileUrlFromAdminId = function(adminId) {
          return gaPublicStorage.getFileUrlFromAdminId(endPoint, publicEndPoint,
              adminId);
        };

        this.save = function(fileId, adminId, content) {
          return gaPublicStorage.save(endPoint, publicEndPoint, fileId,
              adminId, content, contentType);
        };

        // Delete the file in s3. Only if an adminId is specified
        this.del = function(adminId) {
          return gaPublicStorage.del(endPoint, adminId);
        };

      };
      return new FileStorage();
    };
  });
})();
