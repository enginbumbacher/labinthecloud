import DomView from 'core/view/dom_view';
import Template from './lightdisplay.html';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';

import './lightdisplay.scss';

export default class LightDisplayView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);
    this.$el.find(".light-display__content").css({
      width: model.get('width'),
      height: model.get('height')
    })

  }

  addText(newText) {
    this.$el.find(".light-display__content").text(newText)
  }

  render(lights) {
    for (let key in lights) {
      this.$el.find('.light-display__' + key).css({ opacity: Math.ceil(lights[key] / 100) * (0.7 * lights[key] / 100 + 0.3) });
    }
  }
}
