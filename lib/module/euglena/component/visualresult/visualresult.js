import Component from 'core/component/component';
import Model from './model';
import View from './view';
import Utils from 'core/util/utils';
import Timer from 'core/util/timer';
import Globals from 'core/model/globals';
import $ from 'jquery';
import LightDisplay from 'euglena/component/lightdisplay/lightdisplay';
import BulbDisplay from 'euglena/component/bulbdisplay/bulbdisplay';
import VideoDisplay from 'euglena/component/videodisplay/videodisplay';
import EuglenaDisplay from 'euglena/component/euglenadisplay/euglenadisplay';

class VisualResult extends Component {
  constructor(config) {
    config.modelClass = config.modelClass || Model;
    config.viewClass = config.viewClass || View;
    super(config);
    Utils.bindMethods(this, ['_onTick', '_onPlayPauseRequest', '_onVideoReady', '_onResetRequest', '_onTimerEnd',
    '_onSliderRequest','_onStopDrag','_onShowVideo','_onPlaybackRateRequest']);

    this._lightDisplay = LightDisplay.create({
      width: this._model.get('width'),
      height: this._model.get('height')
    });
    this._bulbDisplay = BulbDisplay.create({
      width: this._model.get('width'),
      height: this._model.get('height')
    });
    this._videoDisplay = VideoDisplay.create({
      width: this._model.get('width'),
      height: this._model.get('height')
    });
    
    this._euglenaDisplay = EuglenaDisplay.create(Globals.get('AppConfig.view3d'));

    this._timer = new Timer({
      duration: Globals.get('AppConfig.experiment.maxDuration'),
      loop: true
    });
    this._timer.addEventListener('Timer.Tick', this._onTick);
    this._timer.addEventListener('Timer.End', this._onTimerEnd);
    this.playbackFaster = false;

    //this._videoDisplay.addEventListener('Video.Tick', this._onTick);

    this.view().addChild(this._lightDisplay.view(), ".visual-result__content")
    this.view().addChild(this._videoDisplay.view(), ".visual-result__content")
    this.view().addChild(this._euglenaDisplay.view(), ".visual-result__content")
    this.view().addChild(this._bulbDisplay.view(), ".visual-result__content")

    this.reset();

    Globals.get('Relay').addEventListener('VisualResult.PlayPauseRequest', this._onPlayPauseRequest);
    Globals.get('Relay').addEventListener('VisualResult.PlaybackRateRequest', this._onPlaybackRateRequest);
    Globals.get('Relay').addEventListener('VisualResult.ResetRequest', this._onResetRequest);
    this.view().addEventListener('VideoDisplay.Ready', this._onVideoReady);

    Globals.get('Relay').addEventListener('VisualResult.SliderRequest', this._onSliderRequest);
    Globals.get('Relay').addEventListener('VisualResult.StopDrag', this._onStopDrag);

    this.addEventListener('VideoResult.ShowVideo', this._onShowVideo);

  }

  handleLightData(lightData) {
    this._model.set('lightData', lightData);
  }

  handleModelData(results, model, color) {
    if (results == null) { // Generate the results data

      this._euglenaDisplay.handleData({
        tracks: []
      }, model)
    } else {
      this._euglenaDisplay.handleData(results, model, color);
    }
  }

  play(video = null) {
    // this._euglenaDisplay.initialize();
    this.stop();
    if (video) {
      this._mode = "video";
      this._videoDisplay.handleVideo(video);
      this._timer.setSource(this._videoDisplay);
    } else {
      this._mode = "dryRun";
      this._videoDisplay.handleVideo(null);
      this._timer.setSource(null);
      this._timer.start();
      this.view().handlePlayState(this._timer.active());
    }
  }

  stop() {
    this._timer.stop();
    this.view().handlePlayState(this._timer.active());
  }

  pause() {
    this._timer.pause();
    this.view().handlePlayState(this._timer.active());
  }

  reset() {
    this._timer.stop();
    const resetLights = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    };
    this._lightDisplay.render(resetLights);
    this._bulbDisplay.render(resetLights);
    this._euglenaDisplay.render(resetLights, 0);
    this.view().handlePlayState(this._timer.active());
  }

  _onTick(evt) {
    const time = this._timer.time();
    const lights = this._model.getLightState(time);

    this._lightDisplay.render(lights);
    this._bulbDisplay.render(lights);
    this._euglenaDisplay.render(lights, time);

    this.view().tick(time);
    this.dispatchEvent('VisualResult.Tick', {
      mode: this._mode,
      time: time,
      lights: lights
    })
  }

  _onPlaybackRateRequest(evt) {
    this.playbackFaster = this.playbackFaster ? false : true;
    this.view().handlePlaybackState(this.playbackFaster);
    this._videoDisplay.changePlaybackRate(this.playbackFaster);
    Globals.get('Logger').log({
      type: "playbackrate",
      category: "results",
      data: {playbackrate: this.playbackFaster ? 'faster' : 'normal'}
    })
  }

  _onPlayPauseRequest(evt) {
    if (this._timer.active()) {
      this._timer.pause();
    } else {
      this._timer.start();
    }
    this.view().handlePlayState(this._timer.active());
    Globals.get('Logger').log({
      type: this._timer.active() ? "play" : "pause",
      category: "results",
      data: {}
    })
  }

  _onVideoReady(evt) {
    this._timer.seek(0);
    this._onTick(null)
    this.view().handlePlayState(this._timer.active());
    this.view().handlePlaybackState(this.playbackFaster);
    this._videoDisplay.changePlaybackRate(this.playbackFaster);
  }

  _onResetRequest(evt) {
    this._timer.seek(0);

    const lights = this._model.getLightState(0);

    this._lightDisplay.render(lights);
    this._bulbDisplay.render(lights);
    this._euglenaDisplay.render(lights, 0);

    this.view().videoSlider.setValue(0);

    this.dispatchEvent('VisualResult.Tick', {
      mode: this._mode,
      time: 0,
      lights: lights
    })

    Globals.get('Logger').log({
      type: "reset",
      category: "results",
      data: {}
    })
  }

  _onSliderRequest(evt) {
    if(!this._timer.active()) {
      this._timer.seek(evt.data.sliderValue);

      const time = this._timer.time();
      const lights = this._model.getLightState(time);

      this.view().$el.find('.visual-result__time').text(Utils.secondsToTimeString(time))
      this._lightDisplay.render(lights);
      this._bulbDisplay.render(lights);
      this._euglenaDisplay.render(lights, time);

      this.dispatchEvent('VisualResult.Tick', {
        mode: this._mode,
        time: time,
        lights: lights
      })

    }
  }

  _onStopDrag(evt) {
    Globals.get('Logger').log({
      type: "videoSlider",
      category: "results",
      data: {
        newTime: this._timer.time().toFixed(2)
      }
    })
  }

  clear() {
    this._timer.stop();
    this._videoDisplay.handleVideo(null);
    this._timer.setSource(null);
    this.reset();
  }

  _onShowVideo(evt) {
    this._videoDisplay.dispatchEvent('VideoDisplay.ShowVideo', {showVideo: evt.data.showVideo});
  }

  _onTimerEnd(evt) {
    this.view().handlePlayState(this._timer.active());
  }

  hideControls() {
    this.view().$el.find('.visual-result__control').hide();
    this.view().$el.find('.visual-result__time').hide();
  }

}

VisualResult.create = (data = {}) => new VisualResult({ modelData: data });

export default VisualResult;
