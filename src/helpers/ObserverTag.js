export default class ObserverTag {
  constructor(eventType) {
    this.eventType = eventType;
    this.handlers = [];
    this.init(this.eventType);
  }
  init() {
    window.addEventListener(this.eventType, () => {
      this.handlers.forEach((handler) => {
        handler[1]();
      });
    });
  }
  observe(id, callback) {
    this.handlers.push([id, callback]);
  }
  unObserve(id) {
    this.handlers.filter((handler) => handler[0] !== id);
  }
}
