export default function defineReactive(data, key, val){
    if(arguments.length===2){
        val = data[key]
    }
    function getValue(e) { console.log(e); return val}
    function setValue(e) { console.log(e); val = e}
    Object.defineProperty(data, key, {
        // value: 3,
        enumerable: true,
        configurable: true,
        get: getValue,
        set: setValue
    });
}
