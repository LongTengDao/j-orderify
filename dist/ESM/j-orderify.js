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

export default orderify;

/*¡ @ltd/j-orderify */

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9leHBvcnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gUmVmbGVjdCwgV2Vha01hcCwgT2JqZWN0LCBTZXQsIFByb3h5XG5cbmNvbnN0IHsgZGVmaW5lUHJvcGVydHksIGRlbGV0ZVByb3BlcnR5LCBvd25LZXlzIH0gPSBSZWZsZWN0O1xuXG5jb25zdCBvd25LZXlzS2VlcGVycyA9IG5ldyBXZWFrTWFwO1xuXG5jb25zdCBoYW5kbGVycyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwge1xuXHRkZWZpbmVQcm9wZXJ0eSAodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHtcblx0XHRpZiAoIGRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSApIHtcblx0XHRcdG93bktleXNLZWVwZXJzLmdldCh0YXJnZXQpLmFkZChrZXkpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0ZGVsZXRlUHJvcGVydHkgKHRhcmdldCwga2V5KSB7XG5cdFx0aWYgKCBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIGtleSkgKSB7XG5cdFx0XHRvd25LZXlzS2VlcGVycy5nZXQodGFyZ2V0KS5kZWxldGUoa2V5KTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdG93bktleXMgKHRhcmdldCkge1xuXHRcdHJldHVybiBbLi4ub3duS2V5c0tlZXBlcnMuZ2V0KHRhcmdldCldO1xuXHR9LFxufSk7XG5cbmNvbnN0IG9yZGVyaWZ5ID0gb2JqZWN0ID0+IHtcblx0b3duS2V5c0tlZXBlcnMuc2V0KG9iamVjdCwgbmV3IFNldChvd25LZXlzKG9iamVjdCkpKTtcblx0cmV0dXJuIG5ldyBQcm94eShvYmplY3QsIGhhbmRsZXJzKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IG9yZGVyaWZ5O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUEsTUFBTSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDOztBQUU1RCxNQUFNLGNBQWMsR0FBRyxJQUFJLE9BQU8sQ0FBQzs7QUFFbkMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO0NBQ25ELGNBQWMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFO0VBQ3hDLEtBQUssY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLEdBQUc7R0FDOUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDcEMsT0FBTyxJQUFJLENBQUM7R0FDWjtFQUNELE9BQU8sS0FBSyxDQUFDO0VBQ2I7Q0FDRCxjQUFjLENBQUMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0VBQzVCLEtBQUssY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRztHQUNsQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUN2QyxPQUFPLElBQUksQ0FBQztHQUNaO0VBQ0QsT0FBTyxLQUFLLENBQUM7RUFDYjtDQUNELE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRTtFQUNoQixPQUFPLENBQUMsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7RUFDdkM7Q0FDRCxDQUFDLENBQUM7O0FBRUgsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJO0NBQzFCLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDckQsT0FBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7Q0FDbkMsQ0FBQzs7Ozs7Ozs7In0=