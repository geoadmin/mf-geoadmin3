describe('ga_kml_service', function() {
  
  describe('gaKml', function() {
    var gaKml;

    beforeEach(function() {
      inject(function($injector) {
        gaKml = $injector.get('gaKml');
      });
    });
   
    it('defines if we should use an ol.layer.ImageVector', function() {
      expect(gaKml.useImageVector(100000)).to.be(false);
      expect(gaKml.useImageVector(30000000)).to.be(true);
      expect(gaKml.useImageVector('100000')).to.be(false);
      expect(gaKml.useImageVector('30000000')).to.be(true);
      expect(gaKml.useImageVector(undefined)).to.be(false);
      expect(gaKml.useImageVector(null)).to.be(false);
      expect(gaKml.useImageVector('dfdsfsdfsdfs')).to.be(false);
    });

    it('tests validity of a file size', function() {
      expect(gaKml.isValidFileSize(10000000)).to.be(true);
      expect(gaKml.isValidFileSize(30000000)).to.be(false);
      expect(gaKml.isValidFileSize('10000000')).to.be(true);
      expect(gaKml.isValidFileSize('30000000')).to.be(false);
      expect(gaKml.isValidFileSize(undefined)).to.be(true);
      expect(gaKml.isValidFileSize(null)).to.be(true);
      expect(gaKml.isValidFileSize('sdfsdfdsfsd')).to.be(true);

    });
     
    it('tests validity of a file content', function() {
      expect(gaKml.isValidFileContent('<html></html>')).to.be(false);
      expect(gaKml.isValidFileContent('<kml></kml>')).to.be(true);
      expect(gaKml.isValidFileContent(undefined)).to.be(false);
      expect(gaKml.isValidFileContent(null)).to.be(false);
      expect(gaKml.isValidFileContent(212334)).to.be(false);
    });
  });
});
