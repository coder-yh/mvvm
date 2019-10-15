class Compile {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el); // 选中dom
    this.vm = vm; // vm实例 => MVVM

    if (this.el) {
      let fragment = this.nodeToFragment(this.el);
      this.compile(fragment); // 处理变化的标签
      this.el.appendChild(fragment);
    }
  }
  isElementNode(node) {
    // 判断node是否是标签 例如div、p...
    return node.nodeType === 1;
  }
  isDirective(attrName) {
    // 判断属性名称是否包含v-
    return attrName.includes('v-');
  }
  nodeToFragment(el) {
    // 将标签存储到内存中
    let fragment = document.createDocumentFragment(); // 创建一个空的fragment存储空间
    while (el.firstChild) {
      fragment.appendChild(el.firstChild);
    }
    return fragment;
  }
  compile(fragment) {
    // 解析内存中的fragment
    let childNodes = fragment.childNodes; // 获取el下面的所有标签
    Array.from(childNodes).forEach(node => {
      if (this.isElementNode(node)) {
        // 是node标签
        this.compileElement(node);
        this.compile(node);
      } else {
        this.compileText(node);
      }
    });
  }
  compileElement(node) {
    // 编译标签
    let attrs = node.attributes; // 获取标签上面的属性
    Array.from(attrs).forEach(attr => {
      let attrName = attr.name; // 获取标签的名字
      if (this.isDirective(attrName)) {
        let attrValue = attr.value; // 获取属性对应的值
        let [, type] = attrName.split('-'); // 获取v-指令，对应指令的类型 type = model || type = on ...
        CompileUtil[type](node, this.vm, attrValue);
      }
    });
  }
  compileText(node) {
    // 编译文本
    let text = node.textContent; // 获取文本节点内容

    // 创建匹配 {{}} 的正则表达式
    let reg = /\{\{([^}]+)\}\}/g; // 贪婪匹配
    if (reg.test(text)) {
      // 如果存在{{}}
      CompileUtil.text(node, this.vm, text);
    }
  }
}
