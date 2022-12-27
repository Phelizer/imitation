import * as R from "ramda";

export class Queue<T> {
  private _capacity: number;
  private _elements: T[];

  private queueLengthes: number[] = [];
  private totalQueries: number = 0;
  private handledQueries: number = 0;
  private lostQueries: number = 0;

  private get averageQueueLength() {
    return R.mean(this.queueLengthes);
  }

  private get probabilityOfHandling() {
    return this.handledQueries / this.totalQueries;
  }

  get stats() {
    return {
      averageQueueLength: this.averageQueueLength,
      probabilityOfHandling: this.probabilityOfHandling,
      lostQueries: this.lostQueries,
      handledQueries: this.handledQueries,
      totalQueries: this.totalQueries,
    };
  }

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
    this.totalQueries++;

    if (this._elements.length >= this._capacity) {
      this.lostQueries++;
      return;
    }

    this._elements.push(element);
  }

  dequeue() {
    this.handledQueries++;
    return this._elements.shift();
  }

  constructor(capacity: number, ...elements: T[]) {
    this._capacity = capacity;
    this._elements = elements;

    // Each 20 ms it will push the current queue length to the queueLengthes array
    // in order to calculate the average queue length
    setInterval(() => {
      this.queueLengthes.push(this.length);
    }, 20);
  }
}
