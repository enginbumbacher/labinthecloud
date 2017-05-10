define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager')
  
  const AggregateTimeGraphModel = require('euglena/aggregate/graph/time/model'),
    defaults = {
      graph_class: "velocity_time",
      axis_label: "Average Velocity",
      label: "Average Velocity over Time"
    };

  return class VelocityTimeGraphModel extends AggregateTimeGraphModel {
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

})
