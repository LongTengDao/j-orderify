'use strict';

module.exports = require('@ltd/j-dev')(__dirname+'/..')(async ({ import_ }) => {
	
	const { orderify, Orderified } = await import_('src/export');
	
	const object = {};
	prepare(object);
	compare(object, 'integer-string, string, symbol');
	
	let proxy = orderify({});
	prepare(proxy);
	compare(proxy, 'symbol, string, integer-string');
	
	proxy = new Orderified;
	prepare(proxy);
	compare(proxy, 'symbol, string, integer-string');
	
	if ( !( proxy instanceof Orderified ) ) { throw new Error; }
	if ( 'constructor' in proxy ) { throw new Error; }
	if ( Reflect.ownKeys(Reflect.getPrototypeOf(proxy)).length ) { throw new Error; }
	
});

function prepare (object) {
	object[Symbol()] = 'symbol';
	object.string = 'string';
	object[1] = 'integer-string';
}

function compare (object, ownKeys) {
	if ( Reflect.ownKeys(object).map(key => object[key]).join(', ')!==ownKeys ) {
		throw new Error;
	}
}
