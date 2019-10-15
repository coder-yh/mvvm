class Dep {
  constructor() {
    this.subs = []; // 存储需要监听的data里面的key
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach(watcher => watcher.updated());
  }
}
