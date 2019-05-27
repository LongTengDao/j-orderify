'use strict';

const version = '3.0.0';

const Object_create = Object.create;

const assign = Object.assign;

const defineProperty = Reflect.defineProperty;

const deleteProperty = Reflect.deleteProperty;

const ownKeys = Reflect.ownKeys;

const construct = Reflect.construct;

const ownKeysKeepers = new WeakMap();
const handlers = 
/*#__PURE__*/
assign(Object_create(null), {
    defineProperty(target, key, descriptor) {
        if (defineProperty(target, key, descriptor)) {
            ownKeysKeepers.get(target).add(key);
            return true;
        }
        return false;
    },
    deleteProperty(target, key) {
        if (deleteProperty(target, key)) {
            ownKeysKeepers.get(target).delete(key);
            return true;
        }
        return false;
    },
    ownKeys(target) {
        return [...ownKeysKeepers.get(target)];
    },
});
const { of } = {
    of(object) {
        ownKeysKeepers.set(object, new Set(ownKeys(object)));
        return new Proxy(object, handlers);
    }
};
const { create } = {
    create(proto) {
        const object = Object_create(proto);
        ownKeysKeepers.set(object, new Set);
        return new Proxy(object, handlers);
    }
};
const { extend } = {
    extend(Class) {
        return new Proxy(Class, assign(Object_create(null), {
            construct(Class, args) {
                const object = construct(Class, args);
                ownKeysKeepers.set(object, new Set(ownKeys(object)));
                return new Proxy(object, handlers);
            },
        }));
    }
};
const _export = {
    version,
    of,
    create,
    extend,
    get default() { return this; },
};

module.exports = _export;

//# sourceMappingURL=index.js.map