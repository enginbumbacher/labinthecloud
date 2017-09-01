define((require) => {
  const DomView = require('core/view/dom_view'),
    Template = require('text!./visualresult.html'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    Button = require('core/component/button/field'),
    SliderField = require('core/component/sliderfield/field');


  require('link!./visualresult.css');

  return class VisualResultView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, ['_onSliderChange','_onStopDrag']);

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
      this.resetButton = Button.create({
        id: 'reset',
        label: 'Reset',
        eventName: 'VisualResult.ResetRequest',
        style: 'visual-result__control__reset'
      })
      this.addChild(this.playPauseButton.view(), ".visual-result__control")
      this.addChild(this.resetButton.view(), '.visual-result__control')

      this.videoSlider = SliderField.create({
        label: '',
        min: 0,
        max: Globals.get('AppConfig.experiment.maxDuration'),
        steps: 0.5,
        defaultValue: 0
      })
      this.addChild(this.videoSlider.view(), '.visual-result__control')
      this.videoSlider.addEventListener('Field.Change', this._onSliderChange);
      this.videoSlider.addEventListener('Field.StopDrag', this._onStopDrag);
    }

    tick(time) {
      this.$el.find('.visual-result__time').text(Utils.secondsToTimeString(time))
      this.videoSlider.setValue(time.toFixed(1))
    }

    handlePlayState(playing) {
      this.playPauseButton.setLabel(playing ? "Pause" : "Play");
    }

    _onSliderChange(evt) {
      this.dispatchEvent('VisualResult.SliderRequest', {
        sliderValue: evt.currentTarget.value()
      })
    }

    _onStopDrag(evt) {
      this.dispatchEvent('VisualResult.StopDrag',{})
    }
  }
})
