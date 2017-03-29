define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    PageView = require('./view'),
    TabView = require('./tab_view');

  class Tab extends Component {
    constructor(settings) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || PageView;
      super(settings);

      this._tab = new TabView(this._model);
    }

    title() {
      return this._model.get('title');
    }

    id() {
      return this._model.get('id');
    }

    tab() {
      return this._tab;
    }

    select(isSelected) {
      this._model.set('selected', isSelected);
    }
  }

  Tab.create = (data = {}) => {
    return new Tab({ modelData: data});
  }
  
  return Tab;
})