describe('ga_price_filter', function () {

  var $filter;

  beforeEach(function () {
    inject(function ($injector) {
      $filter = $injector.get('$filter');
    });
  });

  it('should add dash if full number', function () {
    // Arrange.
    var price = 1400, result;

    // Act.
    result = $filter('price')(price);

    // Assert.
    expect(result).to.eql('CHF 14.-');
  });


  it('should show rp if full not full number', function () {
    // Arrange.
    var price = 1499, result;

    // Act.
    result = $filter('price')(price);

    // Assert.
    expect(result).to.eql('CHF 14.99');
  });

  it('should show rp if full not full number', function () {
    // Arrange.
    var price = "1499", result;

    // Act.
    result = $filter('price')(price);

    // Assert.
    expect(result).to.eql('CHF 14.99');
  });

  it('vergrifen should stay', function () {
    // Arrange.
    var price = "vergriffen", result;

    // Act.
    result = $filter('price')(price);

    // Assert.
    expect(result).to.eql('vergriffen');
  });
  it('noprice should return --', function () {
    // Arrange.
    var price = null;

    // Act.
    var result = $filter('price')(price);

    // Assert.
    expect(result).to.eql('--');
  });
  it('noprice should return --', function () {
    // Arrange.
    var price = 0;

    // Act.
    var result = $filter('price')(price);

    // Assert.
    expect(result).to.eql('--');
  });

  it('should show should show CHF 0.10 format', function () {
    // Arrange.
    var price = 10, result;

    // Act.
    result = $filter('price')(price);

    // Assert.
    expect(result).to.eql('CHF 0.10');
  });

  it('should show CHF 0.01 format', function () {
    // Arrange.
    var price = 1, result;

    // Act.
    result = $filter('price')(price);

    // Assert.
    expect(result).to.eql('CHF 0.01');
  });
});
