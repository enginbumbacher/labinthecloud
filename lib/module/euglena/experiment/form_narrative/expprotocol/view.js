import SelectFieldView from 'core/component/selectfield/view';
import Template from './expprotocol.html';
import Utils from 'core/util/utils';
import './expprotocol.scss';

export default class ExpProtocolFieldView extends SelectFieldView {
  constructor(model, tmpl) {
    model._data.label = ''
    super(model, tmpl || Template);
    Utils.bindMethods(this, ['_showDescription','_setVisibility','_isVisible']);
  }

  _showDescription(description) {
    this.$el.find('.exp-protocol__description').text(description);
  }

  _setVisibility(state,visibility) {
    //this.$el.find('.exp-protocol__description').css('opacity',state ? 1.0 : visibility);
    this.$el.css('opacity',state ? 1.0 : visibility);
  }

  _isVisible() {
    return this.$el.css('opacity') == 1.0;
  }
}
