export let activeEffect = undefined

class ReactiveEffect {
    public active = true // 激活状态
    public parent = null
    public deps = []

    constructor(public fn) {
    }

    run() {
        if (!this.active) return this.fn() // 非激活,只执行函数,不进行依赖收集
        // 响应式依赖收集

        try {
            this.parent = activeEffect
            activeEffect = this
            return this.fn()
        } finally {
            activeEffect = this.parent
        }

    }
}

export function effect(fn) {
    const _effectFn = new ReactiveEffect(fn)
    _effectFn.run()
}

//一个属性对应多个effect  一个effect对应多个属性
const targetMap = new WeakMap()  // 依赖
export function track(target, type, key) {
    if (!activeEffect) return
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if (!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    let shouldTrack = deps.has(activeEffect)
    if (!shouldTrack) {
        deps.add(activeEffect)
        activeEffect.deps.push(deps)
    }
}

export function trigger(target, type, key, value) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return // 没在依赖中找到,说明没在模板中,不用触发页面更新
    const effects = depsMap.get(key)
    effects && effects.forEach(effect => {
        if (effect !== activeEffect) effect.run()
    })
}


// 嵌套effect 需要保证activeEffect的顺序
// effect(() => {
//     obj.a
//     effect(() => {
//         obj.b
//     })
//     obj.c
// })