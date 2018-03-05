define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),

    defaults = {
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
    }
  ;

  return class OrientationChangeModel extends Model {
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
        let graphs = {};
        graphs.angleDiff = [];


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
          for (let idx = this.get('dT_Angle'); idx < track.samples.length; idx++) {
            let sample = track.samples[idx];
            let sampleFrame = Math.round(sample.time * rdata.fps);
            var test = 0;
            if (sample.time > 15 && sample.time < 30) test += 1;
            if (sample.time > 30 && sample.time < 45) test += 1;
            if (sample.time > 45 && sample.time < 60) test += 1;

            if (!sample.angleXY) continue;
            // track.samples.slice(idx - this.get('dT_Angle'), idx).reduce((acc,curr) => acc + Math.atan2(curr.speedY, curr.speedX),0) / this.get('dT_Angle') * 180 / Math.PI;
            // var v_eug = [Math.cos(avgAngle), Math.sin(avgAngle)];
            for (let lights of lightConfig) {
              if (lights.timeStart <= sample.time && lights.timeEnd > sample.time) {
                if (lights.lightDir===[0,0]) {
                  graphs.angleDiff[sampleFrame-1].samples.push(90)
                } else {
                  var avgAngle = 0;
                  track.samples.slice(idx - this.get('dT_Angle'), idx).forEach(curr => {
                    let angle = Math.atan2(curr.speedY, curr.speedX);
                    let v_eug = [Math.cos(angle), Math.sin(angle)];
                    let angleDiff = Math.acos(lights.lightDir[0]*v_eug[0] + lights.lightDir[1]*v_eug[1]);
                    angleDiff = Math.min(angleDiff + Math.PI, Math.PI - angleDiff);
                    angleDiff = Math.abs(angleDiff) * 180 / Math.PI;
                    avgAngle += angleDiff;
                  })

                  avgAngle /= this.get('dT_Angle') ;

                  graphs.angleDiff[sampleFrame].samples.push(avgAngle)
                }
              }
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
})
