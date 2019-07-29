const PriorityAsyncQueue = require('../lib');

const priorityAsyncQueue = new PriorityAsyncQueue();

priorityAsyncQueue.addTask({
  callback: function () {
    console.log('start!');
  }
});

for (let i = 1; i <= 2; i++) {
  priorityAsyncQueue.addTask({
    callback: function (data) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('已经过去了', i, '秒');
          resolve(data);
        }, i * 1000);
      });
    }
  });
}

priorityAsyncQueue.addTask({
  callback: function () {
    console.log('mid!');
  }
});

for (let i = 1; i <= 2; i++) {
  priorityAsyncQueue.addTask({
    callback: function (data) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('已经过去了', i, '秒');
          resolve(data);
        }, i * 1000);
      });
    }
  });
}

priorityAsyncQueue.addTask({
  callback: function () {
    console.log('end!');
  }
});
