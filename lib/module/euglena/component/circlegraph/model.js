define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),

    defaults = {
      binCount: 24,
      dT: 1,
      tStep: 1,
      data: null,
      width: 200,
      height: 200,
      margins: {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30
      }
    }
  ;

  return class CircleHistogramModel extends Model {
    constructor(config = {}) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
    }

    parseData(data) {
      let intervals, i, j, parsed, track, sample, int, bin, maxBinValue;
      intervals = [];
      for (i = 0; i < data.runTime; i += this.get('tStep')) {
        parsed = {
          timeStart: i,
          timeEnd: Math.min(i + this.get('tStep'), data.runTime),
          sampleStart: Math.min(i + this.get('tStep'), data.runTime) - this.get('dT'),
          sampleEnd: Math.min(i + this.get('tStep'), data.runTime),
          bins: []
        };
        for (j = 0 ; j < this.get('binCount'); j++) {
          parsed.bins.push({
            thetaStart: j * Utils.TAU / this.get('binCount'),
            thetaEnd: (j+1) * Utils.TAU / this.get('binCount'),
            frequency: 0
          })
        }
        intervals.push(parsed);
      }
      for (track of data.tracks) {
        for (sample of track.samples) {
          bin = Math.floor(this.get('binCount') * sample.angle / Utils.TAU);
          for (int of intervals) {
            if (int.sampleStart <= sample.time && int.sampleEnd > sample.time) {
              int.bins[bin].frequency += 1;
            }
          }
        }
      }
      maxBinValue = intervals.reduce((val, curr) => Math.max(val, curr.bins.reduce((v, c) => Math.max(v, c.frequency), 0)), 0);
      this.set('data', {
        intervals: intervals,
        maxBinValue: maxBinValue
      });
      console.log(intervals);
    }

    update(timestamp, lights) {
      if (this.get('data')) {
        for (let interval of this.get('data.intervals')) {
          if (interval.timeStart <= timestamp && interval.timeEnd > timestamp) {
            this.set('histogram', interval.bins);
            break;
          }
        }
        this.set('lights', lights);
      }
    }

    reset() {
      this.set('data', null);
    }
  }
})