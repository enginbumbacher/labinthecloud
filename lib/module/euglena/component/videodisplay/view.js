import DomView from 'core/view/dom_view';
import Utils from 'core/util/utils';
import Template from './videodisplay.html';

export default class VideoDisplayView extends DomView {
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

  setPlaybackRate(faster) {
    if (this._video[0]) {
      if (faster) {this._video[0].playbackRate = 4 * this._video[0].duration / this._runTime;}
      else { this._video[0].playbackRate = 1 * this._video[0].duration / this._runTime;}
    }
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
    if (this._video[0].duration) {
      this._video[0].currentTime = time * this._video[0].duration / this._runTime;
    } else {
      this._video[0].currentTime = 0;
    }
  }

  _onModelChange(evt) {
    const model = evt.currentTarget;
    switch (evt.data.path) {
      case "video":
        this._video.attr('src', evt.data.value);
        if (evt.data.value == null) {
          this._video.hide();
        } else {
          this._video.show();
        }
      break;
      case "runTime":
        this._runTime = evt.data.value;
      break;
      case "showVideo":
        if (evt.data.value) { this._video.css({display: 'inline'});}
        else { this._video.css({display: 'none'}); }
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
