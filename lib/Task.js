class Task {
  constructor (...args) {
    // default setting
    this.options = {
      id: undefined,
      priority: 'normal',
      weight: 0,
      context: null,
      start: () => {},
      completed: () => {},
      failed: () => {},
      remove: () => {}
    };
    this.callback = () => {};
    // initArgs
    this.initArgs(...args);
  }

  initArgs (...args) {
    const len = args.length;
    if (len === 0) {
      return;
    }
    if (len === 1) {
      if (typeof args[0] === 'function') {
        this.callback = args[0];
      } else {
        throw new Error('Invalid Argument For PAQ, Expected A Function!');
      }
    } else {
      if (typeof args[0] === 'object') {
        this.options = Object.assign(this.options, args[0]);
        this.options.weight = this.setWeightByPriority();
        this.validateArgs(this.options);
      } else {
        throw new Error('Invalid First Argument For PAQ, Expected A Object!');
      }
      if (typeof args[1] === 'function') {
        this.callback = args[1];
      } else {
        throw new Error('Invalid Second Argument For PAQ, Expected A Function!');
      }
    }
  }

  setWeightByPriority () {
    switch (this.options.priority) {
    case 'low':
      return 1;
    case 'normal':
      return 0;
    case 'mid':
      return -1;
    case 'high':
      return -2;
    case 'urgent':
      return -3;
    default:
      throw new Error('Please Choose A Correct Priority!');
    }
  }

  validateArgs (options) {
    if (typeof options.start !== 'function') {
      throw new Error('Start callback must be a valid function!');
    }
    if (typeof options.completed !== 'function') {
      throw new Error('Completed callback must be a valid function!');
    }
    if (typeof options.failed !== 'function') {
      throw new Error('Failed callback must be a valid function!');
    }
    if (typeof options.remove !== 'function') {
      throw new Error('Remove callback must be a valid function!');
    }
  }
}

module.exports = Task;
