import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Utils from 'core/util/utils';
import DomView from 'core/view/dom_view';
import Button from 'core/component/button/field';
import Timer from 'core/util/timer';

const Template = '<div class="notification__note"></div>';

export default class NoteView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);
    Utils.bindMethods(this, ['_onModelChange', '_onAutoExpire'])

    this.$el.addClass(model.get('classes').join(' '));
    this.$el.attr('id', `note__${model.get('id')}`)

    if (model.get('autoExpire') !== null) {
      this._timer = new Timer({ duration: model.get('autoExpire') });
      this._timer.addEventListener('Timer.End', this._onAutoExpire);
    }
    if (model.get('expireLabel')) {
      this._button = Button.create({
        style: 'link',
        label: model.get('expireLabel'),
        eventName: 'Note.ExpirationRequest'
      });
      this.addChild(this._button.view());
    }

    this.addChild(new DomView(`<div class="note__message">${model.get('message')}</div>`));

    model.addEventListener('Model.Change', this._onModelChange);
  }

  _onModelChange(evt) {
    switch (evt.data.path) {
      case "alive":
        if (evt.data.value) {
          this.live();
        } else {
          this.expire();
        }
      break;
    }
  }

  _onAutoExpire(evt) {
    this.dispatchEvent('Note.ExpirationRequest', {});
  }

  live() {
    this.$el.addClass('note__alive');
    setTimeout(() => {
      if (this._timer) this._timer.start();
    }, 500)
  }

  expire() {
    this.$el.removeClass('note__alive');
    setTimeout(() => {
      this.dispatchEvent('Note.Expired');
    }, 500);
  }
}
