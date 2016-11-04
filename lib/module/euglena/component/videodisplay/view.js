define((require) => {
  const DomView = require('core/view/dom_view'),
    Utils = require('core/util/utils'),
    Template = require('text!./videodisplay.html');

  return class VideoDisplayView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, ['_onModelChange', '_onVideoMetaData', '_onVideoEnd', '_onVideoTick']);

      this._video = this.$el.find('.video-display__video');
      this._video.on('loadedmetadata', this._onVideoMetaData)
      this._video.on('ended', this._onVideoEnd);
      this._video.on('timeupdate', this._onVideoTick);

      this._video.css({
        width: model.get('width'),
        height: model.get('height')
      })

      model.addEventListener('Model.Change', this._onModelChange);
    }

    time() {
      return this._runTime * this._video[0].currentTime / this._video[0].duration;
    }

    start() {
      this._video[0].play();
    }

    stop() {
      this.pause();
      this.seek(0);
    }

    pause() {
      this._video[0].pause()
    }

    seek(time) {
      this._video[0].currentTime = time;
    }

    _onModelChange(evt) {
      const model = evt.currentTarget;
      switch (evt.data.path) {
        case "video":
          this._video.attr('src', evt.data.value);
        break;
        case "runTime":
          this._runTime = evt.data.value;
        break;
      }
    }

    _onVideoMetaData(jqevt) {
      this._video[0].playbackRate = this._video[0].duration / this._runTime;
      this.dispatchEvent('VideoDisplay.Ready', {}, true);
    }

    _onVideoTick(jqevt) {
      const curr = this.time();
      if (this._lastTime && curr < this._lastTime) {
        this.dispatchEvent('TimerSource.Loop');
      }
      this._lastTime = curr;
    }
    _onVideoEnd(jqevt) {
      this.dispatchEvent('TimerSource.End');
    }
  }
})