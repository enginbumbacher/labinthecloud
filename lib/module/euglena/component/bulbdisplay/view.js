import DomView from 'core/view/dom_view';
import Template from './bulbdisplay.html';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';

import './bulbdisplay.scss';

export default class BulbDisplayView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);

    this.$el.find(".bulb-display__content").css({
      width: model.get('width'),
      height: model.get('height')
    })

  }

  render(lights) {
    for (let key in lights) {
      this.$el.find('.bulb-display__' + key).css({ opacity: lights[key] / 100 });
    }
  }
}
