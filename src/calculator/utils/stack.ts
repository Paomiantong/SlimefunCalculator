export class Stack<T> {
  constructor(initialItems: T[] = []) {
    this._stack = initialItems;
  }
  private _stack: T[];
  get size() {
    return this._stack.length;
  }
  push(item: T) {
    this._stack.push(item);
  }
  pop() {
    return this._stack.pop();
  }
  peek() {
    return this._stack[this.size - 1];
  }
  clear() {
    this._stack = [];
  }
}
