(function() {
  goog.provide('ga_catalogtree_controller');

  var module = angular.module('ga_catalogtree_controller', []);

  //FIXME: only temporary...
  /*
  var templates = {
    def: 'components/catalogtree/example/tree.json',
    big: 'components/catalogtree/example/bigtree.json'
  };
  */
  var templates = {
    def: 'components/catalogtree/example/s1.json',
    big: 'components/catalogtree/example/s2.json'
  };
   

  module.controller('GaCatalogtreeController',
      ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
        //FIXME: we should/could read current topic from url direclty...but maybe
        //that's broadcasted by topicSelector directive via gaTopicChange already...
        //Review after both are on same branch
        
        
        $scope.topic = 'def';
        updateTree();

        $scope.$on('gaTopicChange', function(event, topic) {
          $scope.topic = topic;
          updateTree();
        });

        function updateTree(){
          var http = $http.get(templates[$scope.topic]);
          http.success(function(data, status, header, config) {
            $scope.tree = data.results;
          });
        };

        //FIXME: this is temporary only! Emulate topic change...
        //Remove $rootScope when removing this
        $scope.switchCatalog = function() {
          if ($scope.topic == 'def') {
            $rootScope.$broadcast('gaTopicChange', 'big');
          } else {
            $rootScope.$broadcast('gaTopicChange', 'def');
          }
        };

      }]);

})();
