UOAUTH.GET_TOKEN = METHOD(function(m) {
	'use strict';
	
	var
	//IMPORT: URL
	URL = require('url'),
	
	//IMPORT: Querystring
	Querystring = require('querystring');
	
	return {
		
		run : function(params, callbackOrHandlers) {
			//REQUIRED: params
			//REQUIRED: params.url
			//REQUIRED: params.method
			//REQUIRED: params.consumerKey
			//REQUIRED: params.consumerSecret
			//OPTIONAL: params.accessTokenSecret
			//OPTIONAL: params.token
			//OPTIONAL: params.verifier
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
	
			var
			// url
			url = params.url,
			
			// url data
			urlData = URL.parse(url),
			
			// error handler.
			errorHandler,
			
			// callback.
			callback;
			
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
				headers : {
					Authorization : UOAUTH.GENERATE_AUTHORIZATION(params)
				}
			}, {
				error : errorHandler,
				success : function(content) {
					callback(Querystring.parse(content));
				}
			});
		}
	};
});
