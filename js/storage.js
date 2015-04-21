var CryptoJS = CryptoJS || false;
var storage = storage || {};

storage = {
	
	getbyKey: function (key, success_cb) {
		"use strict";
		// get the key, jsonify it 
		if (window.localStorage[key]) {
			success_cb(JSON.parse(window.localStorage[key]));
		} else {
			return {
				status: "invalid key"
			};
		}
	}, // end getByKey method
	
	pushtoKey: function (key, obj) {
		"use strict";
		// provided key should be a list, append obj to that list
		// first get the key
		var list;
		try {
			list = JSON.parse(window.localStorage[key]);
		} catch (e) {
			// probably new
			list = [];
		}
		list.push(obj);
		storage.setKey(key, list);
	}, // end pushtoKey
	
	setKey: function (key, obj) {
		"use strict";
		window.localStorage[key] = JSON.stringify(obj);
	}, // end setKey method
	
	mkID: function (string) {
		"use strict";
		if (CryptoJS) {
			return CryptoJS.MD5(string).toString().substr(1, 10);
		} else {
			return "CryptoJS not found";
		}
	} // end mkID method
	
	
	
	
}; // end storage object

