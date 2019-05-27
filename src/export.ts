import version from './version?text';
export { version };

import WeakMap from '.WeakMap';
import Object_create from '.Object.create';
import assign from '.Object.assign';
import Set from '.Set';
import Proxy from '.Proxy';
import defineProperty from '.Reflect.defineProperty';
import deleteProperty from '.Reflect.deleteProperty';
import ownKeys from '.Reflect.ownKeys';
import construct from '.Reflect.construct';

type Key = string | symbol;

const ownKeysKeepers = new WeakMap<object, Set<Key>>();

const handlers :object =
	/*#__PURE__*/
	assign(Object_create(null), {
		defineProperty (target :object, key :Key, descriptor :PropertyDescriptor) :boolean {
			if ( defineProperty(target, key, descriptor) ) {
				ownKeysKeepers.get(target)!.add(key);
				return true;
			}
			return false;
		},
		deleteProperty (target :object, key :Key) :boolean {
			if ( deleteProperty(target, key) ) {
				ownKeysKeepers.get(target)!.delete(key);
				return true;
			}
			return false;
		},
		ownKeys (target :object) :Key[] {
			return [...ownKeysKeepers.get(target)!];
		},
	});

export const { of } = {
	of<target extends object> (object :target) :target {
		ownKeysKeepers.set(object, new Set(ownKeys(object) as Key[]));
		return new Proxy(object, handlers);
	}
};

export const { create } = {
	create<target extends object> (proto :target | null) :target {
		const object :target = Object_create(proto);
		ownKeysKeepers.set(object, new Set);
		return new Proxy(object, handlers);
	}
};

export const { extend } = {
	extend<Target extends { new (...args :any[]) :any }> (Class :Target) :Target {
		return new Proxy(Class, assign(Object_create(null), {
			construct (Class :Target, args :any[]) {
				const object = construct(Class, args);
				ownKeysKeepers.set(object, new Set(ownKeys(object) as Key[]));
				return new Proxy(object, handlers);
			},
		}));
	}
};

export default {
	version,
	of,
	create,
	extend,
	get default () { return this; },
};
