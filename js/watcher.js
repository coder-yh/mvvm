class Watcher {
  constructor(vm, key, cb) {
    // key 为页面对应的变量 people.name
    this.vm = vm;
    this.key = key;
    this.cb = cb;
    this.oldValue = this.get();
  }
  get() {
    Dep.target = this;
    let value = CompileUtil.formateData(this.vm, this.key); // 获取data中对应的值
    Dep.target = null;
    return value;
  }
  updated() {
    // 获取新值
    let newValue = CompileUtil.formateData(this.vm, this.key);
    // 获取旧值
    let oldValue = this.oldValue;
    // 如果新值和旧值不相等，就执行 callback 对 dom 进行更新
    if (newValue !== oldValue) {
      this.cb(newValue);
    }
  }
}
