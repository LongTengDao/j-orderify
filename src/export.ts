import Map from '.Map';
import * as Object from '.Object';
import Proxy from '.Proxy';
import * as Reflect from '.Reflect';
import Set from '.Set';
import TypeError from '.TypeError';
import WeakMap from '.WeakMap';
import undefined from '.undefined';
import isArray from '.Array.isArray';

import version from './version?text';
export { version };

type Target = object;
type Proxy = object;
type Key = string | symbol;
type Keeper = Set<Key>;

const Keeper = Set;
const target2keeper :WeakMap<Target, Keeper> = new WeakMap;
const proxy2target :WeakMap<Proxy, Target> = new WeakMap;
const target2proxy :WeakMap<Target, Proxy> = new WeakMap;

const setDescriptor = /*#__PURE__*/Object.assign(Object.create(null), {
	value: undefined,
	writable: true,
	enumerable: true,
	configurable: true,
});
const handlers = /*#__PURE__*/Object.assign(Object.create(null), {
	apply (Function :{ (...args :any[]) :any }, thisArg :any, args :any[]) {
		return orderify(Reflect.apply(Function, thisArg, args));
	},
	construct (Class :{ new (...args :any[]) :any }, args :any[], newTarget :any) {
		return orderify(Reflect.construct(Class, args, newTarget));
	},
	defineProperty (target :{}, key :Key, descriptor :PropertyDescriptor) :boolean {
		if ( Reflect.defineProperty(target, key, PartialDescriptor(descriptor)) ) {
			target2keeper.get(target)!.add(key);
			return true;
		}
		return false;
	},
	deleteProperty (target :{}, key :Key) :boolean {
		if ( Reflect.deleteProperty(target, key) ) {
			target2keeper.get(target)!.delete(key);
			return true;
		}
		return false;
	},
	ownKeys (target :{}) :Key[] {
		return [ ...target2keeper.get(target)! ];
	},
	set (target :{}, key :Key, value :any, receiver :{}) :boolean {
		if ( key in target ) { return Reflect.set(target, key, value, receiver); }
		setDescriptor.value = value;
		if ( Reflect.defineProperty(target, key, setDescriptor) ) {
			target2keeper.get(target)!.add(key);
			setDescriptor.value = undefined;
			return true;
		}
		else {
			setDescriptor.value = undefined;
			return false;
		}
	},
});

function newProxy<O extends object> (target :O, keeper :Keeper) :O {
	target2keeper.set(target, keeper);
	const proxy :O = new Proxy(target, handlers);
	proxy2target.set(proxy, target);
	return proxy;
}

export const { isOrdered } = {
	isOrdered (object :object) :boolean {
		return proxy2target.has(object);
	}
};
export const { is } = {
	is (object1 :object, object2 :object) :boolean {
		return Object.is(
			proxy2target.get(object1) || object1,
			proxy2target.get(object2) || object2,
		);
	}
};

export const { orderify } = {
	orderify<O extends object> (object :O) :O {
		if ( proxy2target.has(object) ) { return object; }
		let proxy :O | undefined = target2proxy.get(object) as O | undefined;
		if ( proxy ) { return proxy; }
		proxy = newProxy(object, new Keeper(Reflect.ownKeys(object)));
		target2proxy.set(object, proxy);
		return proxy;
	}
};
function getInternal (object :object) :{ target :any, keeper :Keeper, proxy :any } {
	const target = proxy2target.get(object);
	if ( target ) { return { target, keeper: target2keeper.get(target)!, proxy: object }; }
	let proxy = target2proxy.get(object);
	if ( proxy ) { return { target: object, keeper: target2keeper.get(object)!, proxy }; }
	const keeper = new Keeper(Reflect.ownKeys(object));
	target2proxy.set(object, proxy = newProxy(object, keeper));
	return { target: object, keeper, proxy };
}

function PartialDescriptor<D extends PropertyDescriptor> (source :D) :D {
	const target :D = Object.create(null);
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
function InternalDescriptor<D extends PropertyDescriptor> (source :D) :D {
	const target :D = Object.create(null);
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
function ExternalDescriptor<D extends PropertyDescriptor> (source :D) :D {
	const target :D = Object.create(null);
	if ( source.hasOwnProperty('value') ) { target.value = source.value; }
	if ( source.hasOwnProperty('writable') ) { target.writable = source.writable; }
	if ( source.hasOwnProperty('get') ) { target.get = source.get; }
	if ( source.hasOwnProperty('set') ) { target.set = source.set; }
	if ( source.hasOwnProperty('enumerable') ) { target.enumerable = source.enumerable; }
	if ( source.hasOwnProperty('configurable') ) { target.configurable = source.configurable; }
	return target;
}

type TypedPropertyDescriptorMap<O> = { [k in keyof O] :TypedPropertyDescriptor<O[k]> };
export const { create } = {
	create<O extends object, OO extends PropertyDescriptorMap = {}> (proto :null | O, descriptorMap? :OO) :( OO extends TypedPropertyDescriptorMap<infer O> ? O : {} ) & O {
		if ( descriptorMap===undefined ) { return newProxy(Object.create(proto), new Keeper); }
		const target = Object.create(proto);
		const keeper :Keeper = new Keeper;
		for ( let lastIndex :number = arguments.length-1, index :number = 1; ; descriptorMap = arguments[++index] ) {
			const keys = Reflect.ownKeys(descriptorMap!);
			for ( let length :number = keys.length, index :number = 0; index<length; ++index ) {
				const key = keys[index];
				Object.defineProperty(target, key, ExternalDescriptor(descriptorMap![key]));
				keeper.add(key);
			}
			if ( index===lastIndex ) { return newProxy(target, keeper); }
		}
	}
};
export const { defineProperties } = {
	defineProperties<O extends object, OO extends PropertyDescriptorMap> (object :O, descriptorMap :OO) :( OO extends TypedPropertyDescriptorMap<infer O> ? O : never ) & O {
		const { target, keeper, proxy } = getInternal(object);
		for ( let lastIndex :number = arguments.length-1, index :number = 1; ; descriptorMap = arguments[++index] ) {
			const keys = Reflect.ownKeys(descriptorMap);
			for ( let length :number = keys.length, index :number = 0; index<length; ++index ) {
				const key = keys[index];
				Object.defineProperty(target, key, ExternalDescriptor(descriptorMap[key]));
				keeper.add(key);
			}
			if ( index===lastIndex ) { return proxy; }
		}
	}
};

export const { getOwnPropertyDescriptors } = {
	getOwnPropertyDescriptors<O extends object> (object :O) :{ [k in keyof O] :TypedPropertyDescriptor<O[k]> } {
		const descriptors = Object.create(null);
		const keeper :Keeper = new Keeper;
		const keys = Reflect.ownKeys(object);
		for ( let length :number = keys.length, index :number = 0; index<length; ++index ) {
			const key = keys[index];
			descriptors[key] = InternalDescriptor(Object.getOwnPropertyDescriptor(object, key)!);
			keeper.add(key);
		}
		return newProxy(descriptors, keeper);
	}
};

function keeperAddKeys (keeper :Keeper, object :{}) :void {
	const keys :Key[] = Reflect.ownKeys(object);
	for ( let length :number = keys.length, index :number = 0; index<length; ++index ) {
		keeper.add(keys[index]);
	}
}
function NULL_from (source :{}[] | {}, define :boolean) :any {
	const target = Object.create(null);
	const keeper :Keeper = new Keeper;
	if ( define ) {
		if ( isArray(source) ) {
			for ( let length :number = source.length, index :number = 0; index<length; ++index ) {
				const descriptorMap = getOwnPropertyDescriptors(source[index]);
				Object.defineProperties(target, descriptorMap);
				keeperAddKeys(keeper, descriptorMap);
			}
		}
		else {
			const descriptorMap = getOwnPropertyDescriptors(source);
			Object.defineProperties(target, descriptorMap);
			keeperAddKeys(keeper, descriptorMap);
		}
	}
	else {
		if ( isArray(source) ) {
			Object.assign(target, ...source);
			for ( let length :number = source.length, index :number = 0; index<length; ++index ) {
				keeperAddKeys(keeper, source[index]);
			}
		}
		else {
			Object.assign(target, source);
			keeperAddKeys(keeper, source);
		}
	}
	return newProxy(target, keeper);
}
function throwConstructing () :never { throw TypeError(`NULL cannot be invoked with 'new'`); }
export const NULL :typeof import('./export.d').NULL =
	/*#__PURE__*/
	function (this :any) {
		'use strict';
		const NULL :any = function <O extends {}> (this :object, source? :O[] | O, define? :boolean) :O {
			return new.target
				? new.target===NULL
					? /*#__PURE__*/ throwConstructing()
					: /*#__PURE__*/ newProxy(this, new Keeper)
				: /*#__PURE__*/ NULL_from(source!, define!);
		};
		NULL.prototype = null;
		//delete NULL.name;
		//delete NULL.length;
		Object.freeze(NULL);
		return NULL;
	}();
export type NULL<ValueType> = import('./export.d').NULL<ValueType>;

const PropertyKey :any =
	/*#__PURE__*/ new Proxy({}, { get<Key extends string | symbol> (target :{}, key :Key) :Key { return key; } });
export const { fromEntries } = {
	fromEntries<K extends string | symbol, V extends any, O extends object> (entries :Iterable<{ readonly 0 :K, readonly 1 :V }>, proto? :null | O) :{ [k in K] :V } & O {
		const keeper :Keeper = new Keeper;
		const map :Map<K, V> = new Map;
		for ( let { 0: key, 1: value } of entries ) {
			key = PropertyKey[key];
			keeper.add(key);
			map.set(key, value);
		}
		const target = Object.fromEntries(map);
		return newProxy(
			proto===undefined ? target :
				proto===null ? Object.assign(Object.create(null), target) :
					Object.create(target, getOwnPropertyDescriptors(proto)),
			keeper
		);
	}
};

export default /*#__PURE__*/ ( function () {
	const exports = Object.create(null);
	Object.assign(exports, {
		version,
		isOrdered,
		is,
		orderify,
		create,
		defineProperties,
		NULL,
		fromEntries,
		getOwnPropertyDescriptors,
		default: exports,
	});
	var descriptor = Object.create(null);
	descriptor.value = 'Module';
	Object.defineProperty(exports, Symbol.toStringTag, descriptor);
	Object.freeze(exports);
	return exports;
} )();