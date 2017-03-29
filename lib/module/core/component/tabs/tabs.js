define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils'),

    Tab = require('./tab/tab');

  class Tabs extends Component {
    constructor(settings) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);

      Utils.bindMethods(this, ['_onTabSelected'])

      this.view().addEventListener('Tab.Selected', this._onTabSelected)
    }

    addTab(tab) {
      this._model.addTab(tab);
    }

    buildTab(config) {
      this.addTab(Tab.create(config));
    }

    removeTab(id) {
      this._model.removeTab(id)
    }

    _onTabSelected(evt) {
      if (this._active) this._model.selectTab(evt.data.id);
    }
  };

  Tabs.create = (config = {}) => {
    return new Tabs({ modelData: config })
  }

  return Tabs;
})