'use strict';

module.exports = require('@ltd/j-dev')(__dirname+'/..')(async ({ import_ }) => {
	
	const { orderify, Orderified } = await import_('src/export');
	
	const object = {};
	prepare(object);
	compare(object, 'integer-string, integer-string, string, string, symbol, symbol');
	
	let proxy = orderify({});
	prepare(proxy);
	compare(proxy, 'symbol, string, integer-string, symbol, string, integer-string');
	
	proxy = new Orderified;
	prepare(proxy);
	compare(proxy, 'symbol, string, integer-string, symbol, string, integer-string');
	
});

function prepare (object) {
	
	object[Symbol(1)] = 'symbol';
	object.string1 = 'string';
	object[1] = 'integer-string';
	
	object[Symbol(2)] = 'symbol';
	object.string2 = 'string';
	object[2] = 'integer-string';
	
}

function compare (object, ownKeys) {
	if ( Reflect.ownKeys(object).map(key => object[key]).join(', ')!==ownKeys ) {
		throw new Error;
	}
}
