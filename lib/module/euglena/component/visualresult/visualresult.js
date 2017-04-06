define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils'),
    Timer = require('core/util/timer'),
    Globals = require('core/model/globals'),

    LightDisplay = require('euglena/component/lightdisplay/lightdisplay'),
    VideoDisplay = require('euglena/component/videodisplay/videodisplay'),
    EuglenaDisplay = require('euglena/component/euglenadisplay/euglenadisplay');

  class VisualResult extends Component {
    constructor(config) {
      config.modelClass = config.modelClass || Model;
      config.viewClass = config.viewClass || View;
      super(config);
      Utils.bindMethods(this, ['_onTick', '_onPlayPauseRequest', '_onVideoReady']);

      this._lightDisplay = LightDisplay.create({
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
      this._videoDisplay.addEventListener('Video.Tick', this._onTick);

      this.view().addChild(this._lightDisplay.view(), ".visual-result__content")
      this.view().addChild(this._videoDisplay.view(), ".visual-result__content")
      this.view().addChild(this._euglenaDisplay.view(), ".visual-result__content")

      this.reset();

      this.view().addEventListener('VisualResult.PlayPauseRequest', this._onPlayPauseRequest);
      this.view().addEventListener('VideoDisplay.Ready', this._onVideoReady);
    }

    handleLightData(lightData) {
      this._model.set('lightData', lightData);
    }

    handleModelData(results) {
      this._euglenaDisplay.handleData(results);
    }

    play(video = null) {
      // this._euglenaDisplay.initialize();
      this._timer.stop();
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
      this._lightDisplay.render(resetLights)
      this._euglenaDisplay.render(resetLights, 0);
      this.view().handlePlayState(this._timer.active());
    }

    _onTick(evt) {
      const time = this._timer.time();
      const lights = this._model.getLightState(time);

      this._lightDisplay.render(lights);
      this._euglenaDisplay.render(lights, time);

      this.view().tick(time);
      this.dispatchEvent('VisualResult.Tick', {
        mode: this._mode,
        time: time,
        lights: lights
      })
    }

    _onPlayPauseRequest(evt) {
      if (this._timer.active()) {
        this._timer.pause();
      } else {
        this._timer.start();
      }
      this.view().handlePlayState(this._timer.active());
    }

    _onVideoReady(evt) {
      this._timer.start();
      this.view().handlePlayState(this._timer.active());
    }

    clear() {
      this._timer.stop();
      this._videoDisplay.handleVideo(null);
      this._timer.setSource(null);
      this.reset();
    }
  }

  VisualResult.create = (data = {}) => new VisualResult({ modelData: data });
  return VisualResult;
})