var _ = require('underscore');
var validator = require('validator');
var request = require('request');
var async = require('async');
var xmlbuilder = require('xmlbuilder');
var parseString = require('xml2js').parseString;

var getPOXAutodiscoverValues = function (mailAddress, authHeader, callback) {
	if (!mailAddress) {
		callback(new Error('mailAddress is needed'));
		return;
	}

	if (!validator.isEmail(mailAddress)) {
		callback(new Error('Invalid format: ' + mailAddress));
		return;
	}

	var autodiscover = createAutodiscoverService(mailAddress, authHeader);
	autodiscover.trySecureUrls(function (err, data) {
		if (err) {
			autodiscover.tryRedirectionUrls(function (err, data) {
				if (err) {
					callback(err);
					return;
				}
				callback(null, data);
			});
			return;
		}
		callback(null, data);
	});
};

var createAutodiscoverService = function (mailAddress, authHeader) {
	var smtpDomain = pickSmtpDomain(mailAddress);
	var trySecureUrls = function (callback) {
		async.waterfall([
			function (cb) {
				sendRequest('https://' + smtpDomain + '/autodiscover/autodiscover.xml', function (err, url) {
					if (err) {
						cb(null, null);
						return;
					}
					cb(null, url);
				});
			},
			function (url, cb) {
				if (url) {
					cb(null, url);
					return;
				}

				sendRequest('https://autodiscover.' + smtpDomain + '/autodiscover/autodiscover.xml', function (err, newurl) {
					if (err) {
						cb(err);
						return;
					}
					cb(null, newurl);
				});
			}
		], function (err, data) {
			if (err) {
				callback(err);
				return;
			}
			callback(null, data);
		});
	};

	var tryRedirectionUrls = function (callback) {
		request({
			url: 'http://autodiscover.' + smtpDomain + '/autodiscover/autodiscover.xml',
			method: 'GET',
			followRedirect: false,
			timeout: 10000
		}, function (err, res, body) {
			if (err) {
				callback(err);
				return;
			}
			if (res.statusCode !== 302) {
				callback(new Error('Not redirect'));
				return;
			}
			sendRequest(res.headers.location, function (err, data) {
				if (err) {
					callback(err);
					return;
				}
				callback(null, data);
			});
		});
	};

	var sendRequest = function (url, callback) {
		request({
			url: url,
			method: 'POST',
			headers: {
				'Content-Type': 'text/xml; charset=utf-8',
				'Authorization': authHeader
			},
			body: buildRequestBody(mailAddress),
			timeout: 10000
		}, function (err, res, body) {
			if (err) {
				callback(err);
				return;
			}
			if (res.statusCode === 302) {
				sendRequest(res.headers.location, callback);
				return;
			}
			parseRequestBody(body, function (err, result) {
				if (err) {
					callback(err);
					return;
				}

				var error = pickErrorResult(result);
				if (error) {
					callback(new Error('errorCode: ' + error.errorCode + ', message: "' + error.message + '"'));
					return;
				}

				callback(null, result);
			});
		});
	};

	var buildRequestBody = function (mailAddress) {
		var root = xmlbuilder.create('Autodiscover').att(
			'xmlns', 'http://schemas.microsoft.com/exchange/autodiscover/outlook/requestschema/2006');
		var request = root.ele('Request');
		request.ele('EMailAddress', {}, mailAddress);
		request.ele(
			'AcceptableResponseSchema',
			{},
			'http://schemas.microsoft.com/exchange/autodiscover/outlook/responseschema/2006a');
		return root.end({ pretty: true });
	};

	var parseRequestBody = function (body, callback) {
		parseString(body, function (err, result) {
			if (err) {
				callback(err);
				return;
			}
			callback(null, result);
		});
	};

	var pickErrorResult = function (result) {
		var errors = result.Autodiscover.Response[0].Error;
		if (!errors) {
			return null;
		}
		return {
			errorCode: errors[0].ErrorCode[0],
			message: errors[0].Message[0]
		};
	};

	return {
		trySecureUrls: trySecureUrls,
		tryRedirectionUrls: tryRedirectionUrls
	};
};

var pickSmtpDomain = function (mailAddress) {
	return _.last(mailAddress.split('@'));
};

exports.getPOXAutodiscoverValues = getPOXAutodiscoverValues;
