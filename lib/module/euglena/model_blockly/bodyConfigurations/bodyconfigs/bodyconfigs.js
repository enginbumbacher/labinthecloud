define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils')
  ;

  class BodyConfigurations extends Component {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);
      Utils.bindMethods(this, ['_importAllImages','setBodyOpacity', 'setActiveConfiguration', 'hide', 'show'])

      this.activeConfig = null;
      this.opacity = null;

      this._model.setConfigs() ;

      // MOVE THE FOLLOWING PARTS TO VIEW()

      this.imgPath = 'cslib/module/euglena/model_blockly/bodyConfigurations/imgs/';
      this._importAllImages();

      this.setActiveConfiguration(settings.modelData.bodyConfigurationName)
      this.setBodyOpacity(settings.modelData.opacity)

    }

    setActiveConfiguration(configName) {
      if (this.activeConfig) {
        this.hide(this._model.getConfigId(this.activeConfig));
      }
      this.activeConfig = configName;
      this.show(this._model.getConfigId(this.activeConfig));
    }

    getActiveConfiguration() {
        if (this.activeConfig) {
          return this._model.getConfigJSON(this.activeConfig)
        } else {
          return null
        }
    }

    setBodyOpacity(opacity) {
      this.opacit = opacity;
      this.view()._setBodyOpacity(opacity)
    }

    hide(configId) {
      this.view()._hideBodyConfig(configId);
    }

    show(configId) {
      this.view()._showBodyConfig(configId);
    }

    _importAllImages() {
      Object.keys(this._model.defaultConfigs).map(configuration => {

        this.view()._addLayer(this._model.defaultConfigs[configuration], this.imgPath);
      })
    }

    id() {
      return this._model.get('id')
    }

    select() {
      this._model.set('selected', true);
    }

    deselect() {
      this._model.set('selected', false);
    }

    export() {
      return this._model.get('id');
    }
  };

  BodyConfigurations.create = (data) => {
    return new BodyConfigurations({ modelData: data });
  }

  return BodyConfigurations;
});
