import Component from 'core/component/component';
import Model from './model';
import View from './view';
import Utils from 'core/util/utils';
import HM from 'core/event/hook_manager';

class EuglenaDisplay extends Component {
  constructor(settings = {}) {
    settings.modelClass = settings.modelClass || Model;
    settings.viewClass = settings.viewClass || View;
    super(settings);

    this._lastRender = 0;
  }

  handleData(results, model, color) {
    if (results.magnification) this._model.setMagnification(results.magnification);
    this._model.setTrackData(results.tracks, model, color);
  }

  render(lights, time) {
    this.view().render({
      lights: lights,
      time: time,
      model: this._model
    })
  }
}

EuglenaDisplay.create = (data = {}) => new EuglenaDisplay({ modelData: data });

export default EuglenaDisplay;
