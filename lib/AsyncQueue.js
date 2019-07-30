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
    const { context, delay, success, error } = data;
    if (delay) {
      await this.sleep(delay);
    }
    try {
      const res = await Promise.resolve(callback.call(context, data));
      success && success.call(context, res);
    } catch (err) {
      error && error.call(context, err);
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
      const { data } = waitingQueue.getTaskByIndex(i);
      if (data.id && data.id === taskId) {
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
