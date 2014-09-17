var _ = require('underscore');
var validator = require('validator');
var request = require('request');
var async = require('async');
var xmlbuilder = require('xmlbuilder');

var getUrl = function(mailAddress, password, callback) {
  if (!mailAddress) {
    callback(new Error('mailAddress is needed'));
    return;
  }
  if (!password) {
    callback(new Error('password is needed'));
    return;
  }
  if (!validator.isEmail(mailAddress)) {
    callback(new Error('Invalid format: ' + mailAddress));
    return;
  }

  var autodiscover = createAutodiscoverService(mailAddress, password);
  autodiscover.trySecureUrls(function(err, url) {
    if (err) {
      autodiscover.tryRedirectionUrls(function(err, url) {
        if (err) {
          callback(err);
          return;
        }
        callback(null, url);
      });
      return;
    }
    callback(null, url);
  });
};

var createAutodiscoverService = function(mailAddress, password) {
  var smtpDomain = parseSmtpDomain(mailAddress);
  var trySecureUrls = function(callback) {
    async.waterfall([
      function(cb) {
        sendRequest('https://' + smtpDomain + '/autodiscover/autodiscover.xml', function(err, url) {
          if (err) {
            cb(null, null);
            return;
          }
          cb(null, url);
        });
      },
      function(url, cb) {
        if (url) {
          cb(null, url);
          return;
        }

        sendRequest('https://autodiscover.' + smtpDomain + '/autodiscover/autodiscover.xml', function(err, newurl) {
          if (err) {
            cb(err);
            return;
          }
          cb(null, newurl);
        });
      }
    ], function(err, resultUrl) {
      if (err) {
        callback(err);
        return;
      }
      callback(null, resultUrl);
    });
  };

  var tryRedirectionUrls = function(callback) {
    request({
      url: 'http://autodiscover.' + smtpDomain + '/autodiscover/autodiscover.xml',
      method: 'GET',
      followRedirect: false,
      timeout: 10000
    }, function(err, res, body) {
      if (err) {
        callback(err);
        return;
      }
      if (res.statusCode !== 302) {
        callback(new Error('Not redirect'));
        return;
      }
      sendRequest(res.headers.location, function(err, url) {
        if (err) {
          callback(err);
          return;
        }
        callback(null, url);
      });
    });
  };

  var sendRequest = function(url, callback) {
    request({
      url: url,
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8'
      },
      body: buildRequestBody(mailAddress),
      auth: {
        username: mailAddress,
        password: password
      },
      timeout: 10000
    }, function(err, res, body) {
      if (err) {
        callback(err);
        return;
      }
      if (res.statusCode === 302) {
        sendRequest(res.headers.location, callback);
        return;
      }
      callback(null, parseRequestBody(body));
    });
  };

  var buildRequestBody = function(mailAddress) {
    var root = xmlbuilder.create('Autodiscover').att(
      'xmlns', 'http://schemas.microsoft.com/exchange/autodiscover/outlook/requestschema/2006');
    var request = root.ele('Request');
    request.ele('EMailAddress', {}, mailAddress);
    request.ele(
      'AcceptableResponseSchema',
      {},
      'http://schemas.microsoft.com/exchange/autodiscover/outlook/responseschema/2006a');
    return root.end({pretty: true});
  };

  var parseRequestBody = function(body) {
    console.log(body);
  };

  return {
    trySecureUrls: trySecureUrls,
    tryRedirectionUrls: tryRedirectionUrls
  };
};

var parseSmtpDomain = function(mailAddress) {
  return _.last(mailAddress.split('@'));
};

exports.getUrl = getUrl;
