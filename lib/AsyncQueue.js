const PriorityQueue = require('./PriorityQueue');
const Task = require('./Task');

class AsyncQueue {
  constructor () {
    this._pause = false;
    this.executing = null;
    this.waitingQueue = new PriorityQueue();
  }

  addTask (...args) {
    const task = new Task(...args);
    if (this.executing || this.isPause) {
      this.waitingQueue.enqueue(task);
    } else {
      this.executeTask(task);
    }
  }

  async executeTask (task) {
    this.executing = task;
    const { options, callback } = task;
    const { context, delay, start, completed, failed } = options;
    if (delay) {
      await this.sleep(delay);
    }
    try {
      start && start.call(context, this, options);
      const result = await Promise.resolve(callback.call(context, this, options));
      completed && completed.call(context, this, result);
    } catch (err) {
      failed && failed.call(context, this, err);
    } finally {
      await this.changeTask();
    }
  }

  nextTask () {
    return this.waitingQueue.dequeue();
  }

  async changeTask () {
    if (!this.isPause) {
      const task = this.nextTask();
      if (task) {
        await this.executeTask(task);
      } else {
        this.executing = null;
      }
    }
  }

  clearTask () {
    this.waitingQueue.clear();
  }

  removeTask (taskId) {
    const { waitingQueue } = this;
    for (let i = 0; i < waitingQueue.length(); i++) {
      const { options } = waitingQueue.getTaskByIndex(i);
      const { remove, context } = options;
      if (options.id && options.id === taskId) {
        remove && remove.call(context, this, options);
        return waitingQueue.removeTaskByIndex(i);
      }
    }
    return false;
  }

  pause () {
    this._pause = true;
  }

  get isPause () {
    return this._pause;
  }

  resume () {
    this._pause = false;
    this.changeTask();
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
