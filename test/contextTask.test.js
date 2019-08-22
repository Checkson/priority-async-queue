const PAQ = require('../lib');
const paq = new PAQ();

test('Context task test', () => {
  const contextTask = (n) => {
    var testObj = {
      name: 'foo',
      sayName: (name) => {
        console.log(name);
      }
    };
    for (let i = 0; i < n; i++) {
      paq.addTask({ context: testObj }, function () {
        expect(this).toBe(testObj);
        this.sayName(this.name + i);
      });
    }
  };
  
  contextTask(5);
});
