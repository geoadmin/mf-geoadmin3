describe('ga_query_service', function() {

 describe('gaQuery', function() {
    var gaQuery, gaGlobalOptions, $httpBackend, $rootScope, gaLang, $window, $q;
    var twoWeeksAgo = window.moment().subtract(2, 'weeks').
        format('YYYY-MM-DD');
    var predefQueriesByLayer = {
      'ch.bazl.luftfahrthindernis': [{
        id: 'obstacle_started_last_2_weeks',
        filters: [{
          attrName: 'startofconstruction',
          operator: '>=',
          value: twoWeeksAgo
        }, {
          attrName: 'state',
          operator: 'ilike',
          value: 'A'
        }]
      }, {
        id: 'obstacle_deleted_last_2_weeks',
        filters: [{
          layer: null,
          attrName: 'abortionaccomplished',
          operator: '>=',
          value: twoWeeksAgo
        }]
      }],
      'ch.astra.unfaelle-personenschaeden_alle': [{
        id: 'astra_alle_lastyear_casualties',
        filters: [{
          attrName: 'accidentyear',
          operator: '=',
          value: '2015'
        }, {
          attrName: 'severitycategorycode',
          operator: 'ilike',
          value: 'UGT'
        }]
      }]
    };

    beforeEach(function() {

      module(function($provide) {
        $provide.value('gaLang', {
          get: function() {
            return 'somelang';
          }
        });
      });

      inject(function($injector) {
        gaQuery = $injector.get('gaQuery');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        gaLang = $injector.get('gaLang');
        $window = $injector.get('$window');
        $q = $injector.get('$q');
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('set DateTimePicker librairy url', function() {
      expect(gaQuery.dpUrl).to.be('http://localhost:8081/123456/lib/bootstrap-datetimepicker.min.js');
    });

    describe('getPredefQueries', function() {
      it('returns a list a predefined queries for a layer', function() {
        var layerId = 'ch.bazl.luftfahrthindernis';
        expect(gaQuery.getPredefQueries(layerId)).to.eql(predefQueriesByLayer[layerId]);
        layerId = 'ch.astra.unfaelle-personenschaeden_alle';
        expect(gaQuery.getPredefQueries(layerId)).to.eql(predefQueriesByLayer[layerId]);
      });
    });

    describe('getLayerAttributes', function() {
      var url = 'http://api3.geo.admin.ch/rest/services/all/MapServer/somelayer?lang=somelang';
      var attrInfos = {
        NUMERIC: {
          inputType: 'number',
          operators: ['=', '!=', '>', '<', '<=', '>=']
        },
        STRING: {
          inputType: 'text',
          operators: ['ilike', 'not ilike']
        },
        BOOLEAN: {
          inputType: 'checkbox',
          operators: ['=']
        },
        TIME: {
          inputType: 'time',
          operators: ['=', '!=', '>', '<', '<=', '>=']
        },
        DATE: {
          inputType: 'date',
          operators: ['=', '!=', '>', '<', '<=', '>=']
        },
        DATETIME: {
          inputType: 'datetime-local',
          operators: ['=', '!=', '>', '<', '<=', '>=']
        }
      };
      // Others numeric types
      attrInfos.BIGINTEGER = attrInfos.SMALLINTEGER = attrInfos.INTEGER =
          attrInfos.BIGINT = attrInfos.SMALLINT = attrInfos.INT =
          attrInfos.DOUBLE = attrInfos['DOUBLE PRECISION'] =
          attrInfos.FLOAT = attrInfos.DECIMAL = attrInfos.INTERVAL =
          attrInfos.NUMERIC;

      // Others string types
      attrInfos.TEXT = attrInfos.UNICODE = attrInfos.UNICODETEXT =
          attrInfos.ENUM = attrInfos.STRING;

      // Others dates types
      attrInfos.TIMESTAMP = attrInfos['TIMESTAMP WITHOUT TIME ZONE'] =
          attrInfos.DATE;


      var numericTypes = ['NUMERIC', 'BIGINTEGER', 'SMALLINTEGER', 'INTEGER',
          'BIGINT', 'SMALLINT', 'INT', 'DOUBLE', 'DOUBLE PRECISION', 'FLOAT',
          'DECIMAL', 'INTERVAL'];
      var stringTypes = ['STRING', 'TEXT', 'UNICODE', 'UNICODETEXT', 'ENUM'];
      var dateTypes = ['DATE', 'TIMESTAMP WITHOUT TIME ZONE', 'TIMESTAMP'];
      var otherTypes = ['BOOLEAN', 'TIME', 'DATETIME'];
      var allTypes = numericTypes.concat(stringTypes, dateTypes, otherTypes);
      beforeEach(function() {

      });

      it('gets a list of attributes from a bodId', function(done) {
        $httpBackend.expectGET(url).respond({fields: []});
        gaQuery.getLayerAttributes('somelayer').then(function(attrs) {
          expect(attrs).to.be.an(Array);
          done();
        });
        $httpBackend.flush();
      });

      allTypes.forEach(function(i) {
        var field = {
          values: [
            8572922,
            'text',
            true
          ],
          alias: 'Alias',
          name: 'name',
          type: i
        };

        it('gets good values for common attributes (type: ' + i + ')', function(done) {
          $httpBackend.expectGET(url).respond({fields: [field]});
          gaQuery.getLayerAttributes('somelayer').then(function(attrs) {
            var attr = attrs[0];
            var exp = {
              name: 'name',
              label: 'Alias',
              type: i,
              inputPlaceholder: '8572922, text, true',
              inputTitle: '8572922, text, true'
            };
            expect(attr.name).to.be(exp.name);
            expect(attr.label).to.be(exp.label);
            expect(attr.type).to.be(exp.type);
            expect(attr.inputPlaceholder).to.be(exp.inputPlaceholder);
            expect(attr.inputTitle).to.be(exp.inputTitle);
            expect(attr.inputType).to.be(attrInfos[i].inputType);
            expect(attr.operators).to.eql(attrInfos[i].operators);
            expect(attr.transformToLiteral).to.be.a(Function);
            done();
          });
          $httpBackend.flush();
        });
      });

      it('transforms to literal', function(done) {
        $httpBackend.expectGET(url).respond({fields: [{
          type: 'NUMERIC',
          values: []
        }, {
          type: 'BOOLEAN',
          values: []
        }, {
          type: 'STRING',
          values: []
        }, {
          type: 'DATE',
          values: []
        }, {
          type: 'UNKNOWN',
          values: []
        }]});
        gaQuery.getLayerAttributes('somelayer').then(function(attrs) {
          expect(attrs[0].transformToLiteral(230)).to.be(230);
          expect(attrs[1].transformToLiteral(true)).to.be(true);
          expect(attrs[1].transformToLiteral(false)).to.be(false);
          expect(attrs[2].transformToLiteral('a text')).to.be('\'%a text%\'');
          expect(attrs[3].transformToLiteral('2015-06-07 12:30')).to.be('\'2015-06-07 12:30\'');
          expect(attrs[4].transformToLiteral('a text')).to.be('\'%a text%\'');
          done();
        });
        $httpBackend.flush();
      });

      it('replaces null value by a \'null\' string', function(done) {
        $httpBackend.expectGET(url).respond({fields: [{
          type: 'NUMERIC',
          values: [null]
        }]});
        gaQuery.getLayerAttributes('somelayer').then(function(attrs) {
          expect(attrs[0].inputTitle).to.be('null');
          done();
        });
        $httpBackend.flush();
      });

      it('adds ... in placeholder (nb letters > 30) and not in title', function(done) {
        $httpBackend.expectGET(url).respond({fields: [{
          type: 'NUMERIC',
          values: ['13 characters', '13 characters', '13 characters']
        }]});
        gaQuery.getLayerAttributes('somelayer').then(function(attrs) {
          expect(attrs[0].inputPlaceholder).to.be('13 characters, 13 characters,  ...');
          expect(attrs[0].inputTitle).to.be('13 characters, 13 characters, 13 characters');
          done();
        });
        $httpBackend.flush();
      });

      it('rejects the promise if the request fails', function(done) {
        $httpBackend.expectGET(url).respond(404, '');
        gaQuery.getLayerAttributes('somelayer').then(function() {}, function(status) {
          expect(status).to.be(404);
          done();
        });
        $httpBackend.flush();
      });

      it('caches the request', function() {
        $httpBackend.expectGET(url).respond({fields: []});
        gaQuery.getLayerAttributes('somelayer');
        gaQuery.getLayerAttributes('somelayer');
        $httpBackend.flush();
      });
    });


    describe('getAttributeValues', function() {
      var url = 'http://api3.geo.admin.ch/rest/services/all/MapServer/somelayer/attributes/someattr';
      it('rejects the promise if the request fails', function(done) {
        $httpBackend.expectGET(url).respond(404, '');
        gaQuery.getAttributeValues('somelayer', 'someattr').then(function() {}, function(status) {
          expect(status).to.be(404);
          done();
        });
        $httpBackend.flush();
      });

      it('gets a list of values', function(done) {
        $httpBackend.expectGET(url).respond({values: [null, 'value1', 'value2']});
        gaQuery.getAttributeValues('somelayer', 'someattr').then(function(values) {
          expect(values).to.be.an(Array);
          expect(values[0]).to.be('null');
          expect(values[1]).to.be('value1');
          expect(values[2]).to.be('value2');
          done();
        });
        $httpBackend.flush();
      });

      it('caches the request', function() {
        $httpBackend.expectGET(url).respond({values: [null, 'value1', 'value2']});
        gaQuery.getAttributeValues('somelayer', 'someattr');
        gaQuery.getAttributeValues('somelayer', 'someattr');
        $httpBackend.flush();
      });
    });
  });
});
