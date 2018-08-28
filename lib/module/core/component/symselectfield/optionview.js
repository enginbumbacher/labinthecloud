import DomView from 'core/view/dom_view';
import Template from './option.html';

export default class OptionView extends DomView {
  constructor(config) {
    super(Template);
    this.$el.attr('value', config.id);
    this.$el.attr('numericValue',config.numericValue);
    this.$el.html(config.label);
    this.select(config.selected);
  }

  id() {
    return this.$el.attr('value');
  }

  numericValue() {
    return this.$el.attr('numericValue');
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
