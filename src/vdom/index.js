export function createElementVNode(vm, tag, data, ...children) {
  let key = data?.key || "key";
  if (key) {
    delete data.key;
  }
  return vnode(vm, tag, key, data, children);
}
//_v();
export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}
function vnode(vm, tag, key, data, children, text) {
  return {
    vm,
    tag,
    key,
    data,
    children,
    text,
  };
}
