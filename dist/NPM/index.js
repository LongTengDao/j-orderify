'use strict';

const version = '2.3.0';

const create = Object.create;

const defineProperty = Reflect.defineProperty;

const deleteProperty = Reflect.deleteProperty;

const ownKeys = Reflect.ownKeys;

const ownKeysKeepers = new WeakMap;
const handlers = Object.create(null, {
    defineProperty: {
        value(target, key, descriptor) {
            if (defineProperty(target, key, descriptor)) {
                ownKeysKeepers.get(target).add(key);
                return true;
            }
            return false;
        }
    },
    deleteProperty: {
        value(target, key) {
            if (deleteProperty(target, key)) {
                ownKeysKeepers.get(target).delete(key);
                return true;
            }
            return false;
        }
    },
    ownKeys: {
        value(target) {
            return [...ownKeysKeepers.get(target)];
        }
    },
});
const orderify = (object) => {
    ownKeysKeepers.set(object, new Set(ownKeys(object)));
    return new Proxy(object, handlers);
};
class Orderified extends null {
    constructor() {
        const object = create(prototype);
        ownKeysKeepers.set(object, new Set);
        return new Proxy(object, handlers);
    }
}
const { prototype } = Orderified;
const _export = {
    version,
    orderify,
    Orderified,
    get default() { return this; },
};

module.exports = _export;

//# sourceMappingURL=index.js.map