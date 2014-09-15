var expect = require('expect.js');
var autodiscover = require('../lib');

describe('getUrl', function() {
  it('cause error when mail address is undefined', function(done) {
    autodiscover.getUrl(undefined, function(err, url) {
      expect(err.message).to.be('mailAddress is needed');
      expect(url).to.be(undefined);
      done();
    });
  });

  it('cause error when mail address is null', function(done) {
    autodiscover.getUrl(null, function(err, url) {
      expect(err.message).to.be('mailAddress is needed');
      expect(url).to.be(undefined);
      done();
    });
  });

  it('cause error when mail address is invalid', function(done) {
    autodiscover.getUrl('invalid', function(err, url) {
      expect(err.message).to.be('Invalid format: invalid');
      expect(url).to.be(undefined);
      done();
    });
  });
});
