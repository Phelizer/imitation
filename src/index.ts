import { Queue } from "queue-typescript";
import { v4 } from "uuid";

type Platform = "twitter" | "facebook" | "telegram";

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

async function runScrapper(platform: Platform, queue: Queue<Post>) {
  const post = new Post(
    v4(),
    platform,
    Date.now(),
    "text",
    Math.floor(getRandomArbitrary(0, 10000)),
    Math.floor(getRandomArbitrary(0, 1000))
  );

  queue.enqueue(post);

  const interval = getRandomArbitrary(100, 3000);
  setTimeout(() => runScrapper(platform, queue), interval);
}

const queue = new Queue<Post>();

console.log("Done");

setInterval(() => {
  console.log("Queue size: ", queue.length);
}, 1000);

runScrapper("facebook", queue);
runScrapper("telegram", queue);
runScrapper("twitter", queue);
