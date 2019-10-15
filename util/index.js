let CompileUtil = {
  updated: {
    updataText(node, value) {
      // 文本节点更新内容
      node.textContent = value;
    },
    modelUpdater(node, value) {
      // 输入框更新内容
      node.value = value;
    }
  },
  formateData(vm, valKey) {
    // 格式化data中的数据 valKey为data中的key
    let keyArr = valKey.search('.') == -1 ? [valKey] : valKey.split('.'); // 存储匹配的属性的key['people','name']
    // 获取对应属性的值
    return keyArr.reduce((fatherKey, childKey) => {
      // 父亲的key,子类的key 返回最终key对应的值
      return fatherKey[childKey];
    }, vm.$data);
  },
  getTextInData(vm, value) {
    // 在data中获取对应变量的值
    return value.replace(/\{\{([^}]+)\}\}/g, (...args) => {
      return this.formateData(vm, args[1].trim()); // trim去掉变量前后的空格 => people.name
    });
  },
  setData(vm, valKey, newValue) {
    let dataArr = vm.$data;
    // 设置data中的值
    keyArr = valKey.search('.') == -1 ? [valKey] : valKey.split('.');
    return keyArr.reduce((oldVal, newVal, index) => {
      if (keyArr.length - 1 <= index) {
        return (dataArr[oldVal][newVal] = newValue);
      }
      return dataArr[oldVal][newVal];
    });
  },
  model(node, vm, value) {
    // value 对应变量中的key
    // reg为匹配后的变量名称
    let update = this.updated.modelUpdater;
    let dataValue = this.formateData(vm, value); // 找到data中对应的值

    // 添加观察者，作用与 text 方法相同
    new Watcher(vm, value, newValue => {
      update && update(node, newValue);
    });

    // v-model 双向数据绑定，对 input 添加事件监听
    node.addEventListener('input', e => {
      // 获取输入的新值
      let newValue = e.target.value;
      // 更新到节点
      this.setData(vm, value, newValue);
    });

    // 第一次设置值
    update && update(node, dataValue);
  },
  text(node, vm, value) {
    // reg为匹配后的变量名称
    let update = this.updated.updataText;
    let dataValue = this.getTextInData(vm, value); // 找到data中对应的值
    // 替换html中变量的值为data中的值
    value.replace(/\{\{([^}]+)\}\}/g, (...args) => {
      // 解析时遇到了模板中需要替换为数据值的变量时，应该添加一个观察者
      // 当变量重新赋值时，调用更新值节点到 Dom 的方法
      new Watcher(vm, args[1].trim(), newValue => {
        // 如果数据发生变化，重新获取新值
        update && update(node, newValue);
      });
    });
    update && update(node, dataValue);
  }
};
