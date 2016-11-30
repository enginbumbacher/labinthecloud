define((require) => {
  const DomView = require('core/view/dom_view'),
    Utils = require('core/util/utils'),
    Template = require('text!./loadingscreen.html');

  require('link!./loadingscreen.css');

  return class LoadingScreen extends DomView {
    constructor() {
      super(Template);
      this.reset();
    }

    reset() {
      this.update({
        status: 'initializing',
        remaining_estimate: 0
      })
    }

    update(data) {
      let phase = '';
      switch (data.status) {
        case 'queue':
          phase = "Experiment In Queue";
        break;
        case 'initializing':
          phase = "Preparing Experiment";
        break;
        case 'running':
          phase = "Running Experiment"
        break;
        case 'processing':
          phase = "Processing Data";
        break;
        case 'downloading':
          phase = "Downloading Data";
        break;

      }
      let time = '';
      if (data.remaining_estimate <= 0) {
        time = 'Please wait a moment';
      } else {
        time = `Approx. ${Utils.secondsToTimeString(Math.ceil(data.remaining_estimate / 1000))} remaining`
      }
      this.$el.find('.loadingscreen-phase').text(phase)
      this.$el.find('.loadingscreen-estimate').text(time);
    }
  }
})