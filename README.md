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

For the sake of fluency, `priority-async-queue` referred to as `paq`.

**1. addTask**

Create a task and join the `paq` queue.

```javascript
paq.addTask([options, ]callback);
```

`options` is an optional object that contains the following attributes：

```javascript
{
  id: undefined,          // task id
  priority: 'normal',     // task priority, such as: low, normal, mid, high, urgent
  context: null,          // task executing context
  completed: (res) => {}, // task execution completed callback
  failed: (err) => {}     // task execution failed callback
}
```

`callback` is a function that describes the logic to execute the task.

**2. removeTask**

Remove a task by taskId

```javascript
paq.removeTask(taskId)
```

`taskId` is the id of the task.

## Usage

### Basic Usage

As long as you add a task to `paq`, this task will be executed automatically.

```javascript
const PAQ = require('priority-async-queue');
const paq = new PAQ();

paq.addTask(() => {
  console.log('This is a task!');
});

// This is a task!
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
      completed: (res) => {
        console.log('complete, result is', res);
      },
      failed: (err) => {
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

// Error: 0 is too small!
// Error: 1 is too small!
// Error: 2 is too small!
// complete, result is 3
// complete, result is 4
```

### Remove Task

If you need to delete some tasks in time, you can:

```javascript
const removeTask = (n) => {
  for (let i = 0; i < n; i++) {
    paq.addTask({ id: i }, () => {
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

// true
// false
// Step 0 async
// Step 1 async
// Step 2 async
// Step 4 async
```

**Note:** You must assign an id when creating a task, and delete the task based on the id.

## License

MIT