'use strict';
var rp = require('request-promise'),
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  uuidV4 = require('uuid/v4');

const EuglenaUtils = require('../euglenaModels/utils.js');

const euglenaModels = {
  oneEye: require('../euglenaModels/oneEye.js')
}

const createBpuResults = (app, context) => {
  return Promise.all([
      rp('http://biotic.stanford.edu/account/joinlabwithdata/downloadFile/' + context.args.data.bpu_api_id + '/' + context.args.data.bpu_api_id + '.json'),
      rp('http://biotic.stanford.edu/account/joinlabwithdata/downloadFile/' + context.args.data.bpu_api_id + '/tracks.json')
    ])
    .then((downloads) => {
      let report = JSON.parse(downloads[0]),
        tracks = JSON.parse(downloads[1]);
      let fps = report.exp_metaData.numFrames / (report.exp_metaData.runTime / 1000);
      let parsedTracks = [];
      for (let track of tracks) {
        let ptrack = {
          startTime: track.startFrame / fps,
          lastTime: track.lastFrame / fps,
          samples: []
        }
        let lastPos = null;
        let lastSample = null;
        for (let sample of track.samples) {
          let psample = {
            time: sample.frame / fps,
            x: sample.rect[0],
            y: sample.rect[1],
            angle: sample.rect[4]
          }
          if (psample.angle < 0) psample.angle += 360;
          lastSample = psample;
          ptrack.samples.push(psample);
        }
        parsedTracks.push(ptrack);
      }

      const storageDir = '/results/' + context.args.data.experimentId + '/live'
      const fileName = storageDir + '/' + context.args.data.bpu_api_id + '.json';

      context.args.data.trackFile = fileName;
      context.args.data.runTime = report.exp_metaData.runTime / 1000;
      context.args.data.numFrames = report.exp_metaData.numFrames;
      // context.args.data.tracks = parsedTracks;

      return new Promise((resolve, reject) => {
        mkdirp(`${process.cwd()}/client${storageDir}`, (err) => {
          if (err) {
            reject(err)
          } else {
            fs.writeFile(`${process.cwd()}/client${fileName}`, JSON.stringify(parsedTracks), (err) => {
              if (err) reject(err)
              else resolve(true);
            })
          }
        });
      });
    }).catch((err) => {
      console.log(err);
    });
}

const createModelResults = (app, context) => {
  return new Promise((resolve, reject) => {
    app.models.EuglenaModel.findById(context.args.data.modelId), (err, eugModel) => {
      if (err) {
        reject(err);
      } else {
        resolve(eugModel);        
      }
    }
  }).then((eugModel) => {
    return _createModelResults(app, context.args.data, eugModel);
  })
}

const createSimulatedResults = (app, context) => {
  let eugModel = context.args.data.model;
  return _createModelResults(app, context.args.data, eugModel);
}

const _createModelResults = (app, result, model) => {
  return new Promise((resolve, reject) => {
    app.models.Experiment.findById(result.experimentId, (err, experiment) => {
      if (err) { reject(err); return; }
      resolve(experiment);
    })
  }).then((experiment) => {
    const duration = experiment.configuration.reduce((acc, conf) => {
      return acc + conf.duration
    }, 0);
    result.runTime = duration;
    result.numFrames = duration * result.fps;
    const tracks = [];
    for (let euglenaId = 0; euglenaId < model.configuration.count; euglenaId++) {
      let track = {
        startTime: 0,
        lastTime: duration,
        samples: [{
          time: 0,
          x: 0,
          y: 0,
          angle: Math.random() * 2 * Math.PI,
          roll: Math.random() * 2 * Math.PI
        }]
      };
      euglenaModels[model.modelType].initialize({ track: track, model: model, result: result })
      tracks.push(track);
    }
    // console.log(tracks, model, result, duration * result.fps);
    for (let frame = 1; frame <= duration * result.fps; frame++) {
      let lights = EuglenaUtils.lightsFromTime(experiment, frame / result.fps);

      for (let euglenaId = 0; euglenaId < model.configuration.count; euglenaId++) {
        tracks[euglenaId].samples.push(euglenaModels[model.modelType].update({
          lights: lights,
          track: tracks[euglenaId],
          last: tracks[euglenaId].samples[frame - 1],
          model: model,
          result: result,
          frame: frame
        }))
      }
    }

    const storageDir = `/results/${result.experimentId}/simulation`;
    const fileName = `${storageDir}/${uuidV4()}.json`;
    result.trackFile = fileName;
    // result.tracks = tracks;
    delete result.model;
    delete result.fps;

    return new Promise((resolve, reject) => {
      mkdirp(`${process.cwd()}/client${storageDir}`, (err) => {
        if (err) {
          reject(err)
        } else {
          fs.writeFile(`${process.cwd()}/client${fileName}`, JSON.stringify(tracks), (err) => {
            if (err) reject(err)
            else resolve(true);
          })
        }
      });
    });
  })
}

const loadMeta = (context) => {
  const backFill = (context.data.bpu_api_id && !context.data.runTime
    ? rp('http://biotic.stanford.edu/account/joinlabwithdata/downloadFile/' + context.data.bpu_api_id + '/' + context.data.bpu_api_id + '.json')
      .then((data) => {
        const report = JSON.parse(data);
        context.data.runTime = report.exp_metaData.runTime / 1000;
        context.data.numFrames = report.exp_metaData.numFrames;
        return true;
      })
    : Promise.resolve(true));
  const trackLoad = new Promise((resolve, reject) => {
    let trackFile;
    if (context.data.trackFile) {
      trackFile = `${process.cwd()}/client${context.data.trackFile}`;
    } else {
      trackFile = [process.cwd(), 'client', 'results', context.data.experimentId, 'live', context.data.bpu_api_id]
      trackFile = trackFile.join('/') + '.json';
    }
    fs.access(trackFile, (err) => {
      if (err) {
        console.error(err);
        resolve(true);
      } else {
        const trackData = fs.readFileSync(trackFile);
        context.data.tracks = JSON.parse(trackData);
        resolve(true);
      }
    })
  })
  return Promise.all([backFill, trackLoad]).then(() => {
    if (context.data.bpu_api_id) {
      context.data.video = `http://biotic.stanford.edu/account/joinlabwithdata/downloadFile/${context.data.bpu_api_id}/movie.mp4`;
    }
    return context;
  }).catch((err) => {
    console.log(err);
  })
}

module.exports = (Result) => {
  Result.beforeRemote('create', (context, instances, next) => {
    if (context.args.data.bpu_api_id) {
      createBpuResults(Result.app, context).then(() => {
        next();
      }).catch((err) => {
        console.error(err);
        console.error(err.stack);
        next();
      })
    } else if (context.args.data.modelId) {
      createModelResults(Result.app, context).then(() => {
        next();
      }).catch((err) => {
        console.error(err);
        console.error(err.stack);
        next();
      })
    } else {
      createSimulatedResults(Result.app, context).then(() => {
        next();
      }).catch((err) => {
        console.error(err);
        console.error(err.stack);
        next();
      })
    }
  });

  Result.observe('loaded', (ctx, next) => {
    loadMeta(ctx).then(() => {
      next();
    });
  });
};
