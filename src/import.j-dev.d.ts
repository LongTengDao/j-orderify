declare module '*?text' {
	const text :string;
	export default text;
}

declare module '.Object.assign' { export default Object.assign; }
declare module '.Object.create' { export default Object.create; }
declare module '.Proxy' { export default Proxy; }
declare module '.Reflect.construct' { export default Reflect.construct; }
declare module '.Reflect.defineProperty' { export default Reflect.defineProperty; }
declare module '.Reflect.deleteProperty' { export default Reflect.deleteProperty; }
declare module '.Reflect.ownKeys' { export default Reflect.ownKeys; }
declare module '.Set' { export default Set; }
declare module '.WeakMap' { export default WeakMap; }
