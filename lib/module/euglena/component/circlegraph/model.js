import Model from 'core/model/model';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';

const defaults = {
  binCount: 24,
  dT: 1,
  tStep: 1,
  data: {},
  histogram: {},
  meanTheta: 0,
  width: 200,
  height: 200,
  margins: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
  }
};

export default class CircleHistogramModel extends Model {
  constructor(config = {}) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults);
    super(config);
  }

  parseData(data, layer = 'default', color) {
    if (data == null) {
      this.set(`data.${layer}`, null);
      this.set(`histogram.${layer}`, null);
      this.set(`meanTheta.${layer}`, null);
      return;
    }
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
        parsed.bins.push({ // parsed contains the frequency per bin
          thetaStart: j * Utils.TAU / this.get('binCount'), // Utils.TAU = 2*MATH.PI
          thetaEnd: (j+1) * Utils.TAU / this.get('binCount'),
          frequency: 0
        })
      }
      intervals.push(parsed); // Contains data.runTime elements
    }
    for (track of data.tracks) {
      for (sample of track.samples) {
        bin = Math.floor(this.get('binCount') * Utils.posMod(sample.angleXY, Utils.TAU) / Utils.TAU); // Get the bin in which the angle falls
        // I checked whether the calculation of the angleXY has been done by calculating the atan2, or acos of the sample speeds. Only in cases the speed is zero did the values for both deviate. So, sample.angleXY is as good as it gets.
        for (int of intervals) {
          if (int.sampleStart <= sample.time && int.sampleEnd > sample.time) {
            int.bins[bin].frequency += 1;
          }
        }
      }
    }

    for (int of intervals) { // Calculate the weighted average orientation for the circular histograms (weighted by frequencies)
      // I realize this doesn't actually work. If the distribution is completely circular, then the meanTheta line will, if calculated like now, still have a radian of 3. It should then have a length of zero.
      // In order to calculate the length, I have to see how the distribution is generated (e.g. maxValue as max length). It could be proportional to the difference between the longest and shortest histogram in an instance?
      let numFreq = int.bins.reduce((acc,curr) => acc + curr.frequency,0);
      let mean = int.bins.reduce((acc,curr) => acc + (curr.thetaEnd + curr.thetaStart) / 2 * curr.frequency,0) / numFreq;
      int.meanTheta = isNaN(mean) ? 0 : mean;
    }

    maxBinValue = intervals.reduce((val, curr) => Math.max(val, curr.bins.reduce((v, c) => Math.max(v, c.frequency), 0)), 0);
    this.set(`data.${layer}`, {
      intervals: intervals,
      maxBinValue: maxBinValue,
      color: color,
      showLayer: true
    });
  }

  update(timestamp, lights) {
    if (Object.keys(this.get('data')).length) {
      for (let layer in this.get('data')) {
        if (this.get(`data.${layer}.intervals`)) {
          for (let interval of this.get(`data.${layer}.intervals`)) {
            if (interval.timeStart <= timestamp && interval.timeEnd > timestamp) {
              this.set(`histogram.${layer}`, interval.bins);
              this.set(`meanTheta.${layer}`, interval.meanTheta);
              break;
            }
          }
        }
      }
      this.set('lights', lights);
    }
  }

  setLayerLive(showLayerLive) {
    this.set(`data.live.showLayer`, showLayerLive)
  }

  reset() {
    this.set('data', {});
  }
}
