import {activeEffect, track, trigger} from "./effect";
import {isObject} from "@vue/shared";
import {reactive} from "./reactive";

export const enum ReactiveFlags {
    IS_REACTIVE = '_v_isReactive'
}

export const handler = {
    get(target: any, key: string | symbol, receiver: any): any {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true
        }
        // console.log('get 监听')
        track(target, 'get', key)
        const res = Reflect.get(target, key, receiver)  // Reflect.get的返回值是target[key]
        console.log('res', res)
        if (isObject(res)) {
            return reactive(res)
        }

        return res
    },
    set(target: any, key: string | symbol, newValue: any, receiver: any): boolean {
        // console.log('set 设置')
        let oldValue = target[key]
        const result = Reflect.set(target, key, newValue, receiver)
        if (oldValue !== newValue) {
            trigger(target, 'set', key, newValue)
        }
        return result
    }
}

// 对象 某个属性 -> 多个effect
// weakMap = {target对象: Map('key属性': [Set(多个effect)])}

