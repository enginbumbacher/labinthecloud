define((require) => {
  const DomView = require('core/view/dom_view'),
    Template = require('text!./lightdisplay.html'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    EuglenaDisplay = require('euglena/component/euglenadisplay/euglenadisplay')
    // Button = require('core/component/button/field')
  ;

  require('link!./lightdisplay.css');

  return class LightDisplayView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);

      this.$el.find(".light-display__content").css({
        width: model.get('width'),
        height: model.get('height')
      })

      // this.euglena = EuglenaDisplay.create(model.get('euglenaDisplay'));
      // this.addChild(this.euglena.view(), ".light-display__content");

      // this.playPauseButton = Button.create({
      //   id: "playPause",
      //   label: "Pause",
      //   eventName: "LightDisplay.PlayPauseRequest",
      //   style: "light-display__control__toggle"
      // });
      // this.addEventListener('LightDisplay.PlayPauseRequest', this._onPlayPauseRequest);
      // this.addChild(this.playPauseButton.view(), ".light-display__control")
    }

    render(lights) {
      for (let key in lights) {
        this.$el.find('.light-display__' + key).css({ opacity: lights[key] / 100 });
      }
    }

    _onModelChange(evt) {
      switch (evt.data.path) {
        // case "video":
        //   if (evt.data.value) {
        //     this.video = $("<video>")
        //       .attr('src', evt.data.value)
        //       .prop('autoplay', true)
        //       .prop('loop', true);
        //     this.video.on('loadedmetadata', (jqevt) => {
        //       this.video[0].playbackRate = this.video[0].duration / evt.currentTarget.get('runTime')
        //     })
        //     this.$el.find('.light-display__content').append(this.video);
        //     this.active = true;
        //     window.requestAnimationFrame(this._onTick);
        //   } else {
        //     this.active = false;
        //     if (this.video) {
        //       this.video.remove();
        //       this.video = null;
        //     }
        //   }
        //   break;
        case "runTime":
          this._runTime = evt.data.value;
          break;
      }
    }
  }
})