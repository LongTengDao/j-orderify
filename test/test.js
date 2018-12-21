'use strict';

module.exports = require('@ltd/j-dev').
	
	import_default(__dirname+'/../src/default.js').
	
	then(orderify => {
		{
			const object = {};
			assign(object);
			Reflect.ownKeys(object).map(get, object).join(', ')==='integer-string, string, symbol' || throws();
		}
		{
			const object = orderify({});
			assign(object);
			Reflect.ownKeys(object).map(get, object).join(', ')==='symbol, string, integer-string' || throws();
		}
		function assign (object) {
			object[Symbol()] = 'symbol';
			object.string = 'string';
			object[1] = 'integer-string';
		}
		function get (key) {
			return this[key];
		}
		function throws (msg) {
			throw new Error(msg);
		}
	});

module.exports.catch(console.error);
