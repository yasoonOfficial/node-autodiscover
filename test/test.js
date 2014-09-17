var expect = require('expect.js');
var autodiscover = require('../lib');

var VALID_MAIL_ADDRESS = 'test@test.com';
var VALID_PASSWORD = 'password';

describe('getEwsUrl', function() {
  it('cause error when mail address is undefined', function(done) {
    autodiscover.getEwsUrl(undefined, VALID_PASSWORD, function(err, url) {
      expect(err.message).to.be('mailAddress is needed');
      expect(url).to.be(undefined);
      done();
    });
  });

  it('cause error when mail address is null', function(done) {
    autodiscover.getEwsUrl(null, VALID_PASSWORD, function(err, url) {
      expect(err.message).to.be('mailAddress is needed');
      expect(url).to.be(undefined);
      done();
    });
  });

  it('cause error when mail address is invalid', function(done) {
    autodiscover.getEwsUrl('invalid', VALID_PASSWORD, function(err, url) {
      expect(err.message).to.be('Invalid format: invalid');
      expect(url).to.be(undefined);
      done();
    });
  });

  it('cause error when password is undefined', function(done) {
    autodiscover.getEwsUrl(VALID_MAIL_ADDRESS, undefined, function(err, url) {
      expect(err.message).to.be('password is needed');
      expect(url).to.be(undefined);
      done();
    });
  });

  it('cause error when password is null', function(done) {
    autodiscover.getEwsUrl(VALID_MAIL_ADDRESS, null, function(err, url) {
      expect(err.message).to.be('password is needed');
      expect(url).to.be(undefined);
      done();
    });
  });
});
