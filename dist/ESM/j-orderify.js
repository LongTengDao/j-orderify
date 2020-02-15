/*!
 * 模块名称：j-orderify
 * 模块功能：返回一个能保证给定对象的属性按此后添加顺序排列的 proxy，即使键名是 symbol，或整数 string。从属于“简计划”。
   　　　　　Return a proxy for given object, which can guarantee own keys are in setting order, even if the key name is symbol or int string. Belong to "Plan J".
 * 模块版本：7.0.0
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

export default _export;
export { Null, create, defineProperties, fromEntries, getOwnPropertyDescriptors, is, isOrdered, orderify, version };

/*¡ j-orderify */

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnNy4wLjAnOyIsImltcG9ydCBNYXAgZnJvbSAnLk1hcCc7XG5pbXBvcnQgT2JqZWN0X2Fzc2lnbiBmcm9tICcuT2JqZWN0LmFzc2lnbic7XG5pbXBvcnQgT2JqZWN0X2NyZWF0ZSBmcm9tICcuT2JqZWN0LmNyZWF0ZSc7XG5pbXBvcnQgT2JqZWN0X2lzIGZyb20gJy5PYmplY3QuaXMnO1xuaW1wb3J0IE9iamVjdF9kZWZpbmVQcm9wZXJ0eSBmcm9tICcuT2JqZWN0LmRlZmluZVByb3BlcnR5JztcbmltcG9ydCBPYmplY3RfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIGZyb20gJy5PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJztcbmltcG9ydCBPYmplY3RfZnJvbUVudHJpZXMgZnJvbSAnLk9iamVjdC5mcm9tRW50cmllcyc7XG5pbXBvcnQgT2JqZWN0X2ZyZWV6ZSBmcm9tICcuT2JqZWN0LmZyZWV6ZSc7XG5pbXBvcnQgUHJveHkgZnJvbSAnLlByb3h5JztcbmltcG9ydCBSZWZsZWN0X2FwcGx5IGZyb20gJy5SZWZsZWN0LmFwcGx5JztcbmltcG9ydCBSZWZsZWN0X2NvbnN0cnVjdCBmcm9tICcuUmVmbGVjdC5jb25zdHJ1Y3QnO1xuaW1wb3J0IFJlZmxlY3RfZGVmaW5lUHJvcGVydHkgZnJvbSAnLlJlZmxlY3QuZGVmaW5lUHJvcGVydHknO1xuaW1wb3J0IFJlZmxlY3RfZGVsZXRlUHJvcGVydHkgZnJvbSAnLlJlZmxlY3QuZGVsZXRlUHJvcGVydHknO1xuaW1wb3J0IFJlZmxlY3Rfc2V0IGZyb20gJy5SZWZsZWN0LnNldCc7XG5pbXBvcnQgUmVmbGVjdF9vd25LZXlzIGZyb20gJy5SZWZsZWN0Lm93bktleXMnO1xuaW1wb3J0IFNldCBmcm9tICcuU2V0JztcbmltcG9ydCBUeXBlRXJyb3IgZnJvbSAnLlR5cGVFcnJvcic7XG5pbXBvcnQgV2Vha01hcCBmcm9tICcuV2Vha01hcCc7XG5pbXBvcnQgdW5kZWZpbmVkIGZyb20gJy51bmRlZmluZWQnO1xuaW1wb3J0IE51bGxfcHJvdG90eXBlIGZyb20gJy5udWxsLnByb3RvdHlwZSc7XG5cbmltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgIFxuXG5jb25zdCBLZWVwZXIgPSBTZXQ7XG5jb25zdCB0YXJnZXQya2VlcGVyICAgICAgICAgICAgICAgICAgICAgICAgICA9IG5ldyBXZWFrTWFwO1xuY29uc3QgcHJveHkydGFyZ2V0ICAgICAgICAgICAgICAgICAgICAgICAgID0gbmV3IFdlYWtNYXA7XG5jb25zdCB0YXJnZXQycHJveHkgICAgICAgICAgICAgICAgICAgICAgICAgPSBuZXcgV2Vha01hcDtcblxuY29uc3Qgc2V0RGVzY3JpcHRvciA9IC8qI19fUFVSRV9fKi8gT2JqZWN0X2Fzc2lnbihPYmplY3RfY3JlYXRlKE51bGxfcHJvdG90eXBlKSwge1xuXHR2YWx1ZTogdW5kZWZpbmVkLFxuXHR3cml0YWJsZTogdHJ1ZSxcblx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0Y29uZmlndXJhYmxlOiB0cnVlLFxufSk7XG5jb25zdCBoYW5kbGVycyA9IC8qI19fUFVSRV9fKi8gT2JqZWN0X2Fzc2lnbihPYmplY3RfY3JlYXRlKE51bGxfcHJvdG90eXBlKSwge1xuXHRhcHBseSAoRnVuY3Rpb24gICAgICAgICAgICAgICAgICAgICAgICAgICAsIHRoaXNBcmcgICAgICwgYXJncyAgICAgICApIHtcblx0XHRyZXR1cm4gb3JkZXJpZnkoUmVmbGVjdF9hcHBseShGdW5jdGlvbiwgdGhpc0FyZywgYXJncykpO1xuXHR9LFxuXHRjb25zdHJ1Y3QgKENsYXNzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICwgYXJncyAgICAgICAsIG5ld1RhcmdldCAgICAgKSB7XG5cdFx0cmV0dXJuIG9yZGVyaWZ5KFJlZmxlY3RfY29uc3RydWN0KENsYXNzLCBhcmdzLCBuZXdUYXJnZXQpKTtcblx0fSxcblx0ZGVmaW5lUHJvcGVydHkgKHRhcmdldCAgICAsIGtleSAgICAgLCBkZXNjcmlwdG9yICAgICAgICAgICAgICAgICAgICApICAgICAgICAgIHtcblx0XHRpZiAoIFJlZmxlY3RfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIFBhcnRpYWxEZXNjcmlwdG9yKGRlc2NyaXB0b3IpKSApIHtcblx0XHRcdHRhcmdldDJrZWVwZXIuZ2V0KHRhcmdldCkgLmFkZChrZXkpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0ZGVsZXRlUHJvcGVydHkgKHRhcmdldCAgICAsIGtleSAgICAgKSAgICAgICAgICB7XG5cdFx0aWYgKCBSZWZsZWN0X2RlbGV0ZVByb3BlcnR5KHRhcmdldCwga2V5KSApIHtcblx0XHRcdHRhcmdldDJrZWVwZXIuZ2V0KHRhcmdldCkgLmRlbGV0ZShrZXkpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0b3duS2V5cyAodGFyZ2V0ICAgICkgICAgICAgIHtcblx0XHRyZXR1cm4gWyAuLi50YXJnZXQya2VlcGVyLmdldCh0YXJnZXQpICBdO1xuXHR9LFxuXHRzZXQgKHRhcmdldCAgICAsIGtleSAgICAgLCB2YWx1ZSAgICAgLCByZWNlaXZlciAgICApICAgICAgICAgIHtcblx0XHRpZiAoIGtleSBpbiB0YXJnZXQgKSB7IHJldHVybiBSZWZsZWN0X3NldCh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKTsgfVxuXHRcdHNldERlc2NyaXB0b3IudmFsdWUgPSB2YWx1ZTtcblx0XHRpZiAoIFJlZmxlY3RfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNldERlc2NyaXB0b3IpICkge1xuXHRcdFx0dGFyZ2V0MmtlZXBlci5nZXQodGFyZ2V0KSAuYWRkKGtleSk7XG5cdFx0XHRzZXREZXNjcmlwdG9yLnZhbHVlID0gdW5kZWZpbmVkO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0c2V0RGVzY3JpcHRvci52YWx1ZSA9IHVuZGVmaW5lZDtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH0sXG59KTtcblxuZnVuY3Rpb24gbmV3UHJveHkgICAgICAgICAgICAgICAgICAgKHRhcmdldCAgICwga2VlcGVyICAgICAgICApICAgIHtcblx0dGFyZ2V0MmtlZXBlci5zZXQodGFyZ2V0LCBrZWVwZXIpO1xuXHRjb25zdCBwcm94eSA9IG5ldyBQcm94eSAgICh0YXJnZXQsIGhhbmRsZXJzKTtcblx0cHJveHkydGFyZ2V0LnNldChwcm94eSwgdGFyZ2V0KTtcblx0cmV0dXJuIHByb3h5O1xufVxuXG5leHBvcnQgY29uc3QgaXNPcmRlcmVkID0gKG9iamVjdCAgICAgICAgKSAgICAgICAgICA9PiBwcm94eTJ0YXJnZXQuaGFzKG9iamVjdCk7XG5leHBvcnQgY29uc3QgaXMgPSAob2JqZWN0MSAgICAgICAgLCBvYmplY3QyICAgICAgICApICAgICAgICAgID0+IE9iamVjdF9pcyhcblx0cHJveHkydGFyZ2V0LmdldChvYmplY3QxKSB8fCBvYmplY3QxLFxuXHRwcm94eTJ0YXJnZXQuZ2V0KG9iamVjdDIpIHx8IG9iamVjdDIsXG4pO1xuXG5leHBvcnQgY29uc3Qgb3JkZXJpZnkgPSAgICAgICAgICAgICAgICAgICAgKG9iamVjdCAgICkgICAgPT4ge1xuXHRpZiAoIHByb3h5MnRhcmdldC5oYXMob2JqZWN0KSApIHsgcmV0dXJuIG9iamVjdDsgfVxuXHRsZXQgcHJveHkgPSB0YXJnZXQycHJveHkuZ2V0KG9iamVjdCkgICAgICAgICAgICAgICAgIDtcblx0aWYgKCBwcm94eSApIHsgcmV0dXJuIHByb3h5OyB9XG5cdHByb3h5ID0gbmV3UHJveHkob2JqZWN0LCBuZXcgS2VlcGVyKFJlZmxlY3Rfb3duS2V5cyhvYmplY3QpKSk7XG5cdHRhcmdldDJwcm94eS5zZXQob2JqZWN0LCBwcm94eSk7XG5cdHJldHVybiBwcm94eTtcbn07XG5mdW5jdGlvbiBnZXRJbnRlcm5hbCAob2JqZWN0ICAgICAgICApICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcblx0Y29uc3QgdGFyZ2V0ID0gcHJveHkydGFyZ2V0LmdldChvYmplY3QpO1xuXHRpZiAoIHRhcmdldCApIHsgcmV0dXJuIHsgdGFyZ2V0LCBrZWVwZXI6IHRhcmdldDJrZWVwZXIuZ2V0KHRhcmdldCkgLCBwcm94eTogb2JqZWN0IH07IH1cblx0bGV0IHByb3h5ID0gdGFyZ2V0MnByb3h5LmdldChvYmplY3QpO1xuXHRpZiAoIHByb3h5ICkgeyByZXR1cm4geyB0YXJnZXQ6IG9iamVjdCwga2VlcGVyOiB0YXJnZXQya2VlcGVyLmdldChvYmplY3QpICwgcHJveHkgfTsgfVxuXHRjb25zdCBrZWVwZXIgICAgICAgICA9IG5ldyBLZWVwZXIoUmVmbGVjdF9vd25LZXlzKG9iamVjdCkpO1xuXHR0YXJnZXQycHJveHkuc2V0KG9iamVjdCwgcHJveHkgPSBuZXdQcm94eShvYmplY3QsIGtlZXBlcikpO1xuXHRyZXR1cm4geyB0YXJnZXQ6IG9iamVjdCwga2VlcGVyLCBwcm94eSB9O1xufVxuXG5mdW5jdGlvbiBQYXJ0aWFsRGVzY3JpcHRvciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc291cmNlICAgKSAgICB7XG5cdGNvbnN0IHRhcmdldCA9IE9iamVjdF9jcmVhdGUoTnVsbF9wcm90b3R5cGUpICAgICA7XG5cdGlmICggc291cmNlLmhhc093blByb3BlcnR5KCd2YWx1ZScpICkge1xuXHRcdHRhcmdldC52YWx1ZSA9IHNvdXJjZS52YWx1ZTtcblx0XHRpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgnd3JpdGFibGUnKSApIHsgdGFyZ2V0LndyaXRhYmxlID0gc291cmNlLndyaXRhYmxlOyB9XG5cdH1cblx0ZWxzZSBpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgnd3JpdGFibGUnKSApIHsgdGFyZ2V0LndyaXRhYmxlID0gc291cmNlLndyaXRhYmxlOyB9XG5cdGVsc2UgaWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ2dldCcpICkge1xuXHRcdHRhcmdldC5nZXQgPSBzb3VyY2UuZ2V0O1xuXHRcdGlmICggc291cmNlLmhhc093blByb3BlcnR5KCdzZXQnKSApIHsgdGFyZ2V0LnNldCA9IHNvdXJjZS5zZXQ7IH1cblx0fVxuXHRlbHNlIGlmICggc291cmNlLmhhc093blByb3BlcnR5KCdzZXQnKSApIHsgdGFyZ2V0LnNldCA9IHNvdXJjZS5zZXQ7IH1cblx0aWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ2VudW1lcmFibGUnKSApIHsgdGFyZ2V0LmVudW1lcmFibGUgPSBzb3VyY2UuZW51bWVyYWJsZTsgfVxuXHRpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgnY29uZmlndXJhYmxlJykgKSB7IHRhcmdldC5jb25maWd1cmFibGUgPSBzb3VyY2UuY29uZmlndXJhYmxlOyB9XG5cdHJldHVybiB0YXJnZXQ7XG59XG5mdW5jdGlvbiBJbnRlcm5hbERlc2NyaXB0b3IgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNvdXJjZSAgICkgICAge1xuXHRjb25zdCB0YXJnZXQgPSBPYmplY3RfY3JlYXRlKE51bGxfcHJvdG90eXBlKSAgICAgO1xuXHRpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSApIHtcblx0XHR0YXJnZXQudmFsdWUgPSBzb3VyY2UudmFsdWU7XG5cdFx0dGFyZ2V0LndyaXRhYmxlID0gc291cmNlLndyaXRhYmxlO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHRhcmdldC5nZXQgPSBzb3VyY2UuZ2V0O1xuXHRcdHRhcmdldC5zZXQgPSBzb3VyY2Uuc2V0O1xuXHR9XG5cdHRhcmdldC5lbnVtZXJhYmxlID0gc291cmNlLmVudW1lcmFibGU7XG5cdHRhcmdldC5jb25maWd1cmFibGUgPSBzb3VyY2UuY29uZmlndXJhYmxlO1xuXHRyZXR1cm4gdGFyZ2V0O1xufVxuZnVuY3Rpb24gRXh0ZXJuYWxEZXNjcmlwdG9yICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzb3VyY2UgICApICAgIHtcblx0Y29uc3QgdGFyZ2V0ID0gT2JqZWN0X2NyZWF0ZShOdWxsX3Byb3RvdHlwZSkgICAgIDtcblx0aWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykgKSB7IHRhcmdldC52YWx1ZSA9IHNvdXJjZS52YWx1ZTsgfVxuXHRpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgnd3JpdGFibGUnKSApIHsgdGFyZ2V0LndyaXRhYmxlID0gc291cmNlLndyaXRhYmxlOyB9XG5cdGlmICggc291cmNlLmhhc093blByb3BlcnR5KCdnZXQnKSApIHsgdGFyZ2V0LmdldCA9IHNvdXJjZS5nZXQ7IH1cblx0aWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ3NldCcpICkgeyB0YXJnZXQuc2V0ID0gc291cmNlLnNldDsgfVxuXHRpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgnZW51bWVyYWJsZScpICkgeyB0YXJnZXQuZW51bWVyYWJsZSA9IHNvdXJjZS5lbnVtZXJhYmxlOyB9XG5cdGlmICggc291cmNlLmhhc093blByb3BlcnR5KCdjb25maWd1cmFibGUnKSApIHsgdGFyZ2V0LmNvbmZpZ3VyYWJsZSA9IHNvdXJjZS5jb25maWd1cmFibGU7IH1cblx0cmV0dXJuIHRhcmdldDtcbn1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5leHBvcnQgY29uc3QgeyBjcmVhdGUgfSA9IHtcblx0Y3JlYXRlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChwcm90byAgICAgICAgICAsIGRlc2NyaXB0b3JNYXAgICAgICkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG5cdFx0J3VzZSBzdHJpY3QnO1xuXHRcdGlmICggYXJndW1lbnRzLmxlbmd0aDwyICkgeyByZXR1cm4gbmV3UHJveHkoT2JqZWN0X2NyZWF0ZShwcm90bykgICAgICAgLCBuZXcgS2VlcGVyKTsgfVxuXHRcdGNvbnN0IGtlZXBlciAgICAgICAgICAgICAgICAgICAgICA9IG5ldyBLZWVwZXI7XG5cdFx0ZGVzY3JpcHRvck1hcCA9IGFyZ3VtZW50c1swXSA9IG5ld1Byb3h5KE9iamVjdF9jcmVhdGUoTnVsbF9wcm90b3R5cGUpLCBrZWVwZXIpICAgICAgO1xuXHRcdFJlZmxlY3RfYXBwbHkoT2JqZWN0X2Fzc2lnbiwgbnVsbCwgYXJndW1lbnRzICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXHRcdGNvbnN0IHRhcmdldCA9IE9iamVjdF9jcmVhdGUocHJvdG8sIGRlc2NyaXB0b3JNYXAgKSAgICAgICA7XG5cdFx0Zm9yICggY29uc3Qga2V5IG9mIGtlZXBlciApIHtcblx0XHRcdGRlc2NyaXB0b3JNYXAgW2tleV0gPSBFeHRlcm5hbERlc2NyaXB0b3IoZGVzY3JpcHRvck1hcCBba2V5XSk7XG5cdFx0fVxuXHRcdHJldHVybiBuZXdQcm94eSh0YXJnZXQsIGtlZXBlcik7XG5cdH1cbn07XG5leHBvcnQgY29uc3QgeyBkZWZpbmVQcm9wZXJ0aWVzIH0gPSB7XG5cdGRlZmluZVByb3BlcnRpZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvYmplY3QgICAsIGRlc2NyaXB0b3JNYXAgICAgKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcblx0XHRjb25zdCB7IHRhcmdldCwga2VlcGVyLCBwcm94eSB9ID0gZ2V0SW50ZXJuYWwob2JqZWN0KTtcblx0XHRmb3IgKCBsZXQgbGFzdEluZGV4ICAgICAgICAgPSBhcmd1bWVudHMubGVuZ3RoLTEsIGluZGV4ICAgICAgICAgPSAxOyA7IGRlc2NyaXB0b3JNYXAgPSBhcmd1bWVudHNbKytpbmRleF0gKSB7XG5cdFx0XHRjb25zdCBrZXlzID0gUmVmbGVjdF9vd25LZXlzKGRlc2NyaXB0b3JNYXApO1xuXHRcdFx0Zm9yICggbGV0IGxlbmd0aCAgICAgICAgID0ga2V5cy5sZW5ndGgsIGluZGV4ICAgICAgICAgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0XHRcdGNvbnN0IGtleSA9IGtleXNbaW5kZXhdO1xuXHRcdFx0XHRPYmplY3RfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIEV4dGVybmFsRGVzY3JpcHRvcihkZXNjcmlwdG9yTWFwW2tleV0pKTtcblx0XHRcdFx0a2VlcGVyLmFkZChrZXkpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCBpbmRleD09PWxhc3RJbmRleCApIHsgcmV0dXJuIHByb3h5OyB9XG5cdFx0fVxuXHR9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyA9ICAgICAgICAgICAgICAgICAgICAob2JqZWN0ICAgKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9PiB7XG5cdGNvbnN0IGRlc2NyaXB0b3JzID0gT2JqZWN0X2NyZWF0ZShOdWxsX3Byb3RvdHlwZSkgICAgICAgO1xuXHRjb25zdCBrZWVwZXIgICAgICAgICA9IG5ldyBLZWVwZXI7XG5cdGNvbnN0IGtleXMgPSBSZWZsZWN0X293bktleXMob2JqZWN0KTtcblx0Zm9yICggbGV0IGxlbmd0aCAgICAgICAgID0ga2V5cy5sZW5ndGgsIGluZGV4ICAgICAgICAgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0Y29uc3Qga2V5ID0ga2V5c1tpbmRleF07XG5cdFx0ZGVzY3JpcHRvcnNba2V5XSA9IEludGVybmFsRGVzY3JpcHRvcihPYmplY3RfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwga2V5KSApO1xuXHRcdGtlZXBlci5hZGQoa2V5KTtcblx0fVxuXHRyZXR1cm4gbmV3UHJveHkoZGVzY3JpcHRvcnMsIGtlZXBlcik7XG59O1xuXG5leHBvcnQgY29uc3QgTnVsbCA9IC8qI19fUFVSRV9fKi8gZnVuY3Rpb24gKCAgICAgICAgICkge1xuXHRmdW5jdGlvbiB0aHJvd0NvbnN0cnVjdGluZyAoKSAgICAgICAgeyB0aHJvdyBUeXBlRXJyb3IoYFN1cGVyIGNvbnN0cnVjdG9yIE51bGwgY2Fubm90IGJlIGludm9rZWQgd2l0aCAnbmV3J2ApOyB9XG5cdGZ1bmN0aW9uIHRocm93QXBwbHlpbmcgKCkgICAgICAgIHsgdGhyb3cgVHlwZUVycm9yKGBTdXBlciBjb25zdHJ1Y3RvciBOdWxsIGNhbm5vdCBiZSBpbnZva2VkIHdpdGhvdXQgJ25ldydgKTsgfVxuXHRmdW5jdGlvbiBOdWxsICggICAgICAgICAgICApIHtcblx0XHRyZXR1cm4gbmV3LnRhcmdldFxuXHRcdFx0PyBuZXcudGFyZ2V0PT09TnVsbFxuXHRcdFx0XHQ/IC8qI19fUFVSRV9fKi8gdGhyb3dDb25zdHJ1Y3RpbmcoKVxuXHRcdFx0XHQ6IC8qI19fUFVSRV9fKi8gbmV3UHJveHkodGhpcywgbmV3IEtlZXBlcilcblx0XHRcdDogLyojX19QVVJFX18qLyB0aHJvd0FwcGx5aW5nKCk7XG5cdH1cblx0Ly9AdHMtaWdub3JlXG5cdE51bGwucHJvdG90eXBlID0gbnVsbDtcblx0T2JqZWN0X2RlZmluZVByb3BlcnR5KE51bGwsICduYW1lJywgT2JqZWN0X2Fzc2lnbihPYmplY3RfY3JlYXRlKE51bGxfcHJvdG90eXBlKSwgeyB2YWx1ZTogJycgfSkpO1xuXHQvL2RlbGV0ZSBOdWxsLmxlbmd0aDtcblx0T2JqZWN0X2ZyZWV6ZShOdWxsKTtcblx0cmV0dXJuIE51bGw7XG59KCkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5jb25zdCBQcm9wZXJ0eUtleSAgICAgID0gLyojX19QVVJFX18qLyBuZXcgUHJveHkoe30sIHsgZ2V0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRhcmdldCAgICAsIGtleSAgICAgKSAgICAgIHsgcmV0dXJuIGtleTsgfSB9KTtcbmV4cG9ydCBjb25zdCBmcm9tRW50cmllcyA9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZW50cmllcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLCBwcm90byAgICAgICAgICAgKSAgICAgICAgICAgICAgICAgICAgICA9PiB7XG5cdGNvbnN0IGtlZXBlciAgICAgICAgID0gbmV3IEtlZXBlcjtcblx0Y29uc3QgbWFwICAgICAgICAgICAgPSBuZXcgTWFwO1xuXHRmb3IgKCBsZXQgeyAwOiBrZXksIDE6IHZhbHVlIH0gb2YgZW50cmllcyApIHtcblx0XHRrZXkgPSBQcm9wZXJ0eUtleVtrZXldO1xuXHRcdGtlZXBlci5hZGQoa2V5KTtcblx0XHRtYXAuc2V0KGtleSwgdmFsdWUpO1xuXHR9XG5cdGNvbnN0IHRhcmdldCA9IE9iamVjdF9mcm9tRW50cmllcyhtYXApO1xuXHRyZXR1cm4gbmV3UHJveHkoXG5cdFx0cHJvdG89PT11bmRlZmluZWQgPyB0YXJnZXQgOlxuXHRcdFx0cHJvdG89PT1udWxsID8gT2JqZWN0X2Fzc2lnbihPYmplY3RfY3JlYXRlKHByb3RvKSAgICAgICAsIHRhcmdldCkgOlxuXHRcdFx0XHRPYmplY3RfY3JlYXRlKHRhcmdldCwgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhwcm90bykpLFxuXHRcdGtlZXBlclxuXHQpO1xufTtcblxuaW1wb3J0IERlZmF1bHQgZnJvbSAnLmRlZmF1bHQnO1xuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdCh7XG5cdHZlcnNpb24sXG5cdGlzT3JkZXJlZCxcblx0aXMsXG5cdG9yZGVyaWZ5LFxuXHRjcmVhdGUsXG5cdGRlZmluZVByb3BlcnRpZXMsXG5cdE51bGwsXG5cdGZyb21FbnRyaWVzLFxuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzLFxufSk7XG4iXSwibmFtZXMiOlsidW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdCQUFlLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7d0JBQUMseEJDNkJ2QixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDbkIsTUFBTSxhQUFhLDRCQUE0QixJQUFJLE9BQU8sQ0FBQztBQUMzRCxNQUFNLFlBQVksMkJBQTJCLElBQUksT0FBTyxDQUFDO0FBQ3pELE1BQU0sWUFBWSwyQkFBMkIsSUFBSSxPQUFPLENBQUM7O0FBRXpELE1BQU0sYUFBYSxpQkFBaUIsYUFBYSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsRUFBRTtDQUNoRixLQUFLLEVBQUVBLFdBQVM7Q0FDaEIsUUFBUSxFQUFFLElBQUk7Q0FDZCxVQUFVLEVBQUUsSUFBSTtDQUNoQixZQUFZLEVBQUUsSUFBSTtDQUNsQixDQUFDLENBQUM7QUFDSCxNQUFNLFFBQVEsaUJBQWlCLGFBQWEsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEVBQUU7Q0FDM0UsS0FBSyxDQUFDLENBQUMsUUFBUSw2QkFBNkIsT0FBTyxPQUFPLElBQUksU0FBUztFQUN0RSxPQUFPLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQ3hEO0NBQ0QsU0FBUyxDQUFDLENBQUMsS0FBSyxpQ0FBaUMsSUFBSSxTQUFTLFNBQVMsT0FBTztFQUM3RSxP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