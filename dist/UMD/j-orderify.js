﻿/*!
 * 模块名称：j-orderify
 * 模块功能：返回一个能保证给定对象的属性按此后添加顺序排列的 proxy，即使键名是 symbol，或整数 string。
   　　　　　Return a proxy for given object, which can guarantee own keys are in setting order, even if the key name is symbol or int string.
 * 模块版本：5.0.0
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

    const version = '5.0.0';

    const Keeper = Set;
    const target2keeper = new WeakMap;
    const proxy2target = new WeakMap;
    const target2proxy = new WeakMap;
    const setDescriptor = /*#__PURE__*/ function () {
        var setDescriptor = create(null);
        setDescriptor.value = undefined$1;
        setDescriptor.writable = true;
        setDescriptor.enumerable = true;
        setDescriptor.configurable = true;
        return setDescriptor;
    }();
    const handlers = 
    /*#__PURE__*/
    assign(create(null), {
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
    const _export = (
    /*#__PURE__*/
    freeze({
        version,
        isOrdered,
        is: is$1,
        orderify,
        create: create$1,
        defineProperties: defineProperties$1,
        NULL,
        fromEntries: fromEntries$1,
        getOwnPropertyDescriptors,
        get default() { return this; },
    }));

    return _export;

}));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnNS4wLjAnOyIsImltcG9ydCBNYXAgZnJvbSAnLk1hcCc7XG5pbXBvcnQgKiBhcyBPYmplY3QgZnJvbSAnLk9iamVjdCc7XG5pbXBvcnQgUHJveHkgZnJvbSAnLlByb3h5JztcbmltcG9ydCAqIGFzIFJlZmxlY3QgZnJvbSAnLlJlZmxlY3QnO1xuaW1wb3J0IFNldCBmcm9tICcuU2V0JztcbmltcG9ydCBUeXBlRXJyb3IgZnJvbSAnLlR5cGVFcnJvcic7XG5pbXBvcnQgV2Vha01hcCBmcm9tICcuV2Vha01hcCc7XG5pbXBvcnQgdW5kZWZpbmVkIGZyb20gJy51bmRlZmluZWQnO1xuaW1wb3J0IGlzQXJyYXkgZnJvbSAnLkFycmF5LmlzQXJyYXknO1xuXG5pbXBvcnQgdmVyc2lvbiBmcm9tICcuL3ZlcnNpb24/dGV4dCc7XG5leHBvcnQgeyB2ZXJzaW9uIH07XG5cbnR5cGUgVGFyZ2V0ID0gb2JqZWN0O1xudHlwZSBQcm94eSA9IG9iamVjdDtcbnR5cGUgS2V5ID0gc3RyaW5nIHwgc3ltYm9sO1xudHlwZSBLZWVwZXIgPSBTZXQ8S2V5PjtcblxuY29uc3QgS2VlcGVyID0gU2V0O1xuY29uc3QgdGFyZ2V0MmtlZXBlciA6V2Vha01hcDxUYXJnZXQsIEtlZXBlcj4gPSBuZXcgV2Vha01hcDtcbmNvbnN0IHByb3h5MnRhcmdldCA6V2Vha01hcDxQcm94eSwgVGFyZ2V0PiA9IG5ldyBXZWFrTWFwO1xuY29uc3QgdGFyZ2V0MnByb3h5IDpXZWFrTWFwPFRhcmdldCwgUHJveHk+ID0gbmV3IFdlYWtNYXA7XG5cbmNvbnN0IHNldERlc2NyaXB0b3IgPSAvKiNfX1BVUkVfXyovIGZ1bmN0aW9uICgpIHtcblx0dmFyIHNldERlc2NyaXB0b3IgOlByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdHNldERlc2NyaXB0b3IudmFsdWUgPSB1bmRlZmluZWQ7XG5cdHNldERlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuXHRzZXREZXNjcmlwdG9yLmVudW1lcmFibGUgPSB0cnVlO1xuXHRzZXREZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG5cdHJldHVybiBzZXREZXNjcmlwdG9yO1xufSgpO1xuY29uc3QgaGFuZGxlcnMgOm9iamVjdCA9XG5cdC8qI19fUFVSRV9fKi9cblx0T2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCB7XG5cdFx0YXBwbHkgKEZ1bmN0aW9uIDp7ICguLi5hcmdzIDphbnlbXSkgOmFueSB9LCB0aGlzQXJnIDphbnksIGFyZ3MgOmFueVtdKSB7XG5cdFx0XHRyZXR1cm4gb3JkZXJpZnkoUmVmbGVjdC5hcHBseShGdW5jdGlvbiwgdGhpc0FyZywgYXJncykpO1xuXHRcdH0sXG5cdFx0Y29uc3RydWN0IChDbGFzcyA6eyBuZXcgKC4uLmFyZ3MgOmFueVtdKSA6YW55IH0sIGFyZ3MgOmFueVtdLCBuZXdUYXJnZXQgOmFueSkge1xuXHRcdFx0cmV0dXJuIG9yZGVyaWZ5KFJlZmxlY3QuY29uc3RydWN0KENsYXNzLCBhcmdzLCBuZXdUYXJnZXQpKTtcblx0XHR9LFxuXHRcdGRlZmluZVByb3BlcnR5ICh0YXJnZXQgOnt9LCBrZXkgOktleSwgZGVzY3JpcHRvciA6UHJvcGVydHlEZXNjcmlwdG9yKSA6Ym9vbGVhbiB7XG5cdFx0XHRpZiAoIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIFBhcnRpYWxEZXNjcmlwdG9yKGRlc2NyaXB0b3IpKSApIHtcblx0XHRcdFx0dGFyZ2V0MmtlZXBlci5nZXQodGFyZ2V0KSEuYWRkKGtleSk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sXG5cdFx0ZGVsZXRlUHJvcGVydHkgKHRhcmdldCA6e30sIGtleSA6S2V5KSA6Ym9vbGVhbiB7XG5cdFx0XHRpZiAoIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBrZXkpICkge1xuXHRcdFx0XHR0YXJnZXQya2VlcGVyLmdldCh0YXJnZXQpIS5kZWxldGUoa2V5KTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSxcblx0XHRvd25LZXlzICh0YXJnZXQgOnt9KSA6S2V5W10ge1xuXHRcdFx0cmV0dXJuIFsuLi50YXJnZXQya2VlcGVyLmdldCh0YXJnZXQpIV07XG5cdFx0fSxcblx0XHRzZXQgKHRhcmdldCA6e30sIGtleSA6S2V5LCB2YWx1ZSA6YW55LCByZWNlaXZlciA6e30pIDpib29sZWFuIHtcblx0XHRcdGlmICgga2V5IGluIHRhcmdldCApIHsgcmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpOyB9XG5cdFx0XHRzZXREZXNjcmlwdG9yLnZhbHVlID0gdmFsdWU7XG5cdFx0XHRpZiAoIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNldERlc2NyaXB0b3IpICkge1xuXHRcdFx0XHR0YXJnZXQya2VlcGVyLmdldCh0YXJnZXQpIS5hZGQoa2V5KTtcblx0XHRcdFx0c2V0RGVzY3JpcHRvci52YWx1ZSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c2V0RGVzY3JpcHRvci52YWx1ZSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0sXG5cdH0pO1xuXG5mdW5jdGlvbiBuZXdQcm94eTxPIGV4dGVuZHMgb2JqZWN0PiAodGFyZ2V0IDpPLCBrZWVwZXIgOktlZXBlcikgOk8ge1xuXHR0YXJnZXQya2VlcGVyLnNldCh0YXJnZXQsIGtlZXBlcik7XG5cdGNvbnN0IHByb3h5IDpPID0gbmV3IFByb3h5KHRhcmdldCwgaGFuZGxlcnMpO1xuXHRwcm94eTJ0YXJnZXQuc2V0KHByb3h5LCB0YXJnZXQpO1xuXHRyZXR1cm4gcHJveHk7XG59XG5cbmV4cG9ydCBjb25zdCB7IGlzT3JkZXJlZCB9ID0ge1xuXHRpc09yZGVyZWQgKG9iamVjdCA6b2JqZWN0KSA6Ym9vbGVhbiB7XG5cdFx0cmV0dXJuIHByb3h5MnRhcmdldC5oYXMob2JqZWN0KTtcblx0fVxufTtcbmV4cG9ydCBjb25zdCB7IGlzIH0gPSB7XG5cdGlzIChvYmplY3QxIDpvYmplY3QsIG9iamVjdDIgOm9iamVjdCkgOmJvb2xlYW4ge1xuXHRcdHJldHVybiBPYmplY3QuaXMoXG5cdFx0XHRwcm94eTJ0YXJnZXQuZ2V0KG9iamVjdDEpIHx8IG9iamVjdDEsXG5cdFx0XHRwcm94eTJ0YXJnZXQuZ2V0KG9iamVjdDIpIHx8IG9iamVjdDIsXG5cdFx0KTtcblx0fVxufTtcblxuZXhwb3J0IGNvbnN0IHsgb3JkZXJpZnkgfSA9IHtcblx0b3JkZXJpZnk8TyBleHRlbmRzIG9iamVjdD4gKG9iamVjdCA6TykgOk8ge1xuXHRcdGlmICggcHJveHkydGFyZ2V0LmhhcyhvYmplY3QpICkgeyByZXR1cm4gb2JqZWN0OyB9XG5cdFx0bGV0IHByb3h5IDpPIHwgdW5kZWZpbmVkID0gdGFyZ2V0MnByb3h5LmdldChvYmplY3QpIGFzIE8gfCB1bmRlZmluZWQ7XG5cdFx0aWYgKCBwcm94eSApIHsgcmV0dXJuIHByb3h5OyB9XG5cdFx0cHJveHkgPSBuZXdQcm94eShvYmplY3QsIG5ldyBLZWVwZXIoUmVmbGVjdC5vd25LZXlzKG9iamVjdCkpKTtcblx0XHR0YXJnZXQycHJveHkuc2V0KG9iamVjdCwgcHJveHkpO1xuXHRcdHJldHVybiBwcm94eTtcblx0fVxufTtcbmZ1bmN0aW9uIGdldEludGVybmFsIChvYmplY3QgOm9iamVjdCkgOnsgdGFyZ2V0IDphbnksIGtlZXBlciA6S2VlcGVyLCBwcm94eSA6YW55IH0ge1xuXHRjb25zdCB0YXJnZXQgPSBwcm94eTJ0YXJnZXQuZ2V0KG9iamVjdCk7XG5cdGlmICggdGFyZ2V0ICkgeyByZXR1cm4geyB0YXJnZXQsIGtlZXBlcjogdGFyZ2V0MmtlZXBlci5nZXQodGFyZ2V0KSEsIHByb3h5OiBvYmplY3QgfTsgfVxuXHRsZXQgcHJveHkgPSB0YXJnZXQycHJveHkuZ2V0KG9iamVjdCk7XG5cdGlmICggcHJveHkgKSB7IHJldHVybiB7IHRhcmdldDogb2JqZWN0LCBrZWVwZXI6IHRhcmdldDJrZWVwZXIuZ2V0KG9iamVjdCkhLCBwcm94eSB9OyB9XG5cdGNvbnN0IGtlZXBlciA9IG5ldyBLZWVwZXIoUmVmbGVjdC5vd25LZXlzKG9iamVjdCkpO1xuXHR0YXJnZXQycHJveHkuc2V0KG9iamVjdCwgcHJveHkgPSBuZXdQcm94eShvYmplY3QsIGtlZXBlcikpO1xuXHRyZXR1cm4geyB0YXJnZXQ6IG9iamVjdCwga2VlcGVyLCBwcm94eSB9O1xufVxuXG5mdW5jdGlvbiBQYXJ0aWFsRGVzY3JpcHRvcjxEIGV4dGVuZHMgUHJvcGVydHlEZXNjcmlwdG9yPiAoc291cmNlIDpEKSA6RCB7XG5cdGNvbnN0IHRhcmdldCA6RCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdGlmICggc291cmNlLmhhc093blByb3BlcnR5KCd2YWx1ZScpICkge1xuXHRcdHRhcmdldC52YWx1ZSA9IHNvdXJjZS52YWx1ZTtcblx0XHRpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgnd3JpdGFibGUnKSApIHsgdGFyZ2V0LndyaXRhYmxlID0gc291cmNlLndyaXRhYmxlOyB9XG5cdH1cblx0ZWxzZSBpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgnd3JpdGFibGUnKSApIHsgdGFyZ2V0LndyaXRhYmxlID0gc291cmNlLndyaXRhYmxlOyB9XG5cdGVsc2UgaWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ2dldCcpICkge1xuXHRcdHRhcmdldC5nZXQgPSBzb3VyY2UuZ2V0O1xuXHRcdGlmICggc291cmNlLmhhc093blByb3BlcnR5KCdzZXQnKSApIHsgdGFyZ2V0LnNldCA9IHNvdXJjZS5zZXQ7IH1cblx0fVxuXHRlbHNlIGlmICggc291cmNlLmhhc093blByb3BlcnR5KCdzZXQnKSApIHsgdGFyZ2V0LnNldCA9IHNvdXJjZS5zZXQ7IH1cblx0aWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ2VudW1lcmFibGUnKSApIHsgdGFyZ2V0LmVudW1lcmFibGUgPSBzb3VyY2UuZW51bWVyYWJsZTsgfVxuXHRpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgnY29uZmlndXJhYmxlJykgKSB7IHRhcmdldC5jb25maWd1cmFibGUgPSBzb3VyY2UuY29uZmlndXJhYmxlOyB9XG5cdHJldHVybiB0YXJnZXQ7XG59XG5mdW5jdGlvbiBJbnRlcm5hbERlc2NyaXB0b3I8RCBleHRlbmRzIFByb3BlcnR5RGVzY3JpcHRvcj4gKHNvdXJjZSA6RCkgOkQge1xuXHRjb25zdCB0YXJnZXQgOkQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSApIHtcblx0XHR0YXJnZXQudmFsdWUgPSBzb3VyY2UudmFsdWU7XG5cdFx0dGFyZ2V0LndyaXRhYmxlID0gc291cmNlLndyaXRhYmxlO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHRhcmdldC5nZXQgPSBzb3VyY2UuZ2V0O1xuXHRcdHRhcmdldC5zZXQgPSBzb3VyY2Uuc2V0O1xuXHR9XG5cdHRhcmdldC5lbnVtZXJhYmxlID0gc291cmNlLmVudW1lcmFibGU7XG5cdHRhcmdldC5jb25maWd1cmFibGUgPSBzb3VyY2UuY29uZmlndXJhYmxlO1xuXHRyZXR1cm4gdGFyZ2V0O1xufVxuZnVuY3Rpb24gRXh0ZXJuYWxEZXNjcmlwdG9yPEQgZXh0ZW5kcyBQcm9wZXJ0eURlc2NyaXB0b3I+IChzb3VyY2UgOkQpIDpEIHtcblx0Y29uc3QgdGFyZ2V0IDpEID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0aWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykgKSB7IHRhcmdldC52YWx1ZSA9IHNvdXJjZS52YWx1ZTsgfVxuXHRpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgnd3JpdGFibGUnKSApIHsgdGFyZ2V0LndyaXRhYmxlID0gc291cmNlLndyaXRhYmxlOyB9XG5cdGlmICggc291cmNlLmhhc093blByb3BlcnR5KCdnZXQnKSApIHsgdGFyZ2V0LmdldCA9IHNvdXJjZS5nZXQ7IH1cblx0aWYgKCBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ3NldCcpICkgeyB0YXJnZXQuc2V0ID0gc291cmNlLnNldDsgfVxuXHRpZiAoIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSgnZW51bWVyYWJsZScpICkgeyB0YXJnZXQuZW51bWVyYWJsZSA9IHNvdXJjZS5lbnVtZXJhYmxlOyB9XG5cdGlmICggc291cmNlLmhhc093blByb3BlcnR5KCdjb25maWd1cmFibGUnKSApIHsgdGFyZ2V0LmNvbmZpZ3VyYWJsZSA9IHNvdXJjZS5jb25maWd1cmFibGU7IH1cblx0cmV0dXJuIHRhcmdldDtcbn1cblxudHlwZSBUeXBlZFByb3BlcnR5RGVzY3JpcHRvck1hcDxPPiA9IHsgW2sgaW4ga2V5b2YgT10gOlR5cGVkUHJvcGVydHlEZXNjcmlwdG9yPE9ba10+IH07XG5leHBvcnQgY29uc3QgeyBjcmVhdGUgfSA9IHtcblx0Y3JlYXRlPE8gZXh0ZW5kcyBvYmplY3QsIE9PIGV4dGVuZHMgUHJvcGVydHlEZXNjcmlwdG9yTWFwID0ge30+IChwcm90byA6bnVsbCB8IE8sIGRlc2NyaXB0b3JNYXA/IDpPTykgOiggT08gZXh0ZW5kcyBUeXBlZFByb3BlcnR5RGVzY3JpcHRvck1hcDxpbmZlciBPPiA/IE8gOiB7fSApICYgTyB7XG5cdFx0aWYgKCBkZXNjcmlwdG9yTWFwPT09dW5kZWZpbmVkICkgeyByZXR1cm4gbmV3UHJveHkoT2JqZWN0LmNyZWF0ZShwcm90byksIG5ldyBLZWVwZXIpOyB9XG5cdFx0Y29uc3QgdGFyZ2V0ID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XG5cdFx0Y29uc3Qga2VlcGVyIDpLZWVwZXIgPSBuZXcgS2VlcGVyO1xuXHRcdGZvciAoIGxldCBsYXN0SW5kZXggOm51bWJlciA9IGFyZ3VtZW50cy5sZW5ndGgtMSwgaW5kZXggOm51bWJlciA9IDE7IDsgZGVzY3JpcHRvck1hcCA9IGFyZ3VtZW50c1srK2luZGV4XSApIHtcblx0XHRcdGNvbnN0IGtleXMgPSBSZWZsZWN0Lm93bktleXMoZGVzY3JpcHRvck1hcCEpO1xuXHRcdFx0Zm9yICggbGV0IGxlbmd0aCA6bnVtYmVyID0ga2V5cy5sZW5ndGgsIGluZGV4IDpudW1iZXIgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0XHRcdGNvbnN0IGtleSA9IGtleXNbaW5kZXhdO1xuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIEV4dGVybmFsRGVzY3JpcHRvcihkZXNjcmlwdG9yTWFwIVtrZXldKSk7XG5cdFx0XHRcdGtlZXBlci5hZGQoa2V5KTtcblx0XHRcdH1cblx0XHRcdGlmICggaW5kZXg9PT1sYXN0SW5kZXggKSB7IHJldHVybiBuZXdQcm94eSh0YXJnZXQsIGtlZXBlcik7IH1cblx0XHR9XG5cdH1cbn07XG5leHBvcnQgY29uc3QgeyBkZWZpbmVQcm9wZXJ0aWVzIH0gPSB7XG5cdGRlZmluZVByb3BlcnRpZXM8TyBleHRlbmRzIG9iamVjdCwgT08gZXh0ZW5kcyBQcm9wZXJ0eURlc2NyaXB0b3JNYXA+IChvYmplY3QgOk8sIGRlc2NyaXB0b3JNYXAgOk9PKSA6KCBPTyBleHRlbmRzIFR5cGVkUHJvcGVydHlEZXNjcmlwdG9yTWFwPGluZmVyIE8+ID8gTyA6IG5ldmVyICkgJiBPIHtcblx0XHRjb25zdCB7IHRhcmdldCwga2VlcGVyLCBwcm94eSB9ID0gZ2V0SW50ZXJuYWwob2JqZWN0KTtcblx0XHRmb3IgKCBsZXQgbGFzdEluZGV4IDpudW1iZXIgPSBhcmd1bWVudHMubGVuZ3RoLTEsIGluZGV4IDpudW1iZXIgPSAxOyA7IGRlc2NyaXB0b3JNYXAgPSBhcmd1bWVudHNbKytpbmRleF0gKSB7XG5cdFx0XHRjb25zdCBrZXlzID0gUmVmbGVjdC5vd25LZXlzKGRlc2NyaXB0b3JNYXApO1xuXHRcdFx0Zm9yICggbGV0IGxlbmd0aCA6bnVtYmVyID0ga2V5cy5sZW5ndGgsIGluZGV4IDpudW1iZXIgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0XHRcdGNvbnN0IGtleSA9IGtleXNbaW5kZXhdO1xuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIEV4dGVybmFsRGVzY3JpcHRvcihkZXNjcmlwdG9yTWFwW2tleV0pKTtcblx0XHRcdFx0a2VlcGVyLmFkZChrZXkpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCBpbmRleD09PWxhc3RJbmRleCApIHsgcmV0dXJuIHByb3h5OyB9XG5cdFx0fVxuXHR9XG59O1xuXG5leHBvcnQgY29uc3QgeyBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIH0gPSB7XG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvcnM8TyBleHRlbmRzIG9iamVjdD4gKG9iamVjdCA6TykgOnsgW2sgaW4ga2V5b2YgT10gOlR5cGVkUHJvcGVydHlEZXNjcmlwdG9yPE9ba10+IH0ge1xuXHRcdGNvbnN0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0XHRjb25zdCBrZWVwZXIgOktlZXBlciA9IG5ldyBLZWVwZXI7XG5cdFx0Y29uc3Qga2V5cyA9IFJlZmxlY3Qub3duS2V5cyhvYmplY3QpO1xuXHRcdGZvciAoIGxldCBsZW5ndGggOm51bWJlciA9IGtleXMubGVuZ3RoLCBpbmRleCA6bnVtYmVyID0gMDsgaW5kZXg8bGVuZ3RoOyArK2luZGV4ICkge1xuXHRcdFx0Y29uc3Qga2V5ID0ga2V5c1tpbmRleF07XG5cdFx0XHRkZXNjcmlwdG9yc1trZXldID0gSW50ZXJuYWxEZXNjcmlwdG9yKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBrZXkpISk7XG5cdFx0XHRrZWVwZXIuYWRkKGtleSk7XG5cdFx0fVxuXHRcdHJldHVybiBuZXdQcm94eShkZXNjcmlwdG9ycywga2VlcGVyKTtcblx0fVxufTtcblxuZnVuY3Rpb24ga2VlcGVyQWRkS2V5cyAoa2VlcGVyIDpLZWVwZXIsIG9iamVjdCA6e30pIDp2b2lkIHtcblx0Y29uc3Qga2V5cyA6S2V5W10gPSBSZWZsZWN0Lm93bktleXMob2JqZWN0KTtcblx0Zm9yICggbGV0IGxlbmd0aCA6bnVtYmVyID0ga2V5cy5sZW5ndGgsIGluZGV4IDpudW1iZXIgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0a2VlcGVyLmFkZChrZXlzW2luZGV4XSk7XG5cdH1cbn1cbmZ1bmN0aW9uIE5VTExfZnJvbSAoc291cmNlIDp7fVtdIHwge30sIGRlZmluZSA6Ym9vbGVhbikgOmFueSB7XG5cdGNvbnN0IHRhcmdldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdGNvbnN0IGtlZXBlciA6S2VlcGVyID0gbmV3IEtlZXBlcjtcblx0aWYgKCBkZWZpbmUgKSB7XG5cdFx0aWYgKCBpc0FycmF5KHNvdXJjZSkgKSB7XG5cdFx0XHRmb3IgKCBsZXQgbGVuZ3RoIDpudW1iZXIgPSBzb3VyY2UubGVuZ3RoLCBpbmRleCA6bnVtYmVyID0gMDsgaW5kZXg8bGVuZ3RoOyArK2luZGV4ICkge1xuXHRcdFx0XHRjb25zdCBkZXNjcmlwdG9yTWFwID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2VbaW5kZXhdKTtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBkZXNjcmlwdG9yTWFwKTtcblx0XHRcdFx0a2VlcGVyQWRkS2V5cyhrZWVwZXIsIGRlc2NyaXB0b3JNYXApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGNvbnN0IGRlc2NyaXB0b3JNYXAgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSk7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIGRlc2NyaXB0b3JNYXApO1xuXHRcdFx0a2VlcGVyQWRkS2V5cyhrZWVwZXIsIGRlc2NyaXB0b3JNYXApO1xuXHRcdH1cblx0fVxuXHRlbHNlIHtcblx0XHRpZiAoIGlzQXJyYXkoc291cmNlKSApIHtcblx0XHRcdE9iamVjdC5hc3NpZ24odGFyZ2V0LCAuLi5zb3VyY2UpO1xuXHRcdFx0Zm9yICggbGV0IGxlbmd0aCA6bnVtYmVyID0gc291cmNlLmxlbmd0aCwgaW5kZXggOm51bWJlciA9IDA7IGluZGV4PGxlbmd0aDsgKytpbmRleCApIHtcblx0XHRcdFx0a2VlcGVyQWRkS2V5cyhrZWVwZXIsIHNvdXJjZVtpbmRleF0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpO1xuXHRcdFx0a2VlcGVyQWRkS2V5cyhrZWVwZXIsIHNvdXJjZSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBuZXdQcm94eSh0YXJnZXQsIGtlZXBlcik7XG59XG5mdW5jdGlvbiB0aHJvd0NvbnN0cnVjdGluZyAoKSA6bmV2ZXIgeyB0aHJvdyBUeXBlRXJyb3IoYE5VTEwgY2Fubm90IGJlIGludm9rZWQgd2l0aCAnbmV3J2ApOyB9XG5leHBvcnQgY29uc3QgTlVMTCA6dHlwZW9mIGltcG9ydCgnLi9leHBvcnQuZCcpLk5VTEwgPVxuXHQvKiNfX1BVUkVfXyovXG5cdGZ1bmN0aW9uICh0aGlzIDphbnkpIHtcblx0XHQndXNlIHN0cmljdCc7XG5cdFx0Y29uc3QgTlVMTCA6YW55ID0gZnVuY3Rpb24gPE8gZXh0ZW5kcyB7fT4gKHRoaXMgOm9iamVjdCwgc291cmNlPyA6T1tdIHwgTywgZGVmaW5lPyA6Ym9vbGVhbikgOk8ge1xuXHRcdFx0cmV0dXJuIG5ldy50YXJnZXRcblx0XHRcdFx0PyBuZXcudGFyZ2V0PT09TlVMTFxuXHRcdFx0XHRcdD8gLyojX19QVVJFX18qLyB0aHJvd0NvbnN0cnVjdGluZygpXG5cdFx0XHRcdFx0OiAvKiNfX1BVUkVfXyovIG5ld1Byb3h5KHRoaXMsIG5ldyBLZWVwZXIpXG5cdFx0XHRcdDogLyojX19QVVJFX18qLyBOVUxMX2Zyb20oc291cmNlISwgZGVmaW5lISk7XG5cdFx0fTtcblx0XHROVUxMLnByb3RvdHlwZSA9IG51bGw7XG5cdFx0Ly9kZWxldGUgTlVMTC5uYW1lO1xuXHRcdC8vZGVsZXRlIE5VTEwubGVuZ3RoO1xuXHRcdE9iamVjdC5mcmVlemUoTlVMTCk7XG5cdFx0cmV0dXJuIE5VTEw7XG5cdH0oKTtcbmV4cG9ydCB0eXBlIE5VTEw8Vj4gPSBpbXBvcnQoJy4vZXhwb3J0LmQnKS5OVUxMPFY+O1xuXG5jb25zdCBQcm9wZXJ0eUtleSA6YW55ID1cblx0LyojX19QVVJFX18qLyBuZXcgUHJveHkoe30sIHsgZ2V0PEtleSBleHRlbmRzIHN0cmluZyB8IHN5bWJvbD4gKHRhcmdldCA6e30sIGtleSA6S2V5KSA6S2V5IHsgcmV0dXJuIGtleTsgfSB9KTtcbmV4cG9ydCBjb25zdCB7IGZyb21FbnRyaWVzIH0gPSB7XG5cdGZyb21FbnRyaWVzPEsgZXh0ZW5kcyBzdHJpbmcgfCBzeW1ib2wsIFYgZXh0ZW5kcyBhbnksIE8gZXh0ZW5kcyBvYmplY3Q+IChlbnRyaWVzIDpJdGVyYWJsZTx7IHJlYWRvbmx5IDAgOkssIHJlYWRvbmx5IDEgOlYgfT4sIHByb3RvPyA6bnVsbCB8IE8pIDp7IFtrIGluIEtdIDpWIH0gJiBPIHtcblx0XHRjb25zdCBrZWVwZXIgOktlZXBlciA9IG5ldyBLZWVwZXI7XG5cdFx0Y29uc3QgbWFwIDpNYXA8SywgVj4gPSBuZXcgTWFwO1xuXHRcdGZvciAoIGxldCB7IDA6IGtleSwgMTogdmFsdWUgfSBvZiBlbnRyaWVzICkge1xuXHRcdFx0a2V5ID0gUHJvcGVydHlLZXlba2V5XTtcblx0XHRcdGtlZXBlci5hZGQoa2V5KTtcblx0XHRcdG1hcC5zZXQoa2V5LCB2YWx1ZSk7XG5cdFx0fVxuXHRcdGNvbnN0IHRhcmdldCA9IE9iamVjdC5mcm9tRW50cmllcyhtYXApO1xuXHRcdHJldHVybiBuZXdQcm94eShcblx0XHRcdHByb3RvPT09dW5kZWZpbmVkID8gdGFyZ2V0IDpcblx0XHRcdFx0cHJvdG89PT1udWxsID8gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCB0YXJnZXQpIDpcblx0XHRcdFx0XHRPYmplY3QuY3JlYXRlKHRhcmdldCwgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhwcm90bykpLFxuXHRcdFx0a2VlcGVyXG5cdFx0KTtcblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgKFxuXHQvKiNfX1BVUkVfXyovXG5cdE9iamVjdC5mcmVlemUoe1xuXHRcdHZlcnNpb24sXG5cdFx0aXNPcmRlcmVkLFxuXHRcdGlzLFxuXHRcdG9yZGVyaWZ5LFxuXHRcdGNyZWF0ZSxcblx0XHRkZWZpbmVQcm9wZXJ0aWVzLFxuXHRcdE5VTEwsXG5cdFx0ZnJvbUVudHJpZXMsXG5cdFx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyxcblx0XHRnZXQgZGVmYXVsdCAoKSB7IHJldHVybiB0aGlzOyB9LFxuXHR9KVxuKTtcbiJdLCJuYW1lcyI6WyJPYmplY3QuY3JlYXRlIiwidW5kZWZpbmVkIiwiT2JqZWN0LmFzc2lnbiIsIlJlZmxlY3QuYXBwbHkiLCJSZWZsZWN0LmNvbnN0cnVjdCIsIlJlZmxlY3QuZGVmaW5lUHJvcGVydHkiLCJSZWZsZWN0LmRlbGV0ZVByb3BlcnR5IiwiUmVmbGVjdC5zZXQiLCJpcyIsIk9iamVjdC5pcyIsIlJlZmxlY3Qub3duS2V5cyIsImNyZWF0ZSIsIk9iamVjdC5kZWZpbmVQcm9wZXJ0eSIsImRlZmluZVByb3BlcnRpZXMiLCJPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiT2JqZWN0LmRlZmluZVByb3BlcnRpZXMiLCJPYmplY3QuZnJlZXplIiwiZnJvbUVudHJpZXMiLCJPYmplY3QuZnJvbUVudHJpZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvQkFBZSxPQUFPOzs0QkFBQyx4QkNrQnZCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQztJQUNuQixNQUFNLGFBQWEsR0FBNEIsSUFBSSxPQUFPLENBQUM7SUFDM0QsTUFB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