/*!
 * 模块名称：j-orderify
 * 模块功能：返回一个能保证给定对象的属性按此后添加顺序排列的 proxy，即使键名是 symbol，或整数 string。从属于“简计划”。
   　　　　　Return a proxy for given object, which can guarantee own keys are in setting order, even if the key name is symbol or int string. Belong to "Plan J".
 * 模块版本：5.3.0
 * 许可条款：LGPL-3.0
 * 所属作者：龙腾道 <LongTengDao@LongTengDao.com> (www.LongTengDao.com)
 * 问题反馈：https://GitHub.com/LongTengDao/j-orderify/issues
 * 项目主页：https://GitHub.com/LongTengDao/j-orderify/
 */

const Object_assign = Object.assign;

const Object_create = Object.create;

const Object_is = Object.is;

const Object_defineProperty = Object.defineProperty;

const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

const Object_defineProperties = Object.defineProperties;

const Object_fromEntries = Object.fromEntries;

const Object_freeze = Object.freeze;

const Reflect_apply = Reflect.apply;

const Reflect_construct = Reflect.construct;

const Reflect_defineProperty = Reflect.defineProperty;

const Reflect_deleteProperty = Reflect.deleteProperty;

const Reflect_set = Reflect.set;

const Reflect_ownKeys = Reflect.ownKeys;

const undefined$1 = void 0;

const isArray = Array.isArray;

const version = '5.3.0';

const hasOwnProperty = Object.prototype.hasOwnProperty;

const toStringTag = typeof Symbol!=='undefined' ? Symbol.toStringTag : undefined;

const seal = Object.seal;

const Default = (
	/*! j-globals: default (internal) */
	function Default (exports, addOnOrigin) {
		return /*#__PURE__*/ function Module (exports, addOnOrigin) {
			if ( !addOnOrigin ) { addOnOrigin = exports; exports = Object_create(null); }
			if ( Object_assign ) { Object_assign(exports, addOnOrigin); }
			else { for ( var key in addOnOrigin ) { if ( hasOwnProperty.call(addOnOrigin, key) ) { exports[key] = addOnOrigin[key]; } } }
			exports['default'] = exports;
			typeof exports==='function' && exports.prototype && seal(exports.prototype);
			if ( toStringTag ) {
				var descriptor = Object_create(null);
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

const setDescriptor = /*#__PURE__*/Object_assign(Object_create(null), {
	value: undefined$1,
	writable: true,
	enumerable: true,
	configurable: true,
});
const handlers = /*#__PURE__*/Object_assign(Object_create(null), {
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
	const proxy    = new Proxy(target, handlers);
	proxy2target.set(proxy, target);
	return proxy;
}

const { isOrdered } = {
	isOrdered (object        )          {
		return proxy2target.has(object);
	}
};
const { is } = {
	is (object1        , object2        )          {
		return Object_is(
			proxy2target.get(object1) || object1,
			proxy2target.get(object2) || object2,
		);
	}
};

const { orderify } = {
	orderify                   (object   )    {
		if ( proxy2target.has(object) ) { return object; }
		let proxy                = target2proxy.get(object)                 ;
		if ( proxy ) { return proxy; }
		proxy = newProxy(object, new Keeper(Reflect_ownKeys(object)));
		target2proxy.set(object, proxy);
		return proxy;
	}
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
	const target    = Object_create(null);
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
	const target    = Object_create(null);
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
	const target    = Object_create(null);
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
		if ( descriptorMap===undefined$1 ) { return newProxy(Object_create(proto), new Keeper); }
		const target = Object_create(proto);
		const keeper         = new Keeper;
		for ( let lastIndex         = arguments.length-1, index         = 1; ; descriptorMap = arguments[++index] ) {
			const keys = Reflect_ownKeys(descriptorMap );
			for ( let length         = keys.length, index         = 0; index<length; ++index ) {
				const key = keys[index];
				Object_defineProperty(target, key, ExternalDescriptor(descriptorMap [key]));
				keeper.add(key);
			}
			if ( index===lastIndex ) { return newProxy(target, keeper); }
		}
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

const { getOwnPropertyDescriptors } = {
	getOwnPropertyDescriptors                   (object   )                                                    {
		const descriptors = Object_create(null);
		const keeper         = new Keeper;
		const keys = Reflect_ownKeys(object);
		for ( let length         = keys.length, index         = 0; index<length; ++index ) {
			const key = keys[index];
			descriptors[key] = InternalDescriptor(Object_getOwnPropertyDescriptor(object, key) );
			keeper.add(key);
		}
		return newProxy(descriptors, keeper);
	}
};

function keeperAddKeys (keeper        , object    )       {
	const keys        = Reflect_ownKeys(object);
	for ( let length         = keys.length, index         = 0; index<length; ++index ) {
		keeper.add(keys[index]);
	}
}
function NULL_from (source           , define         )      {
	const target = Object_create(null);
	const keeper         = new Keeper;
	if ( define ) {
		if ( isArray(source) ) {
			for ( let length         = source.length, index         = 0; index<length; ++index ) {
				const descriptorMap = getOwnPropertyDescriptors(source[index]);
				Object_defineProperties(target, descriptorMap);
				keeperAddKeys(keeper, descriptorMap);
			}
		}
		else {
			const descriptorMap = getOwnPropertyDescriptors(source);
			Object_defineProperties(target, descriptorMap);
			keeperAddKeys(keeper, descriptorMap);
		}
	}
	else {
		if ( isArray(source) ) {
			Object_assign(target, ...source);
			for ( let length         = source.length, index         = 0; index<length; ++index ) {
				keeperAddKeys(keeper, source[index]);
			}
		}
		else {
			Object_assign(target, source);
			keeperAddKeys(keeper, source);
		}
	}
	return newProxy(target, keeper);
}
function throwConstructing ()        { throw TypeError(`NULL cannot be invoked with 'new'`); }
const NULL                                   =
	/*#__PURE__*/
	function (         ) {
		const NULL      = function                (              source          , define          )    {
			return new.target
				? new.target===NULL
					? /*#__PURE__*/ throwConstructing()
					: /*#__PURE__*/ newProxy(this, new Keeper)
				: /*#__PURE__*/ NULL_from(source , define );
		};
		NULL.prototype = null;
		//delete NULL.name;
		//delete NULL.length;
		Object_freeze(NULL);
		return NULL;
	}();
                                                                   

const PropertyKey      =
	/*#__PURE__*/ new Proxy({}, { get                              (target    , key     )      { return key; } });
const { fromEntries } = {
	fromEntries                                                             (entries                                            , proto           )                      {
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
				proto===null ? Object_assign(Object_create(null), target) :
					Object_create(target, getOwnPropertyDescriptors(proto)),
			keeper
		);
	}
};
const _export = Default({
	version,
	isOrdered,
	is,
	orderify,
	create,
	defineProperties,
	NULL,
	fromEntries,
	getOwnPropertyDescriptors,
});

export default _export;
export { NULL, create, defineProperties, fromEntries, getOwnPropertyDescriptors, is, isOrdered, orderify, version };

/*¡ j-orderify */

//# sourceMappingURL=index.mjs.map