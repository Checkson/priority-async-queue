class PriorityQueue {
  constructor () {
    this.taskList = [];
  }

  enqueue (task) {
    const curWeight = task.options.weight || 0;
    let insertIndex = this.length();
    for (let i = insertIndex; i > 0; i--) {
      const tmpWeight = this.getTaskByIndex(i - 1).weight || 0;
      if (curWeight < tmpWeight) {
        insertIndex = i - 1;
        continue;
      }
      break;
    }
    this.addTaskByIndex(insertIndex, task);
  }

  dequeue () {
    return this.taskList.shift();
  }

  addTaskByIndex (index, task) {
    this.taskList.splice(index, 0, task);
  }

  getTaskByIndex (index) {
    return this.taskList[index];
  }

  removeTaskByIndex (index) {
    const removeArr = this.taskList.splice(index, 1);
    return removeArr.length > 0;
  }

  clear () {
    delete this.taskList;
    this.taskList = [];
  }

  length () {
    return this.taskList.length;
  }
}

module.exports = PriorityQueue;
