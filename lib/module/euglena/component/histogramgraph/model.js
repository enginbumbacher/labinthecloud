define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),

    defaults = {
      binCount: 20,
      vRange: 200,
      mode: 'total',
      dT: 1,
      tStep: 2,
      width: 200,
      height: 200,
      margins: {
        top: 20,
        right: 20,
        bottom: 40,
        left: 40
      }
    }
  ;

  return class HistogramModel extends Model {
    constructor(config = {}) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
    }

    parseData(data) {
      let intervals, i, j, k, parsed, track, sample, int, bin, maxBinValue, usedVrange;
      usedVrange = Globals.get('AppConfig.histogram.vRange') ? this.get('vRange') : data.tracks.reduce(
          (tVal, tCurr) => Math.max(
            tVal, 
            tCurr.samples
              .filter((a) => Utils.exists(a.speed))
              .reduce((sVal, sCurr) => Math.max(sVal, this.get('mode') == 'component' ? Math.max(sCurr.speedX, sCurr.speedY) : sCurr.speed), 0)
          ), 0);
      usedVrange = Math.ceil(usedVrange);

      intervals = [];
      for (i = 0; i < data.runTime; i += this.get('tStep')) {
        parsed = {
          timeStart: i,
          timeEnd: Math.min(i + this.get('tStep'), data.runTime),
          sampleStart: Math.min(i + this.get('tStep'), data.runTime) - this.get('dT'),
          sampleEnd: Math.min(i + this.get('tStep'), data.runTime),
          bins: {}
        };
        let binSize = 0;
        if (this.get('mode') == 'component') {
          parsed.bins.x = [];
          parsed.bins.y = [];
          binSize = usedVrange * 2 / this.get('binCount');
        } else {
          parsed.bins.total = [];
          binSize = usedVrange / this.get('binCount');
        }
        for (j = 0 ; j < this.get('binCount'); j++) {
          for (k in parsed.bins) {
            if (this.get('mode') == 'component') {
              parsed.bins[k].push({
                vStart: j * binSize - usedVrange,
                vEnd: (j + 1) * binSize - usedVrange,
                frequency: 0
              })
            } else {
              parsed.bins[k].push({
                vStart: j * binSize,
                vEnd: (j + 1) * binSize,
                frequency: 0
              })
            }
          }
        }
        intervals.push(parsed);
      }
      maxBinValue = 0;
      for (track of data.tracks) {
        for (sample of track.samples) {
          if (!sample.speed) continue;
          if (this.get('mode') == 'component') {
            if (Math.abs(sample.speedX) > usedVrange || Math.abs(sample.speedY) > usedVrange) continue;
          } else {
            if (Math.abs(sample.speed) > usedVrange) continue;
          }
          for (int of intervals) {
            if (int.sampleStart <= sample.time && int.sampleEnd > sample.time) {
              if (this.get('mode') == 'component') {
                let binX = Math.floor((sample.speedX + usedVrange) / (usedVrange * 2) * this.get('binCount'));
                let binY = Math.floor((sample.speedY + usedVrange) / (usedVrange * 2) * this.get('binCount'));
                int.bins.x[binX].frequency += 1;
                int.bins.y[binY].frequency += 1;
                maxBinValue = Math.max(maxBinValue, Math.max(int.bins.x[binX].frequency, int.bins.y[binY].frequency));
              } else {
                let bin = Math.floor(this.get('binCount') * sample.speed / usedVrange);
                int.bins.total[bin].frequency += 1;
                maxBinValue = Math.max(maxBinValue, int.bins.total[bin].frequency);
              }
            }
          }
        }
      }
      this.set('data', {
        intervals: intervals,
        maxBinValue: maxBinValue
      });
    }

    update(timestamp) {
      for (let interval of this.get('data.intervals')) {
        if (interval.timeStart <= timestamp && interval.timeEnd > timestamp) {
          this.set('histogram', interval.bins);
          break;
        }
      }
    }
  }
})