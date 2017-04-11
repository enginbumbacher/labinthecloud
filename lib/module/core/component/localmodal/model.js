define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');
  
  const Model = require('core/model/model'),
    defaults = {
      cards: [],
      display: false
    };

  return class LocalModalModel extends Model {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
    }
    push(content) {
      const cards = this.get('cards')
      cards.push(content)
      this.set('cards', cards)
      this.dispatchEvent('LocalModal.CardAdded', {
        card: content
      });
    }

    pop() {
      const cards = this.get('cards')
      const popped = cards.pop();
      this.set('cards', cards)
      this.dispatchEvent('LocalModal.CardRemoved', {
        card: popped
      });
    }

    clear() {
      this.set('cards', [])
      this.dispatchEvent('LocalModal.CardsCleared', {})
    }
  }
})