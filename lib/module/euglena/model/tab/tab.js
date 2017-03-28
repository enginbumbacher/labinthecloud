define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');
  
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),

    Form = require('core/component/form/form'),
    SliderField = require('core/component/sliderfield/field'),
    ModelHistoryForm = require('../history/form'),
    SymSliderField = require('core/component/symsliderfield/field');

  class ModelTab extends Component {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);

      this._history = new ModelHistoryForm({
        id: `model_history__${this._model.get("id")}`
      });
      this._form = Form.create({
        fields: [SliderField.create({
          id: "test",
          label: "Testing"
        }), SymSliderField.create({
          id: "symtest",
          label: "Symmetry",
          steps: 1000
        })]
      })
      this.view().addChild(this._history.view());
      this.view().addChild(this._form.view());
    }
  }

  ModelTab.create = (data) => {
    return new ModelTab({ modelData: data });
  }

  return ModelTab;

})