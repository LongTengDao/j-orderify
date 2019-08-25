
```js
function assign (object) {
    object[Symbol("A")] = "1. symbol";
    object["_________"] = "2. string";
    object[10000000000] = "3. string (decimal integer)";
    object[Symbol("B")] = "4. symbol";
    object["__proto__"] = "5. string";
    object[11111111111] = "6. string (decimal integer)";
    return object;
}

/* native object */

const object = Object.create(null) |> assign;

for ( const key of ownKeys(object) ) {
    console.log(object[key]);
    // "3. string (decimal integer)"
    // "6. string (decimal integer)"
    // "2. string"
    // "5. string"
    // "1. symbol"
    // "4. symbol"
}

for ( const key in object ) {
    console.log(object[key]);
    // "3. string (decimal integer)"
    // "6. string (decimal integer)"
    // "2. string"
    // "5. string"
}

/* ordered object */

const ordered = Object.create(null) |> require("@ltd/j-orderify").orderify |> assign;

for ( const key of ownKeys(ordered) ) {
    console.log(ordered[key]);
    // "1. symbol"
    // "2. string"
    // "3. string (decimal integer)"
    // "4. symbol"
    // "5. string"
    // "6. string (decimal integer)"
}

for ( const key in ordered ) {
    console.log(ordered[key]);
    // "2. string"
    // "3. string (decimal integer)"
    // "5. string"
    // "6. string (decimal integer)"
}
```
