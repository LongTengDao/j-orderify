
declare module '.Array.isArray' { export default Array.isArray; }

declare module '.Map' { export default Map; }

declare module '.Object' { export default Object;
	export { default as assign } from '.Object.assign';
	export { default as create } from '.Object.create';
	export { default as defineProperties } from '.Object.defineProperties';
	export { default as defineProperty } from '.Object.defineProperty';
	export { default as entries } from '.Object.entries';
	export { default as freeze } from '.Object.freeze';
	export { default as fromEntries } from '.Object.fromEntries';
	export { default as getOwnPropertyDescriptor } from '.Object.getOwnPropertyDescriptor';
	export { default as getOwnPropertyDescriptors } from '.Object.getOwnPropertyDescriptors';
	export { default as getOwnPropertyNames } from '.Object.getOwnPropertyNames';
	export { default as getOwnPropertySymbols } from '.Object.getOwnPropertySymbols';
	export { default as getPrototypeOf } from '.Object.getPrototypeOf';
	export { default as is } from '.Object.is';
	export { default as isExtensible } from '.Object.isExtensible';
	export { default as isFrozen } from '.Object.isFrozen';
	export { default as isSealed } from '.Object.isSealed';
	export { default as keys } from '.Object.keys';
	export { default as preventExtensions } from '.Object.preventExtensions';
	export { default as seal } from '.Object.seal';
	export { default as setPrototypeOf } from '.Object.setPrototypeOf';
	export { default as values } from '.Object.values';
}
declare module '.Object.assign' { export default Object.assign; }
declare module '.Object.create' { export default Object.create; }
declare module '.Object.defineProperties' { export default Object.defineProperties; }
declare module '.Object.defineProperty' { export default Object.defineProperty; }
declare module '.Object.entries' { export default entries;
	function entries<T extends object> (object :T) :[Extract<string, keyof T>, T[Extract<string, keyof T>]][];
}
declare module '.Object.freeze' { export default Object.freeze; }
declare module '.Object.fromEntries' { export default fromEntries;
	function fromEntries<K extends string | symbol, V extends any> (entries :Iterable<{ readonly 0: K, readonly 1: V }>) :{ [k in K] :V };
}
declare module '.Object.getOwnPropertyDescriptor' { export default Object.getOwnPropertyDescriptor; }
declare module '.Object.getOwnPropertyDescriptors' { export default Object.getOwnPropertyDescriptors; }
declare module '.Object.getOwnPropertyNames' { export default Object.getOwnPropertyNames; }
declare module '.Object.getOwnPropertySymbols' { export default Object.getOwnPropertySymbols; }
declare module '.Object.getPrototypeOf' { export default Object.getPrototypeOf; }
declare module '.Object.is' { export default Object.is; }
declare module '.Object.isExtensible' { export default Object.isExtensible; }
declare module '.Object.isFrozen' { export default Object.isFrozen; }
declare module '.Object.isSealed' { export default Object.isSealed; }
declare module '.Object.keys' { export default keys;
	function keys<T extends object> (object :T) :Extract<string, keyof T>[];
}
declare module '.Object.preventExtensions' { export default Object.preventExtensions; }
declare module '.Object.seal' { export default Object.seal; }
declare module '.Object.setPrototypeOf' { export default Object.setPrototypeOf; }
declare module '.Object.values' { export default values;
	function values<T extends object> (object :T) :T[Extract<string, keyof T>][];
}

declare module '.Proxy' { export default Proxy;
	export { default as revocable } from '.Proxy.revocable';
}
declare module '.Proxy.revocable' { export default Proxy.revocable; }

declare module '.Reflect' { export default Reflect;
	export { default as apply } from '.Reflect.apply';
	export { default as construct } from '.Reflect.construct';
	export { default as defineProperty } from '.Reflect.defineProperty';
	export { default as deleteProperty } from '.Reflect.deleteProperty';
	export { default as get } from '.Reflect.get';
	export { default as getOwnPropertyDescriptor } from '.Reflect.getOwnPropertyDescriptor';
	export { default as getPrototypeOf } from '.Reflect.getPrototypeOf';
	export { default as has } from '.Reflect.has';
	export { default as isExtensible } from '.Reflect.isExtensible';
	export { default as ownKeys } from '.Reflect.ownKeys';
	export { default as preventExtensions } from '.Reflect.preventExtensions';
	export { default as set } from '.Reflect.set';
	export { default as setPrototypeOf } from '.Reflect.setPrototypeOf';
}
declare module '.Reflect.apply' { export default Reflect.apply; }
declare module '.Reflect.construct' { export default Reflect.construct; }
declare module '.Reflect.defineProperty' { export default Reflect.defineProperty; }
declare module '.Reflect.deleteProperty' { export default Reflect.deleteProperty; }
declare module '.Reflect.get' { export default Reflect.get; }
declare module '.Reflect.getOwnPropertyDescriptor' { export default Reflect.getOwnPropertyDescriptor; }
declare module '.Reflect.getPrototypeOf' { export default Reflect.getPrototypeOf; }
declare module '.Reflect.has' { export default Reflect.has; }
declare module '.Reflect.isExtensible' { export default Reflect.isExtensible; }
declare module '.Reflect.ownKeys' { export default ownKeys;
	function ownKeys<T extends object> (object :T) :Extract<string | symbol, keyof T>[];
}
declare module '.Reflect.preventExtensions' { export default Reflect.preventExtensions; }
declare module '.Reflect.set' { export default Reflect.set; }
declare module '.Reflect.setPrototypeOf' { export default Reflect.setPrototypeOf; }

declare module '.Set' { export default Set; }

declare module '.TypeError' { export default TypeError; }

declare module '.WeakMap' { export default WeakMap; }

declare module '.undefined' { export default undefined; }
