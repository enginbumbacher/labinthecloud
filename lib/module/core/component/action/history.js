define((require) => {
  const EventDispatcher = require('core/event/dispatcher');

  return class ActionHistory extends EventDispatcher {
    constructor() {
      super();
      this._history = [];
    }

    execute(action) {
      action.execute()
        .then(() => {
          this._history.push(action);
          this.dispatchEvent('ActionHistory.ActionAdded', { action: action });
        });
    }

    undo() {
      const action = this._history.pop();
      action.undo()
        .then(() => {
          this.dispatchEvent('ActionHistory.ActionUndone', { action: action });
        });
    }
  };
});