import DomView from 'core/view/dom_view';
import Template from './visualresult.html';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import Button from 'core/component/button/field';
import SliderField from 'core/component/sliderfield/field';
import './visualresult.scss';

export default class VisualResultView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);
    Utils.bindMethods(this, ['_onSliderChange','_onStopDrag','disableVideoControls','enableVideoControls']);

    this.$el.find('.visual-result__content').css({
      width: model.get('width'),
      height: model.get('height')
    })

    this.playPauseButton = Button.create({
      id: "playPause",
      label: "Pause",
      eventName: "VisualResult.PlayPauseRequest",
      style: "visual-result__control__toggle",
      eventStyle: 'global'
    });
    this.resetButton = Button.create({
      id: 'reset',
      label: 'Reset',
      eventName: 'VisualResult.ResetRequest',
      style: 'visual-result__control__reset',
      eventStyle: 'global'
    })
    this.playbackButton = Button.create({
      id: 'playbackRate',
      label: 'Normal Speed',
      eventName: 'VisualResult.PlaybackRateRequest',
      style: 'visual-result__control__playback',
      eventStyle: 'global'
    })

    this.addChild(this.playbackButton.view(), ".visual-result__control")
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

  handlePlaybackState(faster) {
    this.playbackButton.setLabel(faster ? "Faster Speed" : "Normal Speed");
  }

  _onSliderChange(evt) {
    Globals.get('Relay').dispatchEvent('VisualResult.SliderRequest', {
      sliderValue: evt.currentTarget.value()
    })
  }

  _onStopDrag(evt) {
    Globals.get('Relay').dispatchEvent('VisualResult.StopDrag',{})
  }

  disableVideoControls() {
    this.videoSlider.disable();
    this.playbackButton.disable();
    this.playPauseButton.disable();
    this.resetButton.disable();
  }

  enableVideoControls() {
    this.videoSlider.enable();
    this.playbackButton.enable();
    this.playPauseButton.enable();
    this.resetButton.enable();
  }

}
