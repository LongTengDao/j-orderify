/*!
 * 模块名称：j-orderify
 * 模块功能：返回一个能保证给定对象的属性按此后添加顺序排列的 proxy，即使键名是 symbol，或整数 string。从属于“简计划”。
   　　　　　Return a proxy for given object, which can guarantee own keys are in setting order, even if the key name is symbol or int string. Belong to "Plan J".
 * 模块版本：5.2.0
 * 许可条款：LGPL-3.0
 * 所属作者：龙腾道 <LongTengDao@LongTengDao.com> (www.LongTengDao.com)
 * 问题反馈：https://GitHub.com/LongTengDao/j-orderify/issues
 * 项目主页：https://GitHub.com/LongTengDao/j-orderify/
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Ordered = factory());
}(this, function () { 'use strict';

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

    return _export;

}));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnNS4yLjAnOyIsImltcG9ydCBNYXAgZnJvbSAnLk1hcCc7XG5pbXBvcnQgKiBhcyBPYmplY3QgZnJvbSAnLk9iamVjdCc7XG5pbXBvcnQgUHJveHkgZnJvbSAnLlByb3h5JztcbmltcG9ydCAqIGFzIFJlZmxlY3QgZnJvbSAnLlJlZmxlY3QnO1xuaW1wb3J0IFNldCBmcm9tICcuU2V0JztcbmltcG9ydCBUeXBlRXJyb3IgZnJvbSAnLlR5cGVFcnJvcic7XG5pbXBvcnQgV2Vha01hcCBmcm9tICcuV2Vha01hcCc7XG5pbXBvcnQgdW5kZWZpbmVkIGZyb20gJy51bmRlZmluZWQnO1xuaW1wb3J0IGlzQXJyYXkgZnJvbSAnLkFycmF5LmlzQXJyYXknO1xuXG5pbXBvcnQgdmVyc2lvbiBmcm9tICcuL3ZlcnNpb24/dGV4dCc7XG5leHBvcnQgeyB2ZXJzaW9uIH07XG5cbnR5cGUgVGFyZ2V0ID0gb2JqZWN0O1xudHlwZSBQcm94eSA9IG9iamVjdDtcbnR5cGUgS2V5ID0gc3RyaW5nIHwgc3ltYm9sO1xudHlwZSBLZWVwZXIgPSBTZXQ8S2V5PjtcblxuY29uc3QgS2VlcGVyID0gU2V0O1xuY29uc3QgdGFyZ2V0MmtlZXBlciA6V2Vha01hcDxUYXJnZXQsIEtlZXBlcj4gPSBuZXcgV2Vha01hcDtcbmNvbnN0IHByb3h5MnRhcmdldCA6V2Vha01hcDxQcm94eSwgVGFyZ2V0PiA9IG5ldyBXZWFrTWFwO1xuY29uc3QgdGFyZ2V0MnByb3h5IDpXZWFrTWFwPFRhcmdldCwgUHJveHk+ID0gbmV3IFdlYWtNYXA7XG5cbmNvbnN0IHNldERlc2NyaXB0b3IgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCB7XG5cdHZhbHVlOiB1bmRlZmluZWQsXG5cdHdyaXRhYmxlOiB0cnVlLFxuXHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRjb25maWd1cmFibGU6IHRydWUsXG59KTtcbmNvbnN0IGhhbmRsZXJzID0gLyojX19QVVJFX18qL09iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwge1xuXHRhcHBseSAoRnVuY3Rpb24gOnsgKC4uLmFyZ3MgOmFueVtdKSA6YW55IH0sIHRoaXNBcmcgOmFueSwgYXJncyA6YW55W10pIHtcblx0XHRyZXR1cm4gb3JkZXJpZnkoUmVmbGVjdC5hcHBseShGdW5jdGlvbiwgdGhpc0FyZywgYXJncykpO1xuXHR9LFxuXHRjb25zdHJ1Y3QgKENsYXNzIDp7IG5ldyAoLi4uYXJncyA6YW55W10pIDphbnkgfSwgYXJncyA6YW55W10sIG5ld1RhcmdldCA6YW55KSB7XG5cdFx0cmV0dXJuIG9yZGVyaWZ5KFJlZmxlY3QuY29uc3RydWN0KENsYXNzLCBhcmdzLCBuZXdUYXJnZXQpKTtcblx0fSxcblx0ZGVmaW5lUHJvcGVydHkgKHRhcmdldCA6e30sIGtleSA6S2V5LCBkZXNjcmlwdG9yIDpQcm9wZXJ0eURlc2NyaXB0b3IpIDpib29sZWFuIHtcblx0XHRpZiAoIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIFBhcnRpYWxEZXNjcmlwdG9yKGRlc2NyaXB0b3IpKSApIHtcblx0XHRcdHRhcmdldDJrZWVwZXIuZ2V0KHRhcmdldCkhLmFkZChrZXkpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0ZGVsZXRlUHJvcGVydHkgKHRhcmdldCA6e30sIGtleSA6S2V5KSA6Ym9vbGVhbiB7XG5cdFx0aWYgKCBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwga2V5KSApIHtcblx0XHRcdHRhcmdldDJrZWVwZXIuZ2V0KHRhcmdldCkhLmRlbGV0ZShrZXkpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0b3duS2V5cyAodGFyZ2V0IDp7fSkgOktleVtdIHtcblx0XHRyZXR1cm4gWyAuLi50YXJnZXQya2VlcGVyLmdldCh0YXJnZXQpISBdO1xuXHR9LFxuXHRzZXQgKHRhcmdldCA6e30sIGtleSA6S2V5LCB2YWx1ZSA6YW55LCByZWNlaXZlciA6e30pIDpib29sZWFuIHtcblx0XHRpZiAoIGtleSBpbiB0YXJnZXQgKSB7IHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKTsgfVxuXHRcdHNldERlc2NyaXB0b3IudmFsdWUgPSB2YWx1ZTtcblx0XHRpZiAoIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNldERlc2NyaXB0b3IpICkge1xuXHRcdFx0dGFyZ2V0MmtlZXBlci5nZXQodGFyZ2V0KSEuYWRkKGtleSk7XG5cdFx0XHRzZXREZXNjcmlwdG9yLnZhbHVlID0gdW5kZWZpbmVkO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0c2V0RGVzY3JpcHRvci52YWx1ZSA9IHVuZGVmaW5lZDtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH0sXG59KTtcblxuZnVuY3Rpb24gbmV3UHJveHk8TyBleHRlbmRzIG9iamVjdD4gKHRhcmdldCA6Tywga2VlcGVyIDpLZWVwZXIpIDpPIHtcblx0dGFyZ2V0MmtlZXBlci5zZXQodGFyZ2V0LCBrZWVwZXIpO1xuXHRjb25zdCBwcm94eSA6TyA9IG5ldyBQcm94eSh0YXJnZXQsIGhhbmRsZXJzKTtcblx0cHJveHkydGFyZ2V0LnNldChwcm94eSwgdGFyZ2V0KTtcblx0cmV0dXJuIHByb3h5O1xufVxuXG5leHBvcnQgY29uc3QgeyBpc09yZGVyZWQgfSA9IHtcblx0aXNPcmRlcmVkIChvYmplY3QgOm9iamVjdCkgOmJvb2xlYW4ge1xuXHRcdHJldHVybiBwcm94eTJ0YXJnZXQuaGFzKG9iamVjdCk7XG5cdH1cbn07XG5leHBvcnQgY29uc3QgeyBpcyB9ID0ge1xuXHRpcyAob2JqZWN0MSA6b2JqZWN0LCBvYmplY3QyIDpvYmplY3QpIDpib29sZWFuIHtcblx0XHRyZXR1cm4gT2JqZWN0LmlzKFxuXHRcdFx0cHJveHkydGFyZ2V0LmdldChvYmplY3QxKSB8fCBvYmplY3QxLFxuXHRcdFx0cHJveHkydGFyZ2V0LmdldChvYmplY3QyKSB8fCBvYmplY3QyLFxuXHRcdCk7XG5cdH1cbn07XG5cbmV4cG9ydCBjb25zdCB7IG9yZGVyaWZ5IH0gPSB7XG5cdG9yZGVyaWZ5PE8gZXh0ZW5kcyBvYmplY3Q+IChvYmplY3QgOk8pIDpPIHtcblx0XHRpZiAoIHByb3h5MnRhcmdldC5oYXMob2JqZWN0KSApIHsgcmV0dXJuIG9iamVjdDsgfVxuXHRcdGxldCBwcm94eSA6TyB8IHVuZGVmaW5lZCA9IHRhcmdldDJwcm94eS5nZXQob2JqZWN0KSBhcyBPIHwgdW5kZWZpbmVkO1xuXHRcdGlmICggcHJveHkgKSB7IHJldHVybiBwcm94eTsgfVxuXHRcdHByb3h5ID0gbmV3UHJveHkob2JqZWN0LCBuZXcgS2VlcGVyKFJlZmxlY3Qub3duS2V5cyhvYmplY3QpKSk7XG5cdFx0dGFyZ2V0MnByb3h5LnNldChvYmplY3QsIHByb3h5KTtcblx0XHRyZXR1cm4gcHJveHk7XG5cdH1cbn07XG5mdW5jdGlvbiBnZXRJbnRlcm5hbCAob2JqZWN0IDpvYmplY3QpIDp7IHRhcmdldCA6YW55LCBrZWVwZXIgOktlZXBlciwgcHJveHkgOmFueSB9IHtcblx0Y29uc3QgdGFyZ2V0ID0gcHJveHkydGFyZ2V0LmdldChvYmplY3QpO1xuXHRpZiAoIHRhcmdldCApIHsgcmV0dXJuIHsgdGFyZ2V0LCBrZWVwZXI6IHRhcmdldDJrZWVwZXIuZ2V0KHRhcmdldCkhLCBwcm94eTogb2JqZWN0IH07IH1cblx0bGV0IHByb3h5ID0gdGFyZ2V0MnByb3h5LmdldChvYmplY3QpO1xuXHRpZiAoIHByb3h5ICkgeyByZXR1cm4geyB0YXJnZXQ6IG9iamVjdCwga2VlcGVyOiB0YXJnZXQya2VlcGVyLmdldChvYmplY3QpISwgcHJveHkgfTsgfVxuXHRjb25zdCBrZWVwZXIgPSBuZXcgS2VlcGVyKFJlZmxlY3Qub3duS2V5cyhvYmplY3QpKTtcblx0dGFyZ2V0MnByb3h5LnNldChvYmplY3QsIHByb3h5ID0gbmV3UHJveHkob2JqZWN0LCBrZWVwZXIpKTtcblx0cmV0dXJuIHsgdGFyZ2V0OiBvYmplY3QsIGtlZXBlciwgcHJveHkgfTtcbn1cblxuZnVuY3Rpb24gUGFydGlhbERlc2NyaXB0b3I8RCBleHRlbmRzIFByb3BlcnR5RGVzY3JpcHRvcj4gKHNvdXJjZSA6RCkgOkQge1xuXHRjb25zdCB0YXJnZXQgOkQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSApIHtcblx0XHR0YXJnZXQudmFsdWUgPSBzb3VyY2UudmFsdWU7XG5cdFx0aWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ3dyaXRhYmxlJykgKSB7IHRhcmdldC53cml0YWJsZSA9IHNvdXJjZS53cml0YWJsZTsgfVxuXHR9XG5cdGVsc2UgaWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ3dyaXRhYmxlJykgKSB7IHRhcmdldC53cml0YWJsZSA9IHNvdXJjZS53cml0YWJsZTsgfVxuXHRlbHNlIGlmICggc291cmNlLmhhc093blByb3BlcnR5KCdnZXQnKSApIHtcblx0XHR0YXJnZXQuZ2V0ID0gc291cmNlLmdldDtcblx0XHRpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgnc2V0JykgKSB7IHRhcmdldC5zZXQgPSBzb3VyY2Uuc2V0OyB9XG5cdH1cblx0ZWxzZSBpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgnc2V0JykgKSB7IHRhcmdldC5zZXQgPSBzb3VyY2Uuc2V0OyB9XG5cdGlmICggc291cmNlLmhhc093blByb3BlcnR5KCdlbnVtZXJhYmxlJykgKSB7IHRhcmdldC5lbnVtZXJhYmxlID0gc291cmNlLmVudW1lcmFibGU7IH1cblx0aWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ2NvbmZpZ3VyYWJsZScpICkgeyB0YXJnZXQuY29uZmlndXJhYmxlID0gc291cmNlLmNvbmZpZ3VyYWJsZTsgfVxuXHRyZXR1cm4gdGFyZ2V0O1xufVxuZnVuY3Rpb24gSW50ZXJuYWxEZXNjcmlwdG9yPEQgZXh0ZW5kcyBQcm9wZXJ0eURlc2NyaXB0b3I+IChzb3VyY2UgOkQpIDpEIHtcblx0Y29uc3QgdGFyZ2V0IDpEID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0aWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykgKSB7XG5cdFx0dGFyZ2V0LnZhbHVlID0gc291cmNlLnZhbHVlO1xuXHRcdHRhcmdldC53cml0YWJsZSA9IHNvdXJjZS53cml0YWJsZTtcblx0fVxuXHRlbHNlIHtcblx0XHR0YXJnZXQuZ2V0ID0gc291cmNlLmdldDtcblx0XHR0YXJnZXQuc2V0ID0gc291cmNlLnNldDtcblx0fVxuXHR0YXJnZXQuZW51bWVyYWJsZSA9IHNvdXJjZS5lbnVtZXJhYmxlO1xuXHR0YXJnZXQuY29uZmlndXJhYmxlID0gc291cmNlLmNvbmZpZ3VyYWJsZTtcblx0cmV0dXJuIHRhcmdldDtcbn1cbmZ1bmN0aW9uIEV4dGVybmFsRGVzY3JpcHRvcjxEIGV4dGVuZHMgUHJvcGVydHlEZXNjcmlwdG9yPiAoc291cmNlIDpEKSA6RCB7XG5cdGNvbnN0IHRhcmdldCA6RCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdGlmICggc291cmNlLmhhc093blByb3BlcnR5KCd2YWx1ZScpICkgeyB0YXJnZXQudmFsdWUgPSBzb3VyY2UudmFsdWU7IH1cblx0aWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ3dyaXRhYmxlJykgKSB7IHRhcmdldC53cml0YWJsZSA9IHNvdXJjZS53cml0YWJsZTsgfVxuXHRpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgnZ2V0JykgKSB7IHRhcmdldC5nZXQgPSBzb3VyY2UuZ2V0OyB9XG5cdGlmICggc291cmNlLmhhc093blByb3BlcnR5KCdzZXQnKSApIHsgdGFyZ2V0LnNldCA9IHNvdXJjZS5zZXQ7IH1cblx0aWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ2VudW1lcmFibGUnKSApIHsgdGFyZ2V0LmVudW1lcmFibGUgPSBzb3VyY2UuZW51bWVyYWJsZTsgfVxuXHRpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgnY29uZmlndXJhYmxlJykgKSB7IHRhcmdldC5jb25maWd1cmFibGUgPSBzb3VyY2UuY29uZmlndXJhYmxlOyB9XG5cdHJldHVybiB0YXJnZXQ7XG59XG5cbnR5cGUgVHlwZWRQcm9wZXJ0eURlc2NyaXB0b3JNYXA8Tz4gPSB7IFtrIGluIGtleW9mIE9dIDpUeXBlZFByb3BlcnR5RGVzY3JpcHRvcjxPW2tdPiB9O1xuZXhwb3J0IGNvbnN0IHsgY3JlYXRlIH0gPSB7XG5cdGNyZWF0ZTxPIGV4dGVuZHMgb2JqZWN0LCBPTyBleHRlbmRzIFByb3BlcnR5RGVzY3JpcHRvck1hcCA9IHt9PiAocHJvdG8gOm51bGwgfCBPLCBkZXNjcmlwdG9yTWFwPyA6T08pIDooIE9PIGV4dGVuZHMgVHlwZWRQcm9wZXJ0eURlc2NyaXB0b3JNYXA8aW5mZXIgTz4gPyBPIDoge30gKSAmIE8ge1xuXHRcdGlmICggZGVzY3JpcHRvck1hcD09PXVuZGVmaW5lZCApIHsgcmV0dXJuIG5ld1Byb3h5KE9iamVjdC5jcmVhdGUocHJvdG8pLCBuZXcgS2VlcGVyKTsgfVxuXHRcdGNvbnN0IHRhcmdldCA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuXHRcdGNvbnN0IGtlZXBlciA6S2VlcGVyID0gbmV3IEtlZXBlcjtcblx0XHRmb3IgKCBsZXQgbGFzdEluZGV4IDpudW1iZXIgPSBhcmd1bWVudHMubGVuZ3RoLTEsIGluZGV4IDpudW1iZXIgPSAxOyA7IGRlc2NyaXB0b3JNYXAgPSBhcmd1bWVudHNbKytpbmRleF0gKSB7XG5cdFx0XHRjb25zdCBrZXlzID0gUmVmbGVjdC5vd25LZXlzKGRlc2NyaXB0b3JNYXAhKTtcblx0XHRcdGZvciAoIGxldCBsZW5ndGggOm51bWJlciA9IGtleXMubGVuZ3RoLCBpbmRleCA6bnVtYmVyID0gMDsgaW5kZXg8bGVuZ3RoOyArK2luZGV4ICkge1xuXHRcdFx0XHRjb25zdCBrZXkgPSBrZXlzW2luZGV4XTtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBFeHRlcm5hbERlc2NyaXB0b3IoZGVzY3JpcHRvck1hcCFba2V5XSkpO1xuXHRcdFx0XHRrZWVwZXIuYWRkKGtleSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIGluZGV4PT09bGFzdEluZGV4ICkgeyByZXR1cm4gbmV3UHJveHkodGFyZ2V0LCBrZWVwZXIpOyB9XG5cdFx0fVxuXHR9XG59O1xuZXhwb3J0IGNvbnN0IHsgZGVmaW5lUHJvcGVydGllcyB9ID0ge1xuXHRkZWZpbmVQcm9wZXJ0aWVzPE8gZXh0ZW5kcyBvYmplY3QsIE9PIGV4dGVuZHMgUHJvcGVydHlEZXNjcmlwdG9yTWFwPiAob2JqZWN0IDpPLCBkZXNjcmlwdG9yTWFwIDpPTykgOiggT08gZXh0ZW5kcyBUeXBlZFByb3BlcnR5RGVzY3JpcHRvck1hcDxpbmZlciBPPiA/IE8gOiBuZXZlciApICYgTyB7XG5cdFx0Y29uc3QgeyB0YXJnZXQsIGtlZXBlciwgcHJveHkgfSA9IGdldEludGVybmFsKG9iamVjdCk7XG5cdFx0Zm9yICggbGV0IGxhc3RJbmRleCA6bnVtYmVyID0gYXJndW1lbnRzLmxlbmd0aC0xLCBpbmRleCA6bnVtYmVyID0gMTsgOyBkZXNjcmlwdG9yTWFwID0gYXJndW1lbnRzWysraW5kZXhdICkge1xuXHRcdFx0Y29uc3Qga2V5cyA9IFJlZmxlY3Qub3duS2V5cyhkZXNjcmlwdG9yTWFwKTtcblx0XHRcdGZvciAoIGxldCBsZW5ndGggOm51bWJlciA9IGtleXMubGVuZ3RoLCBpbmRleCA6bnVtYmVyID0gMDsgaW5kZXg8bGVuZ3RoOyArK2luZGV4ICkge1xuXHRcdFx0XHRjb25zdCBrZXkgPSBrZXlzW2luZGV4XTtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBFeHRlcm5hbERlc2NyaXB0b3IoZGVzY3JpcHRvck1hcFtrZXldKSk7XG5cdFx0XHRcdGtlZXBlci5hZGQoa2V5KTtcblx0XHRcdH1cblx0XHRcdGlmICggaW5kZXg9PT1sYXN0SW5kZXggKSB7IHJldHVybiBwcm94eTsgfVxuXHRcdH1cblx0fVxufTtcblxuZXhwb3J0IGNvbnN0IHsgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyB9ID0ge1xuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzPE8gZXh0ZW5kcyBvYmplY3Q+IChvYmplY3QgOk8pIDp7IFtrIGluIGtleW9mIE9dIDpUeXBlZFByb3BlcnR5RGVzY3JpcHRvcjxPW2tdPiB9IHtcblx0XHRjb25zdCBkZXNjcmlwdG9ycyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdFx0Y29uc3Qga2VlcGVyIDpLZWVwZXIgPSBuZXcgS2VlcGVyO1xuXHRcdGNvbnN0IGtleXMgPSBSZWZsZWN0Lm93bktleXMob2JqZWN0KTtcblx0XHRmb3IgKCBsZXQgbGVuZ3RoIDpudW1iZXIgPSBrZXlzLmxlbmd0aCwgaW5kZXggOm51bWJlciA9IDA7IGluZGV4PGxlbmd0aDsgKytpbmRleCApIHtcblx0XHRcdGNvbnN0IGtleSA9IGtleXNbaW5kZXhdO1xuXHRcdFx0ZGVzY3JpcHRvcnNba2V5XSA9IEludGVybmFsRGVzY3JpcHRvcihPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwga2V5KSEpO1xuXHRcdFx0a2VlcGVyLmFkZChrZXkpO1xuXHRcdH1cblx0XHRyZXR1cm4gbmV3UHJveHkoZGVzY3JpcHRvcnMsIGtlZXBlcik7XG5cdH1cbn07XG5cbmZ1bmN0aW9uIGtlZXBlckFkZEtleXMgKGtlZXBlciA6S2VlcGVyLCBvYmplY3QgOnt9KSA6dm9pZCB7XG5cdGNvbnN0IGtleXMgOktleVtdID0gUmVmbGVjdC5vd25LZXlzKG9iamVjdCk7XG5cdGZvciAoIGxldCBsZW5ndGggOm51bWJlciA9IGtleXMubGVuZ3RoLCBpbmRleCA6bnVtYmVyID0gMDsgaW5kZXg8bGVuZ3RoOyArK2luZGV4ICkge1xuXHRcdGtlZXBlci5hZGQoa2V5c1tpbmRleF0pO1xuXHR9XG59XG5mdW5jdGlvbiBOVUxMX2Zyb20gKHNvdXJjZSA6e31bXSB8IHt9LCBkZWZpbmUgOmJvb2xlYW4pIDphbnkge1xuXHRjb25zdCB0YXJnZXQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRjb25zdCBrZWVwZXIgOktlZXBlciA9IG5ldyBLZWVwZXI7XG5cdGlmICggZGVmaW5lICkge1xuXHRcdGlmICggaXNBcnJheShzb3VyY2UpICkge1xuXHRcdFx0Zm9yICggbGV0IGxlbmd0aCA6bnVtYmVyID0gc291cmNlLmxlbmd0aCwgaW5kZXggOm51bWJlciA9IDA7IGluZGV4PGxlbmd0aDsgKytpbmRleCApIHtcblx0XHRcdFx0Y29uc3QgZGVzY3JpcHRvck1hcCA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlW2luZGV4XSk7XG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgZGVzY3JpcHRvck1hcCk7XG5cdFx0XHRcdGtlZXBlckFkZEtleXMoa2VlcGVyLCBkZXNjcmlwdG9yTWFwKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRjb25zdCBkZXNjcmlwdG9yTWFwID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpO1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBkZXNjcmlwdG9yTWFwKTtcblx0XHRcdGtlZXBlckFkZEtleXMoa2VlcGVyLCBkZXNjcmlwdG9yTWFwKTtcblx0XHR9XG5cdH1cblx0ZWxzZSB7XG5cdFx0aWYgKCBpc0FycmF5KHNvdXJjZSkgKSB7XG5cdFx0XHRPYmplY3QuYXNzaWduKHRhcmdldCwgLi4uc291cmNlKTtcblx0XHRcdGZvciAoIGxldCBsZW5ndGggOm51bWJlciA9IHNvdXJjZS5sZW5ndGgsIGluZGV4IDpudW1iZXIgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0XHRcdGtlZXBlckFkZEtleXMoa2VlcGVyLCBzb3VyY2VbaW5kZXhdKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKTtcblx0XHRcdGtlZXBlckFkZEtleXMoa2VlcGVyLCBzb3VyY2UpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gbmV3UHJveHkodGFyZ2V0LCBrZWVwZXIpO1xufVxuZnVuY3Rpb24gdGhyb3dDb25zdHJ1Y3RpbmcgKCkgOm5ldmVyIHsgdGhyb3cgVHlwZUVycm9yKGBOVUxMIGNhbm5vdCBiZSBpbnZva2VkIHdpdGggJ25ldydgKTsgfVxuZXhwb3J0IGNvbnN0IE5VTEwgOnR5cGVvZiBpbXBvcnQoJy4vZXhwb3J0LmQnKS5OVUxMID1cblx0LyojX19QVVJFX18qL1xuXHRmdW5jdGlvbiAodGhpcyA6YW55KSB7XG5cdFx0J3VzZSBzdHJpY3QnO1xuXHRcdGNvbnN0IE5VTEwgOmFueSA9IGZ1bmN0aW9uIDxPIGV4dGVuZHMge30+ICh0aGlzIDpvYmplY3QsIHNvdXJjZT8gOk9bXSB8IE8sIGRlZmluZT8gOmJvb2xlYW4pIDpPIHtcblx0XHRcdHJldHVybiBuZXcudGFyZ2V0XG5cdFx0XHRcdD8gbmV3LnRhcmdldD09PU5VTExcblx0XHRcdFx0XHQ/IC8qI19fUFVSRV9fKi8gdGhyb3dDb25zdHJ1Y3RpbmcoKVxuXHRcdFx0XHRcdDogLyojX19QVVJFX18qLyBuZXdQcm94eSh0aGlzLCBuZXcgS2VlcGVyKVxuXHRcdFx0XHQ6IC8qI19fUFVSRV9fKi8gTlVMTF9mcm9tKHNvdXJjZSEsIGRlZmluZSEpO1xuXHRcdH07XG5cdFx0TlVMTC5wcm90b3R5cGUgPSBudWxsO1xuXHRcdC8vZGVsZXRlIE5VTEwubmFtZTtcblx0XHQvL2RlbGV0ZSBOVUxMLmxlbmd0aDtcblx0XHRPYmplY3QuZnJlZXplKE5VTEwpO1xuXHRcdHJldHVybiBOVUxMO1xuXHR9KCk7XG5leHBvcnQgdHlwZSBOVUxMPFZhbHVlVHlwZT4gPSBpbXBvcnQoJy4vZXhwb3J0LmQnKS5OVUxMPFZhbHVlVHlwZT47XG5cbmNvbnN0IFByb3BlcnR5S2V5IDphbnkgPVxuXHQvKiNfX1BVUkVfXyovIG5ldyBQcm94eSh7fSwgeyBnZXQ8S2V5IGV4dGVuZHMgc3RyaW5nIHwgc3ltYm9sPiAodGFyZ2V0IDp7fSwga2V5IDpLZXkpIDpLZXkgeyByZXR1cm4ga2V5OyB9IH0pO1xuZXhwb3J0IGNvbnN0IHsgZnJvbUVudHJpZXMgfSA9IHtcblx0ZnJvbUVudHJpZXM8SyBleHRlbmRzIHN0cmluZyB8IHN5bWJvbCwgViBleHRlbmRzIGFueSwgTyBleHRlbmRzIG9iamVjdD4gKGVudHJpZXMgOkl0ZXJhYmxlPHsgcmVhZG9ubHkgMCA6SywgcmVhZG9ubHkgMSA6ViB9PiwgcHJvdG8/IDpudWxsIHwgTykgOnsgW2sgaW4gS10gOlYgfSAmIE8ge1xuXHRcdGNvbnN0IGtlZXBlciA6S2VlcGVyID0gbmV3IEtlZXBlcjtcblx0XHRjb25zdCBtYXAgOk1hcDxLLCBWPiA9IG5ldyBNYXA7XG5cdFx0Zm9yICggbGV0IHsgMDoga2V5LCAxOiB2YWx1ZSB9IG9mIGVudHJpZXMgKSB7XG5cdFx0XHRrZXkgPSBQcm9wZXJ0eUtleVtrZXldO1xuXHRcdFx0a2VlcGVyLmFkZChrZXkpO1xuXHRcdFx0bWFwLnNldChrZXksIHZhbHVlKTtcblx0XHR9XG5cdFx0Y29uc3QgdGFyZ2V0ID0gT2JqZWN0LmZyb21FbnRyaWVzKG1hcCk7XG5cdFx0cmV0dXJuIG5ld1Byb3h5KFxuXHRcdFx0cHJvdG89PT11bmRlZmluZWQgPyB0YXJnZXQgOlxuXHRcdFx0XHRwcm90bz09PW51bGwgPyBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIHRhcmdldCkgOlxuXHRcdFx0XHRcdE9iamVjdC5jcmVhdGUodGFyZ2V0LCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHByb3RvKSksXG5cdFx0XHRrZWVwZXJcblx0XHQpO1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCAvKiNfX1BVUkVfXyovICggZnVuY3Rpb24gKCkge1xuXHRjb25zdCBleHBvcnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0T2JqZWN0LmFzc2lnbihleHBvcnRzLCB7XG5cdFx0dmVyc2lvbixcblx0XHRpc09yZGVyZWQsXG5cdFx0aXMsXG5cdFx0b3JkZXJpZnksXG5cdFx0Y3JlYXRlLFxuXHRcdGRlZmluZVByb3BlcnRpZXMsXG5cdFx0TlVMTCxcblx0XHRmcm9tRW50cmllcyxcblx0XHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzLFxuXHRcdGRlZmF1bHQ6IGV4cG9ydHMsXG5cdH0pO1xuXHR2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdGRlc2NyaXB0b3IudmFsdWUgPSAnTW9kdWxlJztcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgZGVzY3JpcHRvcik7XG5cdE9iamVjdC5mcmVlemUoZXhwb3J0cyk7XG5cdHJldHVybiBleHBvcnRzO1xufSApKCk7Il0sIm5hbWVzIjpbIk9iamVjdC5hc3NpZ24iLCJPYmplY3QuY3JlYXRlIiwidW5kZWZpbmVkIiwiUmVmbGVjdC5hcHBseSIsIlJlZmxlY3QuY29uc3RydWN0IiwiUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSIsIlJlZmxlY3QuZGVsZXRlUHJvcGVydHkiLCJSZWZsZWN0LnNldCIsImlzIiwiT2JqZWN0LmlzIiwiUmVmbGVjdC5vd25LZXlzIiwiY3JlYXRlIiwiT2JqZWN0LmRlZmluZVByb3BlcnR5IiwiZGVmaW5lUHJvcGVydGllcyIsIk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJPYmplY3QuZGVmaW5lUHJvcGVydGllcyIsIk9iamVjdC5mcmVlemUiLCJmcm9tRW50cmllcyIsIk9iamVjdC5mcm9tRW50cmllcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9CQUFlLE9BQU87OzRCQUFDLHhCQ2tCdkIsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ25CLE1BQU0s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