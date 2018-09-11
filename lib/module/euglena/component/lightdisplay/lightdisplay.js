import Component from 'core/component/component';
import Model from './model';
import View from './view';
import Utils from 'core/util/utils';

class LightDisplay extends Component {
  constructor(config = {}) {
    config.viewClass = config.viewClass || View;
    config.modelClass = config.modelClass || Model;
    super(config);
  }

  render(lights) {
    this.view().render(lights);
  }
}

LightDisplay.create = (data) => new LightDisplay({ modelData: data });

export default LightDisplay;
