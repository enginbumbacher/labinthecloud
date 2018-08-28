import MultiFieldView from 'core/component/multifield/view';
import Template from './lightmatrix.html';
import './lightmatrix.scss';

export default class LightMatrixFieldView extends MultiFieldView {
  constructor(model, tmpl) {
    super(model, tmpl || Template);
  }

  updateTotals(total, remaining) {
    this.$el.find('.light-matrix__footer__total .light-matrix__footer__value').text(total);
    this.$el.find('.light-matrix__footer__remaining .light-matrix__footer__value').text(remaining);
  }
}  
