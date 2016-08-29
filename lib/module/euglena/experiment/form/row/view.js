define((require) => {
  const FieldGroupView = require('core/component/fieldgroup/view'),
    Utils = require('core/util/utils'),
    Template = require('text!./experimentrow.html')
  ;
  require('link!./experimentrow.css');

  return class ExperimentRowView extends FieldGroupView {
    constructor(model, tmpl) {
      super(model, tmpl || Template);
    }
  }
})