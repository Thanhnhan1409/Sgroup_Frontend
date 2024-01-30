let currentEffect = null
class Dependency {
    constructor() {
        this.subscribers = new Set();
    }

    subscribe() {
        if (currentEffect) {
            this.subscribers.add(currentEffect);
        }
    }

    notify() {
        this.subscribers.forEach((subscribe) => {
            subscribe();
        });
    }
}


let dependenciesMap = new WeakMap();

function getDependency(target, key) {
    let dependenciesForTarget = dependenciesMap.get(target)
    if (!dependenciesForTarget) {
        dependenciesForTarget = new Map()
        dependenciesMap.set(target, dependenciesForTarget)
    }

    let dependency = dependenciesForTarget.get(key)
    if (!dependency) {
        dependency = new Dependency()
        dependenciesForTarget.set(key, dependency)
    }

    return dependency
}

function newReactive(raw) {
    return new Proxy(raw, {
        get(target, key, receiver) {
            let dependency = getDependency(target, key)
            dependency.subscribe()
            return Reflect.get(target, key, receiver)
        },
        set(target, key, value, receiver) {
            const dependency = getDependency(target, key)
            const result = Reflect.set(target, key, value, receiver)
            dependency.notify()

            return result
        }
    })
}

function watchEffect(effect) {
    currentEffect = effect;
    effect();
    currentEffect = null;
}

function newRef(raw) {
    return newReactive({ value: raw })
}

class newComputedRef {
    constructor(fn) {
        this._dep = new Dependency()
        this._fn = fn
        watchEffect(() => {
            this._dep.notify()
        })
    }

    get value() {
        this._dep.subscribe()
        return this._fn()
    }
}

function computed(fn) {
    return new newComputedRef(fn)
}

const state = newRef(1)
const valueComputed = computed(() => state.value++)
watchEffect(() => {
    // Lỗi lặp vô tận hehhhhh
    console.log('hehhhhh');
    console.log(valueComputed.value)
})
//hhh
// state.value++