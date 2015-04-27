(function() {
  goog.provide('ga_file_storage_service');

  var module = angular.module('ga_file_storage_service', []);

  /**
   * This service can create/read/write/delete a file on s3.
   */
  module.provider('gaFileStorage', function() {
    this.$get = function($http, $q) {
      var fileStorageUrl = this.fileStorageUrl;
      var publicUrl = this.publicUrl;

      var getServiceUrl = function(id) {
          return fileStorageUrl + ((id) ? '/' + id : '');
      };

      var getPublicUrl = function(fileId) {
          return publicUrl + ((fileId) ? '/' + fileId : '');
      };

      var FileStorage = function() {

        // Get the file from a fileId
        this.get = function(fileId) {
          return $http.get(getPublicUrl(fileId));
        };

        // Get a fileId from a fileUrl
        this.getFileIdFromFileUrl = function(fileUrl) {
          if (!fileUrl) {
            return;
          }
          return fileUrl.replace(getPublicUrl() + '/', '');
        };

        // Get the accessible url of the file from an adminId
        this.getFileUrlFromAdminId = function(adminId) {
          var deferred = $q.defer();
          $http.get(getServiceUrl(adminId)).success(function(data) {
             if (data && data.fileId) {
               var url = getPublicUrl(data.fileId);
               deferred.resolve(url);
             } else {
               deferred.reject();
             }
          }).error(function() {
            deferred.reject();
          });
          return deferred.promise;
        };

        // Save the content of a file in s3.
        // If no id defined --> create a new file
        //     returns new adminId and new file url
        // If id is an adminId --> update the file
        //     returns the same adminId and the same file url
        // if id is an fileId --> fork the file
        //     returns new adminId and new file url
        this.save = function(id, content, contentType) {
          var deferred = $q.defer();
          $http.post(getServiceUrl(id), content, {
            headers: {
             'Content-Type': contentType
            }
          }).success(function(data) {
            deferred.resolve({
              adminId: data.adminId,
              fileId: data.fileId,
              fileUrl: getPublicUrl(data.fileId)
            });
          }).error(function() {
            deferred.reject();
          });
          return deferred.promise;
        };


        // Delete the file in s3. Only if an adminId is specified
        this.del = function(adminId) {
          return $http['delete'](getServiceUrl(adminId));
        };

      };
      return new FileStorage();
    };
  });
})();

