
```
'use strict';

const orderify = require('@ltd/j-orderify');

const object = orderify({});
object[Symbol()] = 'symbol';
object.string = 'string';
object[1] = 'integer-string';

const ownValues = [];
for ( const key of Reflect.ownKeys(object) ) { ownValues.push(object[key]); }
values.join(', ')==='symbol, string, integer-string';

const values = [];
for ( const key in object ) { values.push(object[key]); }
values.join(', ')==='string, integer-string';

```
