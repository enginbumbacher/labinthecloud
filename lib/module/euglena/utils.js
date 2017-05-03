define((require) => {
  const Utils = require('core/util/utils');

  class EuglenaUtils {
    getLightState(lights, time) {
      let blockTime = 0;
      let light = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
      for (const block of lights) {
        if (time > blockTime && time <= blockTime + block.duration) {
          ['top', 'right', 'bottom', 'left'].forEach((key) => {
            light[key] = block[key];
          })
          break;
        }
        blockTime += block.duration;
      }
      return light;
    }

    normalizeResults(res) {
      res.runTime = res.runTime || evt.data.experiment.configuration.reduce((acc, val) => {
        return acc + val.duration
      }, 0);
      res.tracks.forEach((track) => {
        track.samples.forEach((sample, ind) => {
          if (ind == 0) {
            sample.speed = 0;
            sample.speedX = 0;
            sample.speedY = 0;
          } else {
            sample.speed = Math.sqrt(Math.pow(sample.x - track.samples[ind - 1].x, 2) + Math.pow(sample.y - track.samples[ind - 1].y, 2)) / (sample.time - track.samples[ind - 1].time);
            sample.speedX = (sample.x - track.samples[ind - 1].x) / (sample.time - track.samples[ind - 1].time);
            sample.speedY = (sample.y - track.samples[ind - 1].y) / (sample.time - track.samples[ind - 1].time);
          }
        })
      })
      res.fps = res.numFrames / res.runTime;
      return res;
    }

    getLiveResults(expId) {
      return Utils.promiseAjax(`/api/v1/Results`, {
        data: {
          filter: {
            where: {
              and: [
                { experimentId: expId },
                { 
                  bpu_api_id: {
                    neq: null
                  }
                }
              ]
            }
          }
        },
        contentType: 'application/json'
      }).then((results) => {
        return this.normalizeResults(results[0]);
      });
    }

    getModelResults(expId, modelId) {
      return Utils.promiseAjax(`/api/v1/Results`, {
        data: {
          filter: {
            where: {
              and: [
                { experimentId: expId },
                { euglenaModelId: modelId }
              ]
            }
          }
        },
        contentType: 'application/json'
      }).then((results) => {
        return this.normalizeResults(results[0]);
      });
    }
  }
  return new EuglenaUtils;
})