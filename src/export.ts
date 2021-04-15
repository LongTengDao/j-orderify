import TypeError from '.TypeError';
import WeakMap from '.WeakMap';
import Proxy from '.Proxy';
import Object_assign from '.Object.assign';
import Object_create from '.Object.create';
import Object_is from '.Object.is';
import Object_defineProperty from '.Object.defineProperty';
import Object_getOwnPropertyDescriptor from '.Object.getOwnPropertyDescriptor';
import Object_defineProperties from '.Object.defineProperties';
import Object_fromEntries from '.Object.fromEntries';
import Object_freeze from '.Object.freeze';
import hasOwnProperty from '.Object.prototype.hasOwnProperty';
import Reflect_apply from '.Reflect.apply';
import Reflect_construct from '.Reflect.construct';
import Reflect_defineProperty from '.Reflect.defineProperty';
import Reflect_deleteProperty from '.Reflect.deleteProperty';
import Reflect_ownKeys from '.Reflect.ownKeys';
import undefined from '.undefined';
import NULL from '.null.prototype';

import version from './version?text';
export { version };

type Key = string | symbol;
type KeyOf<O extends object> = Extract<keyof O, Key>;
type Keeper<T> = T[];
const Keeper = <T> () :T[] => [];

const hasOwnProperty_call = /*#__PURE__*/hasOwnProperty.call.bind(hasOwnProperty);

const newWeakMap = () => {
	const weakMap = new WeakMap;
	weakMap.has = weakMap.has;
	weakMap.get = weakMap.get;
	weakMap.set = weakMap.set;
	return weakMap;
};
const target2keeper = /*#__PURE__*/newWeakMap() as {
	get <K extends Key> (target:{ [k in K] :any }) :Keeper<K> | undefined;
	set <K extends Key> (target :{ [k in K] :any }, keeper :Keeper<K>) :void;
};
const proxy2target = /*#__PURE__*/newWeakMap() as {
	has (proxy: object) :boolean;
	get <O extends object> (proxy: O) :O | undefined;
	set <O extends object> (proxy :O, target :O) :void;
};
const target2proxy = /*#__PURE__*/newWeakMap() as {
	get <O extends object> (target: O) :O | undefined;
	set <O extends object> (target :O, proxy :O) :void;
};

const ExternalDescriptor = <D extends PropertyDescriptor> (source :D) :D => {
	const target = Object_create(NULL) as D;
	if ( hasOwnProperty_call(source, 'enumerable') ) { target.enumerable = source.enumerable; }
	if ( hasOwnProperty_call(source, 'configurable') ) { target.configurable = source.configurable; }
	if ( hasOwnProperty_call(source, 'value') ) { target.value = source.value; }
	if ( hasOwnProperty_call(source, 'writable') ) { target.writable = source.writable; }
	if ( hasOwnProperty_call(source, 'get') ) { target.get = source.get; }
	if ( hasOwnProperty_call(source, 'set') ) { target.set = source.set; }
	return target;
};

const handlers :ProxyHandler<object> = /*#__PURE__*/Object_assign(Object_create(NULL), {
	defineProperty: <K extends Key> (target :{ [k in K] :any }, key :K, descriptor :PropertyDescriptor) :boolean => {
		if ( hasOwnProperty_call(target, key) ) {
			return Reflect_defineProperty(target, key, Object_assign(Object_create(NULL), descriptor));
		}
		if ( Reflect_defineProperty(target, key, Object_assign(Object_create(NULL), descriptor)) ) {
			const keeper = target2keeper.get(target)!;
			keeper[keeper.length] = key;
			return true;
		}
		return false;
	},
	deleteProperty: <K extends Key> (target :{ [k in K] :any }, key :K) :boolean => {
		if ( Reflect_deleteProperty(target, key) ) {
			const keeper = target2keeper.get(target)!;
			const index = keeper.indexOf(key);
			index<0 || --keeper.copyWithin(index, index + 1).length;
			return true;
		}
		return false;
	},
	ownKeys: <O extends object> (target :O) => target2keeper.get(target) as unknown as KeyOf<O>[],
	construct: <A extends any[], R extends object> (target :{ new (...args :A) :R }, args :A, newTarget :any) :R => orderify(Reflect_construct(target, args, newTarget)),
	apply: <T, A extends any[], R extends object> (target :{ (this :T, ...args :A) :R }, thisArg :T, args :A) :R => orderify(Reflect_apply(target, thisArg, args)),
});

const newProxy = <K extends Key, O extends { [k in K] :any }> (target :O, keeper :Keeper<K>) :O => {
	target2keeper.set(target, keeper);
	const proxy = new Proxy<O>(target, handlers);
	proxy2target.set(proxy, target);
	return proxy;
};

export const isOrdered = (object :object) :boolean => proxy2target.has(object);
export const is = (object1 :object, object2 :object) :boolean => Object_is(
	proxy2target.get(object1) || object1,
	proxy2target.get(object2) || object2,
);

export const orderify = <O extends object> (object :O) :O => {
	if ( proxy2target.has(object) ) { return object; }
	let proxy = target2proxy.get(object) as O | undefined;
	if ( proxy ) { return proxy; }
	proxy = newProxy(object, Object_assign(Keeper<KeyOf<O>>(), Reflect_ownKeys(object)));
	target2proxy.set(object, proxy);
	return proxy;
};

type TypedPropertyDescriptorMap<O extends object> = { [K in KeyOf<O>] :TypedPropertyDescriptor<O[K]> };
export const { create } = {
	create<O extends object, OO extends PropertyDescriptorMap = {}> (proto :null | O, ...descriptorMaps :OO[]) :( OO extends TypedPropertyDescriptorMap<infer O> ? O : {} ) & O {
		const keeper = Keeper<KeyOf<OO>>();
		if ( descriptorMaps.length ) {
			const descriptorMap :OO = Object_assign(newProxy(Object_create(NULL) as OO, keeper), ...descriptorMaps);
			const { length } = keeper;
			let index = 0;
			while ( index!==length ) {
				const key = keeper[index++]!;
				descriptorMap[key] = ExternalDescriptor(descriptorMap[key]);
			}
			return newProxy(Object_create(proto, descriptorMap) as any, keeper as any);
		}
		return newProxy(Object_create(proto) as any, keeper as any);
	}
};
export const { defineProperties } = {
	defineProperties<O extends object, OO extends PropertyDescriptorMap> (object :O, descriptorMap :OO, ...descriptorMaps :OO[]) :( OO extends TypedPropertyDescriptorMap<infer O> ? O : never ) & O {
		const keeper = Keeper<KeyOf<OO>>();
		descriptorMap = Object_assign(newProxy(Object_create(NULL) as OO, keeper), descriptorMap, ...descriptorMaps);
		const { length } = keeper;
		let index = 0;
		while ( index!==length ) {
			const key = keeper[index++]!;
			descriptorMap[key] = ExternalDescriptor(descriptorMap[key]);
		}
		return Object_defineProperties(orderify(object), descriptorMap);
	}
};
export const getOwnPropertyDescriptors = <O extends object> (object :O) :TypedPropertyDescriptorMap<O> => {
	const descriptorMap = Object_create(NULL) as TypedPropertyDescriptorMap<O>;
	const keeper = Object_assign(Keeper<KeyOf<O>>(), Reflect_ownKeys(object));
	const { length } = keeper;
	let index = 0;
	while ( index!==length ) {
		const key = keeper[index++];
		descriptorMap[key] = Object_assign(Object_create(NULL), Object_getOwnPropertyDescriptor(object, key)!);
	}
	return newProxy(descriptorMap, keeper);
};

export const Null = /*#__PURE__*/function () {
	function throwConstructing () :never { throw TypeError(`Super constructor Null cannot be invoked with 'new'`); }
	function throwApplying () :never { throw TypeError(`Super constructor Null cannot be invoked without 'new'`); }
	const Nullify = (constructor :{ new (...args :any) :any }) => {
		delete constructor.prototype.constructor;
		Object_freeze(constructor.prototype);
		return constructor;
	};
	function Null (this :any, constructor? :{ new (...args :any) :any }) {
		return new.target
			? new.target===Null
				? /*#__PURE__*/throwConstructing()
				: /*#__PURE__*/newProxy(this, Keeper<Key>())
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
}() as any as typeof import('./export.d').Null;
export type Null<ValueType> = import('./export.d').Null<ValueType>;

const DEFAULT = /*#__PURE__*/Object_assign(class extends null { writable () {} enumerable () {} configurable () {} }.prototype as any as PropertyDescriptor, {
	constructor: undefined,
	writable: true,
	enumerable: true,
	configurable: true,
});
export const fromEntries = <K extends Key, V extends any, O extends object> (entries :Iterable<{ readonly 0 :K, readonly 1 :V }>, proto? :null | O) :{ [k in K] :V } & O => {
	const target = Object_fromEntries(entries);
	const keeper :Keeper<K> = Object_assign(Keeper<K>(), Reflect_ownKeys(target));
	if ( proto===undefined ) { return newProxy(target as { [k in K] :V } & O, keeper); }
	if ( proto===null ) { return newProxy(Object_assign(Object_create(proto), target) as { [k in K] :V } & O, keeper); }
	const descriptorMap = Object_create(NULL) as { [k in K] :TypedPropertyDescriptor<V> };
	const { length } = keeper;
	let index = 0;
	while ( index!==length ) {
		const key :K = keeper[index++]!;
		( descriptorMap[key] = Object_create(DEFAULT) as TypedPropertyDescriptor<V> ).value = target[key];
	}
	return newProxy(Object_create(proto, descriptorMap) as { [k in K] :V } & O, keeper);
};

import Default from '.default';
export default Default({
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
