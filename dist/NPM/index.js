'use strict';

const version = '1.0.0';

const { defineProperty, deleteProperty, ownKeys } = Reflect;

const ownKeysKeepers = new WeakMap;

const handlers = Object.create(null, {
	defineProperty: {
		value (target, key, descriptor) {
			if ( defineProperty(target, key, descriptor) ) {
				ownKeysKeepers.get(target).add(key);
				return true;
			}
			return false;
		}
	},
	deleteProperty: {
		value (target, key) {
			if ( deleteProperty(target, key) ) {
				ownKeysKeepers.get(target).delete(key);
				return true;
			}
			return false;
		}
	},
	ownKeys: {
		value (target) {
			return [...ownKeysKeepers.get(target)];
		}
	},
});

const _export = ( () => {
	const orderify = object => {
		ownKeysKeepers.set(object, new Set(ownKeys(object)));
		return new Proxy(object, handlers);
	};
	orderify.version = version;
	return orderify.orderify = orderify.default = orderify;
} )();

module.exports = _export;

//# sourceMappingURL=index.js.map