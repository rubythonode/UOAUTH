/**
 * HTTP request.
 */
UOAUTH.REQUEST = METHOD(function() {
	'use strict';

	var
	//IMPORT: HTTP
	HTTP = require('http'),

	//IMPORT: HTTPS
	HTTPS = require('https');

	return {

		run : function(params, responseListenerOrListeners) {
			//REQUIRED: params
			//REQUIRED: params.host
			//OPTIONAL: params.port
			//OPTIONAL: params.isSecure
			//REQUIRED: params.method
			//OPTIONAL: params.uri
			//OPTIONAL: params.paramStr
			//OPTIONAL: params.data
			//OPTIONAL: params.headers
			//REQUIRED: responseListenerOrListeners

			var
			// host
			host = params.host,

			// is secure
			isSecure = params.isSecure,

			// port
			port = params.port === undefined ? (isSecure !== true ? 80 : 443) : params.port,

			// method
			method = params.method,

			// uri
			uri = params.uri,

			// param str
			paramStr = params.paramStr,
			
			// headers
			headers = params.headers,

			// response listener
			responseListener,

			// error listener
			errorListener,

			// http request
			req;

			method = method.toUpperCase();

			if (uri !== undefined && uri.indexOf('?') !== -1) {
				paramStr = uri.substring(uri.indexOf('?') + 1) + (paramStr === undefined ? '' : '&' + paramStr);
				uri = uri.substring(0, uri.indexOf('?'));
			}
			
			if (CHECK_IS_DATA(responseListenerOrListeners) !== true) {
				responseListener = responseListenerOrListeners;
			} else {
				responseListener = responseListenerOrListeners.success;
				errorListener = responseListenerOrListeners.error;
			}
			
			if (paramStr === undefined) {
				paramStr = '';
			}

			// GET request.
			if (method === 'GET') {

				req = (isSecure !== true ? HTTP : HTTPS).get({
					hostname : host,
					port : port,
					path : '/' + (uri === undefined ? '' : uri) + '?' + paramStr,
					headers : headers
				}, function(httpResponse) {

					var
					// content
					content;
					
					// redirect.
					if (httpResponse.statusCode === 301 || httpResponse.statusCode === 302) {
						
						GET(httpResponse.headers.location, {
							success : responseListener,
							error : errorListener
						});
						
						httpResponse.destroy();
						
					} else {
						
						content = '';

						httpResponse.setEncoding('utf-8');
						httpResponse.on('data', function(str) {
							content += str;
						});
						httpResponse.on('end', function() {
							responseListener(content, httpResponse.headers);
						});
					}
				});
			}

			// other request.
			else {

				req = (isSecure !== true ? HTTP : HTTPS).request({
					hostname : host,
					port : port,
					path : '/' + (uri === undefined ? '' : uri),
					method : method,
					headers : headers
				}, function(httpResponse) {

					var
					// content
					content = '';

					httpResponse.setEncoding('utf-8');
					httpResponse.on('data', function(str) {
						content += str;
					});
					httpResponse.on('end', function() {
						responseListener(content, httpResponse.headers);
					});
				});

				req.write(paramStr);
				req.end();
			}

			req.on('error', function(error) {

				var
				// error msg
				errorMsg = error.toString();

				if (errorListener !== undefined) {
					errorListener(errorMsg);
				} else {
					SHOW_ERROR('[UOAUTH] REQUEST FAILED: ' + errorMsg, params);
				}
			});
		}
	};
});
