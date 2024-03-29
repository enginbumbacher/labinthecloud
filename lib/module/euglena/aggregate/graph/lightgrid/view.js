import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import DomView from 'core/view/dom_view';
import Template from './lightgrid.html';
import $ from 'jquery';

import './style.scss';

export default class LightGridView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);
    Utils.bindMethods(this, ['_onModelChange'])
    this._spans = [];

    model.addEventListener('Model.Change', this._onModelChange);
  }

  _onModelChange(evt) {
    if (evt.data.path == 'lights') {
      this.render(evt.currentTarget);
    }
  }

  render(model) {
    const lights = model.get('lights')
    while (this._spans.length) {
      this.removeChild(this._spans.pop());
    }

    for (let key in lights) {
      let timecount = 0;
      lights[key].forEach((spanConf) => {
        if (spanConf.intensity > 0) {
          let span = new DomView(`<span class="lightgrid__span">${spanConf.intensity}</span>`)
          span.$dom().css({
            width: `${100 * spanConf.duration / model.get('duration')}%`,
            left: `${100 * timecount / model.get('duration')}%`
          })
          this._spans.push(span);
          this.addChild(span, `.lightgrid__row__${key} .lightgrid__row__intensities`)
        }
        timecount += spanConf.duration;
      })
    }
  }
}
