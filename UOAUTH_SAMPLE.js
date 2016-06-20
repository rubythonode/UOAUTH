require(process.env.UPPERCASE_PATH + '/BOOT.js');

BOOT({
	CONFIG : {
		defaultBoxName : 'UOAUTH_SAMPLE',
		title : 'UOAUTH SAMPLE',
		isDevMode : true,
		webServerPort : 8617
	},
	NODE_CONFIG : {
		isNotUsingCPUClustering : true
	}
});
