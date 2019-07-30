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
    const { data, callback } = task;
    try {
      data.delay && await this.sleep(data.delay);
      const res = await Promise.resolve(callback.call(data.context, data));
      data.success && data.success.call(data.context, res);
    } catch (err) {
      data.error && data.error.call(data.context, err);
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

  sleep (timestamp) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, timestamp);
    });
  }
}

module.exports = AsyncQueue;
