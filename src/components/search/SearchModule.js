goog.provide('ga_search');
goog.require('ga_search_directive');
goog.require('ga_search_service');
goog.require('ga_search_type_directives');
goog.require('ga_searchitem_directive');
(function() {

  angular.module('ga_search', [
    'ga_search_directive',
    'ga_search_service',
    'ga_search_type_directives',
    'ga_searchitem_directive'
  ]);
})();
