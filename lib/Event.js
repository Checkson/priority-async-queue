class Event {
  constructor () {
    this.eventHandlerMap = {};
  }

  on (eventName, eventHandler) {
    if (typeof(eventHandler) !== 'function') {
      throw new Error('eventHandler must be a function!');
    }
    if (!this.eventHandlerMap[eventName]) {
      this.eventHandlerMap[eventName] = [];
    }
    const found = this.eventHandlerMap[eventName].find(handler => handler === eventHandler);
    if (found) {
      return;
    }
    this.eventHandlerMap[eventName].push(eventHandler);
  }

  emit (eventName, ...params) {
    if (this.eventHandlerMap[eventName]) {
      for (const eventHandler of this.eventHandlerMap[eventName]) {
        eventHandler.call(this, ...params);
      }
    }
  }

  off (eventName, eventHandler) {
    if (this.eventHandlerMap[eventName]) {
      const index = this.eventHandlerMap[eventName].findIndex(handler => handler === eventHandler);
      if (index >= 0) {
        this.eventHandlerMap[eventName].splice(index, 1);
      }
    }
  }
}

module.exports = Event;
