const EventEmitter = require('events');
const PriorityQueue = require('./PriorityQueue');
const Task = require('./Task');

class AsyncQueue extends EventEmitter {
  constructor () {
    super();
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
    this.emit('addTask', task.options);
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
      this.emit('startTask', options);
      const result = await Promise.resolve(callback.call(context, this, options));
      completed && completed.call(context, this, result);
      this.emit('completed', options, result);
    } catch (err) {
      failed && failed.call(context, this, err);
      this.emit('failed', options, err);
    } finally {
      this.changeTask();
    }
  }

  nextTask () {
    return this.waitingQueue.dequeue();
  }

  changeTask () {
    if (!this.isPause) {
      const task = this.nextTask();
      if (task) {
        this.emit('changeTask', task.options);
        this.executeTask(task);
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
        const isRemoved = waitingQueue.removeTaskByIndex(i);
        this.emit('removeTask', options, isRemoved);
        return isRemoved;
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
