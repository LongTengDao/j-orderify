﻿/*!
 * 模块名称：@ltd/j-orderify
 * 模块功能：返回一个能保证给定对象的属性按此后添加顺序排列的 proxy，即使键名是 symbol，或整数 string。
   　　　　　Return a proxy for given object, which can guarantee own keys are in setting order, even if the key name is symbol or int string.
 * 模块版本：2.5.0
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

    const version = '2.5.0';

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnMi41LjAnOyIsImltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcbmltcG9ydCBXZWFrTWFwIGZyb20gJy5XZWFrTWFwJztcbmltcG9ydCBPYmplY3QgZnJvbSAnLk9iamVjdCc7XG5pbXBvcnQgY3JlYXRlIGZyb20gJy5PYmplY3QuY3JlYXRlJztcbmltcG9ydCBTZXQgZnJvbSAnLlNldCc7XG5pbXBvcnQgUHJveHkgZnJvbSAnLlByb3h5JztcbmltcG9ydCBkZWZpbmVQcm9wZXJ0eSBmcm9tICcuUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSc7XG5pbXBvcnQgZGVsZXRlUHJvcGVydHkgZnJvbSAnLlJlZmxlY3QuZGVsZXRlUHJvcGVydHknO1xuaW1wb3J0IG93bktleXMgZnJvbSAnLlJlZmxlY3Qub3duS2V5cyc7XG5jb25zdCBvd25LZXlzS2VlcGVycyA9IG5ldyBXZWFrTWFwO1xuY29uc3QgaGFuZGxlcnMgPSBjcmVhdGUobnVsbCwge1xuICAgIGRlZmluZVByb3BlcnR5OiB7XG4gICAgICAgIHZhbHVlKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gICAgICAgICAgICBpZiAoZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpKSB7XG4gICAgICAgICAgICAgICAgb3duS2V5c0tlZXBlcnMuZ2V0KHRhcmdldCkuYWRkKGtleSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGRlbGV0ZVByb3BlcnR5OiB7XG4gICAgICAgIHZhbHVlKHRhcmdldCwga2V5KSB7XG4gICAgICAgICAgICBpZiAoZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgb3duS2V5c0tlZXBlcnMuZ2V0KHRhcmdldCkuZGVsZXRlKGtleSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG93bktleXM6IHtcbiAgICAgICAgdmFsdWUodGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gWy4uLm93bktleXNLZWVwZXJzLmdldCh0YXJnZXQpXTtcbiAgICAgICAgfVxuICAgIH0sXG59KTtcbmV4cG9ydCBjb25zdCBvcmRlcmlmeSA9IChvYmplY3QpID0+IHtcbiAgICBvd25LZXlzS2VlcGVycy5zZXQob2JqZWN0LCBuZXcgU2V0KG93bktleXMob2JqZWN0KSkpO1xuICAgIHJldHVybiBuZXcgUHJveHkob2JqZWN0LCBoYW5kbGVycyk7XG59O1xuZXhwb3J0IGNsYXNzIE9yZGVyaWZpZWQgZXh0ZW5kcyBudWxsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0gY3JlYXRlKHByb3RvdHlwZSk7XG4gICAgICAgIG93bktleXNLZWVwZXJzLnNldChvYmplY3QsIG5ldyBTZXQpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KG9iamVjdCwgaGFuZGxlcnMpO1xuICAgIH1cbn1cbmNvbnN0IHByb3RvdHlwZSA9IC8qI19fUFVSRV9fKi8gZnVuY3Rpb24gKCkge1xuICAgIGRlbGV0ZSBPcmRlcmlmaWVkLnByb3RvdHlwZS5jb25zdHJ1Y3RvcjtcbiAgICBPYmplY3QuZnJlZXplKE9yZGVyaWZpZWQucHJvdG90eXBlKTtcbiAgICByZXR1cm4gT3JkZXJpZmllZC5wcm90b3R5cGU7XG59KCk7XG5leHBvcnQgZGVmYXVsdCB7XG4gICAgdmVyc2lvbixcbiAgICBvcmRlcmlmeSxcbiAgICBPcmRlcmlmaWVkLFxuICAgIGdldCBkZWZhdWx0KCkgeyByZXR1cm4gdGhpczsgfSxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVY0Y0c5eWRDNTBjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4UFFVRlBMRTlCUVU4c1RVRkJUU3huUWtGQlowSXNRMEZCUXp0QlFVTnlReXhQUVVGUExFVkJRVVVzVDBGQlR5eEZRVUZGTEVOQlFVTTdRVUZGYmtJc1QwRkJUeXhQUVVGUExFMUJRVTBzVlVGQlZTeERRVUZETzBGQlF5OUNMRTlCUVU4c1RVRkJUU3hOUVVGTkxGTkJRVk1zUTBGQlF6dEJRVU0zUWl4UFFVRlBMRTFCUVUwc1RVRkJUU3huUWtGQlowSXNRMEZCUXp0QlFVTndReXhQUVVGUExFZEJRVWNzVFVGQlRTeE5RVUZOTEVOQlFVTTdRVUZEZGtJc1QwRkJUeXhMUVVGTExFMUJRVTBzVVVGQlVTeERRVUZETzBGQlF6TkNMRTlCUVU4c1kwRkJZeXhOUVVGTkxIbENRVUY1UWl4RFFVRkRPMEZCUTNKRUxFOUJRVThzWTBGQll5eE5RVUZOTEhsQ1FVRjVRaXhEUVVGRE8wRkJRM0pFTEU5QlFVOHNUMEZCVHl4TlFVRk5MR3RDUVVGclFpeERRVUZETzBGQlJYWkRMRTFCUVUwc1kwRkJZeXhIUVVGSExFbEJRVWtzVDBGQlR5eERRVUZETzBGQlJXNURMRTFCUVUwc1VVRkJVU3hIUVVGWExFMUJRVTBzUTBGQlF5eEpRVUZKTEVWQlFVVTdTVUZEY2tNc1kwRkJZeXhGUVVGRk8xRkJRMllzUzBGQlN5eERRVUZGTEUxQlFXTXNSVUZCUlN4SFFVRnZRaXhGUVVGRkxGVkJRVGhDTzFsQlF6RkZMRWxCUVVzc1kwRkJZeXhEUVVGRExFMUJRVTBzUlVGQlJTeEhRVUZITEVWQlFVVXNWVUZCVlN4RFFVRkRMRVZCUVVjN1owSkJRemxETEdOQlFXTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU1zUjBGQlJ5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMmRDUVVOd1F5eFBRVUZQTEVsQlFVa3NRMEZCUXp0aFFVTmFPMWxCUTBRc1QwRkJUeXhMUVVGTExFTkJRVU03VVVGRFpDeERRVUZETzB0QlEwUTdTVUZEUkN4alFVRmpMRVZCUVVVN1VVRkRaaXhMUVVGTExFTkJRVVVzVFVGQll5eEZRVUZGTEVkQlFXOUNPMWxCUXpGRExFbEJRVXNzWTBGQll5eERRVUZETEUxQlFVMHNSVUZCUlN4SFFVRkhMRU5CUVVNc1JVRkJSenRuUWtGRGJFTXNZMEZCWXl4RFFVRkRMRWRCUVVjc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF5eE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1owSkJRM1pETEU5QlFVOHNTVUZCU1N4RFFVRkRPMkZCUTFvN1dVRkRSQ3hQUVVGUExFdEJRVXNzUTBGQlF6dFJRVU5rTEVOQlFVTTdTMEZEUkR0SlFVTkVMRTlCUVU4c1JVRkJSVHRSUVVOU0xFdEJRVXNzUTBGQlJTeE5RVUZqTzFsQlEzQkNMRTlCUVU4c1EwRkJReXhIUVVGSExHTkJRV01zUTBGQlF5eEhRVUZITEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVONFF5eERRVUZETzB0QlEwUTdRMEZEUkN4RFFVRkRMRU5CUVVNN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVFVGQlRTeFJRVUZSTEVkQlFVY3NRMEZCUXl4TlFVRmpMRVZCUVZVc1JVRkJSVHRKUVVOc1JDeGpRVUZqTEVOQlFVTXNSMEZCUnl4RFFVRkRMRTFCUVUwc1JVRkJSU3hKUVVGSkxFZEJRVWNzUTBGQlF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wbEJRM0pFTEU5QlFVOHNTVUZCU1N4TFFVRkxMRU5CUVVNc1RVRkJUU3hGUVVGRkxGRkJRVkVzUTBGQlF5eERRVUZETzBGQlEzQkRMRU5CUVVNc1EwRkJRenRCUVVWR0xFMUJRVTBzVDBGQlR5eFZRVUZYTEZOQlFWRXNTVUZCU1R0SlFVTnVRenRSUVVORExFMUJRVTBzVFVGQlRTeEhRVUZsTEUxQlFVMHNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRSUVVNM1F5eGpRVUZqTEVOQlFVTXNSMEZCUnl4RFFVRkRMRTFCUVUwc1JVRkJSU3hKUVVGSkxFZEJRVWNzUTBGQlF5eERRVUZETzFGQlEzQkRMRTlCUVU4c1NVRkJTU3hMUVVGTExFTkJRVU1zVFVGQlRTeEZRVUZGTEZGQlFWRXNRMEZCUXl4RFFVRkRPMGxCUTNCRExFTkJRVU03UTBGRFJEdEJRVVZFTEUxQlFVMHNVMEZCVXl4SFFVRkhMR0ZCUVdFc1EwRkJRenRKUVVNdlFpeFBRVUZQTEZWQlFWVXNRMEZCUXl4VFFVRlRMRU5CUVVNc1YwRkJWeXhEUVVGRE8wbEJRM2hETEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNc1ZVRkJWU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBsQlEzQkRMRTlCUVU4c1ZVRkJWU3hEUVVGRExGTkJRVk1zUTBGQlF6dEJRVU0zUWl4RFFVRkRMRVZCUVVVc1EwRkJRenRCUVVWS0xHVkJRV1U3U1VGRFpDeFBRVUZQTzBsQlExQXNVVUZCVVR0SlFVTlNMRlZCUVZVN1NVRkRWaXhKUVVGSkxFOUJRVThzUzBGQlRTeFBRVUZQTEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNN1EwRkRMMElzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQjJaWEp6YVc5dUlHWnliMjBnSnk0dmRtVnljMmx2Ymo5MFpYaDBKenRjYm1WNGNHOXlkQ0I3SUhabGNuTnBiMjRnZlR0Y2JseHVhVzF3YjNKMElGZGxZV3ROWVhBZ1puSnZiU0FuTGxkbFlXdE5ZWEFuTzF4dWFXMXdiM0owSUU5aWFtVmpkQ0JtY205dElDY3VUMkpxWldOMEp6dGNibWx0Y0c5eWRDQmpjbVZoZEdVZ1puSnZiU0FuTGs5aWFtVmpkQzVqY21WaGRHVW5PMXh1YVcxd2IzSjBJRk5sZENCbWNtOXRJQ2N1VTJWMEp6dGNibWx0Y0c5eWRDQlFjbTk0ZVNCbWNtOXRJQ2N1VUhKdmVIa25PMXh1YVcxd2IzSjBJR1JsWm1sdVpWQnliM0JsY25SNUlHWnliMjBnSnk1U1pXWnNaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVKenRjYm1sdGNHOXlkQ0JrWld4bGRHVlFjbTl3WlhKMGVTQm1jbTl0SUNjdVVtVm1iR1ZqZEM1a1pXeGxkR1ZRY205d1pYSjBlU2M3WEc1cGJYQnZjblFnYjNkdVMyVjVjeUJtY205dElDY3VVbVZtYkdWamRDNXZkMjVMWlhsekp6dGNibHh1WTI5dWMzUWdiM2R1UzJWNWMwdGxaWEJsY25NZ1BTQnVaWGNnVjJWaGEwMWhjRHRjYmx4dVkyOXVjM1FnYUdGdVpHeGxjbk1nT205aWFtVmpkQ0E5SUdOeVpXRjBaU2h1ZFd4c0xDQjdYRzVjZEdSbFptbHVaVkJ5YjNCbGNuUjVPaUI3WEc1Y2RGeDBkbUZzZFdVZ0tIUmhjbWRsZENBNmIySnFaV04wTENCclpYa2dPbk4wY21sdVp5QjhJSE41YldKdmJDd2daR1Z6WTNKcGNIUnZjaUE2VUhKdmNHVnlkSGxFWlhOamNtbHdkRzl5S1NCN1hHNWNkRngwWEhScFppQW9JR1JsWm1sdVpWQnliM0JsY25SNUtIUmhjbWRsZEN3Z2EyVjVMQ0JrWlhOamNtbHdkRzl5S1NBcElIdGNibHgwWEhSY2RGeDBiM2R1UzJWNWMwdGxaWEJsY25NdVoyVjBLSFJoY21kbGRDa3VZV1JrS0d0bGVTazdYRzVjZEZ4MFhIUmNkSEpsZEhWeWJpQjBjblZsTzF4dVhIUmNkRngwZlZ4dVhIUmNkRngwY21WMGRYSnVJR1poYkhObE8xeHVYSFJjZEgxY2JseDBmU3hjYmx4MFpHVnNaWFJsVUhKdmNHVnlkSGs2SUh0Y2JseDBYSFIyWVd4MVpTQW9kR0Z5WjJWMElEcHZZbXBsWTNRc0lHdGxlU0E2YzNSeWFXNW5JSHdnYzNsdFltOXNLU0I3WEc1Y2RGeDBYSFJwWmlBb0lHUmxiR1YwWlZCeWIzQmxjblI1S0hSaGNtZGxkQ3dnYTJWNUtTQXBJSHRjYmx4MFhIUmNkRngwYjNkdVMyVjVjMHRsWlhCbGNuTXVaMlYwS0hSaGNtZGxkQ2t1WkdWc1pYUmxLR3RsZVNrN1hHNWNkRngwWEhSY2RISmxkSFZ5YmlCMGNuVmxPMXh1WEhSY2RGeDBmVnh1WEhSY2RGeDBjbVYwZFhKdUlHWmhiSE5sTzF4dVhIUmNkSDFjYmx4MGZTeGNibHgwYjNkdVMyVjVjem9nZTF4dVhIUmNkSFpoYkhWbElDaDBZWEpuWlhRZ09tOWlhbVZqZENrZ09pZ2djM1J5YVc1bklId2djM2x0WW05c0lDbGJYU0I3WEc1Y2RGeDBYSFJ5WlhSMWNtNGdXeTR1TG05M2JrdGxlWE5MWldWd1pYSnpMbWRsZENoMFlYSm5aWFFwWFR0Y2JseDBYSFI5WEc1Y2RIMHNYRzU5S1R0Y2JseHVaWGh3YjNKMElHTnZibk4wSUc5eVpHVnlhV1o1SUQwZ0tHOWlhbVZqZENBNmIySnFaV04wS1NBNmIySnFaV04wSUQwK0lIdGNibHgwYjNkdVMyVjVjMHRsWlhCbGNuTXVjMlYwS0c5aWFtVmpkQ3dnYm1WM0lGTmxkQ2h2ZDI1TFpYbHpLRzlpYW1WamRDa3BLVHRjYmx4MGNtVjBkWEp1SUc1bGR5QlFjbTk0ZVNodlltcGxZM1FzSUdoaGJtUnNaWEp6S1R0Y2JuMDdYRzVjYm1WNGNHOXlkQ0JqYkdGemN5QlBjbVJsY21sbWFXVmtJR1Y0ZEdWdVpITWdiblZzYkNCN1hHNWNkR052Ym5OMGNuVmpkRzl5SUNncElIdGNibHgwWEhSamIyNXpkQ0J2WW1wbFkzUWdPazl5WkdWeWFXWnBaV1FnUFNCamNtVmhkR1VvY0hKdmRHOTBlWEJsS1R0Y2JseDBYSFJ2ZDI1TFpYbHpTMlZsY0dWeWN5NXpaWFFvYjJKcVpXTjBMQ0J1WlhjZ1UyVjBLVHRjYmx4MFhIUnlaWFIxY200Z2JtVjNJRkJ5YjNoNUtHOWlhbVZqZEN3Z2FHRnVaR3hsY25NcE8xeHVYSFI5WEc1OVhHNWNibU52Ym5OMElIQnliM1J2ZEhsd1pTQTlJQzhxSTE5ZlVGVlNSVjlmS2k4Z1puVnVZM1JwYjI0Z0tDa2dlMXh1WEhSa1pXeGxkR1VnVDNKa1pYSnBabWxsWkM1d2NtOTBiM1I1Y0dVdVkyOXVjM1J5ZFdOMGIzSTdYRzVjZEU5aWFtVmpkQzVtY21WbGVtVW9UM0prWlhKcFptbGxaQzV3Y205MGIzUjVjR1VwTzF4dVhIUnlaWFIxY200Z1QzSmtaWEpwWm1sbFpDNXdjbTkwYjNSNWNHVTdYRzU5S0NrN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElIdGNibHgwZG1WeWMybHZiaXhjYmx4MGIzSmtaWEpwWm5rc1hHNWNkRTl5WkdWeWFXWnBaV1FzWEc1Y2RHZGxkQ0JrWldaaGRXeDBJQ2dwSUhzZ2NtVjBkWEp1SUhSb2FYTTdJSDBzWEc1OU8xeHVJbDE5Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0JBQWUsT0FBTzs7Ozs7Ozs7Ozs0QkFBQyx4QkNVdkIsTUFBTSxjQUFjLEdBQUcsSUFBSSxPQUFPLENBQUM7SUFDbkMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRTtJQUM5QixJQUFJLGNBQWMsRUFBRTtJQUNwQixRQUFRLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRTtJQUN2QyxZQUFZLElBQUksY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLEVBQUU7SUFDekQsZ0JBQWdCLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BELGdCQUFnQixPQUFPLElBQUksQ0FBQztJQUM1QixhQUFhO0lBQ2IsWUFBWSxPQUFPLEtBQUssQ0FBQztJQUN6QixTQUFTO0lBQ1QsS0FBSztJQUNMLElBQUksY0FBYyxFQUFFO0lBQ3BCLFFBQVEsS0FBSyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDM0IsWUFBWSxJQUFJLGNBQWMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUU7SUFDN0MsZ0JBQWdCLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZELGdCQUFnQixPQUFPLElBQUksQ0FBQztJQUM1QixhQUFhO0lBQ2IsWUFBWSxPQUFPLEtBQUssQ0FBQztJQUN6QixTQUFTO0lBQ1QsS0FBSztJQUNMLElBQUksT0FBTyxFQUFFO0lBQ2IsUUFBUSxLQUFLLENBQUMsTUFBTSxFQUFFO0lBQ3RCLFlBQVksT0FBTyxDQUFDLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ25ELFNBQVM7SUFDVCxLQUFLO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDSCxJQUFPLE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBTSxLQUFLO0lBQ3BDLElBQUksY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RCxJQUFJLE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQztBQUNGLElBQU8sTUFBTSxVQUFVLFNBQVMsSUFBSSxDQUFDO0lBQ3JDLElBQUksV0FBVyxHQUFHO0lBQ2xCLFFBQVEsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3pDLFFBQVEsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUM1QyxRQUFRLE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLEtBQUs7SUFDTCxDQUFDO0lBQ0QsTUFBTSxTQUFTLGlCQUFpQixZQUFZO0lBQzVDLElBQUksT0FBTyxVQUFVLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztJQUM1QyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hDLElBQUksT0FBTyxVQUFVLENBQUMsU0FBUyxDQUFDO0lBQ2hDLENBQUMsRUFBRSxDQUFDO0FBQ0osb0JBQWU7SUFDZixJQUFJLE9BQU87SUFDWCxJQUFJLFFBQVE7SUFDWixJQUFJLFVBQVU7SUFDZCxJQUFJLElBQUksT0FBTyxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRTtJQUNsQyxDQUFDLENBQUM7Ozs7Ozs7OyIsInNvdXJjZVJvb3QiOiIuLi8uLi9zcmMvIn0=