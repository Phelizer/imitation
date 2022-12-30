import * as R from "ramda";

export interface Stats {
  averageQueueLength: number;
  probabilityOfHandling: number;
  lostQueries: number;
  handledQueries: number;
  totalQueries: number;
  queriesLeftInQueue: number;
}

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

  get stats(): Stats {
    return {
      averageQueueLength: this.averageQueueLength,
      probabilityOfHandling: this.probabilityOfHandling,
      lostQueries: this.lostQueries,
      handledQueries: this.handledQueries,
      totalQueries: this.totalQueries,
      queriesLeftInQueue: this.length,
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
    const elem = this._elements.shift();
    if (elem) {
      this.handledQueries++;
    }

    return elem;
  }

  stop() {
    clearInterval(this.intervalID);
  }

  intervalID: NodeJS.Timeout;

  constructor(capacity: number, ...elements: T[]) {
    this._capacity = capacity;
    this._elements = elements;

    // Each 20 ms it will push the current queue length to the queueLengthes array
    // in order to calculate the average queue length
    this.intervalID = setInterval(() => {
      this.queueLengthes.push(this.length);
    }, 20);
  }
}
