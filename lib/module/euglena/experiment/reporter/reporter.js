define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils');

  const DomView = require('core/view/dom_view'),
    Template = require('text!./reporter.html'),
    Button = require('core/component/button/field');

  require('link!./style.css');

  return class ExperimentReporter extends DomView {
    constructor() {
      super(Template);

      this.buttons = {
        send: Button.create({
          id: "send",
          label: "Send to Results Panel",
          eventName: "ExperimentReporter.Send"
        }),
        dont: Button.create({
          id: "dont",
          label: "Don't Send",
          eventName: "ExperimentReporter.DontSend"
        })
      }
      this.addChild(this.buttons.send.view(), ".exp_reporter__buttons")
      this.addChild(this.buttons.dont.view(), ".exp_reporter__buttons")

      this.reset();
    }

    reset() {
      this.update({
        status: 'initializing',
        remaining_estimate: 0
      })
    }

    update(data) {
      if (data.status != "complete") {
        this.$el.find('.exp_reporter__complete').hide();
        this.$el.find('.exp_reporter__working').show();
        let phase = '';
        switch (data.status) {
          case 'queue':
            phase = "Experiment In Queue";
          break;
          case 'initializing':
            phase = "Preparing Experiment";
          break;
          case 'running':
            phase = "We sent your experiment to the real microscopes. If you can, check out the data from the last experiments."
          break;
          case 'processing':
            phase = "Your new experiment is in process. If you can, continue with the data from the last experiments.";
          break;
          case 'retreiving':
            phase = "Processing Data";
          break;
          case 'downloading':
            phase = "The data from your new experiment is getting downloaded."
          break;
        }
        let time = '';
        if (data.remaining_estimate <= 0) {
          time = 'Please wait a moment';
        } else {
          time = `Approx. ${Utils.secondsToTimeString(Math.ceil(data.remaining_estimate / 1000))} remaining`
        }
        this.$el.find('.exp_reporter__phase').text(phase)
        this.$el.find('.exp_reporter__estimate').text(time);
      } else {
        this.results = data.results;
        this.$el.find('.exp_reporter__complete').show();
        this.$el.find('.exp_reporter__working').hide();
      }
    }

    setFullscreen(fullscreen) {
      this.$el.toggleClass('exp_reporter__fullscreen', fullscreen);
    }
  }
})
