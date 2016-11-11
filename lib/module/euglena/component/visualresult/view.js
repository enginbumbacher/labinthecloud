define((require) => {
  const DomView = require('core/view/dom_view'),
    Template = require('text!./visualresult.html'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    Button = require('core/component/button/field');

  require('link!./visualresult.css');

  return class VisualResultView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);

      this.$el.find('.visual-result__content').css({
        width: model.get('width'),
        height: model.get('height')
      })
      this.playPauseButton = Button.create({
        id: "playPause",
        label: "Pause",
        eventName: "VisualResult.PlayPauseRequest",
        style: "visual-result__control__toggle"
      });
      this.addChild(this.playPauseButton.view(), ".visual-result__control")
    }

    tick(time) {
      this.$el.find('.visual-result__time').text(Utils.secondsToTimeString(time))
    }

    handlePlayState(playing) {
      this.playPauseButton.setLabel(playing ? "Pause" : "Play");
    }
  }
})