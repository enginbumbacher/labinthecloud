import BaseFieldView from 'core/component/form/field/view';
import OptionView from './optionview';
import Utils from 'core/util/utils';
import Template from './selectfield.html';

export default class SelectFieldView extends BaseFieldView {
  constructor(model, tmpl) {
    super(model, tmpl ? tmpl : Template);
    Utils.bindMethods(this, ['_onFieldChange', '_onModelChange']);

    this._options = {}
    if (model.get('color')) this.$el.find('.selectfield__label').css('color', model.get('color'));
    if (model.get('min_width')) this.$el.find('.selectfield__select').css('min-width',model.get('min_width'));
    //if (model.get('inverse_order')) { this.$el.find(".selectfield__label").remove().insertAfter(this.$el.find(".selectfield__select"));}

    this._render(model);

    this.$el.find(".selectfield__select").on('change', this._onFieldChange)
    this.$el.find(".selectfield__select").css({'font-size':'12px'})
  }

  _onModelChange(evt) {
    super._onModelChange(evt);
    if (evt.data.path == 'disabledOptions') {
      Object.values(this._options).forEach((opt) => {
        if (evt.data.value.includes(opt.id())) {
          opt.disable();
          opt.hide();
        } else {
          opt.show();
          opt.enable();
        }
      })
    } else {
      this._render(evt.currentTarget);
    }
  }

  _onFieldChange(jqevt) {
    this.dispatchEvent('Field.ValueChange', {
      value: this.$el.find(".selectfield__select").val()
    });
  }

  disable() {
    this.$el.find('.selectfield__select').prop('disabled', true)
  }

  enable() {
    this.$el.find('.selectfield__select').prop('disabled', false)
  }

  focus() {
    this.$el.find('.selectfield__select').focus();
  }

  _render(model) {
    this.$el.find('.selectfield__label').html(model.get('label'));
    for (let optId in this._options) {
      if (!Object.keys(model.get('options')).includes(optId)) {
        this.removeChild(this._options[optId]);
        delete this._options[optId];
      }
    }
    for (let id in model.get('options')) {
      let label = model.get('options')[id];
      if (!this._options[id]) {
        this._options[id] = new OptionView({
          id: id,
          label: label,
          selected: model.value() == id
        });
        this.addChild(this._options[id], ".selectfield__select");
      } else {
        this._options[id].select(model.value() == id);
      }

      if (id.match('default_choice')) {
        this.$el.find("option[value=" + id + ']').prop('disabled', true);
      }
    }
    if (model.get('disabled')) {
      this.disable();
    } else {
      this.enable();
    }
  }
};
