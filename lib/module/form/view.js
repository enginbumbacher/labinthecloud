define((require) => {
  const DomView = require('core/view/dom_view'),
    Template = require('text!./form.html');

  return class FormView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);

      this.$el.attr('id', model.get('id'));
      model.get('classes').forEach((cls) => this.$el.addClass(cls));
      this.fieldViews = [];
      this.buttonViews = [];

      this.render(model);
    }

    render(model) {
      while (this.fieldViews.length) this.removeChild(this.fieldViews.pop());
      while (this.buttonViews.length) this.removeChild(this.buttonViews.pop());

      for (let field of model.get('fields')) {
        this.fieldViews.push(field.view());
        this.addChild(field.view(), '.fields');
      }
      for (let button of model.get('buttons')) {
        this.buttonViews.push(button.view());
        this.addChild(button.view(), '.buttons');
      }
    }
  };
});