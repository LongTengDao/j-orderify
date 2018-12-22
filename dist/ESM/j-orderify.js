/*!
 * 模块名称：@ltd/j-orderify
 * 模块功能：返回一个可以保证给定对象的自有属性按照此后添加的顺序排列的 proxy，即便键名是 symbol，或整数式 string。
   　　　　　Return a proxy for the given object, which can guarantee the own keys are in setting order, even if the key name is a symbol or an integer-form string.
 * 模块版本：1.0.0
 * 许可条款：LGPL-3.0
 * 所属作者：龙腾道 <LongTengDao@LongTengDao.com> (www.LongTengDao.com)
 * 问题反馈：https://GitHub.com/LongTengDao/j-orderify/issues
 * 项目主页：https://GitHub.com/LongTengDao/j-orderify/
 */

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

orderify.default = orderify;

export default orderify;

/*¡ @ltd/j-orderify */

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9kZWZhdWx0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFJlZmxlY3QsIFdlYWtNYXAsIE9iamVjdCwgU2V0LCBQcm94eVxuXG5jb25zdCB7IGRlZmluZVByb3BlcnR5LCBkZWxldGVQcm9wZXJ0eSwgb3duS2V5cyB9ID0gUmVmbGVjdDtcblxuY29uc3Qgb3duS2V5c0tlZXBlcnMgPSBuZXcgV2Vha01hcDtcblxuY29uc3QgaGFuZGxlcnMgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIHtcblx0ZGVmaW5lUHJvcGVydHkgKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG5cdFx0aWYgKCBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikgKSB7XG5cdFx0XHRvd25LZXlzS2VlcGVycy5nZXQodGFyZ2V0KS5hZGQoa2V5KTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdGRlbGV0ZVByb3BlcnR5ICh0YXJnZXQsIGtleSkge1xuXHRcdGlmICggZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBrZXkpICkge1xuXHRcdFx0b3duS2V5c0tlZXBlcnMuZ2V0KHRhcmdldCkuZGVsZXRlKGtleSk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHRvd25LZXlzICh0YXJnZXQpIHtcblx0XHRyZXR1cm4gWy4uLm93bktleXNLZWVwZXJzLmdldCh0YXJnZXQpXTtcblx0fSxcbn0pO1xuXG5jb25zdCBvcmRlcmlmeSA9IG9iamVjdCA9PiB7XG5cdG93bktleXNLZWVwZXJzLnNldChvYmplY3QsIG5ldyBTZXQob3duS2V5cyhvYmplY3QpKSk7XG5cdHJldHVybiBuZXcgUHJveHkob2JqZWN0LCBoYW5kbGVycyk7XG59O1xuXG5vcmRlcmlmeS5kZWZhdWx0ID0gb3JkZXJpZnk7XG5cbmV4cG9ydCBkZWZhdWx0IG9yZGVyaWZ5O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUEsTUFBTSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDOztBQUU1RCxNQUFNLGNBQWMsR0FBRyxJQUFJLE9BQU8sQ0FBQzs7QUFFbkMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO0NBQ25ELGNBQWMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFO0VBQ3hDLEtBQUssY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLEdBQUc7R0FDOUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDcEMsT0FBTyxJQUFJLENBQUM7R0FDWjtFQUNELE9BQU8sS0FBSyxDQUFDO0VBQ2I7Q0FDRCxjQUFjLENBQUMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0VBQzVCLEtBQUssY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRztHQUNsQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUN2QyxPQUFPLElBQUksQ0FBQztHQUNaO0VBQ0QsT0FBTyxLQUFLLENBQUM7RUFDYjtDQUNELE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRTtFQUNoQixPQUFPLENBQUMsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7RUFDdkM7Q0FDRCxDQUFDLENBQUM7O0FBRUgsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJO0NBQzFCLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDckQsT0FBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7Q0FDbkMsQ0FBQzs7QUFFRixRQUFRLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQzs7Ozs7Ozs7In0=