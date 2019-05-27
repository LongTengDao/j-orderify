
```js
"use strict";

const { of, create, extend } = require("@ltd/j-orderify");

const object = Object.create(null);

const Class = Object.setPrototypeOf(class Class { }, null);

const OrderedClass = extend(Class);

for ( const orderedObject of [
	of(object),
	create(null),
	create(Class.prototype),
	of(new Class),
	new OrderedClass,
] ) {
	
	orderedObject[Symbol()] = "1. symbol";
	orderedObject["__proto__"] = "2. string";
	orderedObject[0] = "3. string (decimal integer)";
	
	for ( const key of Reflect.ownKeys(orderedObject) ) {
		console.log(orderedObject[key]);
		// "1. symbol"
		// "2. string"
		// "3. string (decimal integer)"
	}
	
	for ( const key in orderedObject ) {
		console.log(orderedObject[key]);
		// "1. string"
		// "2. string (decimal integer)"
	}
	
}

```
