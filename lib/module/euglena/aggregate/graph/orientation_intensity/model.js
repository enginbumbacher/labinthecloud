import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Model from 'core/model/model';
import EugUtils from 'euglena/utils';
const defaults = {
  graph_class: 'orientation_intensity',
  label: 'Orientation WRT Light by Light Intensity',
  width: 500,
  height: 300,
  margins: {
    top: 20,
    bottom: 40,
    left: 80,
    right: 20
  }
};

export default class OrientationIntensityGraphModel extends Model {
  constructor(conf) {
    conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
    super(conf);
  }

  update(datasets) {
    const histograms = {};
    Object.values(datasets).forEach((group) => {
      group.get('results').forEach((res) => {
        histograms[res.get('id')] = this.generateBuckets(res, group.get('experiment'))
      })
    })
    this.set('graph', {
      histograms: histograms
    })
  }

  generateBuckets(res, exp) {
    const buckets = {};
    res.get('tracks').forEach((track) => {
      track.samples.forEach((sample) => {
        let lights = EugUtils.getLightState(exp.configuration, sample.time, { angle: true, intensity: true })
        let bucket = Utils.roundDecimal(lights.intensity, -2).toString()
        buckets[bucket] = buckets[bucket] || { samples: [] };
        buckets[bucket].samples.push(sample.angleXY - lights.angle);
      })
    })
    Object.values(buckets).forEach((bucket) => {
      let x = 0, y = 0;
      bucket.samples.forEach((angle) => {
        x += Math.cos(angle)
        y += Math.sin(angle)
      })
      bucket.value = Math.atan2(y, x) * 180 / Math.PI
    })
    return {
      id: res.get('id'),
      color: res.get('color'),
      data: buckets
    }
  }
}
