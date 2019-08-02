﻿/*!
 * 模块名称：j-orderify
 * 模块功能：返回一个能保证给定对象的属性按此后添加顺序排列的 proxy，即使键名是 symbol，或整数 string。从属于“简计划”。
   　　　　　Return a proxy for given object, which can guarantee own keys are in setting order, even if the key name is symbol or int string. Belong to "Plan J".
 * 模块版本：5.3.0
 * 许可条款：LGPL-3.0
 * 所属作者：龙腾道 <LongTengDao@LongTengDao.com> (www.LongTengDao.com)
 * 问题反馈：https://GitHub.com/LongTengDao/j-orderify/issues
 * 项目主页：https://GitHub.com/LongTengDao/j-orderify/
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.Ordered = factory());
}(this, function () { 'use strict';

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

	return _export;

}));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnNS4zLjAnOyIsImltcG9ydCBNYXAgZnJvbSAnLk1hcCc7XG5pbXBvcnQgT2JqZWN0X2Fzc2lnbiBmcm9tICcuT2JqZWN0LmFzc2lnbic7XG5pbXBvcnQgT2JqZWN0X2NyZWF0ZSBmcm9tICcuT2JqZWN0LmNyZWF0ZSc7XG5pbXBvcnQgT2JqZWN0X2lzIGZyb20gJy5PYmplY3QuaXMnO1xuaW1wb3J0IE9iamVjdF9kZWZpbmVQcm9wZXJ0eSBmcm9tICcuT2JqZWN0LmRlZmluZVByb3BlcnR5JztcbmltcG9ydCBPYmplY3RfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIGZyb20gJy5PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJztcbmltcG9ydCBPYmplY3RfZGVmaW5lUHJvcGVydGllcyBmcm9tICcuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMnO1xuaW1wb3J0IE9iamVjdF9mcm9tRW50cmllcyBmcm9tICcuT2JqZWN0LmZyb21FbnRyaWVzJztcbmltcG9ydCBPYmplY3RfZnJlZXplIGZyb20gJy5PYmplY3QuZnJlZXplJztcbmltcG9ydCBQcm94eSBmcm9tICcuUHJveHknO1xuaW1wb3J0IFJlZmxlY3RfYXBwbHkgZnJvbSAnLlJlZmxlY3QuYXBwbHknO1xuaW1wb3J0IFJlZmxlY3RfY29uc3RydWN0IGZyb20gJy5SZWZsZWN0LmNvbnN0cnVjdCc7XG5pbXBvcnQgUmVmbGVjdF9kZWZpbmVQcm9wZXJ0eSBmcm9tICcuUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSc7XG5pbXBvcnQgUmVmbGVjdF9kZWxldGVQcm9wZXJ0eSBmcm9tICcuUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSc7XG5pbXBvcnQgUmVmbGVjdF9zZXQgZnJvbSAnLlJlZmxlY3Quc2V0JztcbmltcG9ydCBSZWZsZWN0X293bktleXMgZnJvbSAnLlJlZmxlY3Qub3duS2V5cyc7XG5pbXBvcnQgU2V0IGZyb20gJy5TZXQnO1xuaW1wb3J0IFR5cGVFcnJvciBmcm9tICcuVHlwZUVycm9yJztcbmltcG9ydCBXZWFrTWFwIGZyb20gJy5XZWFrTWFwJztcbmltcG9ydCB1bmRlZmluZWQgZnJvbSAnLnVuZGVmaW5lZCc7XG5pbXBvcnQgaXNBcnJheSBmcm9tICcuQXJyYXkuaXNBcnJheSc7XG5cbmltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgIFxuXG5jb25zdCBLZWVwZXIgPSBTZXQ7XG5jb25zdCB0YXJnZXQya2VlcGVyICAgICAgICAgICAgICAgICAgICAgICAgICA9IG5ldyBXZWFrTWFwO1xuY29uc3QgcHJveHkydGFyZ2V0ICAgICAgICAgICAgICAgICAgICAgICAgID0gbmV3IFdlYWtNYXA7XG5jb25zdCB0YXJnZXQycHJveHkgICAgICAgICAgICAgICAgICAgICAgICAgPSBuZXcgV2Vha01hcDtcblxuY29uc3Qgc2V0RGVzY3JpcHRvciA9IC8qI19fUFVSRV9fKi9PYmplY3RfYXNzaWduKE9iamVjdF9jcmVhdGUobnVsbCksIHtcblx0dmFsdWU6IHVuZGVmaW5lZCxcblx0d3JpdGFibGU6IHRydWUsXG5cdGVudW1lcmFibGU6IHRydWUsXG5cdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbn0pO1xuY29uc3QgaGFuZGxlcnMgPSAvKiNfX1BVUkVfXyovT2JqZWN0X2Fzc2lnbihPYmplY3RfY3JlYXRlKG51bGwpLCB7XG5cdGFwcGx5IChGdW5jdGlvbiAgICAgICAgICAgICAgICAgICAgICAgICAgICwgdGhpc0FyZyAgICAgLCBhcmdzICAgICAgICkge1xuXHRcdHJldHVybiBvcmRlcmlmeShSZWZsZWN0X2FwcGx5KEZ1bmN0aW9uLCB0aGlzQXJnLCBhcmdzKSk7XG5cdH0sXG5cdGNvbnN0cnVjdCAoQ2xhc3MgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLCBhcmdzICAgICAgICwgbmV3VGFyZ2V0ICAgICApIHtcblx0XHRyZXR1cm4gb3JkZXJpZnkoUmVmbGVjdF9jb25zdHJ1Y3QoQ2xhc3MsIGFyZ3MsIG5ld1RhcmdldCkpO1xuXHR9LFxuXHRkZWZpbmVQcm9wZXJ0eSAodGFyZ2V0ICAgICwga2V5ICAgICAsIGRlc2NyaXB0b3IgICAgICAgICAgICAgICAgICAgICkgICAgICAgICAge1xuXHRcdGlmICggUmVmbGVjdF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgUGFydGlhbERlc2NyaXB0b3IoZGVzY3JpcHRvcikpICkge1xuXHRcdFx0dGFyZ2V0MmtlZXBlci5nZXQodGFyZ2V0KSAuYWRkKGtleSk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHRkZWxldGVQcm9wZXJ0eSAodGFyZ2V0ICAgICwga2V5ICAgICApICAgICAgICAgIHtcblx0XHRpZiAoIFJlZmxlY3RfZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBrZXkpICkge1xuXHRcdFx0dGFyZ2V0MmtlZXBlci5nZXQodGFyZ2V0KSAuZGVsZXRlKGtleSk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHRvd25LZXlzICh0YXJnZXQgICAgKSAgICAgICAge1xuXHRcdHJldHVybiBbIC4uLnRhcmdldDJrZWVwZXIuZ2V0KHRhcmdldCkgIF07XG5cdH0sXG5cdHNldCAodGFyZ2V0ICAgICwga2V5ICAgICAsIHZhbHVlICAgICAsIHJlY2VpdmVyICAgICkgICAgICAgICAge1xuXHRcdGlmICgga2V5IGluIHRhcmdldCApIHsgcmV0dXJuIFJlZmxlY3Rfc2V0KHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpOyB9XG5cdFx0c2V0RGVzY3JpcHRvci52YWx1ZSA9IHZhbHVlO1xuXHRcdGlmICggUmVmbGVjdF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc2V0RGVzY3JpcHRvcikgKSB7XG5cdFx0XHR0YXJnZXQya2VlcGVyLmdldCh0YXJnZXQpIC5hZGQoa2V5KTtcblx0XHRcdHNldERlc2NyaXB0b3IudmFsdWUgPSB1bmRlZmluZWQ7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRzZXREZXNjcmlwdG9yLnZhbHVlID0gdW5kZWZpbmVkO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fSxcbn0pO1xuXG5mdW5jdGlvbiBuZXdQcm94eSAgICAgICAgICAgICAgICAgICAodGFyZ2V0ICAgLCBrZWVwZXIgICAgICAgICkgICAge1xuXHR0YXJnZXQya2VlcGVyLnNldCh0YXJnZXQsIGtlZXBlcik7XG5cdGNvbnN0IHByb3h5ICAgID0gbmV3IFByb3h5KHRhcmdldCwgaGFuZGxlcnMpO1xuXHRwcm94eTJ0YXJnZXQuc2V0KHByb3h5LCB0YXJnZXQpO1xuXHRyZXR1cm4gcHJveHk7XG59XG5cbmV4cG9ydCBjb25zdCB7IGlzT3JkZXJlZCB9ID0ge1xuXHRpc09yZGVyZWQgKG9iamVjdCAgICAgICAgKSAgICAgICAgICB7XG5cdFx0cmV0dXJuIHByb3h5MnRhcmdldC5oYXMob2JqZWN0KTtcblx0fVxufTtcbmV4cG9ydCBjb25zdCB7IGlzIH0gPSB7XG5cdGlzIChvYmplY3QxICAgICAgICAsIG9iamVjdDIgICAgICAgICkgICAgICAgICAge1xuXHRcdHJldHVybiBPYmplY3RfaXMoXG5cdFx0XHRwcm94eTJ0YXJnZXQuZ2V0KG9iamVjdDEpIHx8IG9iamVjdDEsXG5cdFx0XHRwcm94eTJ0YXJnZXQuZ2V0KG9iamVjdDIpIHx8IG9iamVjdDIsXG5cdFx0KTtcblx0fVxufTtcblxuZXhwb3J0IGNvbnN0IHsgb3JkZXJpZnkgfSA9IHtcblx0b3JkZXJpZnkgICAgICAgICAgICAgICAgICAgKG9iamVjdCAgICkgICAge1xuXHRcdGlmICggcHJveHkydGFyZ2V0LmhhcyhvYmplY3QpICkgeyByZXR1cm4gb2JqZWN0OyB9XG5cdFx0bGV0IHByb3h5ICAgICAgICAgICAgICAgID0gdGFyZ2V0MnByb3h5LmdldChvYmplY3QpICAgICAgICAgICAgICAgICA7XG5cdFx0aWYgKCBwcm94eSApIHsgcmV0dXJuIHByb3h5OyB9XG5cdFx0cHJveHkgPSBuZXdQcm94eShvYmplY3QsIG5ldyBLZWVwZXIoUmVmbGVjdF9vd25LZXlzKG9iamVjdCkpKTtcblx0XHR0YXJnZXQycHJveHkuc2V0KG9iamVjdCwgcHJveHkpO1xuXHRcdHJldHVybiBwcm94eTtcblx0fVxufTtcbmZ1bmN0aW9uIGdldEludGVybmFsIChvYmplY3QgICAgICAgICkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuXHRjb25zdCB0YXJnZXQgPSBwcm94eTJ0YXJnZXQuZ2V0KG9iamVjdCk7XG5cdGlmICggdGFyZ2V0ICkgeyByZXR1cm4geyB0YXJnZXQsIGtlZXBlcjogdGFyZ2V0MmtlZXBlci5nZXQodGFyZ2V0KSAsIHByb3h5OiBvYmplY3QgfTsgfVxuXHRsZXQgcHJveHkgPSB0YXJnZXQycHJveHkuZ2V0KG9iamVjdCk7XG5cdGlmICggcHJveHkgKSB7IHJldHVybiB7IHRhcmdldDogb2JqZWN0LCBrZWVwZXI6IHRhcmdldDJrZWVwZXIuZ2V0KG9iamVjdCkgLCBwcm94eSB9OyB9XG5cdGNvbnN0IGtlZXBlciAgICAgICAgID0gbmV3IEtlZXBlcihSZWZsZWN0X293bktleXMob2JqZWN0KSk7XG5cdHRhcmdldDJwcm94eS5zZXQob2JqZWN0LCBwcm94eSA9IG5ld1Byb3h5KG9iamVjdCwga2VlcGVyKSk7XG5cdHJldHVybiB7IHRhcmdldDogb2JqZWN0LCBrZWVwZXIsIHByb3h5IH07XG59XG5cbmZ1bmN0aW9uIFBhcnRpYWxEZXNjcmlwdG9yICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzb3VyY2UgICApICAgIHtcblx0Y29uc3QgdGFyZ2V0ICAgID0gT2JqZWN0X2NyZWF0ZShudWxsKTtcblx0aWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykgKSB7XG5cdFx0dGFyZ2V0LnZhbHVlID0gc291cmNlLnZhbHVlO1xuXHRcdGlmICggc291cmNlLmhhc093blByb3BlcnR5KCd3cml0YWJsZScpICkgeyB0YXJnZXQud3JpdGFibGUgPSBzb3VyY2Uud3JpdGFibGU7IH1cblx0fVxuXHRlbHNlIGlmICggc291cmNlLmhhc093blByb3BlcnR5KCd3cml0YWJsZScpICkgeyB0YXJnZXQud3JpdGFibGUgPSBzb3VyY2Uud3JpdGFibGU7IH1cblx0ZWxzZSBpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgnZ2V0JykgKSB7XG5cdFx0dGFyZ2V0LmdldCA9IHNvdXJjZS5nZXQ7XG5cdFx0aWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ3NldCcpICkgeyB0YXJnZXQuc2V0ID0gc291cmNlLnNldDsgfVxuXHR9XG5cdGVsc2UgaWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ3NldCcpICkgeyB0YXJnZXQuc2V0ID0gc291cmNlLnNldDsgfVxuXHRpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgnZW51bWVyYWJsZScpICkgeyB0YXJnZXQuZW51bWVyYWJsZSA9IHNvdXJjZS5lbnVtZXJhYmxlOyB9XG5cdGlmICggc291cmNlLmhhc093blByb3BlcnR5KCdjb25maWd1cmFibGUnKSApIHsgdGFyZ2V0LmNvbmZpZ3VyYWJsZSA9IHNvdXJjZS5jb25maWd1cmFibGU7IH1cblx0cmV0dXJuIHRhcmdldDtcbn1cbmZ1bmN0aW9uIEludGVybmFsRGVzY3JpcHRvciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc291cmNlICAgKSAgICB7XG5cdGNvbnN0IHRhcmdldCAgICA9IE9iamVjdF9jcmVhdGUobnVsbCk7XG5cdGlmICggc291cmNlLmhhc093blByb3BlcnR5KCd2YWx1ZScpICkge1xuXHRcdHRhcmdldC52YWx1ZSA9IHNvdXJjZS52YWx1ZTtcblx0XHR0YXJnZXQud3JpdGFibGUgPSBzb3VyY2Uud3JpdGFibGU7XG5cdH1cblx0ZWxzZSB7XG5cdFx0dGFyZ2V0LmdldCA9IHNvdXJjZS5nZXQ7XG5cdFx0dGFyZ2V0LnNldCA9IHNvdXJjZS5zZXQ7XG5cdH1cblx0dGFyZ2V0LmVudW1lcmFibGUgPSBzb3VyY2UuZW51bWVyYWJsZTtcblx0dGFyZ2V0LmNvbmZpZ3VyYWJsZSA9IHNvdXJjZS5jb25maWd1cmFibGU7XG5cdHJldHVybiB0YXJnZXQ7XG59XG5mdW5jdGlvbiBFeHRlcm5hbERlc2NyaXB0b3IgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNvdXJjZSAgICkgICAge1xuXHRjb25zdCB0YXJnZXQgICAgPSBPYmplY3RfY3JlYXRlKG51bGwpO1xuXHRpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSApIHsgdGFyZ2V0LnZhbHVlID0gc291cmNlLnZhbHVlOyB9XG5cdGlmICggc291cmNlLmhhc093blByb3BlcnR5KCd3cml0YWJsZScpICkgeyB0YXJnZXQud3JpdGFibGUgPSBzb3VyY2Uud3JpdGFibGU7IH1cblx0aWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ2dldCcpICkgeyB0YXJnZXQuZ2V0ID0gc291cmNlLmdldDsgfVxuXHRpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgnc2V0JykgKSB7IHRhcmdldC5zZXQgPSBzb3VyY2Uuc2V0OyB9XG5cdGlmICggc291cmNlLmhhc093blByb3BlcnR5KCdlbnVtZXJhYmxlJykgKSB7IHRhcmdldC5lbnVtZXJhYmxlID0gc291cmNlLmVudW1lcmFibGU7IH1cblx0aWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ2NvbmZpZ3VyYWJsZScpICkgeyB0YXJnZXQuY29uZmlndXJhYmxlID0gc291cmNlLmNvbmZpZ3VyYWJsZTsgfVxuXHRyZXR1cm4gdGFyZ2V0O1xufVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbmV4cG9ydCBjb25zdCB7IGNyZWF0ZSB9ID0ge1xuXHRjcmVhdGUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHByb3RvICAgICAgICAgICwgZGVzY3JpcHRvck1hcCAgICAgKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcblx0XHRpZiAoIGRlc2NyaXB0b3JNYXA9PT11bmRlZmluZWQgKSB7IHJldHVybiBuZXdQcm94eShPYmplY3RfY3JlYXRlKHByb3RvKSwgbmV3IEtlZXBlcik7IH1cblx0XHRjb25zdCB0YXJnZXQgPSBPYmplY3RfY3JlYXRlKHByb3RvKTtcblx0XHRjb25zdCBrZWVwZXIgICAgICAgICA9IG5ldyBLZWVwZXI7XG5cdFx0Zm9yICggbGV0IGxhc3RJbmRleCAgICAgICAgID0gYXJndW1lbnRzLmxlbmd0aC0xLCBpbmRleCAgICAgICAgID0gMTsgOyBkZXNjcmlwdG9yTWFwID0gYXJndW1lbnRzWysraW5kZXhdICkge1xuXHRcdFx0Y29uc3Qga2V5cyA9IFJlZmxlY3Rfb3duS2V5cyhkZXNjcmlwdG9yTWFwICk7XG5cdFx0XHRmb3IgKCBsZXQgbGVuZ3RoICAgICAgICAgPSBrZXlzLmxlbmd0aCwgaW5kZXggICAgICAgICA9IDA7IGluZGV4PGxlbmd0aDsgKytpbmRleCApIHtcblx0XHRcdFx0Y29uc3Qga2V5ID0ga2V5c1tpbmRleF07XG5cdFx0XHRcdE9iamVjdF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgRXh0ZXJuYWxEZXNjcmlwdG9yKGRlc2NyaXB0b3JNYXAgW2tleV0pKTtcblx0XHRcdFx0a2VlcGVyLmFkZChrZXkpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCBpbmRleD09PWxhc3RJbmRleCApIHsgcmV0dXJuIG5ld1Byb3h5KHRhcmdldCwga2VlcGVyKTsgfVxuXHRcdH1cblx0fVxufTtcbmV4cG9ydCBjb25zdCB7IGRlZmluZVByb3BlcnRpZXMgfSA9IHtcblx0ZGVmaW5lUHJvcGVydGllcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9iamVjdCAgICwgZGVzY3JpcHRvck1hcCAgICApICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuXHRcdGNvbnN0IHsgdGFyZ2V0LCBrZWVwZXIsIHByb3h5IH0gPSBnZXRJbnRlcm5hbChvYmplY3QpO1xuXHRcdGZvciAoIGxldCBsYXN0SW5kZXggICAgICAgICA9IGFyZ3VtZW50cy5sZW5ndGgtMSwgaW5kZXggICAgICAgICA9IDE7IDsgZGVzY3JpcHRvck1hcCA9IGFyZ3VtZW50c1srK2luZGV4XSApIHtcblx0XHRcdGNvbnN0IGtleXMgPSBSZWZsZWN0X293bktleXMoZGVzY3JpcHRvck1hcCk7XG5cdFx0XHRmb3IgKCBsZXQgbGVuZ3RoICAgICAgICAgPSBrZXlzLmxlbmd0aCwgaW5kZXggICAgICAgICA9IDA7IGluZGV4PGxlbmd0aDsgKytpbmRleCApIHtcblx0XHRcdFx0Y29uc3Qga2V5ID0ga2V5c1tpbmRleF07XG5cdFx0XHRcdE9iamVjdF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgRXh0ZXJuYWxEZXNjcmlwdG9yKGRlc2NyaXB0b3JNYXBba2V5XSkpO1xuXHRcdFx0XHRrZWVwZXIuYWRkKGtleSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIGluZGV4PT09bGFzdEluZGV4ICkgeyByZXR1cm4gcHJveHk7IH1cblx0XHR9XG5cdH1cbn07XG5cbmV4cG9ydCBjb25zdCB7IGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgfSA9IHtcblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyAgICAgICAgICAgICAgICAgICAob2JqZWN0ICAgKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG5cdFx0Y29uc3QgZGVzY3JpcHRvcnMgPSBPYmplY3RfY3JlYXRlKG51bGwpO1xuXHRcdGNvbnN0IGtlZXBlciAgICAgICAgID0gbmV3IEtlZXBlcjtcblx0XHRjb25zdCBrZXlzID0gUmVmbGVjdF9vd25LZXlzKG9iamVjdCk7XG5cdFx0Zm9yICggbGV0IGxlbmd0aCAgICAgICAgID0ga2V5cy5sZW5ndGgsIGluZGV4ICAgICAgICAgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0XHRjb25zdCBrZXkgPSBrZXlzW2luZGV4XTtcblx0XHRcdGRlc2NyaXB0b3JzW2tleV0gPSBJbnRlcm5hbERlc2NyaXB0b3IoT2JqZWN0X2dldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIGtleSkgKTtcblx0XHRcdGtlZXBlci5hZGQoa2V5KTtcblx0XHR9XG5cdFx0cmV0dXJuIG5ld1Byb3h5KGRlc2NyaXB0b3JzLCBrZWVwZXIpO1xuXHR9XG59O1xuXG5mdW5jdGlvbiBrZWVwZXJBZGRLZXlzIChrZWVwZXIgICAgICAgICwgb2JqZWN0ICAgICkgICAgICAge1xuXHRjb25zdCBrZXlzICAgICAgICA9IFJlZmxlY3Rfb3duS2V5cyhvYmplY3QpO1xuXHRmb3IgKCBsZXQgbGVuZ3RoICAgICAgICAgPSBrZXlzLmxlbmd0aCwgaW5kZXggICAgICAgICA9IDA7IGluZGV4PGxlbmd0aDsgKytpbmRleCApIHtcblx0XHRrZWVwZXIuYWRkKGtleXNbaW5kZXhdKTtcblx0fVxufVxuZnVuY3Rpb24gTlVMTF9mcm9tIChzb3VyY2UgICAgICAgICAgICwgZGVmaW5lICAgICAgICAgKSAgICAgIHtcblx0Y29uc3QgdGFyZ2V0ID0gT2JqZWN0X2NyZWF0ZShudWxsKTtcblx0Y29uc3Qga2VlcGVyICAgICAgICAgPSBuZXcgS2VlcGVyO1xuXHRpZiAoIGRlZmluZSApIHtcblx0XHRpZiAoIGlzQXJyYXkoc291cmNlKSApIHtcblx0XHRcdGZvciAoIGxldCBsZW5ndGggICAgICAgICA9IHNvdXJjZS5sZW5ndGgsIGluZGV4ICAgICAgICAgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0XHRcdGNvbnN0IGRlc2NyaXB0b3JNYXAgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZVtpbmRleF0pO1xuXHRcdFx0XHRPYmplY3RfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIGRlc2NyaXB0b3JNYXApO1xuXHRcdFx0XHRrZWVwZXJBZGRLZXlzKGtlZXBlciwgZGVzY3JpcHRvck1hcCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Y29uc3QgZGVzY3JpcHRvck1hcCA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKTtcblx0XHRcdE9iamVjdF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgZGVzY3JpcHRvck1hcCk7XG5cdFx0XHRrZWVwZXJBZGRLZXlzKGtlZXBlciwgZGVzY3JpcHRvck1hcCk7XG5cdFx0fVxuXHR9XG5cdGVsc2Uge1xuXHRcdGlmICggaXNBcnJheShzb3VyY2UpICkge1xuXHRcdFx0T2JqZWN0X2Fzc2lnbih0YXJnZXQsIC4uLnNvdXJjZSk7XG5cdFx0XHRmb3IgKCBsZXQgbGVuZ3RoICAgICAgICAgPSBzb3VyY2UubGVuZ3RoLCBpbmRleCAgICAgICAgID0gMDsgaW5kZXg8bGVuZ3RoOyArK2luZGV4ICkge1xuXHRcdFx0XHRrZWVwZXJBZGRLZXlzKGtlZXBlciwgc291cmNlW2luZGV4XSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0T2JqZWN0X2Fzc2lnbih0YXJnZXQsIHNvdXJjZSk7XG5cdFx0XHRrZWVwZXJBZGRLZXlzKGtlZXBlciwgc291cmNlKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG5ld1Byb3h5KHRhcmdldCwga2VlcGVyKTtcbn1cbmZ1bmN0aW9uIHRocm93Q29uc3RydWN0aW5nICgpICAgICAgICB7IHRocm93IFR5cGVFcnJvcihgTlVMTCBjYW5ub3QgYmUgaW52b2tlZCB3aXRoICduZXcnYCk7IH1cbmV4cG9ydCBjb25zdCBOVUxMICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9XG5cdC8qI19fUFVSRV9fKi9cblx0ZnVuY3Rpb24gKCAgICAgICAgICkge1xuXHRcdCd1c2Ugc3RyaWN0Jztcblx0XHRjb25zdCBOVUxMICAgICAgPSBmdW5jdGlvbiAgICAgICAgICAgICAgICAoICAgICAgICAgICAgICBzb3VyY2UgICAgICAgICAgLCBkZWZpbmUgICAgICAgICAgKSAgICB7XG5cdFx0XHRyZXR1cm4gbmV3LnRhcmdldFxuXHRcdFx0XHQ/IG5ldy50YXJnZXQ9PT1OVUxMXG5cdFx0XHRcdFx0PyAvKiNfX1BVUkVfXyovIHRocm93Q29uc3RydWN0aW5nKClcblx0XHRcdFx0XHQ6IC8qI19fUFVSRV9fKi8gbmV3UHJveHkodGhpcywgbmV3IEtlZXBlcilcblx0XHRcdFx0OiAvKiNfX1BVUkVfXyovIE5VTExfZnJvbShzb3VyY2UgLCBkZWZpbmUgKTtcblx0XHR9O1xuXHRcdE5VTEwucHJvdG90eXBlID0gbnVsbDtcblx0XHQvL2RlbGV0ZSBOVUxMLm5hbWU7XG5cdFx0Ly9kZWxldGUgTlVMTC5sZW5ndGg7XG5cdFx0T2JqZWN0X2ZyZWV6ZShOVUxMKTtcblx0XHRyZXR1cm4gTlVMTDtcblx0fSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5jb25zdCBQcm9wZXJ0eUtleSAgICAgID1cblx0LyojX19QVVJFX18qLyBuZXcgUHJveHkoe30sIHsgZ2V0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRhcmdldCAgICAsIGtleSAgICAgKSAgICAgIHsgcmV0dXJuIGtleTsgfSB9KTtcbmV4cG9ydCBjb25zdCB7IGZyb21FbnRyaWVzIH0gPSB7XG5cdGZyb21FbnRyaWVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlbnRyaWVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsIHByb3RvICAgICAgICAgICApICAgICAgICAgICAgICAgICAgICAgIHtcblx0XHRjb25zdCBrZWVwZXIgICAgICAgICA9IG5ldyBLZWVwZXI7XG5cdFx0Y29uc3QgbWFwICAgICAgICAgICAgPSBuZXcgTWFwO1xuXHRcdGZvciAoIGxldCB7IDA6IGtleSwgMTogdmFsdWUgfSBvZiBlbnRyaWVzICkge1xuXHRcdFx0a2V5ID0gUHJvcGVydHlLZXlba2V5XTtcblx0XHRcdGtlZXBlci5hZGQoa2V5KTtcblx0XHRcdG1hcC5zZXQoa2V5LCB2YWx1ZSk7XG5cdFx0fVxuXHRcdGNvbnN0IHRhcmdldCA9IE9iamVjdF9mcm9tRW50cmllcyhtYXApO1xuXHRcdHJldHVybiBuZXdQcm94eShcblx0XHRcdHByb3RvPT09dW5kZWZpbmVkID8gdGFyZ2V0IDpcblx0XHRcdFx0cHJvdG89PT1udWxsID8gT2JqZWN0X2Fzc2lnbihPYmplY3RfY3JlYXRlKG51bGwpLCB0YXJnZXQpIDpcblx0XHRcdFx0XHRPYmplY3RfY3JlYXRlKHRhcmdldCwgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhwcm90bykpLFxuXHRcdFx0a2VlcGVyXG5cdFx0KTtcblx0fVxufTtcblxuaW1wb3J0IERlZmF1bHQgZnJvbSAnLmRlZmF1bHQnO1xuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdCh7XG5cdHZlcnNpb24sXG5cdGlzT3JkZXJlZCxcblx0aXMsXG5cdG9yZGVyaWZ5LFxuXHRjcmVhdGUsXG5cdGRlZmluZVByb3BlcnRpZXMsXG5cdE5VTEwsXG5cdGZyb21FbnRyaWVzLFxuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzLFxufSk7XG4iXSwibmFtZXMiOlsidW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUJBQWUsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBQyx4QkM4QnZCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQztDQUNuQixNQUFNLGFBQWEsNEJBQTRCLElBQUksT0FBTyxDQUFDO0NBQzNELE1BQU0sWUFBWSwyQkFBMkIsSUFBSSxPQUFPLENBQUM7Q0FDekQsTUFBTSxZQUFZLDJCQUEyQixJQUFJLE9BQU8sQ0FBQzs7Q0FFekQsTUFBTSxhQUFhLGdCQUFnQixhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO0NBQ3RFLENBQUMsS0FBSyxFQUFFQSxXQUFTO0NBQ2pCLENBQUMsUUFBUSxFQUFFLElBQUk7Q0FDZixDQUFDLFVBQVUsRUFBRSxJQUFJO0NBQ2pCLENBQUMsWUFBWSxFQUFFLElBQUk7Q0FDbkIsQ0FBQyxDQUFDLENBQUM7Q0FDSCxNQUFNLFFBQVEsZ0JBQWdCLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUU7Q0FDakUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLDZCQUE2QixPQUFPLE9BQU8sSUFBSSxTQUFTO0NBQ3hFLEVBQUUsT0FBTyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztDQUMxRCxFQUFFO0NBQ0YsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLGlDQUFpQyxJQUFJLFNBQVMsU0FBUyxPQUFPO0NBQy9FLEVBQUUsT0FBTyxRQUFRLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0NBQzdELEVBQUU7Q0FDRixDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sTUFBTSxHQUFHLE9BQU8sVUFBVSwrQkFBK0I7Q0FDaEYsRUFBRSxLQUFLLHNCQUFzQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRztDQUM1RSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ3ZDLEdBQUcsT0FBTyxJQUFJLENBQUM7Q0FDZixHQUFHO0NBQ0gsRUFBRSxPQUFPLEtBQUssQ0FBQztDQUNmLEVBQUU7Q0FDRixDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sTUFBTSxHQUFHLGdCQUFnQjtDQUNoRCxFQUFFLEtBQUssc0JBQXNCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHO0NBQzdDLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDMUMsR0FBRyxPQUFPLElBQUksQ0FBQztDQUNmLEdBQUc7Q0FDSCxFQUFFLE9BQU8sS0FBSyxDQUFDO0NBQ2YsRUFBRTtDQUNGLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxhQUFhO0NBQzdCLEVBQUUsT0FBTyxFQUFFLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0NBQzNDLEVBQUU7Q0FDRixDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sTUFBTSxHQUFHLE9BQU8sS0FBSyxPQUFPLFFBQVEsZUFBZTtDQUMvRCxFQUFFLEtBQUssR0FBRyxJQUFJLE1BQU0sR0FBRyxFQUFFLE9BQU8sV0FBVyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7Q0FDNUUsRUFBRSxhQUFhLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztDQUM5QixFQUFFLEtBQUssc0JBQXNCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxhQUFhLENBQUMsR0FBRztDQUM1RCxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ3ZDLEdBQUcsYUFBYSxDQUFDLEtBQUssR0FBR0EsV0FBUyxDQUFDO0NBQ25DLEdBQUcsT0FBTyxJQUFJLENBQUM7Q0FDZixHQUFHO0NBQ0gsT0FBTztDQUNQLEdBQUcsYUFBYSxDQUFDLEtBQUssR0FBR0EsV0FBUyxDQUFDO0NBQ25DLEdBQUcsT0FBTyxLQUFLLENBQUM7Q0FDaEIsR0FBRztDQUNILEVBQUU7Q0FDRixDQUFDLENBQUMsQ0FBQzs7Q0FFSCxTQUFTLFFBQVEsb0JBQW9CLE1BQU0sS0FBSyxNQUFNLGFBQWE7Q0FDbkUsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztDQUNuQyxDQUFDLE1BQU0sS0FBSyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztDQUM5QyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0NBQ2pDLENBQUMsT0FBTyxLQUFLLENBQUM7Q0FDZCxDQUFDOztBQUVELENBQU8sTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHO0NBQzdCLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxtQkFBbUI7Q0FDckMsRUFBRSxPQUFPLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Q0FDbEMsRUFBRTtDQUNGLENBQUMsQ0FBQztBQUNGLENBQU8sTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHO0NBQ3RCLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxVQUFVLE9BQU8sbUJBQW1CO0NBQ2hELEVBQUUsT0FBTyxTQUFTO0NBQ2xCLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxPQUFPO0NBQ3ZDLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxPQUFPO0NBQ3ZDLEdBQUcsQ0FBQztDQUNKLEVBQUU7Q0FDRixDQUFDLENBQUM7O0FBRUYsQ0FBTyxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUc7Q0FDNUIsQ0FBQyxRQUFRLG1CQUFtQixDQUFDLE1BQU0sUUFBUTtDQUMzQyxFQUFFLEtBQUssWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE9BQU8sTUFBTSxDQUFDLEVBQUU7Q0FDcEQsRUFBRSxJQUFJLEtBQUssa0JBQWtCLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGtCQUFrQjtDQUN2RSxFQUFFLEtBQUssS0FBSyxHQUFHLEVBQUUsT0FBTyxLQUFLLENBQUMsRUFBRTtDQUNoQyxFQUFFLEtBQUssR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksTUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDaEUsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztDQUNsQyxFQUFFLE9BQU8sS0FBSyxDQUFDO0NBQ2YsRUFBRTtDQUNGLENBQUMsQ0FBQztDQUNGLFNBQVMsV0FBVyxFQUFFLE1BQU0sdURBQXVEO0NBQ25GLENBQUMsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztDQUN6QyxDQUFDLEtBQUssTUFBTSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTtDQUN4RixDQUFDLElBQUksS0FBSyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Q0FDdEMsQ0FBQyxLQUFLLEtBQUssR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEVBQUU7Q0FDdkYsQ0FBQyxNQUFNLE1BQU0sV0FBVyxJQUFJLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztDQUM1RCxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7Q0FDNUQsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUM7Q0FDMUMsQ0FBQzs7Q0FFRCxTQUFTLGlCQUFpQixnQ0FBZ0MsTUFBTSxRQUFRO0NBQ3hFLENBQUMsTUFBTSxNQUFNLE1BQU0sYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ3ZDLENBQUMsS0FBSyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHO0NBQ3ZDLEVBQUUsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO0NBQzlCLEVBQUUsS0FBSyxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7Q0FDakYsRUFBRTtDQUNGLE1BQU0sS0FBSyxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7Q0FDckYsTUFBTSxLQUFLLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUc7Q0FDMUMsRUFBRSxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7Q0FDMUIsRUFBRSxLQUFLLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtDQUNsRSxFQUFFO0NBQ0YsTUFBTSxLQUFLLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtDQUN0RSxDQUFDLEtBQUssTUFBTSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFO0NBQ3RGLENBQUMsS0FBSyxNQUFNLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUU7Q0FDNUYsQ0FBQyxPQUFPLE1BQU0sQ0FBQztDQUNmLENBQUM7Q0FDRCxTQUFTLGtCQUFrQixnQ0FBZ0MsTUFBTSxRQUFRO0NBQ3pFLENBQUMsTUFBTSxNQUFNLE1BQU0sYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ3ZDLENBQUMsS0FBSyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHO0NBQ3ZDLEVBQUUsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO0NBQzlCLEVBQUUsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0NBQ3BDLEVBQUU7Q0FDRixNQUFNO0NBQ04sRUFBRSxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7Q0FDMUIsRUFBRSxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7Q0FDMUIsRUFBRTtDQUNGLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0NBQ3ZDLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO0NBQzNDLENBQUMsT0FBTyxNQUFNLENBQUM7Q0FDZixDQUFDO0NBQ0QsU0FBUyxrQkFBa0IsZ0NBQWdDLE1BQU0sUUFBUTtDQUN6RSxDQUFDLE1BQU0sTUFBTSxNQUFNLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUN2QyxDQUFDLEtBQUssTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO0NBQ3ZFLENBQUMsS0FBSyxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7Q0FDaEYsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtDQUNqRSxDQUFDLEtBQUssTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0NBQ2pFLENBQUMsS0FBSyxNQUFNLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUU7Q0FDdEYsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRTtDQUM1RixDQUFDLE9BQU8sTUFBTSxDQUFDO0NBQ2YsQ0FBQzs7Q0FFRDtBQUNBLENBQU8sTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHO0NBQzFCLENBQUMsTUFBTSwwREFBMEQsQ0FBQyxLQUFLLFlBQVksYUFBYSx3RUFBd0U7Q0FDeEssRUFBRSxLQUFLLGFBQWEsR0FBR0EsV0FBUyxHQUFHLEVBQUUsT0FBTyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLENBQUMsRUFBRTtDQUN6RixFQUFFLE1BQU0sTUFBTSxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztDQUN0QyxFQUFFLE1BQU0sTUFBTSxXQUFXLElBQUksTUFBTSxDQUFDO0NBQ3BDLEVBQUUsTUFBTSxJQUFJLFNBQVMsV0FBVyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxLQUFLLFdBQVcsQ0FBQyxJQUFJLGFBQWEsR0FBRyxTQUFTLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRztDQUM5RyxHQUFHLE1BQU0sSUFBSSxHQUFHLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztDQUNoRCxHQUFHLE1BQU0sSUFBSSxNQUFNLFdBQVcsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLFdBQVcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxLQUFLLEdBQUc7Q0FDdEYsSUFBSSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Q0FDNUIsSUFBSSxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDaEYsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ3BCLElBQUk7Q0FDSixHQUFHLEtBQUssS0FBSyxHQUFHLFNBQVMsR0FBRyxFQUFFLE9BQU8sUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFO0NBQ2hFLEdBQUc7Q0FDSCxFQUFFO0NBQ0YsQ0FBQyxDQUFDO0FBQ0YsQ0FBTyxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsR0FBRztDQUNwQyxDQUFDLGdCQUFnQixxREFBcUQsQ0FBQyxNQUFNLEtBQUssYUFBYSwwRUFBMEU7Q0FDekssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7Q0FDeEQsRUFBRSxNQUFNLElBQUksU0FBUyxXQUFXLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssV0FBVyxDQUFDLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHO0NBQzlHLEdBQUcsTUFBTSxJQUFJLEdBQUcsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0NBQy9DLEdBQUcsTUFBTSxJQUFJLE1BQU0sV0FBVyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssV0FBVyxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssR0FBRztDQUN0RixJQUFJLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztDQUM1QixJQUFJLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUMvRSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDcEIsSUFBSTtDQUNKLEdBQUcsS0FBSyxLQUFLLEdBQUcsU0FBUyxHQUFHLEVBQUUsT0FBTyxLQUFLLENBQUMsRUFBRTtDQUM3QyxHQUFHO0NBQ0gsRUFBRTtDQUNGLENBQUMsQ0FBQzs7QUFFRixDQUFPLE1BQU0sRUFBRSx5QkFBeUIsRUFBRSxHQUFHO0NBQzdDLENBQUMseUJBQXlCLG1CQUFtQixDQUFDLE1BQU0sd0RBQXdEO0NBQzVHLEVBQUUsTUFBTSxXQUFXLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQzFDLEVBQUUsTUFBTSxNQUFNLFdBQVcsSUFBSSxNQUFNLENBQUM7Q0FDcEMsRUFBRSxNQUFNLElBQUksR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7Q0FDdkMsRUFBRSxNQUFNLElBQUksTUFBTSxXQUFXLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxXQUFXLENBQUMsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsS0FBSyxHQUFHO0NBQ3JGLEdBQUcsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0NBQzNCLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLCtCQUErQixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDO0NBQ3hGLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNuQixHQUFHO0NBQ0gsRUFBRSxPQUFPLFFBQVEsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7Q0FDdkMsRUFBRTtDQUNGLENBQUMsQ0FBQzs7Q0FFRixTQUFTLGFBQWEsRUFBRSxNQUFNLFVBQVUsTUFBTSxZQUFZO0NBQzFELENBQUMsTUFBTSxJQUFJLFVBQVUsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0NBQzdDLENBQUMsTUFBTSxJQUFJLE1BQU0sV0FBVyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssV0FBVyxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssR0FBRztDQUNwRixFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Q0FDMUIsRUFBRTtDQUNGLENBQUM7Q0FDRCxTQUFTLFNBQVMsRUFBRSxNQUFNLGFBQWEsTUFBTSxnQkFBZ0I7Q0FDN0QsQ0FBQyxNQUFNLE1BQU0sR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDcEMsQ0FBQyxNQUFNLE1BQU0sV0FBVyxJQUFJLE1BQU0sQ0FBQztDQUNuQyxDQUFDLEtBQUssTUFBTSxHQUFHO0NBQ2YsRUFBRSxLQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRztDQUN6QixHQUFHLE1BQU0sSUFBSSxNQUFNLFdBQVcsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLFdBQVcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxLQUFLLEdBQUc7Q0FDeEYsSUFBSSxNQUFNLGFBQWEsR0FBRyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztDQUNuRSxJQUFJLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztDQUNuRCxJQUFJLGFBQWEsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7Q0FDekMsSUFBSTtDQUNKLEdBQUc7Q0FDSCxPQUFPO0NBQ1AsR0FBRyxNQUFNLGFBQWEsR0FBRyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztDQUMzRCxHQUFHLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztDQUNsRCxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7Q0FDeEMsR0FBRztDQUNILEVBQUU7Q0FDRixNQUFNO0NBQ04sRUFBRSxLQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRztDQUN6QixHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQztDQUNwQyxHQUFHLE1BQU0sSUFBSSxNQUFNLFdBQVcsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLFdBQVcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxLQUFLLEdBQUc7Q0FDeEYsSUFBSSxhQUFhLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0NBQ3pDLElBQUk7Q0FDSixHQUFHO0NBQ0gsT0FBTztDQUNQLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztDQUNqQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7Q0FDakMsR0FBRztDQUNILEVBQUU7Q0FDRixDQUFDLE9BQU8sUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztDQUNqQyxDQUFDO0NBQ0QsU0FBUyxpQkFBaUIsV0FBVyxFQUFFLE1BQU0sU0FBUyxDQUFDLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDOUYsQ0FBTyxNQUFNLElBQUk7Q0FDakI7Q0FDQSxDQUFDLHFCQUFxQjtBQUN0QixDQUNBLEVBQUUsTUFBTSxJQUFJLFFBQVEsdUNBQXVDLE1BQU0sWUFBWSxNQUFNLGVBQWU7Q0FDbEcsR0FBRyxPQUFPLEdBQUcsQ0FBQyxNQUFNO0NBQ3BCLE1BQU0sR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJO0NBQ3ZCLHFCQUFxQixpQkFBaUIsRUFBRTtDQUN4QyxxQkFBcUIsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLE1BQU0sQ0FBQztDQUMvQyxvQkFBb0IsU0FBUyxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQztDQUNoRCxHQUFHLENBQUM7Q0FDSixFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0NBQ3hCO0NBQ0E7Q0FDQSxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUN0QixFQUFFLE9BQU8sSUFBSSxDQUFDO0NBQ2QsRUFBRSxFQUFFLENBQUM7Q0FDTDs7Q0FFQSxNQUFNLFdBQVc7Q0FDakIsZUFBZSxJQUFJLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLDhCQUE4QixDQUFDLE1BQU0sTUFBTSxHQUFHLFlBQVksRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQy9HLENBQU8sTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHO0NBQy9CLENBQUMsV0FBVyw2REFBNkQsQ0FBQyxPQUFPLDhDQUE4QyxLQUFLLGtDQUFrQztDQUN0SyxFQUFFLE1BQU0sTUFBTSxXQUFXLElBQUksTUFBTSxDQUFDO0NBQ3BDLEVBQUUsTUFBTSxHQUFHLGNBQWMsSUFBSSxHQUFHLENBQUM7Q0FDakMsRUFBRSxNQUFNLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxPQUFPLEdBQUc7Q0FDOUMsR0FBRyxHQUFHLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQzFCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNuQixHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0NBQ3ZCLEdBQUc7Q0FDSCxFQUFFLE1BQU0sTUFBTSxHQUFHLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ3pDLEVBQUUsT0FBTyxRQUFRO0NBQ2pCLEdBQUcsS0FBSyxHQUFHQSxXQUFTLEdBQUcsTUFBTTtDQUM3QixJQUFJLEtBQUssR0FBRyxJQUFJLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUM7Q0FDN0QsS0FBSyxhQUFhLENBQUMsTUFBTSxFQUFFLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDO0NBQzVELEdBQUcsTUFBTTtDQUNULEdBQUcsQ0FBQztDQUNKLEVBQUU7Q0FDRixDQUFDLENBQUM7QUFDRixBQUVBLGlCQUFlLE9BQU8sQ0FBQztDQUN2QixDQUFDLE9BQU87Q0FDUixDQUFDLFNBQVM7Q0FDVixDQUFDLEVBQUU7Q0FDSCxDQUFDLFFBQVE7Q0FDVCxDQUFDLE1BQU07Q0FDUCxDQUFDLGdCQUFnQjtDQUNqQixDQUFDLElBQUk7Q0FDTCxDQUFDLFdBQVc7Q0FDWixDQUFDLHlCQUF5QjtDQUMxQixDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Iiwic291cmNlUm9vdCI6Ii4uLy4uL3NyYy8ifQ==