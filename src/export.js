import version from './version?text';// Reflect, WeakMap, Object, Set, Proxy

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

export const orderify = object => {
	ownKeysKeepers.set(object, new Set(ownKeys(object)));
	return new Proxy(object, handlers);
};

export { version };

export default ( () => {
	const orderify = object => {
		ownKeysKeepers.set(object, new Set(ownKeys(object)));
		return new Proxy(object, handlers);
	};
	orderify.version = version;
	return orderify.orderify = orderify.default = orderify;
} )();
