'use strict';

module.exports = require('@ltd/j-dev')(__dirname+'/..')(async ({ import_ }) => {
	
	const { of, create, extend } = await import_('src/export');
	
	const object = {};
	prepare(object);
	compare(object, [
		'string (decimal integer)',
		'string (decimal integer)',
		
		'string',
		'string',
		
		'symbol',
		'symbol',
	]);
	
	for ( const orderedObject of [
		of({}),
		create(null),
		create(Object.prototype),
		create(object), new ( extend(Object) )
	] ) {
		prepare(orderedObject);
		compare(orderedObject, [
			'symbol',
			'string',
			'string (decimal integer)',
			
			'symbol',
			'string',
			'string (decimal integer)',
		]);
	}
	
	if ( Reflect.getPrototypeOf(create(null))!==null ) { throw Error('__proto__!==null'); }
	if ( Reflect.getPrototypeOf(create(object))!==object ) { throw Error('__proto__!==object'); }
	
});

function prepare (object) {
	
	object[Symbol(1)] = 'symbol';
	object.string1 = 'string';
	object[1] = 'string (decimal integer)';
	
	object[Symbol(2)] = 'symbol';
	object.string2 = 'string';
	object[2] = 'string (decimal integer)';
	
}

function compare (object, expect) {
	if ( JSON.stringify(Reflect.ownKeys(object).map(key => object[key]))!==JSON.stringify(expect) ) {
		throw new Error;
	}
}
