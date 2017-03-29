define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),

    HM = require('core/event/hook_manager');

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

    addContent(content) {
      this._model.addContent(content);
    }

    removeContent(content) {
      this._model.removeContent(content);
    }
  }

  LayoutPanel.create = (config) => {
    return new LayoutPanel({ modelData: config });
  }
  return LayoutPanel;
})