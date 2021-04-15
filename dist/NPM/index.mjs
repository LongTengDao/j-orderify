const TypeError$1 = TypeError;

const WeakMap$1 = WeakMap;

const Proxy$1 = Proxy;

const Object_assign = Object.assign;

const Object_create = Object.create;

const Object_is = Object.is;

const Object_defineProperty = Object.defineProperty;

const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

const Object_defineProperties = Object.defineProperties;

const Object_fromEntries = Object.fromEntries;

const Object_freeze = Object.freeze;

const hasOwnProperty = Object.prototype.hasOwnProperty;

const Reflect_apply = Reflect.apply;

const Reflect_construct = Reflect.construct;

const Reflect_defineProperty = Reflect.defineProperty;

const Reflect_deleteProperty = Reflect.deleteProperty;

const Reflect_ownKeys = Reflect.ownKeys;

const undefined$1 = void 0;

const NULL = (
	/*! j-globals: null.prototype (internal) */
	Object.seal
		? /*#__PURE__*/Object.preventExtensions(Object.create(null))
		: null
	/*¡ j-globals: null.prototype (internal) */
);

const version = '7.0.1';

const toStringTag = typeof Symbol==='undefined' ? undefined$1 : Symbol.toStringTag;

var hasOwn = hasOwnProperty.bind
	? /*#__PURE__*/hasOwnProperty.call.bind(hasOwnProperty)
	: function (object, key) { return /*#__PURE__*/hasOwnProperty.call(object, key); };// && object!=null

const Default = (
	/*! j-globals: default (internal) */
	function Default (exports, addOnOrigin) {
		return /*#__PURE__*/ function Module (exports, addOnOrigin) {
			if ( !addOnOrigin ) { addOnOrigin = exports; exports = Object_create(NULL); }
			if ( Object_assign ) { Object_assign(exports, addOnOrigin); }
			else { for ( var key in addOnOrigin ) { if ( hasOwn(addOnOrigin, key) ) { exports[key] = addOnOrigin[key]; } } }
			exports.default = exports;
			if ( toStringTag ) {
				var descriptor = Object_create(NULL);
				descriptor.value = 'Module';
				Object_defineProperty(exports, toStringTag, descriptor);
			}
			typeof exports==='function' && exports.prototype && Object_freeze(exports.prototype);
			return Object_freeze(exports);
		}(exports, addOnOrigin);
	}
	/*¡ j-globals: default (internal) */
);

const Keeper =     ()      => [];

const hasOwnProperty_call = /*#__PURE__*/hasOwnProperty.call.bind(hasOwnProperty);

const newWeakMap = () => {
	const weakMap = new WeakMap$1;
	weakMap.has = weakMap.has;
	weakMap.get = weakMap.get;
	weakMap.set = weakMap.set;
	return weakMap;
};
const target2keeper = /*#__PURE__*/newWeakMap()     
	                                                                      
	                                                                         
 ;
const proxy2target = /*#__PURE__*/newWeakMap()     
	                             
	                                                 
	                                                   
 ;
const target2proxy = /*#__PURE__*/newWeakMap()     
	                                                  
	                                                   
 ;

const ExternalDescriptor =                                (source   )    => {
	const target = Object_create(NULL)     ;
	if ( hasOwnProperty_call(source, 'enumerable') ) { target.enumerable = source.enumerable; }
	if ( hasOwnProperty_call(source, 'configurable') ) { target.configurable = source.configurable; }
	if ( hasOwnProperty_call(source, 'value') ) { target.value = source.value; }
	if ( hasOwnProperty_call(source, 'writable') ) { target.writable = source.writable; }
	if ( hasOwnProperty_call(source, 'get') ) { target.get = source.get; }
	if ( hasOwnProperty_call(source, 'set') ) { target.set = source.set; }
	return target;
};

const handlers                       = /*#__PURE__*/Object_assign(Object_create(NULL), {
	defineProperty:                 (target                   , key   , descriptor                    )          => {
		if ( hasOwnProperty_call(target, key) ) {
			return Reflect_defineProperty(target, key, Object_assign(Object_create(NULL), descriptor));
		}
		if ( Reflect_defineProperty(target, key, Object_assign(Object_create(NULL), descriptor)) ) {
			const keeper = target2keeper.get(target) ;
			keeper[keeper.length] = key;
			return true;
		}
		return false;
	},
	deleteProperty:                 (target                   , key   )          => {
		if ( Reflect_deleteProperty(target, key) ) {
			const keeper = target2keeper.get(target) ;
			const index = keeper.indexOf(key);
			index<0 || --keeper.copyWithin(index, index + 1).length;
			return true;
		}
		return false;
	},
	ownKeys:                    (target   ) => target2keeper.get(target)                         ,
	construct:                                     (target                         , args   , newTarget     )    => orderify(Reflect_construct(target, args, newTarget)),
	apply:                                        (target                              , thisArg   , args   )    => orderify(Reflect_apply(target, thisArg, args)),
});

const newProxy =                                              (target   , keeper           )    => {
	target2keeper.set(target, keeper);
	const proxy = new Proxy$1   (target, handlers);
	proxy2target.set(proxy, target);
	return proxy;
};

const isOrdered = (object        )          => proxy2target.has(object);
const is = (object1        , object2        )          => Object_is(
	proxy2target.get(object1) || object1,
	proxy2target.get(object2) || object2,
);

const orderify =                    (object   )    => {
	if ( proxy2target.has(object) ) { return object; }
	let proxy = target2proxy.get(object)                 ;
	if ( proxy ) { return proxy; }
	proxy = newProxy(object, Object_assign(Keeper          (), Reflect_ownKeys(object)));
	target2proxy.set(object, proxy);
	return proxy;
};

                                                                                                       
const { create } = {
	create                                                          (proto          , ...descriptorMaps      )                                                                  {
		const keeper = Keeper           ();
		if ( descriptorMaps.length ) {
			const descriptorMap     = Object_assign(newProxy(Object_create(NULL)      , keeper), ...descriptorMaps);
			const { length } = keeper;
			let index = 0;
			while ( index!==length ) {
				const key = keeper[index++] ;
				descriptorMap[key] = ExternalDescriptor(descriptorMap[key]);
			}
			return newProxy(Object_create(proto, descriptorMap)       , keeper       );
		}
		return newProxy(Object_create(proto)       , keeper       );
	}
};
const { defineProperties } = {
	defineProperties                                                     (object   , descriptorMap    , ...descriptorMaps      )                                                                     {
		const keeper = Keeper           ();
		descriptorMap = Object_assign(newProxy(Object_create(NULL)      , keeper), descriptorMap, ...descriptorMaps);
		const { length } = keeper;
		let index = 0;
		while ( index!==length ) {
			const key = keeper[index++] ;
			descriptorMap[key] = ExternalDescriptor(descriptorMap[key]);
		}
		return Object_defineProperties(orderify(object), descriptorMap);
	}
};
const getOwnPropertyDescriptors =                    (object   )                                => {
	const descriptorMap = Object_create(NULL)                                 ;
	const keeper = Object_assign(Keeper          (), Reflect_ownKeys(object));
	const { length } = keeper;
	let index = 0;
	while ( index!==length ) {
		const key = keeper[index++];
		descriptorMap[key] = Object_assign(Object_create(NULL), Object_getOwnPropertyDescriptor(object, key) );
	}
	return newProxy(descriptorMap, keeper);
};

const Null = /*#__PURE__*/function () {
	function throwConstructing ()        { throw TypeError$1(`Super constructor Null cannot be invoked with 'new'`); }
	function throwApplying ()        { throw TypeError$1(`Super constructor Null cannot be invoked without 'new'`); }
	const Nullify = (constructor                             ) => {
		delete constructor.prototype.constructor;
		Object_freeze(constructor.prototype);
		return constructor;
	};
	function Null (           constructor                              ) {
		return new.target
			? new.target===Null
				? /*#__PURE__*/throwConstructing()
				: /*#__PURE__*/newProxy(this, Keeper     ())
			: typeof constructor==='function'
				? /*#__PURE__*/Nullify(constructor)
				: /*#__PURE__*/throwApplying();
	}
	//@ts-ignore
	Null.prototype = null;
	Object_defineProperty(Null, 'name', Object_assign(Object_create(NULL), { value: '', configurable: false }));
	//delete Null.length;
	Object_freeze(Null);
	return Null;
}()                                           ;
                                                                   

const DEFAULT = /*#__PURE__*/Object_assign(class extends null { writable () {} enumerable () {} configurable () {} }.prototype                             , {
	constructor: undefined$1,
	writable: true,
	enumerable: true,
	configurable: true,
});
const fromEntries =                                                  (entries                                            , proto           )                      => {
	const target = Object_fromEntries(entries);
	const keeper            = Object_assign(Keeper   (), Reflect_ownKeys(target));
	if ( proto===undefined$1 ) { return newProxy(target                       , keeper); }
	if ( proto===null ) { return newProxy(Object_assign(Object_create(proto), target)                       , keeper); }
	const descriptorMap = Object_create(NULL)                                            ;
	const { length } = keeper;
	let index = 0;
	while ( index!==length ) {
		const key    = keeper[index++] ;
		( descriptorMap[key] = Object_create(DEFAULT)                               ).value = target[key];
	}
	return newProxy(Object_create(proto, descriptorMap)                       , keeper);
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

export default _export;
export { Null, create, defineProperties, fromEntries, getOwnPropertyDescriptors, is, isOrdered, orderify, version };

//# sourceMappingURL=index.mjs.map