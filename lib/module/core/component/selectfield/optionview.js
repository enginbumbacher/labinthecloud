define((require) => {
  const DomView = require('core/view/dom_view'),
    Template = require('text!./option.html');

  return class OptionView extends DomView {
    constructor(config) {
      super(Template);
      this.$el.attr('value', config.id);
      this.$el.html(config.label);
      this.select(config.selected);
    }

    id() {
      return this.$el.attr('value');
    }

    select(selected) {
      this.$el.prop('selected', selected);
    }

    disable() {
      this.$el.prop('disabled', true);
    }
    enable() {
      this.$el.prop('disabled', false);
    }
  }
})