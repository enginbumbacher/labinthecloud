define((require) => {
  const MultiFieldView = require('core/component/multifield/view'),
    Template = require('text!./lightmatrix.html')
  ;

  require('link!./lightmatrix.css');

  return class LightMatrixFieldView extends MultiFieldView {
    constructor(model, tmpl) {
      super(model, tmpl || Template);
    }

    updateTotals(total, remaining) {
      this.$el.find('.light-matrix__footer__total .light-matrix__footer__value').text(total);
      this.$el.find('.light-matrix__footer__remaining .light-matrix__footer__value').text(remaining);
    }
  }  
})