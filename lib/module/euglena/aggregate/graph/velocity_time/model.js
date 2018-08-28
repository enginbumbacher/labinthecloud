import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import AggregateTimeGraphModel from 'euglena/aggregate/graph/time/model';
const defaults = {
  id: 'velocity_time',
  graph_class: "velocity_time",
  axis_label: "Average Velocity",
  label: "Average Velocity over Time"
};

export default class VelocityTimeGraphModel extends AggregateTimeGraphModel {
  constructor(conf) {
    conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
    super(conf);
  }

  generateLinePoint(data, experiment) {
    if (data.samples.length) {
      return data.samples.reduce((acc, val) => { return acc + val.speed }, 0) / data.samples.length;
    } else {
      return 0
    }
  }
}
