﻿'use strict';

const Object_assign = Object.assign;

const Object_create = Object.create;

const Object_is = Object.is;

const Object_defineProperty = Object.defineProperty;

const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

const Object_fromEntries = Object.fromEntries;

const Object_freeze = Object.freeze;

const Reflect_apply = Reflect.apply;

const Reflect_construct = Reflect.construct;

const Reflect_defineProperty = Reflect.defineProperty;

const Reflect_deleteProperty = Reflect.deleteProperty;

const Reflect_set = Reflect.set;

const Reflect_ownKeys = Reflect.ownKeys;

const undefined$1 = void 0;

const Null_prototype = (
	/*! j-globals: null.prototype (internal) */
	Object.create
		? /*#__PURE__*/ Object.preventExtensions(Object.create(null))
		: null
	/*¡ j-globals: null.prototype (internal) */
);

const version = '7.0.0';

const hasOwnProperty = Object.prototype.hasOwnProperty;

const toStringTag = typeof Symbol!=='undefined' ? Symbol.toStringTag : undefined;

const seal = Object.seal;

const Default = (
	/*! j-globals: default (internal) */
	function Default (exports, addOnOrigin) {
		return /*#__PURE__*/ function Module (exports, addOnOrigin) {
			if ( !addOnOrigin ) { addOnOrigin = exports; exports = Object_create(Null_prototype); }
			if ( Object_assign ) { Object_assign(exports, addOnOrigin); }
			else { for ( var key in addOnOrigin ) { if ( hasOwnProperty.call(addOnOrigin, key) ) { exports[key] = addOnOrigin[key]; } } }
			exports['default'] = exports;
			typeof exports==='function' && exports.prototype && seal(exports.prototype);
			if ( toStringTag ) {
				var descriptor = Object_create(Null_prototype);
				descriptor.value = 'Module';
				Object_defineProperty(exports, toStringTag, descriptor);
			}
			return Object_freeze(exports);
		}(exports, addOnOrigin);
	}
	/*¡ j-globals: default (internal) */
);

const Keeper = Set;
const target2keeper                          = new WeakMap;
const proxy2target                         = new WeakMap;
const target2proxy                         = new WeakMap;

const setDescriptor = /*#__PURE__*/ Object_assign(Object_create(Null_prototype), {
	value: undefined$1,
	writable: true,
	enumerable: true,
	configurable: true,
});
const handlers = /*#__PURE__*/ Object_assign(Object_create(Null_prototype), {
	apply (Function                           , thisArg     , args       ) {
		return orderify(Reflect_apply(Function, thisArg, args));
	},
	construct (Class                               , args       , newTarget     ) {
		return orderify(Reflect_construct(Class, args, newTarget));
	},
	defineProperty (target    , key     , descriptor                    )          {
		if ( Reflect_defineProperty(target, key, PartialDescriptor(descriptor)) ) {
			target2keeper.get(target) .add(key);
			return true;
		}
		return false;
	},
	deleteProperty (target    , key     )          {
		if ( Reflect_deleteProperty(target, key) ) {
			target2keeper.get(target) .delete(key);
			return true;
		}
		return false;
	},
	ownKeys (target    )        {
		return [ ...target2keeper.get(target)  ];
	},
	set (target    , key     , value     , receiver    )          {
		if ( key in target ) { return Reflect_set(target, key, value, receiver); }
		setDescriptor.value = value;
		if ( Reflect_defineProperty(target, key, setDescriptor) ) {
			target2keeper.get(target) .add(key);
			setDescriptor.value = undefined$1;
			return true;
		}
		else {
			setDescriptor.value = undefined$1;
			return false;
		}
	},
});

function newProxy                   (target   , keeper        )    {
	target2keeper.set(target, keeper);
	const proxy = new Proxy   (target, handlers);
	proxy2target.set(proxy, target);
	return proxy;
}

const isOrdered = (object        )          => proxy2target.has(object);
const is = (object1        , object2        )          => Object_is(
	proxy2target.get(object1) || object1,
	proxy2target.get(object2) || object2,
);

const orderify =                    (object   )    => {
	if ( proxy2target.has(object) ) { return object; }
	let proxy = target2proxy.get(object)                 ;
	if ( proxy ) { return proxy; }
	proxy = newProxy(object, new Keeper(Reflect_ownKeys(object)));
	target2proxy.set(object, proxy);
	return proxy;
};
function getInternal (object        )                                              {
	const target = proxy2target.get(object);
	if ( target ) { return { target, keeper: target2keeper.get(target) , proxy: object }; }
	let proxy = target2proxy.get(object);
	if ( proxy ) { return { target: object, keeper: target2keeper.get(object) , proxy }; }
	const keeper         = new Keeper(Reflect_ownKeys(object));
	target2proxy.set(object, proxy = newProxy(object, keeper));
	return { target: object, keeper, proxy };
}

function PartialDescriptor                               (source   )    {
	const target = Object_create(Null_prototype)     ;
	if ( source.hasOwnProperty('value') ) {
		target.value = source.value;
		if ( source.hasOwnProperty('writable') ) { target.writable = source.writable; }
	}
	else if ( source.hasOwnProperty('writable') ) { target.writable = source.writable; }
	else if ( source.hasOwnProperty('get') ) {
		target.get = source.get;
		if ( source.hasOwnProperty('set') ) { target.set = source.set; }
	}
	else if ( source.hasOwnProperty('set') ) { target.set = source.set; }
	if ( source.hasOwnProperty('enumerable') ) { target.enumerable = source.enumerable; }
	if ( source.hasOwnProperty('configurable') ) { target.configurable = source.configurable; }
	return target;
}
function InternalDescriptor                               (source   )    {
	const target = Object_create(Null_prototype)     ;
	if ( source.hasOwnProperty('value') ) {
		target.value = source.value;
		target.writable = source.writable;
	}
	else {
		target.get = source.get;
		target.set = source.set;
	}
	target.enumerable = source.enumerable;
	target.configurable = source.configurable;
	return target;
}
function ExternalDescriptor                               (source   )    {
	const target = Object_create(Null_prototype)     ;
	if ( source.hasOwnProperty('value') ) { target.value = source.value; }
	if ( source.hasOwnProperty('writable') ) { target.writable = source.writable; }
	if ( source.hasOwnProperty('get') ) { target.get = source.get; }
	if ( source.hasOwnProperty('set') ) { target.set = source.set; }
	if ( source.hasOwnProperty('enumerable') ) { target.enumerable = source.enumerable; }
	if ( source.hasOwnProperty('configurable') ) { target.configurable = source.configurable; }
	return target;
}

                                                                                       
const { create } = {
	create                                                          (proto          , descriptorMap     )                                                                  {
		if ( arguments.length<2 ) { return newProxy(Object_create(proto)       , new Keeper); }
		const keeper                      = new Keeper;
		descriptorMap = arguments[0] = newProxy(Object_create(Null_prototype), keeper)      ;
		Reflect_apply(Object_assign, null, arguments                             );
		const target = Object_create(proto, descriptorMap )       ;
		for ( const key of keeper ) {
			descriptorMap [key] = ExternalDescriptor(descriptorMap [key]);
		}
		return newProxy(target, keeper);
	}
};
const { defineProperties } = {
	defineProperties                                                     (object   , descriptorMap    )                                                                     {
		const { target, keeper, proxy } = getInternal(object);
		for ( let lastIndex         = arguments.length-1, index         = 1; ; descriptorMap = arguments[++index] ) {
			const keys = Reflect_ownKeys(descriptorMap);
			for ( let length         = keys.length, index         = 0; index<length; ++index ) {
				const key = keys[index];
				Object_defineProperty(target, key, ExternalDescriptor(descriptorMap[key]));
				keeper.add(key);
			}
			if ( index===lastIndex ) { return proxy; }
		}
	}
};

const getOwnPropertyDescriptors =                    (object   )                                                    => {
	const descriptors = Object_create(Null_prototype)       ;
	const keeper         = new Keeper;
	const keys = Reflect_ownKeys(object);
	for ( let length         = keys.length, index         = 0; index<length; ++index ) {
		const key = keys[index];
		descriptors[key] = InternalDescriptor(Object_getOwnPropertyDescriptor(object, key) );
		keeper.add(key);
	}
	return newProxy(descriptors, keeper);
};

const Null = /*#__PURE__*/ function (         ) {
	function throwConstructing ()        { throw TypeError(`Super constructor Null cannot be invoked with 'new'`); }
	function throwApplying ()        { throw TypeError(`Super constructor Null cannot be invoked without 'new'`); }
	function Null (            ) {
		return new.target
			? new.target===Null
				? /*#__PURE__*/ throwConstructing()
				: /*#__PURE__*/ newProxy(this, new Keeper)
			: /*#__PURE__*/ throwApplying();
	}
	//@ts-ignore
	Null.prototype = null;
	Object_defineProperty(Null, 'name', Object_assign(Object_create(Null_prototype), { value: '' }));
	//delete Null.length;
	Object_freeze(Null);
	return Null;
}()                                           ;
                                                                   

const PropertyKey      = /*#__PURE__*/ new Proxy({}, { get                              (target    , key     )      { return key; } });
const fromEntries =                                                              (entries                                            , proto           )                      => {
	const keeper         = new Keeper;
	const map            = new Map;
	for ( let { 0: key, 1: value } of entries ) {
		key = PropertyKey[key];
		keeper.add(key);
		map.set(key, value);
	}
	const target = Object_fromEntries(map);
	return newProxy(
		proto===undefined$1 ? target :
			proto===null ? Object_assign(Object_create(proto)       , target) :
				Object_create(target, getOwnPropertyDescriptors(proto)),
		keeper
	);
};
const _export = Default({
	version,
	isOrdered,
	is,
	orderify,
	create,
	defineProperties,
	Null,
	fromEntries,
	getOwnPropertyDescriptors,
});

module.exports = _export;

//# sourceMappingURL=index.js.map