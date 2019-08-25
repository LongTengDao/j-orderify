import Map from '.Map';
import Object_assign from '.Object.assign';
import Object_create from '.Object.create';
import Object_is from '.Object.is';
import Object_defineProperty from '.Object.defineProperty';
import Object_getOwnPropertyDescriptor from '.Object.getOwnPropertyDescriptor';
import Object_fromEntries from '.Object.fromEntries';
import Object_freeze from '.Object.freeze';
import Proxy from '.Proxy';
import Reflect_apply from '.Reflect.apply';
import Reflect_construct from '.Reflect.construct';
import Reflect_defineProperty from '.Reflect.defineProperty';
import Reflect_deleteProperty from '.Reflect.deleteProperty';
import Reflect_set from '.Reflect.set';
import Reflect_ownKeys from '.Reflect.ownKeys';
import Set from '.Set';
import TypeError from '.TypeError';
import WeakMap from '.WeakMap';
import undefined from '.undefined';
import Null_prototype from '.null.prototype';

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

const setDescriptor = /*#__PURE__*/ Object_assign(Object_create(Null_prototype), {
	value: undefined,
	writable: true,
	enumerable: true,
	configurable: true,
});
const handlers = /*#__PURE__*/ Object_assign(Object_create(Null_prototype), {
	apply (Function :{ (...args :any[]) :any }, thisArg :any, args :any[]) {
		return orderify(Reflect_apply(Function, thisArg, args));
	},
	construct (Class :{ new (...args :any[]) :any }, args :any[], newTarget :any) {
		return orderify(Reflect_construct(Class, args, newTarget));
	},
	defineProperty (target :{}, key :Key, descriptor :PropertyDescriptor) :boolean {
		if ( Reflect_defineProperty(target, key, PartialDescriptor(descriptor)) ) {
			target2keeper.get(target)!.add(key);
			return true;
		}
		return false;
	},
	deleteProperty (target :{}, key :Key) :boolean {
		if ( Reflect_deleteProperty(target, key) ) {
			target2keeper.get(target)!.delete(key);
			return true;
		}
		return false;
	},
	ownKeys (target :{}) :Key[] {
		return [ ...target2keeper.get(target)! ];
	},
	set (target :{}, key :Key, value :any, receiver :{}) :boolean {
		if ( key in target ) { return Reflect_set(target, key, value, receiver); }
		setDescriptor.value = value;
		if ( Reflect_defineProperty(target, key, setDescriptor) ) {
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
	const proxy = new Proxy<O>(target, handlers);
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
		return Object_is(
			proxy2target.get(object1) || object1,
			proxy2target.get(object2) || object2,
		);
	}
};

export const { orderify } = {
	orderify<O extends object> (object :O) :O {
		if ( proxy2target.has(object) ) { return object; }
		let proxy = target2proxy.get(object) as O | undefined;
		if ( proxy ) { return proxy; }
		proxy = newProxy(object, new Keeper(Reflect_ownKeys(object)));
		target2proxy.set(object, proxy);
		return proxy;
	}
};
function getInternal (object :object) :{ target :any, keeper :Keeper, proxy :any } {
	const target = proxy2target.get(object);
	if ( target ) { return { target, keeper: target2keeper.get(target)!, proxy: object }; }
	let proxy = target2proxy.get(object);
	if ( proxy ) { return { target: object, keeper: target2keeper.get(object)!, proxy }; }
	const keeper :Keeper = new Keeper(Reflect_ownKeys(object));
	target2proxy.set(object, proxy = newProxy(object, keeper));
	return { target: object, keeper, proxy };
}

function PartialDescriptor<D extends PropertyDescriptor> (source :D) :D {
	const target = Object_create(Null_prototype) as D;
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
	const target = Object_create(Null_prototype) as D;
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
	const target = Object_create(Null_prototype) as D;
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
		'use strict';
		if ( arguments.length<2 ) { return newProxy(Object_create(proto) as any, new Keeper); }
		const keeper :Set<Key & keyof OO> = new Keeper;
		descriptorMap = arguments[0] = newProxy(Object_create(Null_prototype), keeper) as OO;
		Reflect_apply(Object_assign, null, arguments as unknown as [ object, OO ]);
		const target = Object_create(proto, descriptorMap!) as any;
		for ( const key of keeper ) {
			descriptorMap![key] = ExternalDescriptor(descriptorMap![key]);
		}
		return newProxy(target, keeper);
	}
};
export const { defineProperties } = {
	defineProperties<O extends object, OO extends PropertyDescriptorMap> (object :O, descriptorMap :OO) :( OO extends TypedPropertyDescriptorMap<infer O> ? O : never ) & O {
		const { target, keeper, proxy } = getInternal(object);
		for ( let lastIndex :number = arguments.length-1, index :number = 1; ; descriptorMap = arguments[++index] ) {
			const keys = Reflect_ownKeys(descriptorMap);
			for ( let length :number = keys.length, index :number = 0; index<length; ++index ) {
				const key = keys[index];
				Object_defineProperty(target, key, ExternalDescriptor(descriptorMap[key]));
				keeper.add(key);
			}
			if ( index===lastIndex ) { return proxy; }
		}
	}
};

export const { getOwnPropertyDescriptors } = {
	getOwnPropertyDescriptors<O extends object> (object :O) :{ [k in keyof O] :TypedPropertyDescriptor<O[k]> } {
		const descriptors = Object_create(Null_prototype) as any;
		const keeper :Keeper = new Keeper;
		const keys = Reflect_ownKeys(object);
		for ( let length :number = keys.length, index :number = 0; index<length; ++index ) {
			const key = keys[index];
			descriptors[key] = InternalDescriptor(Object_getOwnPropertyDescriptor(object, key)!);
			keeper.add(key);
		}
		return newProxy(descriptors, keeper);
	}
};

export const NULL = /*#__PURE__*/ function (this :any) {
	function throwConstructing () :never { throw TypeError(`Super constructor NULL cannot be invoked with 'new'`); }
	function throwApplying () :never { throw TypeError(`Super constructor NULL cannot be invoked without 'new'`); }
	function NULL (this :object) {
		return new.target
			? new.target===NULL
				? /*#__PURE__*/ throwConstructing()
				: /*#__PURE__*/ newProxy(this, new Keeper)
			: /*#__PURE__*/ throwApplying();
	}
	( NULL ).prototype = null;
	Object_defineProperty(NULL, 'name', Object_assign(Object_create(Null_prototype), { value: '' }));
	//delete NULL.length;
	Object_freeze(NULL);
	return NULL;
}() as any as typeof import('./export.d').NULL;
export type NULL<ValueType> = import('./export.d').NULL<ValueType>;

const PropertyKey :any = /*#__PURE__*/ new Proxy({}, { get<Key extends string | symbol> (target :{}, key :Key) :Key { return key; } });
export const { fromEntries } = {
	fromEntries<K extends string | symbol, V extends any, O extends object> (entries :Iterable<{ readonly 0 :K, readonly 1 :V }>, proto? :null | O) :{ [k in K] :V } & O {
		const keeper :Keeper = new Keeper;
		const map :Map<K, V> = new Map;
		for ( let { 0: key, 1: value } of entries ) {
			key = PropertyKey[key];
			keeper.add(key);
			map.set(key, value);
		}
		const target = Object_fromEntries(map);
		return newProxy(
			proto===undefined ? target :
				proto===null ? Object_assign(Object_create(proto) as any, target) :
					Object_create(target, getOwnPropertyDescriptors(proto)),
			keeper
		);
	}
};

import Default from '.default';
export default Default({
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
