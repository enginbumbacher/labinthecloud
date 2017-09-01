define((require) => {
  const DomView = require('core/view/dom_view'),
    Utils = require('core/util/utils'),

    Template = require('text!./tab_tab.html');

  return class TabTabView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, ['_onChange', '_onTabClick'])

      this._id = model.get('id');

      this._render(model);
      model.addEventListener('Model.Change', this._onChange);
      this.$el.find('.tab__label').click(this._onTabClick);
    }

    _onTabClick(jqevt) {
      this.dispatchEvent('Tab.Selected', { id: this._id }, true);
      return false;
    }

    _render(model) {
      this.$el.find('.tab__label').html(model.get('title'));
      this.$el.toggleClass('tab__selected', model.get('selected'));
      this.$el.toggleClass('tab__disabled', model.get('disabled'));
    }

    _onChange(evt) {
      this._render(evt.currentTarget);
    }
  }
})