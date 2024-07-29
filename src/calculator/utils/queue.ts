// 基于数组封装队列类
// 基于数组封装队列类
export class Queue<T> {
  items: T[];
  constructor() {
    // 属性
    this.items = [];
  }

  // 方法
  // 1.enqueue():将元素加入到队列中
  enqueue = (element: T) => {
    this.items.push(element);
  };

  // 2.dequeue():从队列中删除前端元素
  dequeue = () => {
    return this.items.shift();
  };

  // 3.front():查看前端的元素
  front = () => {
    return this.items[0];
  };

  // 4.isEmpty:查看队列是否为空
  isEmpty = () => {
    return this.items.length === 0;
  };

  // 5.size():查看队列中元素的个数
  size = () => {
    return this.items.length;
  };

  // 6.toString():将队列中元素以字符串形式输出
  toString = () => {
    let resultString = '';
    for (const i of this.items) {
      resultString += i + ' ';
    }
    return resultString;
  };
}
