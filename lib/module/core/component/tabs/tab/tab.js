import Component from 'core/component/component';
import Model from './model';
import PageView from './view';
import TabView from './tab_view';

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

  disable() {
    this._model.set('disabled', true);
    super.disable();
  }

  enable() {
    this._model.set('disabled', false);
    super.enable();
  }
}

Tab.create = (data = {}) => {
  return new Tab({ modelData: data});
}

export default Tab;
