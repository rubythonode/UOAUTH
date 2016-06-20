UOAUTH_SAMPLE.MAIN = METHOD({

	run : function(params) {
		'use strict';
		
		var
		// oauth room
		oauthRoom = UOAUTH_SAMPLE.ROOM('oauthRoom'),
		
		// oauth_token parameter
		oauthTokenParam = new RegExp('[?&]oauth_token=([^&]*)').exec(location.search),
		
		// oauth_verifier parameter
		oauthVerifierParam = new RegExp('[?&]oauth_verifier=([^&]*)').exec(location.search),
		
		// oauth token
		oauthToken,
		
		// oauth verifier
		oauthVerifier,
		
		// token info
		tokenInfo;
		
		if (oauthTokenParam !== TO_DELETE) {
			oauthToken = decodeURIComponent(oauthTokenParam[1]);
		}
		
		if (oauthVerifierParam !== TO_DELETE) {
			oauthVerifier = decodeURIComponent(oauthVerifierParam[1]);
		}
		
		if (oauthToken !== undefined && oauthVerifier !== undefined) {
			
			oauthRoom.send({
				methodName : 'accessToken',
				data : {
					oauthToken : oauthToken,
					oauthVerifier : oauthVerifier
				}
			}, function(_tokenInfo) {
				tokenInfo = _tokenInfo;
				
				console.log(tokenInfo);
				
				oauthRoom.send({
					methodName : 'getTwitterUserData',
					data : tokenInfo
				}, function(d) {
					console.log(d);
				});
			});
		}

		DIV({
			style : {
				padding : 20
			},
			c : [A({
				c : IMG({
					src : UOAUTH_SAMPLE.R('twitter-login-button.png')
				}),
				on : {
					tap : function() {
						
						oauthRoom.send('requestToken', function(token) {
							location.href = 'https://api.twitter.com/oauth/authenticate?oauth_token=' + token;
						});
					}
				}
			})]
		}).appendTo(BODY);
	}
});
