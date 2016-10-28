define((require) => {
  const DomView = require('core/view/dom_view'),
    Template = require('text!./lightdisplay.html'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    EuglenaDisplay = require('euglena/component/euglenadisplay/euglenadisplay'),
    Button = require('core/component/button/field')
  ;

  require('link!./lightdisplay.css');

  return class LightDisplayView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, ['_onTick', '_onTock', '_onPlayRequest', '_onStopRequest', '_onModelChange', '_onReset',
        '_onPlayPauseRequest']);

      model.addEventListener('LightDisplay.Reset', this._onReset);
      model.addEventListener('LightDisplay.Tock', this._onTock);
      model.addEventListener('LightDisplay.PlayRequest', this._onPlayRequest);
      model.addEventListener('LightDisplay.StopRequest', this._onStopRequest);
      model.addEventListener('Model.Change', this._onModelChange);

      this.euglena = EuglenaDisplay.create(model.get('euglenaDisplay'));
      this.addChild(this.euglena.view(), ".light-display__content");

      this.playPauseButton = Button.create({
        id: "playPause",
        label: "Pause",
        eventName: "LightDisplay.PlayPauseRequest",
        style: "light-display__control__toggle"
      });
      this.addEventListener('LightDisplay.PlayPauseRequest', this._onPlayPauseRequest);
      this.addChild(this.playPauseButton.view(), ".light-display__control")

      this.active = false;
    }

    _onTick() {
      if (this.active) {
        if (this._startTime) {
          let deltaSec = (((new Date()).getTime() - this._startTime) / 1000) % Globals.get('AppConfig.experimentLength');
          this.dispatchEvent('LightDisplay.Tick', {
            videoTime: deltaSec
          });
          window.requestAnimationFrame(this._onTick);
        } else {
          // console.log(this._runTime, this.video[0].currentTime, this.video[0].duration);
          if (this.video && this.video[0].readyState > 0) {
            this.dispatchEvent('LightDisplay.Tick', {
              videoTime: this._runTime * this.video[0].currentTime / this.video[0].duration
            });
          }
          window.requestAnimationFrame(this._onTick);
        }
      }
    }

    _onTock(evt) {
      // console.log(evt.data.time);
      for (let key in evt.data.light) {
        this.$el.find('.light-display__' + key).css({ opacity: evt.data.light[key] / 100 });
      }
      this.$el.find('.light-display__time').text(Utils.secondsToTimeString(evt.data.time));
      this.euglena.render(evt.data.light, evt.data.time * 1000);
      this._lastTime = evt.data.time;
    }

    _onReset(evt) {
      this.euglena.initialize();
    }

    _onPlayRequest(evt) {
      if (this.video) {
        this.video[0].play();
      } else {
        this._startTime = (new Date()).getTime();
      }
      this.euglena.initialize();
      this.active = true;
      window.requestAnimationFrame(this._onTick);
    }

    _onPlayPauseRequest(evt) {
      if (this.active) {
        this.active = false;
        this._currTime = (((new Date()).getTime() - this._startTime) / 1000) % Globals.get('AppConfig.experimentLength')
        if (this.video) this.video[0].pause();
        this.playPauseButton.view().$dom().find('.button').html('Play')
      } else {
        this.active = true;
        if (this.video) {
          this.video[0].play();
        } else {
          this._startTime = (new Date()).getTime() - this._currTime * 1000
        }
        this.playPauseButton.view().$dom().find('.button').html('Pause')
        window.requestAnimationFrame(this._onTick);
      }
    }

    _onStopRequest(evt) {
      if (this.video) {
        this.video[0].pause();
        // this.video[0].seek(0);
      }
      this._startTime = null;
      ['top', 'bottom', 'left', 'right'].forEach((side) => {
        this.$el.find('.light-display__' + side).css({ opacity: 0 })
      })
      this.$el.find('.light-display__time').text(Utils.secondsToTimeString(0));
      this.active = false;
    }

    _onModelChange(evt) {
      switch (evt.data.path) {
        case "video":
          if (evt.data.value) {
            this.video = $("<video>")
              .attr('src', evt.data.value)
              .prop('autoplay', true)
              .prop('loop', true);
              // .prop('controls', true);
            // this.video.on('timeupdate', this._onTick)
            this.video.on('loadedmetadata', (jqevt) => {
              this.video[0].playbackRate = this.video[0].duration / evt.currentTarget.get('runTime')
            })
            this.$el.find('.light-display__content').append(this.video);
            this.active = true;
            window.requestAnimationFrame(this._onTick);
          } else {
            this.active = false;
            if (this.video) {
              this.video.remove();
              this.video = null;
            }
          }
          break;
        case "runTime":
          this._runTime = evt.data.value;
          break;
      }
    }
  }
})