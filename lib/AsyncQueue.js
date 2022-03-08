const Event = require('./Event');
const PriorityQueue = require('./PriorityQueue');
const Task = require('./Task');

class AsyncQueue extends Event {
  /**
   * constructor
   * @param {number} executeLimit Number of concurrent，Default: 1.
   */
  constructor (executeLimit = 1) {
    super();
    this._pause = false;
    this.executeLimit = executeLimit;
    this.executingQueue = [];
    this.waitingQueue = new PriorityQueue();
    this.eventHandlerMap = {};
  }

  addTask (...args) {
    const task = new Task(...args);
    task.options.createTime = this.getNowTimestamp();
    if (this.executingQueue.length >= this.executeLimit || this.isPause) {
      this.waitingQueue.enqueue(task);
    } else {
      this.executeTask(task);
    }
    this.emit('addTask', task.options);
    return this;
  }

  async executeTask (task) {
    this.executingQueue.push(task);
    const { options, callback } = task;
    const { context, delay, start, completed, failed } = options;
    if (delay) {
      await this.sleep(delay);
    }
    try {
      start && start.call(context, this, options);
      this.emit('startTask', options);
      options.startTime = this.getNowTimestamp();
      const result = await Promise.resolve(callback.call(context, this, options));
      options.endTime = this.getNowTimestamp();
      completed && completed.call(context, this, result);
      this.emit('completed', options, result);
    } catch (err) {
      options.endTime = this.getNowTimestamp();
      failed && failed.call(context, this, err);
      this.emit('failed', options, err);
    } finally {
      this.changeTask(task);
    }
  }

  nextTask () {
    return this.waitingQueue.dequeue();
  }

  changeTask (task) {
    if (task) {
      const index = this.executingQueue.findIndex((item) => item === task);
      this.executingQueue.splice(index, 1);
    }
    if (!this.isPause) {
      const task = this.nextTask();
      if (task) {
        this.emit('changeTask', task.options);
        this.executeTask(task);
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
    if (this.executingQueue.length < this.executeLimit) {
      this.changeTask();
    }
  }

  sleep (timestamp) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, timestamp);
    });
  }

  setExcutingLimit (executeLimit) {
    this.executeLimit = executeLimit;
  }

  getNowTimestamp () {
    return new Date().getTime();
  }
}

module.exports = AsyncQueue;
