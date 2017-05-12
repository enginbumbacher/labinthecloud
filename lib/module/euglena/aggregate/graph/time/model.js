define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager')
  
  const Model = require('core/model/model'),
    defaults = {
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
    }

  return class AggregateTimeGraphModel extends Model {
    constructor(conf) {
      conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
      super(conf);
    }

    update(datasets) {
      if (Object.values(datasets).length != 1) {
        // TODO disable graph
        this.set('graph', null)
        this.dispatchEvent('AggregateTimeGraph.RequestDisable', {
          id: this.get('id')
        })
        return;
      }
      this.dispatchEvent('AggregateTimeGraph.RequestEnable', {
        id: this.get('id')
      })
      let group = Object.values(datasets)[0];

      const lines = {};
      group.get('results').forEach((res) => {
        lines[res.get('id')] = this.generateLine(res, group.get('experiment'))
      })
      this.set('graph', {
        lines: lines,
        lights: group.get('experiment.configuration'),
        runTime: group.get('experiment.configuration').reduce((acc, val) => acc + val.duration, 0),
        maxValue: Object.values(lines).reduce((lacc, lval) => Math.max(lacc, lval.data.reduce((pacc,pval) => Math.max(pacc, pval.value), 0)), 0),
        minValue: Object.values(lines).reduce((lacc, lval) => Math.min(lacc, lval.data.reduce((pacc,pval) => Math.min(pacc, pval.value), 0)), 0)
      })
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
          line[sframe].samples.push(sample);
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
})