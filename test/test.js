'use strict';

module.exports = require('@ltd/j-dev')(__dirname+'/..')(async ({ import_default }) => {
	
	const { orderify } = await import_default('src/default');
	
	const object = orderify(Object.create(null));
	
	object[Symbol('A')] = 1;
	object['_________'] = 2;
	object[10000000000] = 3;
	object[Symbol('B')] = 4;
	object['__proto__'] = 5;
	object[11111111111] = 6;
	
	let index = 0;
	for ( const key of Reflect.ownKeys(object) ) {
		if ( object[key]!== ++index ) { throw Error('Reflect.ownKeys'); }
	}
	
	const indexes = [ 2, 3, 5, 6 ];
	for ( const key in object ) {
		if ( object[key]!==indexes.shift() ) { throw Error('for/in'); }
	}
	
	class MyArray extends orderify(Array) { k () {} }
	const ma = new MyArray;
	if ( !Array.isArray(ma) ) { throw Error('Array.isArray'); }
	ma.k();
	
});
