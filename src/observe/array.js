// 重写数组
let oldArrayProtoMethods = Array.prototype;
let newArrayProto = Object.create(oldArrayProtoMethods);
let methods = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"]; // 7个方法
methods.forEach((method) => {
  newArrayProto[method] = function (...args) {
    // ...arguments  把数组中的参数转为数组
    const result = oldArrayProtoMethods[method].call(this, ...args);
    // 添加新功能
    let inserted;
    let ob = this.__ob__;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
    }
    if (inserted) {
      ob.observeArray(inserted);
    }
    console.log('>>>result',result);
    return result;
  };
});
export { newArrayProto };
