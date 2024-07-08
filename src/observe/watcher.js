import { Dep } from "./dep.js";

let id = 0;
// 1）当我们创建渲染watcher的时候我们会把当前的渲染watcher放到Dep.target上
// 2）调用_render(）会取值走到get上

class Watcher {
  constructor(vm,fn,options) {//不同组件有不同的watcher目前只有一个渲染根实例的
    
    this.id = id++;
    this.renderWatcher = options;//= options; //是一个渲染watcher
    this.getter = fn;// getter意味着调用这个函数可以发生取值操作
    this.get()
  }
  get(){
    Dep.taget=this
    this.getter()//vm上取值
    Dep.taget=null
    
  }
}
export default {Watcher}