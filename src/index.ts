import { v4 } from "uuid";
import { Queue } from "./queue.js";

type Platform = "twitter" | "facebook" | "telegram";

const random = (min: number, max: number) => Math.random() * (max - min) + min;

class Post {
  constructor(
    readonly id: string,
    readonly paltform: Platform,
    readonly timestamp: number,
    readonly text: string,
    readonly likes: number,
    // this field is not relatable to telegram
    readonly reposts?: number
  ) {}
}

class Controller {
  constructor(
    private readonly queue: Queue<Post>,
    private readonly modellingTimePaceCoef: number
  ) {
    this.startRushHour();
    this.runScrapper("facebook", 10, 20);
    this.runQueueingSystem(10);
  }

  startRushHour() {
    const interval = random(2000, 4000);
    setTimeout(() => {
      this.isRushHour = true;
      this.stopRushHour();
    }, interval);
  }

  stopRushHour() {
    const duration = random(400, 800);
    setTimeout(() => {
      this.isRushHour = false;
      this.startRushHour();
    }, duration);
  }

  private isRushHour: boolean = false;

  private randomPost(platform: Platform) {
    return new Post(
      v4(),
      platform,
      Date.now(),
      "text",
      Math.floor(random(0, 10000)),
      Math.floor(random(0, 1000))
    );
  }

  async runScrapper(
    platform: Platform,
    minInterval: number,
    maxInterval: number
  ) {
    const post = this.randomPost(platform);
    this.queue.enqueue(post);
    const rand = random(minInterval, maxInterval);
    const interval =
      (this.isRushHour ? rand / 10 : rand) * this.modellingTimePaceCoef;

    setTimeout(
      () => this.runScrapper(platform, minInterval, maxInterval),
      interval
    );
  }

  async runQueueingSystem(delay: number) {
    const post = this.queue.dequeue();
    setTimeout(
      () => this.runQueueingSystem(delay),
      (post ? delay : 1) * this.modellingTimePaceCoef
    );
  }
}

const queue = new Queue<Post>(500);
setInterval(() => {
  console.log("Queue size: ", queue.length);
}, 500);

const controller = new Controller(queue, 1);
