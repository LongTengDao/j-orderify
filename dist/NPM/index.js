'use strict';

const assign = Object.assign;

const create = Object.create;

const defineProperties = Object.defineProperties;

const defineProperty = Object.defineProperty;

const freeze = Object.freeze;

const fromEntries = Object.fromEntries;

const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

const is = Object.is;

const apply = Reflect.apply;

const construct = Reflect.construct;

const defineProperty$1 = Reflect.defineProperty;

const deleteProperty = Reflect.deleteProperty;

const ownKeys = Reflect.ownKeys;

const set = Reflect.set;

const undefined$1 = void 0;

const isArray = Array.isArray;

const version = '5.2.0';

const Keeper = Set;
const target2keeper = new WeakMap;
const proxy2target = new WeakMap;
const target2proxy = new WeakMap;
const setDescriptor = /*#__PURE__*/ assign(create(null), {
    value: undefined$1,
    writable: true,
    enumerable: true,
    configurable: true,
});
const handlers = /*#__PURE__*/ assign(create(null), {
    apply(Function, thisArg, args) {
        return orderify(apply(Function, thisArg, args));
    },
    construct(Class, args, newTarget) {
        return orderify(construct(Class, args, newTarget));
    },
    defineProperty(target, key, descriptor) {
        if (defineProperty$1(target, key, PartialDescriptor(descriptor))) {
            target2keeper.get(target).add(key);
            return true;
        }
        return false;
    },
    deleteProperty(target, key) {
        if (deleteProperty(target, key)) {
            target2keeper.get(target).delete(key);
            return true;
        }
        return false;
    },
    ownKeys(target) {
        return [...target2keeper.get(target)];
    },
    set(target, key, value, receiver) {
        if (key in target) {
            return set(target, key, value, receiver);
        }
        setDescriptor.value = value;
        if (defineProperty$1(target, key, setDescriptor)) {
            target2keeper.get(target).add(key);
            setDescriptor.value = undefined$1;
            return true;
        }
        else {
            setDescriptor.value = undefined$1;
            return false;
        }
    },
});
function newProxy(target, keeper) {
    target2keeper.set(target, keeper);
    const proxy = new Proxy(target, handlers);
    proxy2target.set(proxy, target);
    return proxy;
}
const { isOrdered } = {
    isOrdered(object) {
        return proxy2target.has(object);
    }
};
const { is: is$1 } = {
    is(object1, object2) {
        return is(proxy2target.get(object1) || object1, proxy2target.get(object2) || object2);
    }
};
const { orderify } = {
    orderify(object) {
        if (proxy2target.has(object)) {
            return object;
        }
        let proxy = target2proxy.get(object);
        if (proxy) {
            return proxy;
        }
        proxy = newProxy(object, new Keeper(ownKeys(object)));
        target2proxy.set(object, proxy);
        return proxy;
    }
};
function getInternal(object) {
    const target = proxy2target.get(object);
    if (target) {
        return { target, keeper: target2keeper.get(target), proxy: object };
    }
    let proxy = target2proxy.get(object);
    if (proxy) {
        return { target: object, keeper: target2keeper.get(object), proxy };
    }
    const keeper = new Keeper(ownKeys(object));
    target2proxy.set(object, proxy = newProxy(object, keeper));
    return { target: object, keeper, proxy };
}
function PartialDescriptor(source) {
    const target = create(null);
    if (source.hasOwnProperty('value')) {
        target.value = source.value;
        if (source.hasOwnProperty('writable')) {
            target.writable = source.writable;
        }
    }
    else if (source.hasOwnProperty('writable')) {
        target.writable = source.writable;
    }
    else if (source.hasOwnProperty('get')) {
        target.get = source.get;
        if (source.hasOwnProperty('set')) {
            target.set = source.set;
        }
    }
    else if (source.hasOwnProperty('set')) {
        target.set = source.set;
    }
    if (source.hasOwnProperty('enumerable')) {
        target.enumerable = source.enumerable;
    }
    if (source.hasOwnProperty('configurable')) {
        target.configurable = source.configurable;
    }
    return target;
}
function InternalDescriptor(source) {
    const target = create(null);
    if (source.hasOwnProperty('value')) {
        target.value = source.value;
        target.writable = source.writable;
    }
    else {
        target.get = source.get;
        target.set = source.set;
    }
    target.enumerable = source.enumerable;
    target.configurable = source.configurable;
    return target;
}
function ExternalDescriptor(source) {
    const target = create(null);
    if (source.hasOwnProperty('value')) {
        target.value = source.value;
    }
    if (source.hasOwnProperty('writable')) {
        target.writable = source.writable;
    }
    if (source.hasOwnProperty('get')) {
        target.get = source.get;
    }
    if (source.hasOwnProperty('set')) {
        target.set = source.set;
    }
    if (source.hasOwnProperty('enumerable')) {
        target.enumerable = source.enumerable;
    }
    if (source.hasOwnProperty('configurable')) {
        target.configurable = source.configurable;
    }
    return target;
}
const { create: create$1 } = {
    create(proto, descriptorMap) {
        if (descriptorMap === undefined$1) {
            return newProxy(create(proto), new Keeper);
        }
        const target = create(proto);
        const keeper = new Keeper;
        for (let lastIndex = arguments.length - 1, index = 1;; descriptorMap = arguments[++index]) {
            const keys = ownKeys(descriptorMap);
            for (let length = keys.length, index = 0; index < length; ++index) {
                const key = keys[index];
                defineProperty(target, key, ExternalDescriptor(descriptorMap[key]));
                keeper.add(key);
            }
            if (index === lastIndex) {
                return newProxy(target, keeper);
            }
        }
    }
};
const { defineProperties: defineProperties$1 } = {
    defineProperties(object, descriptorMap) {
        const { target, keeper, proxy } = getInternal(object);
        for (let lastIndex = arguments.length - 1, index = 1;; descriptorMap = arguments[++index]) {
            const keys = ownKeys(descriptorMap);
            for (let length = keys.length, index = 0; index < length; ++index) {
                const key = keys[index];
                defineProperty(target, key, ExternalDescriptor(descriptorMap[key]));
                keeper.add(key);
            }
            if (index === lastIndex) {
                return proxy;
            }
        }
    }
};
const { getOwnPropertyDescriptors } = {
    getOwnPropertyDescriptors(object) {
        const descriptors = create(null);
        const keeper = new Keeper;
        const keys = ownKeys(object);
        for (let length = keys.length, index = 0; index < length; ++index) {
            const key = keys[index];
            descriptors[key] = InternalDescriptor(getOwnPropertyDescriptor(object, key));
            keeper.add(key);
        }
        return newProxy(descriptors, keeper);
    }
};
function keeperAddKeys(keeper, object) {
    const keys = ownKeys(object);
    for (let length = keys.length, index = 0; index < length; ++index) {
        keeper.add(keys[index]);
    }
}
function NULL_from(source, define) {
    const target = create(null);
    const keeper = new Keeper;
    if (define) {
        if (isArray(source)) {
            for (let length = source.length, index = 0; index < length; ++index) {
                const descriptorMap = getOwnPropertyDescriptors(source[index]);
                defineProperties(target, descriptorMap);
                keeperAddKeys(keeper, descriptorMap);
            }
        }
        else {
            const descriptorMap = getOwnPropertyDescriptors(source);
            defineProperties(target, descriptorMap);
            keeperAddKeys(keeper, descriptorMap);
        }
    }
    else {
        if (isArray(source)) {
            assign(target, ...source);
            for (let length = source.length, index = 0; index < length; ++index) {
                keeperAddKeys(keeper, source[index]);
            }
        }
        else {
            assign(target, source);
            keeperAddKeys(keeper, source);
        }
    }
    return newProxy(target, keeper);
}
function throwConstructing() { throw TypeError(`NULL cannot be invoked with 'new'`); }
const NULL = 
/*#__PURE__*/
function () {
    const NULL = function (source, define) {
        return (new.target)
            ? new.target === NULL
                ? /*#__PURE__*/ throwConstructing()
                : /*#__PURE__*/ newProxy(this, new Keeper)
            : /*#__PURE__*/ NULL_from(source, define);
    };
    NULL.prototype = null;
    //delete NULL.name;
    //delete NULL.length;
    freeze(NULL);
    return NULL;
}();
const PropertyKey = 
/*#__PURE__*/ new Proxy({}, { get(target, key) { return key; } });
const { fromEntries: fromEntries$1 } = {
    fromEntries(entries, proto) {
        const keeper = new Keeper;
        const map = new Map;
        for (let { 0: key, 1: value } of entries) {
            key = PropertyKey[key];
            keeper.add(key);
            map.set(key, value);
        }
        const target = fromEntries(map);
        return newProxy(proto === undefined$1 ? target :
            proto === null ? assign(create(null), target) :
                create(target, getOwnPropertyDescriptors(proto)), keeper);
    }
};
const _export = /*#__PURE__*/ (function () {
    const exports = create(null);
    assign(exports, {
        version,
        isOrdered,
        is: is$1,
        orderify,
        create: create$1,
        defineProperties: defineProperties$1,
        NULL,
        fromEntries: fromEntries$1,
        getOwnPropertyDescriptors,
        default: exports,
    });
    var descriptor = create(null);
    descriptor.value = 'Module';
    defineProperty(exports, Symbol.toStringTag, descriptor);
    freeze(exports);
    return exports;
})();

module.exports = _export;

//# sourceMappingURL=index.js.map