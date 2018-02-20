define((require) => {
  const DomView = require('core/view/dom_view'),
    Template = require('text!./lightdisplay.html'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals')
  ;

  require('link!./lightdisplay.css');

  return class LightDisplayView extends DomView {
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
        this.$el.find('.light-display__' + key).css({ opacity: lights[key] / 100 });
      }
    }
  }
})
