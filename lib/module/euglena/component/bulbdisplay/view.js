define((require) => {
  const DomView = require('core/view/dom_view'),
    Template = require('text!./bulbdisplay.html'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals')
  ;

  require('link!./bulbdisplay.css');

  return class BulbDisplayView extends DomView {
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
})
