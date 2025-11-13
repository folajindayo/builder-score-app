/**
 * Task Queue Implementation
 */

export interface Task<T = any> {
  id: string;
  execute: () => Promise<T>;
  priority: number;
  createdAt: Date;
}

export class TaskQueue {
  private queue: Task[] = [];
  private processing: boolean = false;
  private concurrency: number;
  private activeCount: number = 0;

  constructor(concurrency: number = 1) {
    this.concurrency = concurrency;
  }

  async enqueue<T>(execute: () => Promise<T>, priority: number = 0): Promise<T> {
    return new Promise((resolve, reject) => {
      const task: Task<T> = {
        id: `task-${Date.now()}-${Math.random()}`,
        execute: async () => {
          try {
            const result = await execute();
            resolve(result);
            return result;
          } catch (error) {
            reject(error);
            throw error;
          }
        },
        priority,
        createdAt: new Date(),
      };

      this.queue.push(task);
      this.queue.sort((a, b) => b.priority - a.priority);
      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0 && this.activeCount < this.concurrency) {
      const task = this.queue.shift();
      if (!task) break;

      this.activeCount++;
      task.execute()
        .finally(() => {
          this.activeCount--;
          this.process();
        });
    }

    this.processing = false;
  }

  size(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }
}

