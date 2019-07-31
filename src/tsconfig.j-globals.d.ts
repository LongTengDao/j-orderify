
declare module '.Array.isArray' { export default isArray;
	function isArray (value :any) :value is any[] | readonly any[];
}

declare module '.Map' { export default Map; }

declare module '.Object.assign' { export default Object.assign; }
declare module '.Object.create' { export default Object.create; }
declare module '.Object.defineProperties' { export default Object.defineProperties; }
declare module '.Object.defineProperty' { export default Object.defineProperty; }
declare module '.Object.freeze' { export default Object.freeze; }
declare module '.Object.fromEntries' { export default fromEntries;
	function fromEntries<K extends string | symbol, V extends any> (entries :Iterable<{ readonly 0: K, readonly 1: V }>) :{ [k in K] :V };
}
declare module '.Object.getOwnPropertyDescriptor' { export default Object.getOwnPropertyDescriptor; }
declare module '.Object.is' { export default Object.is; }

declare module '.Proxy' { export default Proxy; }

declare module '.Reflect.apply' { export default Reflect.apply; }
declare module '.Reflect.construct' { export default Reflect.construct; }
declare module '.Reflect.defineProperty' { export default Reflect.defineProperty; }
declare module '.Reflect.deleteProperty' { export default Reflect.deleteProperty; }
declare module '.Reflect.ownKeys' { export default ownKeys;
	function ownKeys<T extends object> (object :T) :Extract<string | symbol, keyof T>[];
}
declare module '.Reflect.set' { export default Reflect.set; }

declare module '.Set' { export default Set; }

declare module '.TypeError' { export default TypeError; }

declare module '.WeakMap' { export default WeakMap; }

declare module '.undefined' { export default undefined; }
