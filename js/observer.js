class Observer {
  constructor(data) {
    this.observe(data);
  }
  observe(data) {
    if (!data || typeof data !== 'object') return;
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
      this.observe(data[key]); // 对data下面的所有对象的key都做遍历
    });
  }
  defineReactive(obj, key, value) {
    let _this = this;
    let dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true, // 是否可遍历
      configurable: true, // 是否可以删除
      get() {
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set(newVal) {
        console.log('newVal', newVal);
        if (newVal !== value) {
          _this.observe(newVal); // 重新赋值如果是对象进行深度劫持
          value = newVal;
          dep.notify(); // 通知所有人数据更新了
        }
      }
    });
  }
}
