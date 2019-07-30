const PAQ = require('../lib');
const paq = new PAQ();

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

contextTask(5);
