import DomView from 'core/view/dom_view';
import Template from './form.html';

export default class FormView extends DomView {
  constructor(model, tmpl = null) {
    super(tmpl || Template);

    this._onFieldAdded = this._onFieldAdded.bind(this);
    this._onFieldRemoved = this._onFieldRemoved.bind(this);
    this._onChange = this._onChange.bind(this);

    // this.$el.attr('id', model.get('id'));
    // model.get('classes').forEach((cls) => this.$el.addClass(cls));
    this._fieldViews = [];
    this._buttonViews = [];

    this.render(model);

    model.addEventListener('Form.FieldAdded', this._onFieldAdded);
    model.addEventListener('Form.FieldRemoved', this._onFieldRemoved);
    model.addEventListener('Model.Change', this._onChange);
  }

  _onChange(evt) {
    switch (evt.data.path) {
      case "buttons":
        this._renderButtons(evt.currentTarget);
        break;
      case "title":
        this._renderHeader(evt.currentTarget);
        break;
      case "errors":
        this._renderErrors(evt.currentTarget);
        break
    }
  }

  render(model) {
    if (model.get('classes')) {
      this.$el.addClass(model.get('classes').join(' '));
    }
    this._renderHeader(model);
    this._renderFields(model);
    this._renderButtons(model);
    this._renderErrors(model);
    this._renderHelp(model);
  }

  _onFieldAdded(evt) {
    this._renderFields(evt.currentTarget);
  }
  _onFieldRemoved(evt) {
    this._renderFields(evt.currentTarget);
  }

  _renderHeader(model) {
    if (model.get('title')) {
      if (this._title) this.removeChild(this._title);
      this._title = new DomView(model.get('title'))
      this.addChild(this._title, ".form__header")
      this.$el.find('.form__header').show();
    } else {
      this.$el.find('.form__header').hide();
    }
  }

  _renderFields(model) {
    while (this._fieldViews.length) this.removeChild(this._fieldViews.pop());

    for (let regionId in model.get('regions')) {
      let destination = this._mapRegion(regionId);
      for (let field of model.get('regions')[regionId]) {
        this._fieldViews.push(field.view());
        this.addChild(field.view(), destination);
      }
    }
  }

  _renderErrors(model) {
    let errStr = model.get('errors').map((err) => `<p class="form__error">${err}</p>`).join('');
    this.$el.find(".form__errors").html(errStr);
  }

  _mapRegion(regionId) {
    return ".form__fields";
  }

  _renderButtons(model) {
    while (this._buttonViews.length) this.removeChild(this._buttonViews.pop());

    for (let btn of model.get('buttons')) {
      this._buttonViews.push(btn.view());
      this.addChild(btn.view(), '.form__buttons');
    }
  }

  _renderHelp(model) {
    this.$el.find('.form__help').html(model.get('help'));
  }
};
