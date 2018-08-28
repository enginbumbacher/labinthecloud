import Model from 'core/model/model';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';

const defaults = {
  vRange: null,
  mode: 'total',
  stdBand: true,
  dT: 1,
  width: 400,
  height: 300,
  data: {},
  raw: {},
  margins: {
    top: 40,
    left: 40,
    bottom: 40,
    right: 20
  }
};

export default class TimeSeriesModel extends Model {
  constructor(config = {}) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults);
    super(config);
  }

  parseData(data, layer = 'default', lightConfig, color) {
    this.set(`raw.${layer}`, data);
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

    this.set('lightConfig', lightConfig)


    // set the range for the vertical axis
    // vRange: if it is given as a parameter, choose it.
    // The structure of the data:
    // this.get('raw').live.tracks --> Array of tracks for each recorded Euglena. Each element has an array of samples, which corresponds to the info for that specific Euglena.
    // this.get('raw').live.tracks[0].samples --> Each sample has the following dictionary {angleXY, speed, speedX, speedY, time, x, y, yaw}
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

      // For each frame generate the relevant data structure for the graph - here, it has to haev a time value, a mean and a standard deviation s at every time point.
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
          if (this.get('mode') == 'component') { // Either display information for x and y speed separately, or the total speed.
            graphs.x[sampleFrame-1].samples.push(sample.speedX);
            graphs.y[sampleFrame-1].samples.push(sample.speedY);
          } else {
            graphs.total[sampleFrame-1].samples.push(sample.speed);
          }
        }
      }

      // Create the mean and standard deviation
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
