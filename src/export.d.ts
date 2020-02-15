export const version :string;

export function isOrdered (object :object) :boolean;

export function is (object1 :object, object2 :object) :boolean;

export function orderify<O extends object> (object :O) :O;

export function create<O extends object, OO extends PropertyDescriptorMap> (proto :null | O, ...descriptorMaps :OO[]) :( OO extends TypedPropertyDescriptorMap<infer O> ? O : never ) & O;

export function defineProperties<O extends object, OO extends PropertyDescriptorMap> (object :O, descriptorMap :OO, ...descriptorMaps :OO[]) :( OO extends TypedPropertyDescriptorMap<infer O> ? O : never ) & O;

export function getOwnPropertyDescriptors<O extends object> (object :O) :{ [k in keyof O] :TypedPropertyDescriptor<O[k]> };

export const Null :{
	new<ValueType extends any> () :Null<ValueType>
	new () :object
};
export type Null<ValueType> = {
	[key :string] :undefined | ValueType
	toString? :ValueType
	toLocaleString? :ValueType
	valueOf? :ValueType
	hasOwnProperty? :ValueType
	isPrototypeOf? :ValueType
	propertyIsEnumerable? :ValueType
	__defineGetter__? :ValueType
	__defineSetter__? :ValueType
	__lookupGetter__? :ValueType
	__lookupSetter__? :ValueType
	__proto__? :ValueType
	constructor? :ValueType
};

export function fromEntries<K extends string | symbol, V extends any, O extends object> (entries :Iterable<{ readonly 0: K, readonly 1: V }>, proto? :null | O) :{ [k in K] :V } & O;

export default exports;
declare const exports :{
	version :typeof version,
	isOrdered :typeof isOrdered,
	is :typeof is,
	orderify :typeof orderify,
	create :typeof create,
	defineProperties :typeof defineProperties,
	Null :typeof Null,
	fromEntries :typeof fromEntries,
	getOwnPropertyDescriptors :typeof getOwnPropertyDescriptors,
	default :typeof exports,
};

type TypedPropertyDescriptorMap<O> = { [k in keyof O] :TypedPropertyDescriptor<O[k]> };
