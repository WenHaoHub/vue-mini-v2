import { observe } from "./observe/index";
import { compileToFunction } from "./compiler/index";
import { initLifecycle, mountComponent } from "./lifecycle/index";
export default function Vue(options) {
  this._init(options);
}
initMixin(Vue);
initLifecycle(Vue);
function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;
    initState(vm);
    if (options.el) {
      vm.$mount(options.el);
    }
  };
  Vue.prototype.$mount = function (el) {
    const vm = this;
    el = document.querySelector(el);
    let ops = vm.$options;
    if (!ops.render) {
      let template;
      if (!ops.template && el) {
        template = el.outerHTML;
      } else {
        if (el) {
          template = ops.template;
        }
      }
      if (template) {
        const render = compileToFunction(template);
        ops.render = render;
      }
    }
    mountComponent(vm, el); //组件挂载
  };
}
function initState(vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
}
function _proxy(vm, target, key) {
  // vm[key]=vm[target][key];
  Object.defineProperty(vm, key, {
    get() {
      // console.log('>>>get',key);
      return vm[target][key];
    },
    set(newValue) {
      // console.log('>>>set',newValue);
      vm[target][key] = newValue;
    },
  });
}
function initData(vm) {
  let data = vm.$options.data;
  if (typeof data === "function") {
    data = data.call(vm);
  }
  vm._data = data;
  observe(data);
  // //实现了两个位置的代理 下面这个就是为了方便取值
  //直接赋值没有代理劫持
  for (const key in data) {
    _proxy(vm, "_data", key);
  }
}
