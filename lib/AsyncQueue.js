const PriorityQueue = require('./PriorityQueue');
const Task = require('./Task');

class AsyncQueue {
  constructor () {
    this.executing = null;
    this.waitingQueue = new PriorityQueue();
  }

  addTask (...args) {
    const task = new Task(...args);
    if (this.executing) {
      this.waitingQueue.enqueue(task);
    } else {
      this.executeTask(task);
    }
  }

  async executeTask (task) {
    this.executing = task;
    const { options, callback } = task;
    const { context, delay, completed, failed } = options;
    if (delay) {
      await this.sleep(delay);
    }
    try {
      const result = await Promise.resolve(callback.call(context, options));
      completed && completed.call(context, result);
    } catch (err) {
      failed && failed.call(context, err);
    } finally {
      this.changeTask();
    }
  }

  nextTask () {
    return this.waitingQueue.dequeue();
  }

  async changeTask () {
    const task = this.nextTask();
    if (task) {
      await this.executeTask(task);
    } else {
      this.executing = null;
    }
  }

  clearTask () {
    this.waitingQueue.clear();
  }

  removeTask (taskId) {
    const { waitingQueue } = this;
    for (let i = 0; i < waitingQueue.length(); i++) {
      const { options } = waitingQueue.getTaskByIndex(i);
      if (options.id && options.id === taskId) {
        return waitingQueue.removeTaskByIndex(i);
      }
    }
    return false;
  }

  sleep (timestamp) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, timestamp);
    });
  }
}

module.exports = AsyncQueue;
