import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Model from 'core/model/model';
import EugUtils from 'euglena/utils';
const defaults = {
  id: 'aggregate_time',
  graph_class: 'aggregate_time',
  axis_label: 'Aggregate Time',
  width: 500,
  height: 300,
  margins: {
    top: 20,
    bottom: 40,
    left: 80,
    right: 20
  }
};

export default class AggregateTimeGraphModel extends Model {
  constructor(conf) {
    conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
    super(conf);
  }

  update(datasets) {
    const dss = Object.values(datasets);
    let allSame = true;
    for (let ds of dss) {
      if (ds == dss[0]) continue;
      if (!EugUtils.experimentMatch(dss[0].get('experiment'), ds.get('experiment'))) {
        allSame = false;
        break;
      }
    }
    if (!allSame || dss.length == 0) {
      // TODO disable graph
      this.set('graph', null)
      this.dispatchEvent('AggregateGraph.DisableRequest', {
        id: this.get('id')
      })
      return;
    }
    this.dispatchEvent('AggregateGraph.EnableRequest', {
      id: this.get('id')
    })
    // let group = Object.values(datasets)[0];

    const lines = {};
    for (let group of dss) {
      group.get('results').forEach((res) => {
        lines[res.get('id')] = this.generateLine(res, group.get('experiment'))
      })
    }
    this.set('graph', {
      lines: lines,
      lights: dss[0].get('experiment.configuration'),
      runTime: dss[0].get('experiment.configuration').reduce((acc, val) => acc + val.duration, 0),
      maxValue: this.getMaxValue(lines),
      minValue: this.getMinValue(lines)
    })
  }

  getMinValue(lines) {
    return Object.values(lines).reduce((lacc, lval) => Math.min(lacc, lval.data.reduce((pacc,pval) => Math.min(pacc, pval.value), 0)), 0)
  }

  getMaxValue(lines) {
    return Object.values(lines).reduce((lacc, lval) => Math.max(lacc, lval.data.reduce((pacc,pval) => Math.max(pacc, pval.value), 0)), 0)
  }

  generateLine(res, exp) {
    const line = []
    for (let i = 0; i <= res.get('numFrames'); i++) {
      line.push({
        frame: i,
        time: i / res.get('fps'),
        samples: []
      })
    }
    res.get('tracks').forEach((track) => {
      track.samples.forEach((sample) => {
        const sframe = Math.max(1, Math.round(sample.time * res.get('fps')));
        const maxFrame = Math.min(res.get('numFrames'), sframe + Math.round(res.get('fps') * Globals.get('AppConfig.aggregate.timeWindow')))
        for (let i = sframe; i <= maxFrame; i++) {
          line[i].samples.push(sample)
        }
      })
    })
    line.forEach((point) => {
      point.value = this.generateLinePoint(point, exp);
    })

    return {
      id: res.get('id'),
      color: res.get('color'),
      data: line
    };
  }

  generateLinePoint(data, experiment) {
    return 0;
  }
}
