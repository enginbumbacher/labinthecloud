define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');
  
  const Field = require('core/component/form/field/field'),
    Model = require('./model'),
    View = require('./view');

  class SliderField extends Field {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);
      Utils.bindMethods(this, ['_onChangeRequest'])

      this.view().addEventListener('SliderField.ChangeRequest', this._onChangeRequest)
    }

    _onChangeRequest(evt) {
      this._model.setUnitValue(evt.data.value, evt.data.index);
    }
  }

  SliderField.create = (data) => {
    return new SliderField({ modelData: data })
  }

  return SliderField;
})