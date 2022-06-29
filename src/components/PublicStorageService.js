goog.provide('ga_publicstorage_service');

(function() {

  var module = angular.module('ga_publicstorage_service', []);

  /**
   * This service can create/read/write/delete a file on s3.
   */
  module.provider('gaPublicStorage', function() {
    this.$get = function($http, $q, gaGlobalOptions) {

      var getServiceUrl = function(endPoint, id) {
        return gaGlobalOptions.storageUrl + endPoint + ((id) ? '/' + id : '');
      };

      var getPublicUrl = function(endPoint, fileId) {
        return gaGlobalOptions.storageUrl + endPoint +
            ((fileId) ? '/' + fileId : '');
      };

      var getMetadataUrl = function(endPoint, adminId) {
        return gaGlobalOptions.storageUrl + endPoint +
              '?admin_id=' + adminId
      }

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
        // using the metadata request
        this.getFileUrlFromAdminId = function(endPoint, publicEndPoint,
            adminId) {
          var deferred = $q.defer();
          $http.get(getMetadataUrl(endPoint, adminId)).then(function(response) {
            var data = response.data;
            if (data && data.links && data.links.kml) {
              var url = data.links.kml;
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
        this.save = function(endPoint, publicEndPoint, fileId,
            adminId, content, contentType) {

          var method = 'PUT'
          const formData = new FormData();
          const blob = new Blob([content], { name: 'kml',
            filename: 'blob',
            type: contentType})
          formData.append('kml', blob);
          formData.append('author', 'mf-geoadmin3');
          if (fileId === undefined && adminId === undefined) {
            method = 'POST'
          } else {
            formData.append('admin_id', adminId)
          }
          return $http({
            method: method,
            url: getServiceUrl(endPoint, fileId),
            data: formData,
            // Use 'undefined' to send 'multipart/form-data'
            // See https://stackoverflow.com/a/44726531/996693
            headers: {
              'Content-Type': undefined
            }
          }).then(function(response) {
            var data = response.data;
            return {
              adminId: data.admin_id,
              fileId: data.file_id,
              fileUrl: ((data || {}).links || {}).kml
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
