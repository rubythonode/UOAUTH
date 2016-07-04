UOAUTH.GET_TOKEN = METHOD(function(m) {
	'use strict';
	
	var
	//IMPORT: URL
	URL = require('url'),
	
	//IMPORT: Querystring
	Querystring = require('querystring');
	
	return {
		
		run : function(params, callback) {
			//REQUIRED: params
			//REQUIRED: params.url
			//REQUIRED: params.method
			//REQUIRED: params.consumerKey
			//REQUIRED: params.consumerSecret
			//OPTIONAL: params.accessTokenSecret
			//OPTIONAL: params.token
			//OPTIONAL: params.verifier
			//REQUIRED: callback
	
			var
			// url
			url = params.url,
			
			// url data
			urlData = URL.parse(url);
			
			POST({
				isSecure : urlData.protocol === 'https:',
				host : urlData.hostname === TO_DELETE ? undefined : urlData.hostname,
				port : urlData.port === TO_DELETE ? undefined : INTEGER(urlData.port),
				uri : urlData.pathname === TO_DELETE ? undefined : urlData.pathname.substring(1),
				headers : {
					Authorization : UOAUTH.GENERATE_AUTHORIZATION(params)
				}
			}, function(content) {
				callback(Querystring.parse(content));
			});
		}
	};
});
