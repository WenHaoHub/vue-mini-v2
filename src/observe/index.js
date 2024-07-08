import { newArrayProto } from "./array";
import Dep  from "./dep.js";
class Observe {
  constructor(data) {
    // data.__ob__ = this;
    //不可枚举
    Object.defineProperty(data, "__ob__", {
      value: this,
      enumerable: false,
    });
    // this.walk(data);
    if (Array.isArray(data)) {
      data.__proto__ = newArrayProto;
      console.log(">>>data", data);
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }

  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
  observeArray(data) {
    data.forEach((item) => {
      observe(item);
    });
  }
}
function defineReactive(target, key, val) {
  //递归遍历 对象类型代理
  observe(val);
  let dep=new Dep();
  Object.defineProperty(target, key, {

    get() {
  debugger;

      console.log(">>>defineReactive-get", key);
      if(Dep.target){
        dep.depend();
      }
      return val;
    },
    set(newVal) {
      console.log(">>>defineReactive-set", key, newVal);
      if (newVal === val) return;
      val = newVal;
    },
  });
  // const dep = new Dep();
  // Object.defineProperty(target, key, {
  //     get(){
  //         if(Dep.target){
  //             dep.depend();
  //         }
  //         return val;
  //     },
  //     set(newVal){
  //         if(newVal === val) return;
  //         val = newVal;
  //         dep.notify();
  //     }
  // })
}
export function observe(data) {
  // typeof {} [] == object
  if (typeof data !== "object" || data === null) {
    return;
  }
  if (data.__ob__ instanceof Observe) {
    return data.__ob__;
  }
  new Observe(data);
}
