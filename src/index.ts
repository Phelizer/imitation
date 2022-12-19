import { v4 } from "uuid";
import { Queue } from "./queue.js";

type Platform = "twitter" | "facebook" | "telegram";

// TODO: refactor
function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

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
  constructor(private readonly queue: Queue<Post>) {
    this.startRushHour();
    setInterval(() => {
      console.log(this.isRushHour);
    }, 100);

    this.runThreeScrappers();
    this.runQueueingSystem(10);
  }

  startRushHour() {
    const interval = getRandomArbitrary(2000, 4000);
    setTimeout(() => {
      this.isRushHour = true;
      this.stopRushHour();
    }, interval);
  }

  stopRushHour() {
    const duration = getRandomArbitrary(400, 800);
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
      Math.floor(getRandomArbitrary(0, 10000)),
      Math.floor(getRandomArbitrary(0, 1000))
    );
  }

  async runScrapper(platform: Platform) {
    const post = this.randomPost(platform);
    this.queue.enqueue(post);
    const interval = this.isRushHour
      ? Math.floor(getRandomArbitrary(10, 100) / 10)
      : getRandomArbitrary(10, 100);

    setTimeout(() => this.runScrapper(platform), interval);
  }

  runThreeScrappers() {
    this.runScrapper("facebook");
    this.runScrapper("telegram");
    this.runScrapper("twitter");
  }

  async runQueueingSystem(delay: number) {
    const post = this.queue.dequeue();
    setTimeout(() => this.runQueueingSystem(delay), post ? delay : 1);
  }
}

const queue = new Queue<Post>(500);
setInterval(() => {
  console.log("Queue size: ", queue.length);
}, 500);

const controller = new Controller(queue);

// runScrapper("facebook", queue);
// runScrapper("telegram", queue);
// runScrapper("twitter", queue);

// setTimeout(() => runQueueingSystem(queue, 800), 5000);
