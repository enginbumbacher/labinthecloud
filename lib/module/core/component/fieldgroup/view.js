import DomView from 'core/view/dom_view';
import Template from './fieldgroup.html';

export default class FieldGroupView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);
    this._onModelChange = this._onModelChange.bind(this);

    model.addEventListener('Model.Change', this._onModelChange);
    this._fieldViews = [];
    this.renderModel(model);
  }

  _onModelChange(evt) {
    this.renderModel(evt.currentTarget);
  }

  renderModel(model) {
    while (this._fieldViews.length) {
      this.removeChild(this._fieldViews.pop());
    }
    
    for (let field of model.get('fields')) {
      this._fieldViews.push(field.view());
      this.addChild(field.view(), '.fieldgroup__fields');
    }
  }

  focus() {
    if (this._fieldViews.length) {
      this._fieldViews[0].focus()
    }
  }
};
