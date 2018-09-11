import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Model from 'core/model/model';

const defaults = {
  cards: [],
  display: false
};

export default class LocalModalModel extends Model {
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
