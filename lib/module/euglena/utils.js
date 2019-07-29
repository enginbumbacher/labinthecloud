import Utils from 'core/util/utils';
import Globals from 'core/model/globals';

class EuglenaUtils {
  getLightState(lights, time, opts = {}) {
    let blockTime = 0;
    let light = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
    if (time <= lights.reduce((acc, val) => acc + val.duration, 0)) {
      for (const block of lights) {
        ['top', 'right', 'bottom', 'left'].forEach((key) => {
          light[key] = block[key];
        })
        if (time == 0 || (time > blockTime && time <= blockTime + block.duration)) {
          break;
        }
        blockTime += block.duration;
      }
    }
    if (opts.angle) {
      light.angle = Math.atan2(light.bottom - light.top, light.left - light.right)
    }
    if (opts.intensity) {
      light.intensity = Math.sqrt(Math.pow(light.bottom - light.top, 2) + Math.pow(light.left - light.right, 2))
    }
    return light;
  }

  normalizeResults(res) {
    let timePromise;
    if (res.runTime) {
      timePromise = Promise.resolve(res);
    } else {
      timePromise = Utils.promiseAjax(`/api/v1/Experiments/${res.experimentId}`).then((exp) => {
        let time = exp.configuration.reduce((acc, val) => {
          return acc + val.duration
        }, 0);
        res.runTime = time;
        return res;
      });
    }
    return timePromise.then((result) => {
      result.tracks.forEach((track) => {
        track.samples.forEach((sample, ind) => {
          if (ind == 0) {
            sample.speed = 0;
            sample.speedX = 0;
            sample.speedY = 0;
            sample.angleXY = Math.random() * 2 * Math.PI;
          } else {
            sample.speed = Math.sqrt(Math.pow(sample.x - track.samples[ind - 1].x, 2) + Math.pow(sample.y - track.samples[ind - 1].y, 2)) / (sample.time - track.samples[ind - 1].time);
            sample.speedX = (sample.x - track.samples[ind - 1].x) / (sample.time - track.samples[ind - 1].time);
            sample.speedY = (sample.y - track.samples[ind - 1].y) / (sample.time - track.samples[ind - 1].time);
            sample.angleXY = Math.atan2((sample.y - track.samples[ind - 1].y) , (sample.x - track.samples[ind - 1].x));
          }
        })
      })
      result.fps = result.numFrames / result.runTime;
      return result;
    })
  }

  getLiveResults(expId) {
    const noteId = Utils.guid4();
    Globals.get('Relay').dispatchEvent('Notifications.Add', {
      id: noteId,
      expireLabel: null,
      message: "Loading live results"
    });
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
    }).then((normalized) => {
      Globals.get('Relay').dispatchEvent('Notifications.Remove', {
        noteId: noteId, type: 'experiment'
      })
      return normalized;
    });
  }

  getModelResults(expId, model, reload = false) {
    let noteId;
    if (!reload) {
      noteId = Utils.guid4();
      Globals.get('Relay').dispatchEvent('Notifications.Add', {
        id: noteId,
        expireLabel: null,
        message: "Loading model results"
      });
    }
    return Utils.promiseAjax(`/api/v1/Results`, {
      data: {
        filter: {
          where: {
            and: [
              { experimentId: expId },
              { euglenaModelId: model.id }
            ]
          }
        }
      },
      contentType: 'application/json'
    }).then((results) => {
      if (results.length) {
        return results[0];
      } else {
        return this.generateResults({
          experimentId: expId,
          euglenaModelId: model.id,
          count: model.configuration.count,
          magnification: Globals.get('currentExperimentResults.magnification')
        }).then(() => {
          return this.getModelResults(expId, model, true);
        })
      }
    }).then((result) => {
      return this.normalizeResults(result);
    }).then((normalized) => {
      if (noteId) {
        Globals.get('Relay').dispatchEvent('Notifications.Remove', {
          noteId: noteId, type: 'model'
        })
      }
      return normalized;
    });
  }

  generateResults(conf) {
    if (!conf.bpu_api_id) {
      conf.fps = Globals.get('AppConfig.model.simulationFps');
      //conf.initialization = this.initializeModelEuglena(conf.count, conf.magnification, conf.initialization);
      delete conf.count;
      delete conf.magnification;
    } else {
      delete conf.tracks
    }
    return Utils.promiseAjax('/api/v1/Results', {
      method: 'POST',
      data: JSON.stringify(conf),
      contentType: 'application/json'
    })
  }

  initializeModelEuglena(count, magnification, initialOrientation) {
    const initialize = [];
    if (initialOrientation==='1') {

      for (let i = 0; i < count; i++) {
        initialize.push({
          x: (Math.random() * 2 - 1) * 640 / (2 * magnification),
          y: (Math.random() * 2 - 1) * 480 / (2 * magnification),
          z: 0,
          yaw: Math.random() * Utils.TAU,
          roll: 0,
          pitch: Math.random() * Utils.TAU
        })
      }
    } else {
      for (let i = 0; i < count; i++) {
        initialize.push({
          x: (Math.random() * 2 - 1) * 640 / (2 * liveResult.magnification),
          y: (Math.random() * 2 - 1) * 480 / (2 * liveResult.magnification),
          z: 0,
          yaw: 0,
          roll: 0.1,
          pitch: Math.PI / 2
        })
      }
    }
    return initialize;
  }

  experimentMatch(a,b) {
    if (a.configuration.length != b.configuration.length) return false;
    for (let ind = 0; ind < a.configuration.length; ind++) {
      let lightConf = a.configuration[ind];
      for (let key in lightConf) {
        if ((lightConf[key]>0) !== (b.configuration[ind][key]>0)) return false;
      }
    }
    return true;
  }
}
export default new EuglenaUtils;
