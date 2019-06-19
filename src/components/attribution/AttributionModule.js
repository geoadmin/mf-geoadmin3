import gaAttributionDirective from './AttributionDirective.js';
import gaAttributionService from './AttributionService.js';

const gaAttributionModule = angular.module('ga_attribution', [
  gaAttributionDirective,
  gaAttributionService
]);

export default gaAttributionModule;
