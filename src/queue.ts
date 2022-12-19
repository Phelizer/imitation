import * as R from "ramda";

export class Queue<T> {
  private _capacity: number;
  private _elements: T[];

  get capacity() {
    return this._capacity;
  }

  get elements() {
    return R.clone(this._elements);
  }

  get length() {
    return this._elements.length;
  }

  enqueue(element: T) {
    if (this._elements.length >= this._capacity) {
      return;
    }

    this._elements.push(element);
  }

  dequeue() {
    return this._elements.shift();
  }

  constructor(capacity: number, ...elements: T[]) {
    this._capacity = capacity;
    this._elements = elements;
  }
}
