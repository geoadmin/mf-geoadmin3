describe('ga_context_proposal_service', function() {
  var gaContextProposalService,
      $q,
      $timeout,
      $rootScope;

  beforeEach(inject(function($injector) {
    gaContextProposalService = $injector.get('gaContextProposalService');
    $q= $injector.get('$q');
    $timeout = $injector.get('$timeout');
    $rootScope = $injector.get('$rootScope');
  }));

  it('gets correct number or results', function() {
    var res;

    gaContextProposalService.topLayersForTopic('ech', 0).then(function(data) {res = data; });
    $timeout.flush();
    $rootScope.$digest();
    expect(res.length).to.be(1);

    gaContextProposalService.topLayersForTopic('ech', 1).then(function(data) {res = data; });
    $timeout.flush();
    $rootScope.$digest();
    expect(res.length).to.be(1);
    expect(res[0]).to.be('ch.swisstopo.swisstlm3d-wanderwege');

    gaContextProposalService.topLayersForTopic('ech', 10).then(function(data) {res = data; });
    $timeout.flush();
    $rootScope.$digest();
    expect(res.length).to.be(10);
    expect(res[0]).to.be('ch.swisstopo.swisstlm3d-wanderwege');

    gaContextProposalService.topLayersForTopic('ech', 11).then(function(data) {res = data; });
    $timeout.flush();
    $rootScope.$digest();
    expect(res.length).to.be(10);
    expect(res[0]).to.be('ch.swisstopo.swisstlm3d-wanderwege');

  });
});
