﻿/*!
 * 模块名称：@ltd/j-orderify
 * 模块功能：返回一个能保证给定对象的属性按此后添加顺序排列的 proxy，即使键名是 symbol，或整数 string。
   　　　　　Return a proxy for given object, which can guarantee own keys are in setting order, even if the key name is symbol or int string.
 * 模块版本：1.0.0
 * 许可条款：LGPL-3.0
 * 所属作者：龙腾道 <LongTengDao@LongTengDao.com> (www.LongTengDao.com)
 * 问题反馈：https://GitHub.com/LongTengDao/j-orderify/issues
 * 项目主页：https://GitHub.com/LongTengDao/j-orderify/
 */

const version = '1.0.0';

// @ts-ignore
const { defineProperty, deleteProperty, ownKeys } = Reflect;
const ownKeysKeepers = new WeakMap;
const handlers = Object.create(null, {
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
const _export = (() => {
    const orderify = (object) => {
        ownKeysKeepers.set(object, new Set(ownKeys(object)));
        return new Proxy(object, handlers);
    };
    orderify.version = version;
    return orderify.orderify = orderify.default = orderify;
})();

export default _export;
export { orderify, version };

/*¡ @ltd/j-orderify */

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnMS4wLjAnOyIsIi8vIEB0cy1pZ25vcmVcbmltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JzsgLy8gUmVmbGVjdCwgV2Vha01hcCwgT2JqZWN0LCBTZXQsIFByb3h5XG5jb25zdCB7IGRlZmluZVByb3BlcnR5LCBkZWxldGVQcm9wZXJ0eSwgb3duS2V5cyB9ID0gUmVmbGVjdDtcbmNvbnN0IG93bktleXNLZWVwZXJzID0gbmV3IFdlYWtNYXA7XG5jb25zdCBoYW5kbGVycyA9IE9iamVjdC5jcmVhdGUobnVsbCwge1xuICAgIGRlZmluZVByb3BlcnR5OiB7XG4gICAgICAgIHZhbHVlKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gICAgICAgICAgICBpZiAoZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpKSB7XG4gICAgICAgICAgICAgICAgb3duS2V5c0tlZXBlcnMuZ2V0KHRhcmdldCkuYWRkKGtleSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGRlbGV0ZVByb3BlcnR5OiB7XG4gICAgICAgIHZhbHVlKHRhcmdldCwga2V5KSB7XG4gICAgICAgICAgICBpZiAoZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgb3duS2V5c0tlZXBlcnMuZ2V0KHRhcmdldCkuZGVsZXRlKGtleSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG93bktleXM6IHtcbiAgICAgICAgdmFsdWUodGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gWy4uLm93bktleXNLZWVwZXJzLmdldCh0YXJnZXQpXTtcbiAgICAgICAgfVxuICAgIH0sXG59KTtcbmV4cG9ydCBjb25zdCBvcmRlcmlmeSA9IChvYmplY3QpID0+IHtcbiAgICBvd25LZXlzS2VlcGVycy5zZXQob2JqZWN0LCBuZXcgU2V0KG93bktleXMob2JqZWN0KSkpO1xuICAgIHJldHVybiBuZXcgUHJveHkob2JqZWN0LCBoYW5kbGVycyk7XG59O1xuZXhwb3J0IHsgdmVyc2lvbiB9O1xuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcbiAgICBjb25zdCBvcmRlcmlmeSA9IChvYmplY3QpID0+IHtcbiAgICAgICAgb3duS2V5c0tlZXBlcnMuc2V0KG9iamVjdCwgbmV3IFNldChvd25LZXlzKG9iamVjdCkpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eShvYmplY3QsIGhhbmRsZXJzKTtcbiAgICB9O1xuICAgIG9yZGVyaWZ5LnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgIHJldHVybiBvcmRlcmlmeS5vcmRlcmlmeSA9IG9yZGVyaWZ5LmRlZmF1bHQgPSBvcmRlcmlmeTtcbn0pKCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVY0Y0c5eWRDNTBjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4aFFVRmhPMEZCUTJJc1QwRkJUeXhQUVVGUExFMUJRVTBzWjBKQlFXZENMRU5CUVVNc1EwRkJRU3gxUTBGQmRVTTdRVUZGTlVVc1RVRkJUU3hGUVVGRkxHTkJRV01zUlVGQlJTeGpRVUZqTEVWQlFVVXNUMEZCVHl4RlFVRkZMRWRCUVVjc1QwRkJUeXhEUVVGRE8wRkJSVFZFTEUxQlFVMHNZMEZCWXl4SFFVRkhMRWxCUVVrc1QwRkJUeXhEUVVGRE8wRkJSVzVETEUxQlFVMHNVVUZCVVN4SFFVRlhMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeEZRVUZGTzBsQlF6VkRMR05CUVdNc1JVRkJSVHRSUVVObUxFdEJRVXNzUTBGQlJTeE5RVUZqTEVWQlFVVXNSMEZCYjBJc1JVRkJSU3hWUVVFNFFqdFpRVU14UlN4SlFVRkxMR05CUVdNc1EwRkJReXhOUVVGTkxFVkJRVVVzUjBGQlJ5eEZRVUZGTEZWQlFWVXNRMEZCUXl4RlFVRkhPMmRDUVVNNVF5eGpRVUZqTEVOQlFVTXNSMEZCUnl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRExFZEJRVWNzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0blFrRkRjRU1zVDBGQlR5eEpRVUZKTEVOQlFVTTdZVUZEV2p0WlFVTkVMRTlCUVU4c1MwRkJTeXhEUVVGRE8xRkJRMlFzUTBGQlF6dExRVU5FTzBsQlEwUXNZMEZCWXl4RlFVRkZPMUZCUTJZc1MwRkJTeXhEUVVGRkxFMUJRV01zUlVGQlJTeEhRVUZ2UWp0WlFVTXhReXhKUVVGTExHTkJRV01zUTBGQlF5eE5RVUZOTEVWQlFVVXNSMEZCUnl4RFFVRkRMRVZCUVVjN1owSkJRMnhETEdOQlFXTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMmRDUVVOMlF5eFBRVUZQTEVsQlFVa3NRMEZCUXp0aFFVTmFPMWxCUTBRc1QwRkJUeXhMUVVGTExFTkJRVU03VVVGRFpDeERRVUZETzB0QlEwUTdTVUZEUkN4UFFVRlBMRVZCUVVVN1VVRkRVaXhMUVVGTExFTkJRVVVzVFVGQll6dFpRVU53UWl4UFFVRlBMRU5CUVVNc1IwRkJSeXhqUVVGakxFTkJRVU1zUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRlRU1zUTBGQlF6dExRVU5FTzBOQlEwUXNRMEZCUXl4RFFVRkRPMEZCUlVnc1RVRkJUU3hEUVVGRExFMUJRVTBzVVVGQlVTeEhRVUZITEVOQlFVTXNUVUZCWXl4RlFVRlZMRVZCUVVVN1NVRkRiRVFzWTBGQll5eERRVUZETEVkQlFVY3NRMEZCUXl4TlFVRk5MRVZCUVVVc1NVRkJTU3hIUVVGSExFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRKUVVOeVJDeFBRVUZQTEVsQlFVa3NTMEZCU3l4RFFVRkRMRTFCUVUwc1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU53UXl4RFFVRkRMRU5CUVVNN1FVRkZSaXhQUVVGUExFVkJRVVVzVDBGQlR5eEZRVUZGTEVOQlFVTTdRVUZGYmtJc1pVRkJaU3hEUVVGRkxFZEJRV0VzUlVGQlJUdEpRVU12UWl4TlFVRk5MRkZCUVZFc1IwRkJSeXhEUVVGRExFMUJRV01zUlVGQlZTeEZRVUZGTzFGQlF6TkRMR05CUVdNc1EwRkJReXhIUVVGSExFTkJRVU1zVFVGQlRTeEZRVUZGTEVsQlFVa3NSMEZCUnl4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdVVUZEY2tRc1QwRkJUeXhKUVVGSkxFdEJRVXNzUTBGQlF5eE5RVUZOTEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNN1NVRkRjRU1zUTBGQlF5eERRVUZETzBsQlEwWXNVVUZCVVN4RFFVRkRMRTlCUVU4c1IwRkJSeXhQUVVGUExFTkJRVU03U1VGRE0wSXNUMEZCVHl4UlFVRlJMRU5CUVVNc1VVRkJVU3hIUVVGSExGRkJRVkVzUTBGQlF5eFBRVUZQTEVkQlFVY3NVVUZCVVN4RFFVRkRPMEZCUTNoRUxFTkJRVU1zUTBGQlJTeEZRVUZGTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2THlCQWRITXRhV2R1YjNKbFhHNXBiWEJ2Y25RZ2RtVnljMmx2YmlCbWNtOXRJQ2N1TDNabGNuTnBiMjQvZEdWNGRDYzdMeThnVW1WbWJHVmpkQ3dnVjJWaGEwMWhjQ3dnVDJKcVpXTjBMQ0JUWlhRc0lGQnliM2g1WEc1Y2JtTnZibk4wSUhzZ1pHVm1hVzVsVUhKdmNHVnlkSGtzSUdSbGJHVjBaVkJ5YjNCbGNuUjVMQ0J2ZDI1TFpYbHpJSDBnUFNCU1pXWnNaV04wTzF4dVhHNWpiMjV6ZENCdmQyNUxaWGx6UzJWbGNHVnljeUE5SUc1bGR5QlhaV0ZyVFdGd08xeHVYRzVqYjI1emRDQm9ZVzVrYkdWeWN5QTZiMkpxWldOMElEMGdUMkpxWldOMExtTnlaV0YwWlNodWRXeHNMQ0I3WEc1Y2RHUmxabWx1WlZCeWIzQmxjblI1T2lCN1hHNWNkRngwZG1Gc2RXVWdLSFJoY21kbGRDQTZiMkpxWldOMExDQnJaWGtnT25OMGNtbHVaeUI4SUhONWJXSnZiQ3dnWkdWelkzSnBjSFJ2Y2lBNlVISnZjR1Z5ZEhsRVpYTmpjbWx3ZEc5eUtTQjdYRzVjZEZ4MFhIUnBaaUFvSUdSbFptbHVaVkJ5YjNCbGNuUjVLSFJoY21kbGRDd2dhMlY1TENCa1pYTmpjbWx3ZEc5eUtTQXBJSHRjYmx4MFhIUmNkRngwYjNkdVMyVjVjMHRsWlhCbGNuTXVaMlYwS0hSaGNtZGxkQ2t1WVdSa0tHdGxlU2s3WEc1Y2RGeDBYSFJjZEhKbGRIVnliaUIwY25WbE8xeHVYSFJjZEZ4MGZWeHVYSFJjZEZ4MGNtVjBkWEp1SUdaaGJITmxPMXh1WEhSY2RIMWNibHgwZlN4Y2JseDBaR1ZzWlhSbFVISnZjR1Z5ZEhrNklIdGNibHgwWEhSMllXeDFaU0FvZEdGeVoyVjBJRHB2WW1wbFkzUXNJR3RsZVNBNmMzUnlhVzVuSUh3Z2MzbHRZbTlzS1NCN1hHNWNkRngwWEhScFppQW9JR1JsYkdWMFpWQnliM0JsY25SNUtIUmhjbWRsZEN3Z2EyVjVLU0FwSUh0Y2JseDBYSFJjZEZ4MGIzZHVTMlY1YzB0bFpYQmxjbk11WjJWMEtIUmhjbWRsZENrdVpHVnNaWFJsS0d0bGVTazdYRzVjZEZ4MFhIUmNkSEpsZEhWeWJpQjBjblZsTzF4dVhIUmNkRngwZlZ4dVhIUmNkRngwY21WMGRYSnVJR1poYkhObE8xeHVYSFJjZEgxY2JseDBmU3hjYmx4MGIzZHVTMlY1Y3pvZ2UxeHVYSFJjZEhaaGJIVmxJQ2gwWVhKblpYUWdPbTlpYW1WamRDa2dPaWdnYzNSeWFXNW5JSHdnYzNsdFltOXNJQ2xiWFNCN1hHNWNkRngwWEhSeVpYUjFjbTRnV3k0dUxtOTNia3RsZVhOTFpXVndaWEp6TG1kbGRDaDBZWEpuWlhRcFhUdGNibHgwWEhSOVhHNWNkSDBzWEc1OUtUdGNibHh1Wlhod2IzSjBJR052Ym5OMElHOXlaR1Z5YVdaNUlEMGdLRzlpYW1WamRDQTZiMkpxWldOMEtTQTZiMkpxWldOMElEMCtJSHRjYmx4MGIzZHVTMlY1YzB0bFpYQmxjbk11YzJWMEtHOWlhbVZqZEN3Z2JtVjNJRk5sZENodmQyNUxaWGx6S0c5aWFtVmpkQ2twS1R0Y2JseDBjbVYwZFhKdUlHNWxkeUJRY205NGVTaHZZbXBsWTNRc0lHaGhibVJzWlhKektUdGNibjA3WEc1Y2JtVjRjRzl5ZENCN0lIWmxjbk5wYjI0Z2ZUdGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdLQ0FvS1NBNlJuVnVZM1JwYjI0Z1BUNGdlMXh1WEhSamIyNXpkQ0J2Y21SbGNtbG1lU0E5SUNodlltcGxZM1FnT205aWFtVmpkQ2tnT205aWFtVmpkQ0E5UGlCN1hHNWNkRngwYjNkdVMyVjVjMHRsWlhCbGNuTXVjMlYwS0c5aWFtVmpkQ3dnYm1WM0lGTmxkQ2h2ZDI1TFpYbHpLRzlpYW1WamRDa3BLVHRjYmx4MFhIUnlaWFIxY200Z2JtVjNJRkJ5YjNoNUtHOWlhbVZqZEN3Z2FHRnVaR3hsY25NcE8xeHVYSFI5TzF4dVhIUnZjbVJsY21sbWVTNTJaWEp6YVc5dUlEMGdkbVZ5YzJsdmJqdGNibHgwY21WMGRYSnVJRzl5WkdWeWFXWjVMbTl5WkdWeWFXWjVJRDBnYjNKa1pYSnBabmt1WkdWbVlYVnNkQ0E5SUc5eVpHVnlhV1o1TzF4dWZTQXBLQ2s3WEc0aVhYMD0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxnQkFBZSxPQUFPOztBQ0F0QjtBQUNBLEFBQ0EsTUFBTSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDO0FBQzVELE1BQU0sY0FBYyxHQUFHLElBQUksT0FBTyxDQUFDO0FBQ25DLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO0lBQ2pDLGNBQWMsRUFBRTtRQUNaLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRTtZQUMzQixJQUFJLGNBQWMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFVBQVUsQ0FBQyxFQUFFO2dCQUN6QyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDcEMsT0FBTyxJQUFJLENBQUM7YUFDZjtZQUNELE9BQU8sS0FBSyxDQUFDO1NBQ2hCO0tBQ0o7SUFDRCxjQUFjLEVBQUU7UUFDWixLQUFLLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtZQUNmLElBQUksY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRTtnQkFDN0IsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZDLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7WUFDRCxPQUFPLEtBQUssQ0FBQztTQUNoQjtLQUNKO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNWLE9BQU8sQ0FBQyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUMxQztLQUNKO0NBQ0osQ0FBQyxDQUFDO0FBQ0gsQUFBWSxNQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sS0FBSztJQUNoQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JELE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0NBQ3RDLENBQUM7QUFDRixBQUNBLGdCQUFlLENBQUMsTUFBTTtJQUNsQixNQUFNLFFBQVEsR0FBRyxDQUFDLE1BQU0sS0FBSztRQUN6QixjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3RDLENBQUM7SUFDRixRQUFRLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUMzQixPQUFPLFFBQVEsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7Q0FDMUQsR0FBRyxDQUFDOzs7Ozs7Ozs7Iiwic291cmNlUm9vdCI6Ii4uLy4uL3NyYy8ifQ==