// import defineReactive from './utils'
let uid = 0
let wid = 0
class Dep {
    constructor() {
        console.log('new Dep')
        this.id = uid++
        this.subs = []
    }
    addSub(sub){
        // 订阅
        this.subs.push(sub)
    }
    depend(){
        if(Dep.target) {
            this.addSub(Dep.target)
        }
    }
    notify(){
        console.log('通知')
        const subs = this.subs.slice()
        for(let i = 0, l = subs.length; i <l; i++) {
            subs[i].update()
        }
    }
}

function parsePath(str){
    var segments = str.split('.')
    return (obj)=>{
        for(let i = 0; i < segments.length; i++){
            if(!obj) return
            obj = obj[segments[i]]
        }
        return obj
    }
}

class Watcher {
    constructor(target,expression,callback) {
        console.log('new Watcher')
        this.id = wid++
        this.target = target
        this.getter = parsePath(expression)
        this.callback = callback
        this.value = this.get()
    }
    update() {
        this.run()
    }
    get(){
        Dep.target = this
        const obj = this.target
        let value
        try{
            value = this.getter(obj)
        } finally {
            Dep.target = null
        }
        return value
    }
    run(){
        this.getAndInvoke(this.callback)
    }
    getAndInvoke(fn){
        const value = this.get()
        if(value !== this.value || typeof value == 'object'){
            const oldValue = this.value
            this.value = value
            fn.call(this.target,value,oldValue)
        }
    }
}

const def = function(obj,key,value,enumerable){
    Object.defineProperty(obj, key, {
        enumerable,
        writable: true,
        configurable: true,
        value
    })
}
// 改写
const arrFunc = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]
const arrayProtoType = Array.prototype
const arrayMethods = Object.create(arrayProtoType)
arrFunc.forEach(el=>{
    const original = arrayProtoType[el]
    def(arrayMethods, el, function(){
        const ob = this.__ob__
        let inserted = []
        switch (el) {
            case 'push':
            case 'unshift':
                inserted = arguments
                break
            case 'splice':
                inserted = Array.from(arguments).slice(2)
                break
        }
        if(inserted.length){
            ob.observeArray(inserted)
        }
        ob.dep.notify()
        console.log(123)
        const result = original.apply(this,arguments)
        return result||this
    }, false)
})

// 设置响应式
function defineReactive(data, key, val){
    this.dep = new Dep()
    if(arguments.length===2){
        val = data[key]
    }
    // if(typeof data[key] === 'object'){
    let childOb = observe(val)
    // }
    function getValue( ) {
        console.log(`访问${key}属性`);
        if(Dep.target){
            dep.depend()
            if(childOb){
                console.log(childOb)
                childOb.dep.depend()
            }
        }
        return val
    }
    function setValue(e) {
        console.log(`设置${key}属性`);
        val = e;
        childOb = observe(e);
        dep.notify()
    }
    Object.defineProperty(data, key, {
        // value: 3,
        enumerable: true,
        configurable: true,
        get: getValue,
        set: setValue
    });
}
// 观察添加__ob__
class Observer {
    constructor(val) {
        this.initValue(val)
        if(Array.isArray(val)){
            Object.setPrototypeOf(val, arrayMethods)
            this.observeArray(val)
        }else{
            this.walk(val)
        }
    }
    initValue(val){
        console.log(val)
        this.dep = new Dep()
        def(val, '__ob__', this, false)
    }
    // 遍历
    walk(val){
        for(const key in val) {
            defineReactive(val, key)
        }
    }
    observeArray(val){
        for(let i = 0; i < val.length; i++){
            observe(val[i])
        }
    }
}

function observe(val) {
    if(typeof val !== 'object') return
    let ob
    if(typeof val.__ob__ !== 'undefined'){
        ob = val.__ob__
    } else {
        ob = new Observer(val)
    }
    return ob
}

var obj = {
    a: {
        m: {
            n:5
        }
    },
    b: 4,
    arr: [22,33,44,55]
};

// defineReactive(obj, 'a')
// defineReactive(obj, 'b', 1)
// defineReactive(obj, 'c', 1)

observe(obj)
new Watcher(obj, 'a.m.n', (val,oldVal)=>{
    console.log(val)
    console.log(oldVal)
})
obj.a.m.n = 8
// obj.a = 'a'
// obj.b++
// obj.a.m.n++
// obj.a.c = {
//     e: 0
// }
// obj.arr.push(66)
// // obj.arr[0] = 1
//
// // console.log(obj)
// // console.log(obj.a.m.n, obj.b)
// // console.log(obj.a.c.e)
// console.log(obj.arr.splice(2,1,88,99))
console.log(obj)


