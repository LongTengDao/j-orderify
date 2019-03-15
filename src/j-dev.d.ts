declare module '*?text' {
	const text = '';
	export default text;
}

declare module '.WeakMap' { export default WeakMap; }
declare module '.Object' { export default Object; }
declare module '.Object.create' { export default Object.create; }
declare module '.Set' { export default Set; }
declare module '.Proxy' { export default Proxy; }
declare module '.Reflect.defineProperty' { export default Reflect.defineProperty; }
declare module '.Reflect.deleteProperty' { export default Reflect.deleteProperty; }
declare module '.Reflect.ownKeys' { export default Reflect.ownKeys; }