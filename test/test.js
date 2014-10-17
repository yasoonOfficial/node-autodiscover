var expect = require('expect.js');
var autodiscover = require('../lib');

var VALID_MAIL_ADDRESS = 'test@test.com';
var VALID_USERNAME = 'test@test.com';
var VALID_PASSWORD = 'password';

describe('getEwsUrl', function() {
  it('cause error when mail address is undefined', function(done) {
    autodiscover.getEwsUrl(
      undefined,
      {
        username: VALID_USERNAME,
        password: VALID_PASSWORD
      },
      function(err, url) {
        expect(err.message).to.be('mailAddress is needed');
        expect(url).to.be(undefined);
        done();
      });
  });

  it('cause error when mail address is null', function(done) {
    autodiscover.getEwsUrl(
      null,
      {
        username: VALID_USERNAME,
        password: VALID_PASSWORD
      },
      function(err, url) {
        expect(err.message).to.be('mailAddress is needed');
        expect(url).to.be(undefined);
        done();
      });
  });

  it('cause error when mail address is invalid', function(done) {
    autodiscover.getEwsUrl(
      'invalid',
      {
        username: VALID_USERNAME,
        password: VALID_PASSWORD
      },
      function(err, url) {
        expect(err.message).to.be('Invalid format: invalid');
        expect(url).to.be(undefined);
        done();
      });
  });

  it('cause error when auth is undefined', function(done) {
    autodiscover.getEwsUrl(
      VALID_MAIL_ADDRESS,
      undefined,
      function(err, url) {
        expect(err.message).to.be('username is needed');
        expect(url).to.be(undefined);
        done();
      });
  });

  it('cause error when auth is null', function(done) {
    autodiscover.getEwsUrl(
      VALID_MAIL_ADDRESS,
      null,
      function(err, url) {
        expect(err.message).to.be('username is needed');
        expect(url).to.be(undefined);
        done();
      });
  });

  it('cause error when username is undefined', function(done) {
    autodiscover.getEwsUrl(
      VALID_MAIL_ADDRESS,
      {
        password: VALID_PASSWORD
      },
      function(err, url) {
        expect(err.message).to.be('username is needed');
        expect(url).to.be(undefined);
        done();
      });
  });

  it('cause error when username is null', function(done) {
    autodiscover.getEwsUrl(
      VALID_MAIL_ADDRESS,
      {
        username: null,
        password: VALID_PASSWORD
      },
      function(err, url) {
        expect(err.message).to.be('username is needed');
        expect(url).to.be(undefined);
        done();
      });
  });

  it('cause error when password is undefined', function(done) {
    autodiscover.getEwsUrl(
      VALID_MAIL_ADDRESS,
      {
        username: VALID_USERNAME
      },
      function(err, url) {
        expect(err.message).to.be('password is needed');
        expect(url).to.be(undefined);
        done();
      });
  });

  it('cause error when password is null', function(done) {
    autodiscover.getEwsUrl(
      VALID_MAIL_ADDRESS,
      {
        username: VALID_USERNAME,
        password: null
      },
      function(err, url) {
        expect(err.message).to.be('password is needed');
        expect(url).to.be(undefined);
        done();
      });
  });
});
