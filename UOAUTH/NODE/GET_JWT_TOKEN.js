UOAUTH.GET_JWT_TOKEN = METHOD(function(m) {
	'use strict';
	
	var
	//IMPORT: URL
	URL = require('url'),
	
	//IMPORT: Crypto
	Crypto = require('crypto');
	
	return {
		
		run : function(params, callbackOrHandlers) {
			//REQUIRED: params
			//REQUIRED: params.url
			//REQUIRED: params.scopes
			//REQUIRED: params.clientEmail
			//REQUIRED: params.privateKey
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//OPTIONAL: callbackOrHandlers.success
	
			var
			// url
			url = params.url,
			
			// url data
			urlData = URL.parse(url),
			
			// scopes
			scopes = params.scopes,
			
			// client email
			clientEmail = params.clientEmail,
			
			// private key
			privateKey = params.privateKey,
			
			// error handler.
			errorHandler,
			
			// callback.
			callback,
			
			// issued assertion time
			iat = INTEGER(Date.now() / 1000),
			
			// expiration time
			exp = iat + INTEGER(60 * 60),
			
			// claims
			claims = {
				iss: clientEmail,
				scope: scopes.join(' '),
				aud: url,
				exp: exp,
				iat: iat
			},
			
			// json web token
			jwt = new Buffer(STRINGIFY({
				alg : 'RS256',
				typ : 'JWT'
			})).toString('base64') + '.' + new Buffer(STRINGIFY(claims)).toString('base64');

			jwt += '.' + Crypto.createSign('RSA-SHA256').update(jwt).sign(privateKey, 'base64');
			
			if (callbackOrHandlers !== undefined) {
				
				if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
					callback = callbackOrHandlers;
				} else {
					errorHandler = callbackOrHandlers.error;
					callback = callbackOrHandlers.success;
				}
			}

			POST({
				isSecure : urlData.protocol === 'https:',
				host : urlData.hostname === TO_DELETE ? undefined : urlData.hostname,
				port : urlData.port === TO_DELETE ? undefined : INTEGER(urlData.port),
				uri : urlData.pathname === TO_DELETE ? undefined : urlData.pathname.substring(1),
				paramStr : 'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') + '&assertion=' + encodeURIComponent(jwt),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}, {
				error : errorHandler,
				success : function(content) {
					callback(PARSE_STR(content));
				}
			});
		}
	};
});
