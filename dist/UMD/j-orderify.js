/*!
 * 模块名称：@ltd/j-orderify
 * 模块功能：返回一个能保证给定对象的属性按此后添加顺序排列的 proxy，即使键名是 symbol，或整数 string。
   　　　　　Return a proxy for given object, which can guarantee own keys are in setting order, even if the key name is symbol or int string.
 * 模块版本：1.0.0
 * 许可条款：LGPL-3.0
 * 所属作者：龙腾道 <LongTengDao@LongTengDao.com> (www.LongTengDao.com)
 * 问题反馈：https://GitHub.com/LongTengDao/j-orderify/issues
 * 项目主页：https://GitHub.com/LongTengDao/j-orderify/
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.orderify = factory());
}(this, function () { 'use strict';

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

	return _export;

}));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnMS4wLjAnOyIsImltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JzsvLyBSZWZsZWN0LCBXZWFrTWFwLCBPYmplY3QsIFNldCwgUHJveHlcblxuY29uc3QgeyBkZWZpbmVQcm9wZXJ0eSwgZGVsZXRlUHJvcGVydHksIG93bktleXMgfSA9IFJlZmxlY3Q7XG5cbmNvbnN0IG93bktleXNLZWVwZXJzID0gbmV3IFdlYWtNYXA7XG5cbmNvbnN0IGhhbmRsZXJzID0gT2JqZWN0LmNyZWF0ZShudWxsLCB7XG5cdGRlZmluZVByb3BlcnR5OiB7XG5cdFx0dmFsdWUgKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG5cdFx0XHRpZiAoIGRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSApIHtcblx0XHRcdFx0b3duS2V5c0tlZXBlcnMuZ2V0KHRhcmdldCkuYWRkKGtleSk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fSxcblx0ZGVsZXRlUHJvcGVydHk6IHtcblx0XHR2YWx1ZSAodGFyZ2V0LCBrZXkpIHtcblx0XHRcdGlmICggZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBrZXkpICkge1xuXHRcdFx0XHRvd25LZXlzS2VlcGVycy5nZXQodGFyZ2V0KS5kZWxldGUoa2V5KTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9LFxuXHRvd25LZXlzOiB7XG5cdFx0dmFsdWUgKHRhcmdldCkge1xuXHRcdFx0cmV0dXJuIFsuLi5vd25LZXlzS2VlcGVycy5nZXQodGFyZ2V0KV07XG5cdFx0fVxuXHR9LFxufSk7XG5cbmV4cG9ydCBjb25zdCBvcmRlcmlmeSA9IG9iamVjdCA9PiB7XG5cdG93bktleXNLZWVwZXJzLnNldChvYmplY3QsIG5ldyBTZXQob3duS2V5cyhvYmplY3QpKSk7XG5cdHJldHVybiBuZXcgUHJveHkob2JqZWN0LCBoYW5kbGVycyk7XG59O1xuXG5leHBvcnQgeyB2ZXJzaW9uIH07XG5cbmV4cG9ydCBkZWZhdWx0ICggKCkgPT4ge1xuXHRjb25zdCBvcmRlcmlmeSA9IG9iamVjdCA9PiB7XG5cdFx0b3duS2V5c0tlZXBlcnMuc2V0KG9iamVjdCwgbmV3IFNldChvd25LZXlzKG9iamVjdCkpKTtcblx0XHRyZXR1cm4gbmV3IFByb3h5KG9iamVjdCwgaGFuZGxlcnMpO1xuXHR9O1xuXHRvcmRlcmlmeS52ZXJzaW9uID0gdmVyc2lvbjtcblx0cmV0dXJuIG9yZGVyaWZ5Lm9yZGVyaWZ5ID0gb3JkZXJpZnkuZGVmYXVsdCA9IG9yZGVyaWZ5O1xufSApKCk7XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFBZSxPQUFPOzt5QkFBQyx4QkNFdkIsTUFBTSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDOztDQUU1RCxNQUFNLGNBQWMsR0FBRyxJQUFJLE9BQU8sQ0FBQzs7Q0FFbkMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Q0FDckMsQ0FBQyxjQUFjLEVBQUU7Q0FDakIsRUFBRSxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRTtDQUNsQyxHQUFHLEtBQUssY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLEdBQUc7Q0FDbEQsSUFBSSxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUN4QyxJQUFJLE9BQU8sSUFBSSxDQUFDO0NBQ2hCLElBQUk7Q0FDSixHQUFHLE9BQU8sS0FBSyxDQUFDO0NBQ2hCLEdBQUc7Q0FDSCxFQUFFO0NBQ0YsQ0FBQyxjQUFjLEVBQUU7Q0FDakIsRUFBRSxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0NBQ3RCLEdBQUcsS0FBSyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHO0NBQ3RDLElBQUksY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDM0MsSUFBSSxPQUFPLElBQUksQ0FBQztDQUNoQixJQUFJO0NBQ0osR0FBRyxPQUFPLEtBQUssQ0FBQztDQUNoQixHQUFHO0NBQ0gsRUFBRTtDQUNGLENBQUMsT0FBTyxFQUFFO0NBQ1YsRUFBRSxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUU7Q0FDakIsR0FBRyxPQUFPLENBQUMsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Q0FDMUMsR0FBRztDQUNILEVBQUU7Q0FDRixDQUFDLENBQUMsQ0FBQztBQUNILEFBT0E7QUFDQSxpQkFBZSxFQUFFLE1BQU07Q0FDdkIsQ0FBQyxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUk7Q0FDNUIsRUFBRSxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3ZELEVBQUUsT0FBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7Q0FDckMsRUFBRSxDQUFDO0NBQ0gsQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztDQUM1QixDQUFDLE9BQU8sUUFBUSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztDQUN4RCxDQUFDLElBQUksQ0FBQzs7Ozs7Ozs7Iiwic291cmNlUm9vdCI6Ii4uLy4uL3NyYy8ifQ==