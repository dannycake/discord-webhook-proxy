import { EventEmitter } from 'events';
import logger from './logger';

export class Queue<T> extends EventEmitter {
  public readonly name: string;

  private data: T[] = [];

  constructor(name: string) {
    super();
    this.name = name;
  }

  add(...items: T[]): void {
    items.map((item) => this.data.push(item));
    this.emit('item');
  }

  shuffle(): void {
    for (let i = this.data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
    }
  }

  private pop(): T {
    const item = this.data.pop();
    if (!item)
      throw new Error(`Queue ${this.name} is empty but attempted to grab item`);
    return item;
  }

  dump(): T[] {
    return this.data;
  }

  clear(): void {
    this.data = [];
  }

  get length(): number {
    return this.data.length;
  }

  /**
   * Waits until next item is available and grabs it
   */
  async next(): Promise<T> {
    const item = this.data.pop();
    if (item) {
      // logger.debug(
      //   `Got an item in the queue for ${this.name}, ${this.length} left`
      // );

      if (this.length === 0) this.emit('finished');

      return item;
    }

    // logger.debug(`Waiting for next item in the queue for ${this.name}`);

    return new Promise((resolve) =>
      this.once('item', () => resolve(this.pop()))
    );
  }

  /**
   * Waits until the queue is empty
   */
  finished(): Promise<void> {
    return new Promise<void>((resolve) =>
      this.once('finished', () => {
        resolve();
      })
    );
  }
}

type QueueExecutor<T> = (item: T) => Promise<void>;

export class AsyncQueue<T> extends Queue<T> {
  declare execute: QueueExecutor<T>;

  constructor(name: string, execute: QueueExecutor<T>) {
    super(name);

    this.execute = execute;
    this.start();
  }

  async start(): Promise<any> {
    for (;;) {
      try {
        const next = await this.next();
        await this.execute(next);
      } catch (error) {
        logger.error(`Failed to process item for queue ${this.name}:`, error);
      }
    }
  }
}
