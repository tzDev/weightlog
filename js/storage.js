var CryptoJS = CryptoJS || false;
var storage = storage || {};

storage = {
	
	getbyKey: function (key) {
		"use strict";
		// get the key, jsonify it 
		if (window.localStorage[key]) {
			return window.localStorage.getItem(key);
		} else {
			return "invalid key";
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
		window.localStorage[key] = obj;
		return "key set";
	}, // end setKey method
	
	mkID: function (string) {
		"use strict";
		if (CryptoJS) {
			return CryptoJS.MD5(string).toString().substr(1, 10);
		} else {
			return "CryptoJS not found";
		}
	}, // end mkID method
	
	sorbyDate: function (list, date_key) {
		"use strict";
		var i;
		// first check the date keys
		for (i = 0; i < list.length; i += 1) {
			if (!list[i][date_key] instanceof Date) {
				// try and convert it
				try {
					list[i][date_key] = new Date(list[i][date_key]);
				} catch (e) {
					// we could not make a date out of it, no point tryint to sort
					return "failed to sort: " + e;
				} // end try/catch 
			} // end if
		} // end date checking
		// if we make it out then we know our date keys are all valid
		list.sort(function (a, b) {
			// define the comparison
			return new Date(b[date_key]).getTime() - new Date(a[date_key]).getTime();
		});
		return list;
	} // end sortbyDate method
	
}; // end storage object













