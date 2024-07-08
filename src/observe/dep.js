let id = 0;
class Dep {
  constructor(vm, fn, options) {
    this.id = id++; //属性的dep收集watcher
    this.subs = []; //存放当前属性对应的watcher有哪些
  }
  depend() {
    this.subs.push(Dep.target);
  }
}
Dep.target = null;
export default { Dep };
