# priority-async-queue

A prioritized asynchronous (or synchronous) queue for node.js.

If you need it apply in browser, you can use the [babel](https://babeljs.io/) tool to compile it into ES5.

## Install

```
$ npm install priority-async-queue --save
```

**Or**

```
$ yarn add priority-async-queue --save
```

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

You can execute a series of synchronization tasks with `paq`, For Example:

```javascript
const syncTask = (n) => {
  for (let i = 0; i < n; i++) {
    paq.addTask(() => {
      console.log('Step', i, 'sync');
      return i;
    });
  }
};

syncTask(5);

// Step 0 sync
// Step 1 sync
// Step 2 sync
// Step 3 sync
// Step 4 sync
```

### Async Task

You can also execute a series of asynchronization tasks with `paq`, For Example:

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

asyncTask(5);

// Step 0 async
// Step 1 async
// Step 2 async
// Step 3 async
// Step 4 async
```

### Mix Task

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