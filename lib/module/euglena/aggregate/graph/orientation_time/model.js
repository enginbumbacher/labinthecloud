import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import AggregateTimeGraphModel from 'euglena/aggregate/graph/time/model';
const defaults = {
  id: 'orientation_time',
  graph_class: "orientation_time",
  axis_label: "Average Orientation",
  label: "Average Orientation over Time"
};

export default class OrientationTimeGraphModel extends AggregateTimeGraphModel {
  constructor(conf) {
    conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
    super(conf);
  }

  generateLinePoint(data, experiment) {
    let x = 0, y = 0;
    data.samples.forEach((sample) => {
      x += Math.cos(sample.angleXY)
      y += Math.sin(sample.angleXY)
    })
    let alpha = Math.atan2(y, x) * 180 / Math.PI;
    // return alpha
    if (Math.abs(alpha) > 90) {
      alpha -= Math.sign(alpha) * 180
    }
    return Math.abs(alpha)
  }

  getMinValue(lines) {
    // return -180
    return 0
  }

  getMaxValue(lines) {
    // return 180
    return 90
  }
}
