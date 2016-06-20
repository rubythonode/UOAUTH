UOAUTH_SAMPLE.MAIN = METHOD({

	run : function(params) {
		'use strict';
		
		UOAUTH_SAMPLE.ROOM('oauthRoom', function(clientInfo, on, off) {
			
			on('requestToken', function(notUsing, ret) {
				
				UOAUTH.GET_TOKEN({
					url : 'https://api.twitter.com/oauth/request_token',
					method : 'POST',
					consumerKey : 'oqJNUJQXxPgN3gxIrtiB7TMbc',
					consumerSecret : '59lcELXwmao7GpK832A1fx4UiINiqHqWwFAHGrNY55JS2riCR5'
				}, function(token) {
					ret(token.oauth_token);
				});
			});
			
			on('accessToken', function(params, ret) {
				
				if (params !== undefined) {
				
					UOAUTH.GET_TOKEN({
						url : 'https://api.twitter.com/oauth/access_token',
						method : 'POST',
						consumerKey : 'oqJNUJQXxPgN3gxIrtiB7TMbc',
						consumerSecret : '59lcELXwmao7GpK832A1fx4UiINiqHqWwFAHGrNY55JS2riCR5',
						token : params.oauthToken,
						verifier : params.oauthVerifier
					}, function(token) {
						ret(token);
					});
				}
			});
			
			on('getTwitterUserData', function(tokenInfo, ret) {
				
				if (tokenInfo !== undefined) {
					
					UOAUTH.REQUEST({
						isSecure : true,
						host : 'api.twitter.com',
						method : 'GET',
						uri : '1.1/users/lookup.json',
						paramStr : 'screen_name=btncafe',
						headers : {
							Authorization : UOAUTH.GENERATE_AUTHORIZATION({
								url : 'https://api.twitter.com/1.1/users/lookup.json',
								method : 'GET',
								paramStr : 'screen_name=btncafe',
								consumerKey : 'oqJNUJQXxPgN3gxIrtiB7TMbc',
								consumerSecret : '59lcELXwmao7GpK832A1fx4UiINiqHqWwFAHGrNY55JS2riCR5',
								token : tokenInfo.oauth_token,
								tokenSecret : tokenInfo.oauth_token_secret
							})
						}
					}, function(content) {
						ret(content);
					});
				}
			});
		});
	}
});
