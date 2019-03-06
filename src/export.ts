import version from './version?text';
export { version };

import WeakMap from '.WeakMap';
import Object from '.Object';
import create from '.Object.create';
import Set from '.Set';
import Proxy from '.Proxy';
import defineProperty from '.Reflect.defineProperty';
import deleteProperty from '.Reflect.deleteProperty';
import ownKeys from '.Reflect.ownKeys';

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

export class Orderified extends null {
	constructor () {
		const object :Orderified = create(prototype);
		ownKeysKeepers.set(object, new Set);
		return new Proxy(object, handlers);
	}
}

const prototype = /*#__PURE__*/ function () {
	delete Orderified.prototype.constructor;
	Object.freeze(Orderified.prototype);
	return Orderified.prototype;
}();

export default {
	version,
	orderify,
	Orderified,
	get default () { return this; },
};
