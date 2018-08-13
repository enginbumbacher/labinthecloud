import Model from 'core/model/model';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';

const defaults = {
  vRange: 360,
  stdBand: true,
  dT: 1,
  dT_Angle: 15,
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
};

export default class OrientationChangeModel extends Model {
  constructor(config = {}) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults);
    super(config);

    Utils.bindMethods(this, ['parseData']);

  }

  parseData(data, layer = 'default', lightConfig, color) {
    this.set(`raw.${layer}`, data);
    // Orientation of 0 points to the right.

    if (lightConfig) {
      // Calculate the light direction for each time band and the accumulated time
      var acc_time = 0
      for (let config of lightConfig) {
        let v_light = [0,0];
        for (let k in config) {
          switch (k) {
            case "left":
              v_light[0] += config[k];
              break;
            case "right":
              v_light[0] += -config[k];
              break;
            case "top":
              v_light[1] += config[k];
              break;
            case "bottom":
              v_light[1] += -config[k];
              break;
          }
        }
        let v_length = Math.sqrt(v_light[0]*v_light[0] + v_light[1]*v_light[1]);
        v_length = v_length===0 ? 1 : v_length;
        v_light = v_light.map(function(x) {return x / v_length});
        config.lightDir = v_light
        config.timeStart = acc_time;
        config.timeEnd = acc_time + config.duration;
        acc_time += config.duration;
      }
    }


    // set the range for the vertical axis: 180 degrees is away from light; 0 degrees is towards light; 90 degrees is neither or.
    var usedVRange = this.get('vRange');

    let pdata = {};

    for (let rlayer in this.get('raw')) {
      let rdata = this.get(`raw.${rlayer}`);

      // For each frame generate the relevant data structure for the graph - here, it has to haev a time value, a mean and a standard deviation s at every time point.
      let intervals, i, j, parsed, track, sample, int, bin, maxBinValue;
      let graphs = [];

      for (i = 0; i < rdata.numFrames / rdata.fps; i += this.get('tStep')) {
        parsed = {
          time: i,
          sampleStart: Math.min(i + this.get('tStep'), rdata.numFrames / rdata.fps) - this.get('dT'),
          sampleEnd: Math.min(i + this.get('tStep'), rdata.numFrames / rdata.fps),
          bins: [],
          mean: null,
          s: null
        };
        for (j = 0 ; j < this.get('binCount'); j++) {
          parsed.bins.push({ // parsed contains the frequency per bin
            thetaStart: j * Utils.TAU / this.get('binCount'), // Utils.TAU = 2*MATH.PI
            thetaEnd: (j+1) * Utils.TAU / this.get('binCount'),
            avgBinAngle: (2 * j + 1) * Utils.TAU / (2 * this.get('binCount')),
            frequency: 0
          })
        }
        graphs.push(parsed);
      }

      for (track of rdata.tracks) {
        for (sample of track.samples) {
          bin = Math.floor(this.get('binCount') * Utils.posMod(sample.angleXY, Utils.TAU) / Utils.TAU); // Get the bin in which the angle falls
          // I checked whether the calculation of the angleXY has been done by calculating the atan2, or acos of the sample speeds. Only in cases the speed is zero did the values for both deviate. So, sample.angleXY is as good as it gets.
          for (int of graphs) {
            if (int.sampleStart <= sample.time && int.sampleEnd > sample.time) {
              int.bins[bin].frequency += 1;
            }
          }
        }
      }

      for (int of graphs) {
        for (let lights of lightConfig) {
          if (lights.timeStart <= int.time && int.time < lights.timeEnd) {
            if (lights.lightDir[0]==0 && lights.lightDir[1]==0) {
              int.numEugs = int.bins.reduce((acc, curr) => acc + curr.frequency,0)
              int.mean = 90;
              int.s = 0;
            } else {

              var numNonZeroWeights = 0
              for (let bin of int.bins) {
                // let v_eug = [Math.cos(bin.avgBinAngle), Math.sin(bin.avgBinAngle)];
                // let angleDiff = Math.acos(lights.lightDir[0]*v_eug[0] + lights.lightDir[1]*v_eug[1]);
                // angleDiff = Math.min(angleDiff + Math.PI, Math.PI - angleDiff);
                // angleDiff = Math.abs(angleDiff);
                // bin.angleDiff = angleDiff * 180 / Math.PI;
                if (0 < bin.avgBinAngle && bin.avgBinAngle <= Math.PI / 2) { bin.angleDiff = bin.avgBinAngle;}
                else if (Math.PI/2 < bin.avgBinAngle && bin.avgBinAngle <= Math.PI) { bin.angleDiff = bin.avgBinAngle - Math.PI / 2; }
                else if (Math.PI < bin.avgBinAngle && bin.avgBinAngle <= 3/2 * Math.PI) { bin.angleDiff = bin.avgBinAngle - Math.PI; }
                else if (3/2 * Math.PI < bin.avgBinAngle && bin.avgBinAngle <= 2 * Math.PI) { bin.angleDiff = 2*Math.PI - bin.avgBinAngle; }
                bin.angleDiff = bin.angleDiff * 180 / Math.PI;
                if (bin.frequency>0) numNonZeroWeights += 1;
              }

              // Calculate the weighted mean and standard deviation
              int.numEugs = int.bins.reduce((acc, curr) => acc + curr.frequency,0)
              int.mean = int.bins.reduce((acc, curr) => acc + curr.angleDiff * curr.frequency, 0) / int.numEugs;
              let weightedStd = int.bins.map((elem) => elem.frequency * Math.pow(elem.angleDiff - int.mean,2)).reduce((v,c) => v + c,0);
              int.s = Math.sqrt(weightedStd / ((numNonZeroWeights - 1) / numNonZeroWeights * int.numEugs));
            }
          }
        }
      }

      pdata[rlayer] = {
        graphs: graphs,
        runTime: rdata.runTime,
        color: rlayer == layer ? color : null,
        showLayer: (rlayer == layer) ? true : this.get(`data.${rlayer}.showLayer`)
      };
    }
    this.set('data', pdata);
  }

  setLayerLive(showLayerLive) {
    this.set(`data.live.showLayer`, showLayerLive)
  }

  reset() {
    this.set('data', {});
  }
}
