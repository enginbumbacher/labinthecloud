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
      data: {},
      raw: {},
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

    parseData(data, layer = 'default') {
      this.set(`raw.${layer}`, data);
      let intervals, i, j, k, parsed, track, sample, int, bin, maxBinValue, usedVrange, pdata, rdata;
      usedVrange = Globals.get('AppConfig.histogram.vRange') ? this.get('vRange') : Object.values(this.get('raw')).reduce((acc, val) => {
        return Math.max(acc, val.tracks.reduce((tacc, tval) => {
          return Math.max(tacc, tval.samples.filter((a) => Utils.exists(a.speed)).reduce((sacc, sval) => {
            return Math.max(sacc, this.get('mode') == 'component' ? Math.max(Math.abs(sval.speedX), Math.abs(sval.speedY)) : sval.speed);
          }, 0));
        }, 0));
      }, 0);
      usedVrange = Math.ceil(usedVrange);

      pdata = {};
      for (let rlayer in this.get('raw')) {
        rdata = this.get(`raw.${rlayer}`);
        intervals = [];
        for (i = 0; i < rdata.runTime; i += this.get('tStep')) {
          parsed = {
            timeStart: i,
            timeEnd: Math.min(i + this.get('tStep'), rdata.runTime),
            sampleStart: Math.min(i + this.get('tStep'), rdata.runTime) - this.get('dT'),
            sampleEnd: Math.min(i + this.get('tStep'), rdata.runTime),
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
        for (track of rdata.tracks) {
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
        pdata[rlayer] = {
          intervals: intervals,
          maxBinValue: maxBinValue
        };
      }
      this.set('data', pdata);
    }

    reset() {
      this.set('data', {});
    }

    update(timestamp) {
      if (this.get('data')) {
        let histogram = {};
        for (let layer in this.get('data')) {
          for (let interval of this.get(`data.${layer}.intervals`)) {
            if (interval.timeStart <= timestamp && interval.timeEnd > timestamp) {
              histogram[layer] = interval.bins;
              break;
            }
          }
        }
        this.set('histogram', histogram);
      }
    }
  }
})