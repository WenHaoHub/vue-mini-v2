import { createElementVNode, createTextVNode } from "../vdom/index.js";
import { Watcher } from "../observe/watcher.js";
export function mountComponent(vm, el) {
  //调用render方法
  vm.$el = el;
  const updateComponent = () => {
    //根据虚拟dom生成真实dom
    vm._update(vm._render());
  };
  new Watcher(vm, updateComponent,true);
}
//属性处理
function patchProps(el, props) {
  for (let key in props) {
    if (key === "style") {
      for (let styleName in props.style) {
        el.style[styleName] = props.style[styleName];
      }
    } else {
      el.setAttribute(key, props[key]);
    }
  }
}

function createElm(vnode) {
  let { tag, data, children, text } = vnode;
  if (typeof tag === "string") {
    vnode.el = document.createElement(tag); //虚拟节点挂载真实节点
    patchProps(vnode.el, data);
    children.forEach((child) => {
      let childEl = createElm(child);
      vnode.el.appendChild(childEl);
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}
function patch(oldvNode, vnode) {
  const isRealElement = oldvNode.nodeType; //原生
  //chu
  if (isRealElement) {
    const el = oldvNode;
    const parentEl = el.parentNode; //拿到父节点
    let newEl = createElm(vnode);
    parentEl.insertBefore(newEl, el.nextSibling);
    parentEl.removeChild(el);
    console.log(">>>newEl", newEl);
    return newEl;
  } else {
  }
}
export function initLifecycle(Vue) {
  Vue.prototype._update = function (vNode) {
    const vm = this;
    const el = vm.$el;
    vm.$el = patch(el, vNode);
  };
  Vue.prototype._c = function () {
    // console.log('>>>_c',this);
    console.log(">>>_carguments", ...arguments);
    return createElementVNode(this, ...arguments);
  };
  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments);
  };
  Vue.prototype._s = function (val) {
    return JSON.stringify(val);
  };
  Vue.prototype._render = function () {
    const vm = this;
    /** render方法
        with(this){
          return _c(
                  "div",
                  { id: "app", key: "#app" },
                  _c("p", { key: "p1" }, _v("hello")),
                  _c("p", { key: "p2", style: { color: "red" } }, _v(_s(message)))
                );
          }
      */
    //让with的this指向vm
    return vm.$options.render.call(vm); //ast转义后生成的
  };
}
