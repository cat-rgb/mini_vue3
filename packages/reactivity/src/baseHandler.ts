import {activeEffect, track, trigger} from "./effect";

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
        return Reflect.get(target, key, receiver)
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

