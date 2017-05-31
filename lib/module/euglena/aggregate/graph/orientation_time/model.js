define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager')
  
  const AggregateTimeGraphModel = require('euglena/aggregate/graph/time/model'),
    defaults = {
      id: 'orientation_time',
      graph_class: "orientation_time",
      axis_label: "Average Orientation",
      label: "Average Orientation over Time"
    };

  return class OrientationTimeGraphModel extends AggregateTimeGraphModel {
    constructor(conf) {
      conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
      super(conf);
    }

    generateLinePoint(data, experiment) {
      let x = 0, y = 0;
      data.samples.forEach((sample) => {
        x += Math.cos(sample.yaw)
        y += Math.sin(sample.yaw)
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

})