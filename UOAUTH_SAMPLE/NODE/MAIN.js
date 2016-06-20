UOAUTH_SAMPLE.MAIN = METHOD({

	run : function() {
		'use strict';
		
		UOAUTH_SAMPLE.ROOM('oauthRoom', function(clientInfo, on, off) {
			
			on('requestToken', function(notUsing, ret) {
				
				UOAUTH.GET_TOKEN({
					url : 'https://api.twitter.com/oauth/request_token',
					method : 'POST',
					consumerKey : 'S3BHgVoKD6eTHXrzzbKw5ztUr',
					consumerSecret : '9fXxULfpROHWGTrbyL6CjuL1RFdvPi38xqbOr8gaMG0GsvZXqp'
				}, function(data) {
					ret(data.oauth_token);
				});
			});
			
			on('accessToken', function(params, ret) {
				
				if (params !== undefined) {
				
					UOAUTH.GET_TOKEN({
						url : 'https://api.twitter.com/oauth/access_token',
						method : 'POST',
						consumerKey : 'S3BHgVoKD6eTHXrzzbKw5ztUr',
						consumerSecret : '9fXxULfpROHWGTrbyL6CjuL1RFdvPi38xqbOr8gaMG0GsvZXqp',
						token : params.oauthToken,
						verifier : params.oauthVerifier
					}, function(data) {
						ret(data);
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
								consumerKey : 'S3BHgVoKD6eTHXrzzbKw5ztUr',
								consumerSecret : '9fXxULfpROHWGTrbyL6CjuL1RFdvPi38xqbOr8gaMG0GsvZXqp',
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
