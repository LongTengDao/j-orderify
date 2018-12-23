
```
'use strict';

const orderify = require('@ltd/j-orderify');

const object = {};

const proxy = orderify(object);

proxy[Symbol()] = '1. symbol';
proxy.string = '2. string';
proxy[1] = '3. integer-string';

for ( const key of Reflect.ownKeys(proxy) ) {
	console.log(proxy[key]);
	// "1. symbol"
	// "2. string"
	// "3. integer-string"
}

for ( const key in proxy ) {
	console.log(proxy[key]);
	// "1. string"
	// "2. integer-string"
}

```
