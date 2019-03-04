// @ts-ignore
import version from './version?text';// Reflect, WeakMap, Object, Set, Proxy
export { version };

const { defineProperty, deleteProperty, ownKeys } = Reflect;

const ownKeysKeepers = new WeakMap;

const handlers :object = Object.create(null, {
	defineProperty: {
		value (target :object, key :string | symbol, descriptor :PropertyDescriptor) {
			if ( defineProperty(target, key, descriptor) ) {
				ownKeysKeepers.get(target).add(key);
				return true;
			}
			return false;
		}
	},
	deleteProperty: {
		value (target :object, key :string | symbol) {
			if ( deleteProperty(target, key) ) {
				ownKeysKeepers.get(target).delete(key);
				return true;
			}
			return false;
		}
	},
	ownKeys: {
		value (target :object) :( string | symbol )[] {
			return [...ownKeysKeepers.get(target)];
		}
	},
});

export const orderify = (object :object) :object => {
	ownKeysKeepers.set(object, new Set(ownKeys(object)));
	return new Proxy(object, handlers);
};

let create = (proto :typeof prototype) :Orderified => {
	delete proto.constructor;
	if ( ownKeys(proto).length ) { throw new Error(''); }
	Object.freeze(proto);
	create = Object.create;
	return create(proto);
};

export class Orderified extends null {
	constructor () {
		const object :Orderified = create(prototype);
		ownKeysKeepers.set(object, new Set);
		return new Proxy(object, handlers);
	}
}

const { prototype } = Orderified;

export default {
	version,
	orderify,
	Orderified,
	get default () { return this; },
};
