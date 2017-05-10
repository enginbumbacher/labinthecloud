define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),

    defaults = {
      vRange: null,
      mode: 'total',
      stdBand: true,
      dT: 1,
      width: 400,
      height: 300,
      data: {},
      raw: {},
      margins: {
        top: 20,
        left: 40,
        bottom: 40,
        right: 20
      }
    }
  ;

  return class TimeSeriesModel extends Model {
    constructor(config = {}) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
    }

    parseData(data, layer = 'default') {
      this.set(`raw.${layer}`, data);

      let usedVrange = Globals.get('AppConfig.histogram.vRange') ? this.get('vRange') : Object.values(this.get('raw')).reduce((acc, val) => {
        return Math.max(acc, val.tracks.reduce((tacc, tval) => {
          return Math.max(tacc, tval.samples.filter((a) => Utils.exists(a.speed)).reduce((sacc, sval) => {
            return Math.max(sacc, this.get('mode') == 'component' ? Math.max(Math.abs(sval.speedX), Math.abs(sval.speedY)) : sval.speed);
          }, 0));
        }, 0));
      }, 0);
      usedVrange = Math.ceil(usedVrange);

      let pdata = {};

      for (let rlayer in this.get('raw')) {
        let rdata = this.get(`raw.${rlayer}`);
        let graphs = {};
        if (this.get('mode') == 'component') {
          graphs.x = [];
          graphs.y = [];
        } else {
          graphs.total = [];
        }

        for (let i = 0; i < rdata.numFrames; i++) {
          for (let key in graphs) {
            graphs[key].push({
              frame: i,
              time: i / rdata.fps,
              samples: [],
              mean: null,
              s: null
            })
          }
        }
        for (let track of rdata.tracks) {
          for (let sample of track.samples) {
            if (!sample.speed) continue;
            if (this.get('mode') == 'component') {
              if (Math.abs(sample.speedX) > usedVrange || Math.abs(sample.speedY) > usedVrange) continue;
            } else {
              if (Math.abs(sample.speed) > usedVrange) continue;
            }
            let sampleFrame = Math.round(sample.time * rdata.fps);
            if (this.get('mode') == 'component') {
              graphs.x[sampleFrame-1].samples.push(sample.speedX);
              graphs.y[sampleFrame-1].samples.push(sample.speedY);
            } else {
              graphs.total[sampleFrame-1].samples.push(sample.speed);
            }
          }
        }
        let maxDisplay = 0;
        for (let key in graphs) {
          for (let frame of graphs[key]) {
            if (frame.samples.length) {
              frame.mean = frame.samples.reduce((v, c) => v + c, 0) / frame.samples.length;
              frame.s = Math.sqrt(frame.samples.map((v) => Math.pow(v - frame.mean, 2)).reduce((v, c) => v + c, 0) / frame.samples.length);
              maxDisplay = Math.max(maxDisplay, Math.max(Math.abs(frame.mean + frame.s), Math.abs(frame.mean - frame.s)));
            }
          }
        }
        pdata[rlayer] = {
          graphs: graphs,
          maxValue: maxDisplay,
          runTime: rdata.runTime
        };
      }
      this.set('data', pdata);
    }

    reset() {
      this.set('data', {});
    }
  }
})