goog.provide('ga_price_filter');

(function() {

  angular.module('ga_price_filter', [])
      .filter('price', priceFilter);

  function priceFilter() {
    return function(input) {

      if (input === null) {
        return '--';
      }
      if (input === 0) {
        return '--';
      }
      if (isNaN(input)) {
        return input;
      }

      //what happens if negative?
      //if(input<0){
      //
      //}

      var filteredPriceRp;
      var filteredPriceFr = input.toString().slice(0,
          input.toString().length - 2);
      if (filteredPriceFr === '') {
        filteredPriceFr = '0';
      }
      if (input >= 10) {
        filteredPriceRp = input.toString().slice(-2);
      }
      else {
        filteredPriceRp = '0' + input.toString().slice(-2);
      }
      if (filteredPriceRp === '00') {
        filteredPriceRp = '-';
      }

      return 'CHF ' + filteredPriceFr + '.' + filteredPriceRp;
    };
  }
})();
