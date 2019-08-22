# priority-async-queue

A prioritized asynchronous (or synchronous) queue for node.js.

## Install

```
$ npm install priority-async-queue --save
```

**Or**

```
$ yarn add priority-async-queue
```

## API

For convenience, `priority-async-queue` referred to as `paq`.

**1. addTask**

Create a task and join in the `paq` queue.

```javascript
paq.addTask([options, ]callback);
```

`options` is an optional object that contains the following attributes：

```javascript
{
  id: undefined,          // task id
  priority: 'normal',     // task priority, such as: low, normal, mid, high, urgent
  context: null,          // task executing context
  start: (ctx, options) => {}, // task execution will start callback
  completed: (ctx, res) => {}, // task execution completed callback
  failed: (ctx, err) => {},    // task execution failed callback
  remove: (ctx, options) => {} // task execution will remove callback
}
```

`callback` is a function that describes the logic to execute the task, and it contains two parameters: `ctx` and `options`:

- `ctx` is the paq instance to which the task belongs.
- `options` is the final value of the *options* parameter for this task.

```javascript
paq.addTask((ctx, options) => {
  console.log(ctx === paq); // true
});
```

**2. removeTask**

Remove a task by taskId.

```javascript
paq.removeTask(taskId)
```

`taskId` is the id of the task. If remove task successfully, it will return `true`. Otherwise, it will return `false`.

**3. pause**

Pause queue execution task.

```javascript
paq.pause();
```

**Note:** However, you cannot suspend the currently executing task because the progress of the asynchronous task cannot be detected temporarily.

**4. isPause**

Returns whether the current queue is in a paused state.

```javascript
paq.isPause; // return true or false.
```

**5. resume**

Restart the asynchronous queue execution task.

```javascript
paq.resume();
```

**6. clearTask**

Clear all tasks in the queue.

```javascript
paq.clearTask();
```

## Usage

### Basic Usage

As long as you add a task to `paq`, this task will be executed automatically.

```javascript
const PAQ = require('priority-async-queue');
const paq = new PAQ();

paq.addTask((ctx, options) => {
  console.log('This is a simple task!');
});

// This is a simple task!
```

### Sync Task

You can execute a series of synchronization tasks with `paq`. For Example:

```javascript
const syncTask = (n) => {
  for (let i = 0; i < n; i++) {
    paq.addTask(() => {
      console.log('Step', i, 'sync');
      return i;
    });
  }
};

syncTask(3);

// Step 0 sync
// Step 1 sync
// Step 2 sync
```

### Async Task

You can also execute a series of asynchronization tasks with `paq`. For Example:

```javascript
const asyncTask = (n) => {
  for (let i = 0; i < n; i++) {
    paq.addTask(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('Step', i, 'async');
          resolve(i);
        }, i * 1000);
      });
    });
  }
};

asyncTask(3);

// Step 0 async
// Step 1 async
// Step 2 async
```

### Mix Task

You can also execute a series of synchronous and asynchronous interleaved tasks with `paq`. for example:

```javascript
const mixTask = (n) => {
  asyncTask(n);
  syncTask(n);
  asyncTask(n);
};

mixTask(2);

// Step 0 async
// Step 1 async
// Step 0 sync
// Step 1 sync
// Step 0 async
// Step 1 async
```

### Bind Contenxt Task

If sometimes you need to specify a context to execute the task. For example:

```javascript
const contextTask = (n) => {
  var testObj = {
    name: 'foo',
    sayName: (name) => {
      console.log(name);
    }
  };
  for (let i = 0; i < n; i++) {
    paq.addTask({ context: testObj }, function () {
      this.sayName(this.name + i);
    });
  }
};

contextTask(3);

// foo0
// foo1
// foo2
```

**Note:** this does not exist in the arrow function.

### Delay Task

`paq` also support delay task. For example:

```javascript
const delayTask = (n) => {
  for (let i = 0; i < n; i++) {
    paq.addTask({ delay: 1000 * i }, () => {
      console.log('Step', i, 'sync');
      return i;
    });
  }
};

delayTask(3);

// Step 0 sync
// Step 1 sync
// Step 2 sync
```

### Priority Task

If the task being executed has priority. For example:

```javascript
const priorityTask = (n) => {
  for (let i = 0; i < n; i++) {
    paq.addTask({ priority: i === n - 1 ? 'high' : 'normal' }, () => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('Step', i, 'async');
          resolve(i);
        }, i * 1000);
      });
    });
  }
};

priorityTask(5);

// Step 0 async
// Step 4 async
// Step 1 async
// Step 2 async
// Step 3 async
```

The default priority map is as follows:

```javascript
{
  "low": 1,
  "normal": 0, // default
  "mid": -1,
  "high": -2,
  "urgent": -3
}
```

### Handle Callback Task

Sometimes, you want to be able to control the completion or failure of the task. For Example

```javascript
const callbackTask = (n) => {
  for (let i = 0; i < n; i++) {
    paq.addTask({
      id: i,
      start: (ctx, options) => {
        console.log('start running task id is', options.id);
      },
      completed: (ctx, res) => {
        console.log('complete, result is', res);
      },
      failed: (ctx, err) => {
        console.log(err);
      }
    }, () => {
      if (i < n / 2) {
        throw new Error(i + ' is too small!');
      }
      return i;
    });
  }
};

callbackTask(5);

// start running task id is 0
// Error: 0 is too small!
// start running task id is 1
// Error: 1 is too small!
// start running task id is 2
// Error: 2 is too small!
// start running task id is 3
// complete, result is 3
// start running task id is 4
// complete, result is 4
```

### Remove Task

If you need to delete some tasks in time, you can:

```javascript
const removeTask = (n) => {
  for (let i = 0; i < n; i++) {
    paq.addTask({
      id: i,
      remove: (ctx, options) => {
        console.log('remove task id is', options.id);
      }
    }, () => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('Step', i, 'async');
          resolve(i);
        }, i * 1000);
      });
    });
  }
  console.log(paq.removeTask(3));
  console.log(paq.removeTask(5));
};

removeTask(5);

// remove task id is 3
// true
// false
// Step 0 async
// Step 1 async
// Step 2 async
// Step 4 async
```

**Note:** You must assign an id when creating a task, and delete the task based on the id.

## Queue Event

If you need to monitor the state of the queue, `paq` provides the following event listeners.

**1. addTask**

```javascript
paq.on('addTask', (options) => {
  // Triggered when the queue adds a task.
});
```

**2. startTask**

```javascript
paq.on('startTask', (options) => {
  // Triggered when a task in the queue is about to execute.
});
```

**3. changeTask**

```javascript
paq.on('changeTask', (options) => {
  // Triggered when a task in the queue changes.
});
```

**4. removeTask**

```javascript
paq.on('removeTask', (options) => {
  // Triggered when the queue remove a task.
});
```

**5. completed**

```javascript
paq.on('completed', (options, result) => {
  // Triggered when the task execution in the queue is complete.
});
```

**6. failed**

```javascript
paq.on('failed', (options, err) => {
  // Triggered when a task in the queue fails to execute.
});
```

## License

MIT