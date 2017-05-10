define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');
  
  const DomView = require('core/view/dom_view'),
    Template = require('text!./localmodal.html');

  return class LocalModalView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, ['_onModelChange', '_onCardAdded', '_onCardRemoved', '_onCardsCleared']);

      this._cards = [];
      model.addEventListener('Model.Change', this._onModelChange);
      model.addEventListener('LocalModal.CardAdded', this._onCardAdded)
      model.addEventListener('LocalModal.CardRemoved', this._onCardRemoved)
      model.addEventListener('LocalModal.CardsCleared', this._onCardsCleared)
    }

    _onModelChange(evt) {
      switch(evt.data.path) {
        case 'display':
          if (evt.data.value) {
            this.$el.fadeIn({
              complete: () => {
                this.dispatchEvent('LocalModal.ShowComplete');
              }
            })
          } else {
            this.$el.fadeOut({
              complete: () => {
                this.dispatchEvent('LocalModal.HideComplete');
              }
            })
          }
        break;
      }
    }

    _onCardAdded(evt) {
      const card = evt.data.card;
      const cardwrap = new DomView("<div class='localmodal__content'></div>");
      cardwrap.addChild(card);
      cardwrap.$dom().css({
        left: `${this._cards.length + 3}rem`,
        opacity: 0
      });
      this.addChild(cardwrap);
      cardwrap.$dom().animate({
        left: `${this._cards.length}rem`,
        opacity: 1
      }, {
        duration: 500,
        complete: () => {
          this.dispatchEvent("LocalModal.ShowComplete", {});
        }
      });
      this._cards.push(cardwrap);
    }
    _onCardRemoved(evt) {
      const card = this._cards.pop();
      card.$dom().animate({
        left: `${this._cards.length + 2}rem`,
        opacity: 0
      }, {
        duration: 500,
        complete: () => {
          this.removeChild(card);
        }
      });
    }

    _onCardsCleared(evt) {
      while (this._cards.length) {
        this.removeChild(this._cards.pop())
      }
    }
  }
})