/*!
 * 模块名称：@ltd/j-orderify
 * 模块功能：返回一个能保证给定对象的属性按此后添加顺序排列的 proxy，即使键名是 symbol，或整数 string。
   　　　　　Return a proxy for given object, which can guarantee own keys are in setting order, even if the key name is symbol or int string.
 * 模块版本：2.7.1
 * 许可条款：LGPL-3.0
 * 所属作者：龙腾道 <LongTengDao@LongTengDao.com> (www.LongTengDao.com)
 * 问题反馈：https://GitHub.com/LongTengDao/j-orderify/issues
 * 项目主页：https://GitHub.com/LongTengDao/j-orderify/
 */

const version = '2.7.1';

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

export default _export;
export { Orderified, orderify, version };

/*¡ @ltd/j-orderify */

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnMi43LjEnOyIsImltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuaW1wb3J0IFdlYWtNYXAgZnJvbSAnLldlYWtNYXAnO1xuaW1wb3J0IE9iamVjdCBmcm9tICcuT2JqZWN0JztcbmltcG9ydCBjcmVhdGUgZnJvbSAnLk9iamVjdC5jcmVhdGUnO1xuaW1wb3J0IFNldCBmcm9tICcuU2V0JztcbmltcG9ydCBQcm94eSBmcm9tICcuUHJveHknO1xuaW1wb3J0IGRlZmluZVByb3BlcnR5IGZyb20gJy5SZWZsZWN0LmRlZmluZVByb3BlcnR5JztcbmltcG9ydCBkZWxldGVQcm9wZXJ0eSBmcm9tICcuUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSc7XG5pbXBvcnQgb3duS2V5cyBmcm9tICcuUmVmbGVjdC5vd25LZXlzJztcblxuY29uc3Qgb3duS2V5c0tlZXBlcnMgPSBuZXcgV2Vha01hcDtcblxuY29uc3QgaGFuZGxlcnMgOm9iamVjdCA9IGNyZWF0ZShudWxsLCB7XG5cdGRlZmluZVByb3BlcnR5OiB7XG5cdFx0dmFsdWUgKHRhcmdldCA6b2JqZWN0LCBrZXkgOnN0cmluZyB8IHN5bWJvbCwgZGVzY3JpcHRvciA6UHJvcGVydHlEZXNjcmlwdG9yKSB7XG5cdFx0XHRpZiAoIGRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSApIHtcblx0XHRcdFx0b3duS2V5c0tlZXBlcnMuZ2V0KHRhcmdldCkuYWRkKGtleSk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fSxcblx0ZGVsZXRlUHJvcGVydHk6IHtcblx0XHR2YWx1ZSAodGFyZ2V0IDpvYmplY3QsIGtleSA6c3RyaW5nIHwgc3ltYm9sKSB7XG5cdFx0XHRpZiAoIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwga2V5KSApIHtcblx0XHRcdFx0b3duS2V5c0tlZXBlcnMuZ2V0KHRhcmdldCkuZGVsZXRlKGtleSk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fSxcblx0b3duS2V5czoge1xuXHRcdHZhbHVlICh0YXJnZXQgOm9iamVjdCkgOiggc3RyaW5nIHwgc3ltYm9sIClbXSB7XG5cdFx0XHRyZXR1cm4gWy4uLm93bktleXNLZWVwZXJzLmdldCh0YXJnZXQpXTtcblx0XHR9XG5cdH0sXG59KTtcblxuZXhwb3J0IGNvbnN0IG9yZGVyaWZ5ID0gKG9iamVjdCA6b2JqZWN0KSA6b2JqZWN0ID0+IHtcblx0b3duS2V5c0tlZXBlcnMuc2V0KG9iamVjdCwgbmV3IFNldChvd25LZXlzKG9iamVjdCkpKTtcblx0cmV0dXJuIG5ldyBQcm94eShvYmplY3QsIGhhbmRsZXJzKTtcbn07XG5cbmV4cG9ydCBjbGFzcyBPcmRlcmlmaWVkIGV4dGVuZHMgbnVsbCB7XG5cdGNvbnN0cnVjdG9yICgpIHtcblx0XHRjb25zdCBvYmplY3QgOk9yZGVyaWZpZWQgPSBjcmVhdGUocHJvdG90eXBlKTtcblx0XHRvd25LZXlzS2VlcGVycy5zZXQob2JqZWN0LCBuZXcgU2V0KTtcblx0XHRyZXR1cm4gbmV3IFByb3h5KG9iamVjdCwgaGFuZGxlcnMpO1xuXHR9XG59XG5cbmNvbnN0IHByb3RvdHlwZSA9IC8qI19fUFVSRV9fKi8gZnVuY3Rpb24gKCkge1xuXHRkZWxldGUgT3JkZXJpZmllZC5wcm90b3R5cGUuY29uc3RydWN0b3I7XG5cdE9iamVjdC5mcmVlemUoT3JkZXJpZmllZC5wcm90b3R5cGUpO1xuXHRyZXR1cm4gT3JkZXJpZmllZC5wcm90b3R5cGU7XG59KCk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0dmVyc2lvbixcblx0b3JkZXJpZnksXG5cdE9yZGVyaWZpZWQsXG5cdGdldCBkZWZhdWx0ICgpIHsgcmV0dXJuIHRoaXM7IH0sXG59O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsZ0JBQWUsT0FBTzs7Ozs7Ozs7Ozt3QkFBQyx4QkNZdkIsTUFBTSxjQUFjLEdBQUcsSUFBSSxPQUFPLENBQUM7QUFFbkMsTUFBTSxRQUFRLEdBQVcsTUFBTSxDQUFDLElBQUksRUFBRTtJQUNyQyxjQUFjLEVBQUU7UUFDZixLQUFLLENBQUUsTUFBYyxFQUFFLEdBQW9CLEVBQUUsVUFBOEI7WUFDMUUsSUFBSyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsRUFBRztnQkFDOUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3BDLE9BQU8sSUFBSSxDQUFDO2FBQ1o7WUFDRCxPQUFPLEtBQUssQ0FBQztTQUNiO0tBQ0Q7SUFDRCxjQUFjLEVBQUU7UUFDZixLQUFLLENBQUUsTUFBYyxFQUFFLEdBQW9CO1lBQzFDLElBQUssY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRztnQkFDbEMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZDLE9BQU8sSUFBSSxDQUFDO2FBQ1o7WUFDRCxPQUFPLEtBQUssQ0FBQztTQUNiO0tBQ0Q7SUFDRCxPQUFPLEVBQUU7UUFDUixLQUFLLENBQUUsTUFBYztZQUNwQixPQUFPLENBQUMsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDdkM7S0FDRDtDQUNELENBQUMsQ0FBQztBQUVILE1BQWEsUUFBUSxHQUFHLENBQUMsTUFBYztJQUN0QyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JELE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0NBQ25DLENBQUM7QUFFRixNQUFhLFVBQVcsU0FBUSxJQUFJO0lBQ25DO1FBQ0MsTUFBTSxNQUFNLEdBQWUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzdDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxDQUFDLENBQUM7UUFDcEMsT0FBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDbkM7Q0FDRDtBQUVELE1BQU0sU0FBUyxpQkFBaUI7SUFDL0IsT0FBTyxVQUFVLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztJQUN4QyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNwQyxPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUM7Q0FDNUIsRUFBRSxDQUFDO0FBRUosZ0JBQWU7SUFDZCxPQUFPO0lBQ1AsUUFBUTtJQUNSLFVBQVU7SUFDVixJQUFJLE9BQU8sS0FBTSxPQUFPLElBQUksQ0FBQyxFQUFFO0NBQy9CLENBQUM7Ozs7Ozs7OzsiLCJzb3VyY2VSb290IjoiLi4vLi4vc3JjLyJ9