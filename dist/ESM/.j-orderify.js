﻿/*!
 * 模块名称：@ltd/j-orderify
 * 模块功能：返回一个能保证给定对象的属性按此后添加顺序排列的 proxy，即使键名是 symbol，或整数 string。
   　　　　　Return a proxy for given object, which can guarantee own keys are in setting order, even if the key name is symbol or int string.
 * 模块版本：3.0.0
 * 许可条款：LGPL-3.0
 * 所属作者：龙腾道 <LongTengDao@LongTengDao.com> (www.LongTengDao.com)
 * 问题反馈：https://GitHub.com/LongTengDao/j-orderify/issues
 * 项目主页：https://GitHub.com/LongTengDao/j-orderify/
 */

import WeakMap from '.WeakMap';
import Object_create from '.Object.create';
import assign from '.Object.assign';
import Set from '.Set';
import Proxy from '.Proxy';
import defineProperty from '.Reflect.defineProperty';
import deleteProperty from '.Reflect.deleteProperty';
import ownKeys from '.Reflect.ownKeys';
import construct from '.Reflect.construct';

const version = '3.0.0';

const ownKeysKeepers = new WeakMap();
const handlers = 
/*#__PURE__*/
assign(Object_create(null), {
    defineProperty(target, key, descriptor) {
        if (defineProperty(target, key, descriptor)) {
            ownKeysKeepers.get(target).add(key);
            return true;
        }
        return false;
    },
    deleteProperty(target, key) {
        if (deleteProperty(target, key)) {
            ownKeysKeepers.get(target).delete(key);
            return true;
        }
        return false;
    },
    ownKeys(target) {
        return [...ownKeysKeepers.get(target)];
    },
});
const { of } = {
    of(object) {
        ownKeysKeepers.set(object, new Set(ownKeys(object)));
        return new Proxy(object, handlers);
    }
};
const { create } = {
    create(proto) {
        const object = Object_create(proto);
        ownKeysKeepers.set(object, new Set);
        return new Proxy(object, handlers);
    }
};
const { extend } = {
    extend(Class) {
        return new Proxy(Class, assign(Object_create(null), {
            construct(Class, args) {
                const object = construct(Class, args);
                ownKeysKeepers.set(object, new Set(ownKeys(object)));
                return new Proxy(object, handlers);
            },
        }));
    }
};
const _export = {
    version,
    of,
    create,
    extend,
    get default() { return this; },
};

export default _export;
export { create, extend, of, version };

/*¡ @ltd/j-orderify */

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnMy4wLjAnOyIsImltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuaW1wb3J0IFdlYWtNYXAgZnJvbSAnLldlYWtNYXAnO1xuaW1wb3J0IE9iamVjdF9jcmVhdGUgZnJvbSAnLk9iamVjdC5jcmVhdGUnO1xuaW1wb3J0IGFzc2lnbiBmcm9tICcuT2JqZWN0LmFzc2lnbic7XG5pbXBvcnQgU2V0IGZyb20gJy5TZXQnO1xuaW1wb3J0IFByb3h5IGZyb20gJy5Qcm94eSc7XG5pbXBvcnQgZGVmaW5lUHJvcGVydHkgZnJvbSAnLlJlZmxlY3QuZGVmaW5lUHJvcGVydHknO1xuaW1wb3J0IGRlbGV0ZVByb3BlcnR5IGZyb20gJy5SZWZsZWN0LmRlbGV0ZVByb3BlcnR5JztcbmltcG9ydCBvd25LZXlzIGZyb20gJy5SZWZsZWN0Lm93bktleXMnO1xuaW1wb3J0IGNvbnN0cnVjdCBmcm9tICcuUmVmbGVjdC5jb25zdHJ1Y3QnO1xuXG50eXBlIEtleSA9IHN0cmluZyB8IHN5bWJvbDtcblxuY29uc3Qgb3duS2V5c0tlZXBlcnMgPSBuZXcgV2Vha01hcDxvYmplY3QsIFNldDxLZXk+PigpO1xuXG5jb25zdCBoYW5kbGVycyA6b2JqZWN0ID1cblx0LyojX19QVVJFX18qL1xuXHRhc3NpZ24oT2JqZWN0X2NyZWF0ZShudWxsKSwge1xuXHRcdGRlZmluZVByb3BlcnR5ICh0YXJnZXQgOm9iamVjdCwga2V5IDpLZXksIGRlc2NyaXB0b3IgOlByb3BlcnR5RGVzY3JpcHRvcikgOmJvb2xlYW4ge1xuXHRcdFx0aWYgKCBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikgKSB7XG5cdFx0XHRcdG93bktleXNLZWVwZXJzLmdldCh0YXJnZXQpIS5hZGQoa2V5KTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSxcblx0XHRkZWxldGVQcm9wZXJ0eSAodGFyZ2V0IDpvYmplY3QsIGtleSA6S2V5KSA6Ym9vbGVhbiB7XG5cdFx0XHRpZiAoIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwga2V5KSApIHtcblx0XHRcdFx0b3duS2V5c0tlZXBlcnMuZ2V0KHRhcmdldCkhLmRlbGV0ZShrZXkpO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LFxuXHRcdG93bktleXMgKHRhcmdldCA6b2JqZWN0KSA6S2V5W10ge1xuXHRcdFx0cmV0dXJuIFsuLi5vd25LZXlzS2VlcGVycy5nZXQodGFyZ2V0KSFdO1xuXHRcdH0sXG5cdH0pO1xuXG5leHBvcnQgY29uc3QgeyBvZiB9ID0ge1xuXHRvZjx0YXJnZXQgZXh0ZW5kcyBvYmplY3Q+IChvYmplY3QgOnRhcmdldCkgOnRhcmdldCB7XG5cdFx0b3duS2V5c0tlZXBlcnMuc2V0KG9iamVjdCwgbmV3IFNldChvd25LZXlzKG9iamVjdCkgYXMgS2V5W10pKTtcblx0XHRyZXR1cm4gbmV3IFByb3h5KG9iamVjdCwgaGFuZGxlcnMpO1xuXHR9XG59O1xuXG5leHBvcnQgY29uc3QgeyBjcmVhdGUgfSA9IHtcblx0Y3JlYXRlPHRhcmdldCBleHRlbmRzIG9iamVjdD4gKHByb3RvIDp0YXJnZXQgfCBudWxsKSA6dGFyZ2V0IHtcblx0XHRjb25zdCBvYmplY3QgOnRhcmdldCA9IE9iamVjdF9jcmVhdGUocHJvdG8pO1xuXHRcdG93bktleXNLZWVwZXJzLnNldChvYmplY3QsIG5ldyBTZXQpO1xuXHRcdHJldHVybiBuZXcgUHJveHkob2JqZWN0LCBoYW5kbGVycyk7XG5cdH1cbn07XG5cbmV4cG9ydCBjb25zdCB7IGV4dGVuZCB9ID0ge1xuXHRleHRlbmQ8VGFyZ2V0IGV4dGVuZHMgeyBuZXcgKC4uLmFyZ3MgOmFueVtdKSA6YW55IH0+IChDbGFzcyA6VGFyZ2V0KSA6VGFyZ2V0IHtcblx0XHRyZXR1cm4gbmV3IFByb3h5KENsYXNzLCBhc3NpZ24oT2JqZWN0X2NyZWF0ZShudWxsKSwge1xuXHRcdFx0Y29uc3RydWN0IChDbGFzcyA6VGFyZ2V0LCBhcmdzIDphbnlbXSkge1xuXHRcdFx0XHRjb25zdCBvYmplY3QgPSBjb25zdHJ1Y3QoQ2xhc3MsIGFyZ3MpO1xuXHRcdFx0XHRvd25LZXlzS2VlcGVycy5zZXQob2JqZWN0LCBuZXcgU2V0KG93bktleXMob2JqZWN0KSBhcyBLZXlbXSkpO1xuXHRcdFx0XHRyZXR1cm4gbmV3IFByb3h5KG9iamVjdCwgaGFuZGxlcnMpO1xuXHRcdFx0fSxcblx0XHR9KSk7XG5cdH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0dmVyc2lvbixcblx0b2YsXG5cdGNyZWF0ZSxcblx0ZXh0ZW5kLFxuXHRnZXQgZGVmYXVsdCAoKSB7IHJldHVybiB0aGlzOyB9LFxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnQkFBZSxPQUFPOzt3QkFBQyx4QkNldkIsTUFBTSxjQUFjLEdBQUcsSUFBSSxPQUFPLEVBQW9CLENBQUM7QUFFdkQsTUFBTSxRQUFROztBQUViLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDM0IsY0FBYyxDQUFFLE1BQWMsRUFBRSxHQUFRLEVBQUUsVUFBOEI7UUFDdkUsSUFBSyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsRUFBRztZQUM5QyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyQyxPQUFPLElBQUksQ0FBQztTQUNaO1FBQ0QsT0FBTyxLQUFLLENBQUM7S0FDYjtJQUNELGNBQWMsQ0FBRSxNQUFjLEVBQUUsR0FBUTtRQUN2QyxJQUFLLGNBQWMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUc7WUFDbEMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEMsT0FBTyxJQUFJLENBQUM7U0FDWjtRQUNELE9BQU8sS0FBSyxDQUFDO0tBQ2I7SUFDRCxPQUFPLENBQUUsTUFBYztRQUN0QixPQUFPLENBQUMsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDLENBQUM7S0FDeEM7Q0FDRCxDQUFDLENBQUM7QUFFSixNQUFhLEVBQUUsRUFBRSxFQUFFLEdBQUc7SUFDckIsRUFBRSxDQUF5QixNQUFjO1FBQ3hDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQVUsQ0FBQyxDQUFDLENBQUM7UUFDOUQsT0FBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDbkM7Q0FDRCxDQUFDO0FBRUYsTUFBYSxFQUFFLE1BQU0sRUFBRSxHQUFHO0lBQ3pCLE1BQU0sQ0FBeUIsS0FBb0I7UUFDbEQsTUFBTSxNQUFNLEdBQVcsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxDQUFDLENBQUM7UUFDcEMsT0FBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDbkM7Q0FDRCxDQUFDO0FBRUYsTUFBYSxFQUFFLE1BQU0sRUFBRSxHQUFHO0lBQ3pCLE1BQU0sQ0FBZ0QsS0FBYTtRQUNsRSxPQUFPLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25ELFNBQVMsQ0FBRSxLQUFhLEVBQUUsSUFBVztnQkFDcEMsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdEMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBVSxDQUFDLENBQUMsQ0FBQztnQkFDOUQsT0FBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDbkM7U0FDRCxDQUFDLENBQUMsQ0FBQztLQUNKO0NBQ0QsQ0FBQztBQUVGLGdCQUFlO0lBQ2QsT0FBTztJQUNQLEVBQUU7SUFDRixNQUFNO0lBQ04sTUFBTTtJQUNOLElBQUksT0FBTyxLQUFNLE9BQU8sSUFBSSxDQUFDLEVBQUU7Q0FDL0IsQ0FBQzs7Ozs7Ozs7OyIsInNvdXJjZVJvb3QiOiIuLi8uLi9zcmMvIn0=