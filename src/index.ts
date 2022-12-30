import { v4 } from "uuid";
import { Queue, Stats } from "./queue.js";

type Platform = "twitter" | "facebook" | "telegram";

const random = (min: number, max: number) => Math.random() * (max - min) + min;

class Post {
  constructor(
    readonly id: string,
    readonly paltform: Platform,
    readonly timestamp: number,
    readonly text: string,
    readonly likes: number,
    readonly reposts?: number
  ) {}
}

class Controller {
  timers: NodeJS.Timeout[] = [];

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
    const timer = setTimeout(() => {
      this.isRushHour = true;
      this.stopRushHour();
    }, interval);

    this.timers.push(timer);
  }

  stopRushHour() {
    const duration = random(400, 800);
    const timer = setTimeout(() => {
      this.isRushHour = false;
      this.startRushHour();
    }, duration);

    this.timers.push(timer);
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
      (this.isRushHour ? rand / 7 : rand) * this.modellingTimePaceCoef;

    const timer = setTimeout(
      () => this.runScrapper(platform, minInterval, maxInterval),
      interval
    );

    this.timers.push(timer);
  }

  async runQueueingSystem(delay: number) {
    const post = this.queue.dequeue();
    const timer = setTimeout(
      () => this.runQueueingSystem(delay),
      (post ? delay : 1) * this.modellingTimePaceCoef
    );

    this.timers.push(timer);
  }

  stop() {
    for (const timer of this.timers) {
      clearTimeout(timer);
      this.queue.stop();
    }
  }
}

async function imitate24H(): Promise<Stats> {
  const DAY_MODELLING_TIME = 24 * 60 * 10;
  const queue = new Queue<Post>(500);

  const timer = setInterval(() => console.log("len", queue.length), 100);

  const controller = new Controller(queue, 1);
  return new Promise((resolve) => {
    setTimeout(() => {
      clearInterval(timer);
      controller.stop();
      resolve(queue.stats);
    }, DAY_MODELLING_TIME);
  });
}

async function runMeasurements(numOfRuns: number) {
  const statsAccumulator: Stats[] = [];
  for (let i = 0; i < numOfRuns; i++) {
    const stats = await imitate24H();
    console.log({ stats });
    statsAccumulator.push(stats);
  }

  return statsAccumulator;
}

runMeasurements(10).then((statsAcc) => {
  console.log({ statsAcc });
});
