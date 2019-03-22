/*!
 * 模块名称：@ltd/j-orderify
 * 模块功能：返回一个能保证给定对象的属性按此后添加顺序排列的 proxy，即使键名是 symbol，或整数 string。
   　　　　　Return a proxy for given object, which can guarantee own keys are in setting order, even if the key name is symbol or int string.
 * 模块版本：2.6.0
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

    const version = '2.6.0';

    const create = Object.create;

    const defineProperty = Reflect.defineProperty;

    const deleteProperty = Reflect.deleteProperty;

    const ownKeys = Reflect.ownKeys;

    const ownKeysKeepers = new WeakMap;
    const handlers = create(null, {
        defineProperty: {
            value(target, key, descriptor) {
                if (defineProperty(target, key, descriptor)) {
                    ownKeysKeepers.get(target).add(key);
                    return true;
                }
                return false;
            }
        },
        deleteProperty: {
            value(target, key) {
                if (deleteProperty(target, key)) {
                    ownKeysKeepers.get(target).delete(key);
                    return true;
                }
                return false;
            }
        },
        ownKeys: {
            value(target) {
                return [...ownKeysKeepers.get(target)];
            }
        },
    });
    const orderify = (object) => {
        ownKeysKeepers.set(object, new Set(ownKeys(object)));
        return new Proxy(object, handlers);
    };
    class Orderified extends null {
        constructor() {
            const object = create(prototype);
            ownKeysKeepers.set(object, new Set);
            return new Proxy(object, handlers);
        }
    }
    const prototype = /*#__PURE__*/ function () {
        delete Orderified.prototype.constructor;
        Object.freeze(Orderified.prototype);
        return Orderified.prototype;
    }();
    const _export = {
        version,
        orderify,
        Orderified,
        get default() { return this; },
    };

    return _export;

}));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnMi42LjAnOyIsImltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuaW1wb3J0IFdlYWtNYXAgZnJvbSAnLldlYWtNYXAnO1xuaW1wb3J0IE9iamVjdCBmcm9tICcuT2JqZWN0JztcbmltcG9ydCBjcmVhdGUgZnJvbSAnLk9iamVjdC5jcmVhdGUnO1xuaW1wb3J0IFNldCBmcm9tICcuU2V0JztcbmltcG9ydCBQcm94eSBmcm9tICcuUHJveHknO1xuaW1wb3J0IGRlZmluZVByb3BlcnR5IGZyb20gJy5SZWZsZWN0LmRlZmluZVByb3BlcnR5JztcbmltcG9ydCBkZWxldGVQcm9wZXJ0eSBmcm9tICcuUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSc7XG5pbXBvcnQgb3duS2V5cyBmcm9tICcuUmVmbGVjdC5vd25LZXlzJztcblxuY29uc3Qgb3duS2V5c0tlZXBlcnMgPSBuZXcgV2Vha01hcDtcblxuY29uc3QgaGFuZGxlcnMgOm9iamVjdCA9IGNyZWF0ZShudWxsLCB7XG5cdGRlZmluZVByb3BlcnR5OiB7XG5cdFx0dmFsdWUgKHRhcmdldCA6b2JqZWN0LCBrZXkgOnN0cmluZyB8IHN5bWJvbCwgZGVzY3JpcHRvciA6UHJvcGVydHlEZXNjcmlwdG9yKSB7XG5cdFx0XHRpZiAoIGRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSApIHtcblx0XHRcdFx0b3duS2V5c0tlZXBlcnMuZ2V0KHRhcmdldCkuYWRkKGtleSk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fSxcblx0ZGVsZXRlUHJvcGVydHk6IHtcblx0XHR2YWx1ZSAodGFyZ2V0IDpvYmplY3QsIGtleSA6c3RyaW5nIHwgc3ltYm9sKSB7XG5cdFx0XHRpZiAoIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwga2V5KSApIHtcblx0XHRcdFx0b3duS2V5c0tlZXBlcnMuZ2V0KHRhcmdldCkuZGVsZXRlKGtleSk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fSxcblx0b3duS2V5czoge1xuXHRcdHZhbHVlICh0YXJnZXQgOm9iamVjdCkgOiggc3RyaW5nIHwgc3ltYm9sIClbXSB7XG5cdFx0XHRyZXR1cm4gWy4uLm93bktleXNLZWVwZXJzLmdldCh0YXJnZXQpXTtcblx0XHR9XG5cdH0sXG59KTtcblxuZXhwb3J0IGNvbnN0IG9yZGVyaWZ5ID0gKG9iamVjdCA6b2JqZWN0KSA6b2JqZWN0ID0+IHtcblx0b3duS2V5c0tlZXBlcnMuc2V0KG9iamVjdCwgbmV3IFNldChvd25LZXlzKG9iamVjdCkpKTtcblx0cmV0dXJuIG5ldyBQcm94eShvYmplY3QsIGhhbmRsZXJzKTtcbn07XG5cbmV4cG9ydCBjbGFzcyBPcmRlcmlmaWVkIGV4dGVuZHMgbnVsbCB7XG5cdGNvbnN0cnVjdG9yICgpIHtcblx0XHRjb25zdCBvYmplY3QgOk9yZGVyaWZpZWQgPSBjcmVhdGUocHJvdG90eXBlKTtcblx0XHRvd25LZXlzS2VlcGVycy5zZXQob2JqZWN0LCBuZXcgU2V0KTtcblx0XHRyZXR1cm4gbmV3IFByb3h5KG9iamVjdCwgaGFuZGxlcnMpO1xuXHR9XG59XG5cbmNvbnN0IHByb3RvdHlwZSA9IC8qI19fUFVSRV9fKi8gZnVuY3Rpb24gKCkge1xuXHRkZWxldGUgT3JkZXJpZmllZC5wcm90b3R5cGUuY29uc3RydWN0b3I7XG5cdE9iamVjdC5mcmVlemUoT3JkZXJpZmllZC5wcm90b3R5cGUpO1xuXHRyZXR1cm4gT3JkZXJpZmllZC5wcm90b3R5cGU7XG59KCk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0dmVyc2lvbixcblx0b3JkZXJpZnksXG5cdE9yZGVyaWZpZWQsXG5cdGdldCBkZWZhdWx0ICgpIHsgcmV0dXJuIHRoaXM7IH0sXG59O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0JBQWUsT0FBTzs7Ozs7Ozs7Ozs0QkFBQyx4QkNZdkIsTUFBTSxjQUFjLEdBQUcsSUFBSSxPQUFPLENBQUM7SUFFbkMsTUFBTSxRQUFRLEdBQVcsTUFBTSxDQUFDLElBQUksRUFBRTtRQUNyQyxjQUFjLEVBQUU7WUFDZixLQUFLLENBQUUsTUFBYyxFQUFFLEdBQW9CLEVBQUUsVUFBOEI7Z0JBQzFFLElBQUssY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLEVBQUc7b0JBQzlDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNwQyxPQUFPLElBQUksQ0FBQztpQkFDWjtnQkFDRCxPQUFPLEtBQUssQ0FBQzthQUNiO1NBQ0Q7UUFDRCxjQUFjLEVBQUU7WUFDZixLQUFLLENBQUUsTUFBYyxFQUFFLEdBQW9CO2dCQUMxQyxJQUFLLGNBQWMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUc7b0JBQ2xDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN2QyxPQUFPLElBQUksQ0FBQztpQkFDWjtnQkFDRCxPQUFPLEtBQUssQ0FBQzthQUNiO1NBQ0Q7UUFDRCxPQUFPLEVBQUU7WUFDUixLQUFLLENBQUUsTUFBYztnQkFDcEIsT0FBTyxDQUFDLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2FBQ3ZDO1NBQ0Q7S0FDRCxDQUFDLENBQUM7QUFFSCxJQUFPLE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBYztRQUN0QyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQztBQUVGLFVBQWEsVUFBVyxTQUFRLElBQUk7UUFDbkM7WUFDQyxNQUFNLE1BQU0sR0FBZSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDN0MsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNwQyxPQUFPLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNuQztLQUNEO0lBRUQsTUFBTSxTQUFTLGlCQUFpQjtRQUMvQixPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sVUFBVSxDQUFDLFNBQVMsQ0FBQztJQUM3QixDQUFDLEVBQUUsQ0FBQztBQUVKLG9CQUFlO1FBQ2QsT0FBTztRQUNQLFFBQVE7UUFDUixVQUFVO1FBQ1YsSUFBSSxPQUFPLEtBQU0sT0FBTyxJQUFJLENBQUMsRUFBRTtLQUMvQixDQUFDOzs7Ozs7OzsiLCJzb3VyY2VSb290IjoiLi4vLi4vc3JjLyJ9