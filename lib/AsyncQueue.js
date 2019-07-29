const PriorityQueue = require('./PriorityQueue');
const Task = require('./Task');

class AsyncQueue {
  constructor () {
    this.executing = null;
    this.waitingQueue = new PriorityQueue();
  }

  addTask ({
    context = null,
    data = {},
    callback = () => {}
  }) {
    const task = new Task(context, data, callback);
    if (this.executing) {
      this.waitingQueue.enqueue(task);
    } else {
      this.executeTask(task);
    }
  }

  async executeTask (task) {
    this.executing = task;
    const { context, data, callback } = task;
    try {
      await Promise.resolve(callback.call(context, data));
    } catch (err) {
      data.errorCallback && data.errorCallback.call(context, err);
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
}

module.exports = AsyncQueue;
