import {isObject} from "@vue/shared";
import {handler, ReactiveFlags} from "./baseHandler";

const reactiveMap = new WeakMap()


export function reactive(obj) {
    if (!isObject(obj)) return

    // 如果obj是一个已经被代理过的对象, 访问内部属性,如果返回true,说明已经被代理过了,直接返回该对象
    if (obj[ReactiveFlags.IS_REACTIVE]) {
        return obj
    }

    // 如果原始对象已经被代理过了,就从map中取出缓存的值防止重复代理
    if (reactiveMap.has(obj)) {
        return reactiveMap.get(obj)
    }
    const proxy = new Proxy(obj, handler
    )
    reactiveMap.set(obj, proxy)
    return proxy
}

// proxy不使用target[key] 方式是为了避免this被更改
// let obj = {
//     name: '1',
//     get alias() {
//         return this.name
//     }
// }