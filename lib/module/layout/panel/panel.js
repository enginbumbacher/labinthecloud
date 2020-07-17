import Component from 'core/component/component';
import Model from './model';
import View from './view';
import HM from 'core/event/hook_manager';

class LayoutPanel extends Component {
  constructor(settings) {
    settings.modelClass = settings.modelClass || Model;
    settings.viewClass = settings.viewClass || View;
    super(settings);
  }

  id() {
    return this._model.get('id');
  }

  build() {
    let contents = [];
    HM.invoke('Panel.Contents', contents, {
      id: this._model.get('id')
    });
    contents.forEach((content, ind) => {
      this._model.addContent(content);
    })
  }

  addContent(content, index = null) {
    this._model.addContent(content, index);
  }

  removeContent(content) {
    this._model.removeContent(content);
  }
}

LayoutPanel.create = (config) => {
  return new LayoutPanel({ modelData: config });
}
export default LayoutPanel;
