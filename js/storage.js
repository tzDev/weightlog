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
		var list = JSON.parse(window.localStorage[key]);
		list.push(obj);
		storage.setKey(key, list);
	}, // end pushtoKey
	
	setKey: function (key, obj) {
		"use strict";
		window.localStorage[key] = JSON.stringify(obj);
	} // end setKey method
	
	
	
	
	
}; // end storage object

