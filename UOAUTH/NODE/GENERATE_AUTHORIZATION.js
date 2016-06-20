UOAUTH.GENERATE_AUTHORIZATION = METHOD(function(m) {
	'use strict';
	
	var
	//IMPORT: Crypto
	Crypto = require('crypto'),
	
	//IMPORT: Querystring
	Querystring = require('querystring'),
	
	// sha1.
	sha1 = function(key, str, encoding) {
		
		var
		// hmac
		hmac = Crypto.createHmac('sha1', key);
		
		hmac.update(str);
		
		return hmac.digest(encoding);
	};
	
	return {
		
		run : function(params, callback) {
			//REQUIRED: params
			//REQUIRED: params.url
			//REQUIRED: params.method
			//OPTIONAL: params.paramStr
			//REQUIRED: params.consumerKey
			//REQUIRED: params.consumerSecret
			//OPTIONAL: params.tokenSecret
			//OPTIONAL: params.token
			//OPTIONAL: params.verifier
			//REQUIRED: callback
	
			var
			// url
			url = params.url,
			
			// method
			method = params.method,
			
			// param str
			paramStr = params.paramStr === undefined ? {} : Querystring.parse(params.paramStr),
			
			// consumer key
			consumerKey = params.consumerKey,
			
			// consumer secret
			consumerSecret = params.consumerSecret,
			
			// token secret
			tokenSecret = params.tokenSecret === undefined ? '' : params.tokenSecret,
			
			// token
			token = params.token,
			
			// verifier
			verifier = params.verifier,
			
			// nonce
			nonce = RANDOM_STR(42),
			
			// timestamp
			timestamp = INTEGER(Date.now() / 1000),
			
			// oauth data
			oauthData = {
				oauth_consumer_key : consumerKey,
				oauth_nonce : nonce,
				oauth_signature_method : 'HMAC-SHA1',
				oauth_timestamp : timestamp,
				oauth_token : token,
				oauth_verifier : verifier,
				oauth_version : '1.0'
			},
			
			// data
			data = COMBINE([paramStr, oauthData]),
			
			// keys
			keys = Object.keys(data).sort(),
			
			// body
			body = '',
			
			// authorization
			authorization = 'OAuth ';
			
			EACH(keys, function(key, i) {
				if (data[key] !== undefined) {
					if (body === '') {
						body += key + '=' + encodeURIComponent(data[key]);
					} else {
						body += '&' + key + '=' + encodeURIComponent(data[key]);
					}
				}
			});
			
			body = encodeURIComponent(body);
			
			EACH(oauthData, function(value, name) {
				if (value !== undefined) {
					if (authorization === 'OAuth ') {
						authorization += name + '="' + encodeURIComponent(value) + '"';
					} else {
						
						if (name === 'oauth_signature_method') {
							authorization += ', oauth_signature="' + encodeURIComponent(sha1(consumerSecret + '&' + tokenSecret, method + '&' + encodeURIComponent(url) + '&' + body, 'base64')) + '"';
						}
						
						authorization += ', ' + name + '="' + encodeURIComponent(value) + '"';
					}
				}
			});
			
			return authorization;
		}
	};
});
