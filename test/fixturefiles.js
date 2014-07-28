/**
 * Module dependencies.
 */

require('should');

var fixtures = require('../lib');

/**
 * Tests
 */

describe('fixturefiles', function() {
  describe('function', function() {
    before(function() {
      fixtures.reload();
    });

    it('should return json', function() {
      fixtures.one.should.eql({ hello: 'world' });
      fixtures.three.four.six.should.eql({ six: 6 });
    });

    it('should return text', function() {
      fixtures.three.four.five.should.eql('555');
      fixtures.eight.should.eql('nine: 10');
    });
  });

  describe('function', function() {
    before(function() {
      fixtures.reload({ type: 'function' });
    });

    it('should return json', function() {
      fixtures.one().should.eql({ hello: 'world' });
      fixtures.one('text').should.eql('{"hello":"world"}');
      fixtures.three.four.six().should.eql({ six: 6 });
    });

    it('should return text', function() {
      fixtures.three.four.five().should.eql('555');
      fixtures.eight().should.eql('nine: 10');
    });

    it('should return buffer', function() {
      fixtures.one('buffer').should.be.instanceof(Buffer);
      fixtures.one('buffer').length.should.equal(18);
      fixtures.two('buffer').should.be.instanceof(Buffer);
    });
  });
});
