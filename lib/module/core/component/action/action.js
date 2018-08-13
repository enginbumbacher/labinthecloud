export default class Action {
  execute() {
    return Promise.resolve(true);
  }

  undo() {
    return Promise.resolve(true);
  }
}