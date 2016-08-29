define((require) => {
  const DomView = require('core/view/dom_view'),
    Template = require('text!./lightdisplay.html'),
    Utils = require('core/util/utils')
  ;

  require('link!./lightdisplay.css');

  return class LightDisplayView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, ['_onTick', '_onTock', '_onPlayRequest', '_onStopRequest']);

      model.addEventListener('LightDisplay.Tock', this._onTock);
      model.addEventListener('LightDisplay.PlayRequest', this._onPlayRequest);
      model.addEventListener('LightDisplay.StopRequest', this._onStopRequest);
    }

    _onTick(timestamp) {
      if (this._startTime) {
        let deltaSec = (((new Date()).getTime() - this._startTime) / 1000) % window.EuglenaConfig.experimentLength;
        this.dispatchEvent('LightDisplay.Tick', {
          videoTime: deltaSec
        });
        window.requestAnimationFrame(this._onTick);
      }
    }

    _onTock(evt) {
      for (let key in evt.data.light) {
        this.$el.find('.light-display__' + key).css({ opacity: evt.data.light[key] / 100 });
      }
      this.$el.find('.light-display__time').text(Utils.secondsToTimeString(evt.data.time));
    }

    _onPlayRequest(evt) {
      if (this.video) {
        
      } else {
        this._startTime = (new Date()).getTime();
        window.requestAnimationFrame(this._onTick);
      }
    }

    _onStopRequest(evt) {
      this._startTime = null;
      ['top', 'bottom', 'left', 'right'].forEach((side) => {
        this.$el.find('.light-display__' + side).css({ opacity: 0 })
      })
      this.$el.find('.light-display__time').text(Utils.secondsToTimeString(0));
    }
  }
})