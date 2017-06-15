define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils');

  class VideoDisplay extends Component {
    constructor(config = {}) {
      config.modelClass = config.modelClass || Model;
      config.viewClass = config.viewClass || View;
      super(config);
      Utils.bindMethods(this, ['_onTimerEvent'])

      this.view().addEventListener('TimerSource.End', this._onTimerEvent)
    }

    handleVideo(data) {
      if (data) {
        this._model.set('runTime', data.runTime);
        this._model.set('video', data.video);
      } else {
        this._model.set('runTime', 0);
        this._model.set('video', null);
      }
    }

    timer_time() {
      return this.view().time();
    }
    timer_start() {
      this.view().start();
    }
    timer_stop() {
      this.view().stop();
    }
    timer_pause() {
      this.view().pause();
    }
    timer_seek(time) {
      this.view().seek(time);
    }
    timer_duration() {
      return this._model.get('runTime');
    }

    _onTimerEvent(evt) {
      this.dispatchEvent(evt);
    }
  }

  VideoDisplay.create = (data) => new VideoDisplay({ modelData: data });

  return VideoDisplay;
})