import SelectField from 'core/component/selectfield/field';
import View from './view';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';

class ExpProtocolField extends SelectField {
  constructor(config) {
    config.viewClass = config.viewClass || View;
    super(config);
    Utils.bindMethods(this, ['_onModelChange','showDescription', 'setVisibility','isVisible']);
  }

  _onModelChange(evt) {
    super._onModelChange(evt);
  }

  showDescription(key) {
    if (key) {
      if (Object.keys(this._model._data.description).indexOf(key)>-1) {
        this.view()._showDescription(this._model._data.description[key]);
      } else if (Object.keys(this._model._data.description).some((elem) => {return key.match(elem)})) {
        let tmpkeys = Object.keys(this._model._data.description).map((elem) => {return key.match(elem)})
        let tmpkey = tmpkeys.findIndex(x => x != null)
        tmpkey = Object.keys(this._model._data.description)[tmpkey]
        this.view()._showDescription(this._model._data.description[tmpkey]);
      } else {
        this.view()._showDescription('default_choice')
      }
    } else {
      this.view()._showDescription(this._model._data.description);
    }
  }

  setVisibility(state,visibility=0.2) {
    if (state == 'hidden') {
      this.view()._setVisibility(false,visibility);
    } else if (state == 'visible') {
      this.view()._setVisibility(true,visibility);
    }
  }

  isVisible() {
    return this.view()._isVisible();
  }
}

ExpProtocolField.create = (data) => {
  return new ExpProtocolField({
    modelData: data
  });
}

export default ExpProtocolField;
