// Reflect, WeakMap, Object, Set, Proxy

const { defineProperty, deleteProperty, ownKeys } = Reflect;

const ownKeysKeepers = new WeakMap;

const handlers = Object.assign(Object.create(null), {
	defineProperty (target, key, descriptor) {
		if ( defineProperty(target, key, descriptor) ) {
			ownKeysKeepers.get(target).add(key);
			return true;
		}
		return false;
	},
	deleteProperty (target, key) {
		if ( deleteProperty(target, key) ) {
			ownKeysKeepers.get(target).delete(key);
			return true;
		}
		return false;
	},
	ownKeys (target) {
		return [...ownKeysKeepers.get(target)];
	},
});

const orderify = object => {
	ownKeysKeepers.set(object, new Set(ownKeys(object)));
	return new Proxy(object, handlers);
};

export default orderify;
