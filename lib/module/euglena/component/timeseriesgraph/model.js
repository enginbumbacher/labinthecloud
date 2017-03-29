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

    parseData(data) {
      let usedVrange = this.get('vRange') || data.tracks.reduce(
          (tVal, tCurr) => Math.max(
            tVal, 
            tCurr.samples
              .filter((a) => Utils.exists(a.speed))
              .reduce((sVal, sCurr) => Math.max(sVal, this.get('mode') == 'component' ? Math.max(sCurr.speedX, sCurr.speedY) : sCurr.speed), 0)
          ), 0);
      usedVrange = Math.ceil(usedVrange);

      let graphs = {};
      if (this.get('mode') == 'component') {
        graphs.x = [];
        graphs.y = [];
      } else {
        graphs.total = [];
      }

      for (let i = 0; i < data.numFrames; i++) {
        for (let key in graphs) {
          graphs[key].push({
            frame: i,
            time: i / data.fps,
            samples: [],
            mean: null,
            s: null
          })
        }
      }
      for (let track of data.tracks) {
        for (let sample of track.samples) {
          if (!sample.speed) continue;
          if (this.get('mode') == 'component') {
            if (Math.abs(sample.speedX) > usedVrange || Math.abs(sample.speedY) > usedVrange) continue;
          } else {
            if (Math.abs(sample.speed) > usedVrange) continue;
          }
          let sampleFrame = Math.round(sample.time * data.fps);
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
      this.set('data', {
        graphs: graphs,
        maxValue: maxDisplay,
        runTime: data.runTime
      });
    }

    reset() {
      this.set('data', null);
    }
  }
})