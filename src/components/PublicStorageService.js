goog.provide('ga_publicstorage_service');

(function() {

  var module = angular.module('ga_publicstorage_service', []);

  /**
   * This service can create/read/write/delete a file on s3.
   */
  module.provider('gaPublicStorage', function() {
    this.$get = function($http, $q, gaGlobalOptions) {

      var getServiceUrl = function(endPoint, id) {
        return gaGlobalOptions.apiUrl + endPoint + ((id) ? '/' + id : '');
      };

      var getPublicUrl = function(endPoint, fileId) {
        return gaGlobalOptions.publicUrl + endPoint +
            ((fileId) ? '/' + fileId : '');
      };

      var PublicStorage = function() {

        // Get the file from a fileId
        this.get = function(publicEndPoint, fileId) {
          return $http.get(getPublicUrl(publicEndPoint, fileId));
        };

        // Get a fileId from a fileUrl
        this.getFileIdFromFileUrl = function(fileUrl) {
          if (!fileUrl) {
            return;
          }
          return fileUrl.split('/').pop();
        };

        // Get the accessible url of the file from an adminId
        this.getFileUrlFromAdminId = function(endPoint, publicEndPoint,
            adminId) {
          var deferred = $q.defer();
          $http.get(getServiceUrl(endPoint, adminId)).then(function(response) {
            var data = response.data;
            if (data && data.fileId) {
              var url = getPublicUrl(publicEndPoint, data.fileId);
              deferred.resolve(url);
            } else {
              deferred.reject();
            }
          }, function() {
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
        this.save = function(endPoint, publicEndPoint, id, content,
            contentType) {
          return $http.post(getServiceUrl(endPoint, id), content, {
            headers: {
              'Content-Type': contentType
            }
          }).then(function(response) {
            var data = response.data;
            return {
              adminId: data.adminId,
              fileId: data.fileId,
              fileUrl: getPublicUrl(publicEndPoint, data.fileId)
            };
          });
        };

        // Delete the file in s3. Only if an adminId is specified
        this.del = function(endPoint, adminId) {
          return $http['delete'](getServiceUrl(endPoint, adminId));
        };

      };
      return new PublicStorage();
    };
  });
})();
