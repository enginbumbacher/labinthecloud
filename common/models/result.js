'use strict';
var rp = require('request-promise'),
  fs = require('fs'),
  mkdirp = require('mkdirp');

const createBpuResults = (context) => {
  return Promise.all([
      rp('http://biotic.stanford.edu/account/joinlabwithdata/downloadFile/' + context.args.data.bpu_api_id + '/' + context.args.data.bpu_api_id + '.json'),
      rp('http://biotic.stanford.edu/account/joinlabwithdata/downloadFile/' + context.args.data.bpu_api_id + '/tracks.json')
    ])
    .then((downloads) => {
      let report = JSON.parse(downloads[0]),
        tracks = JSON.parse(downloads[1]);
      let fps = report.exp_metaData.numFrames / ((report.exp_runEndTime - report.exp_runStartTime) / 1000);
      let parsedTracks = [];
      for (let track of tracks) {
        let ptrack = {
          startTime: track.startFrame / fps,
          lastTime: track.lastFrame / fps,
          samples: []
        }
        let lastPos = null;
        for (let sample of track.samples) {
          let psample = {
            time: sample.frame / fps,
            x: sample.rect[0],
            y: sample.rect[1],
            angle: sample.rect[4]
          }
          if (psample.angle < 0) psample.angle += 360;
          ptrack.samples.push(psample);
        }
        parsedTracks.push(ptrack);
      }

      const storageDir = process.cwd() + '/client/results/' + context.args.data.experimentId + '/live'
      const fileName = storageDir + '/' + context.args.data.bpu_api_id + '.json';

      return new Promise((resolve, reject) => {
        mkdirp(storageDir, (err) => {
          if (err) {
            reject(err)
          } else {
            fs.writeFile(fileName, JSON.stringify(parsedTracks), (err) => {
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

const createModelResults = (context) => {
  // TODO: load model spec, generate results based on model type
  Promise.resolve(true);
}

const _createOneEyeResults = (context) => {
  // TODO: generate one-eye model results
  Promise.resolve(true);
}

module.exports = (Result) => {
  Result.beforeRemote('create', (context, instances, next) => {
    if (context.args.data.bpu_api_id) {
      createBpuResults(context).then(() => {
        next();
      });
    } else {
      createModelResults(context).then(() => {
        next();
      });
    }
  });

  Result.observe('loaded', (ctx, cb) => {
    let trackFile = [process.cwd(), 'client', 'results', ctx.data.experimentId]
    if (ctx.data.bpu_api_id) {
      trackFile.push('live', ctx.data.bpu_api_id);
      ctx.data.video = 'http://biotic.stanford.edu/account/joinlabwithdata/downloadFile/' + ctx.data.bpu_api_id + '/movie.mp4';
    } else {
      trackFile.push('model', ctx.data.model_id);
    }
    trackFile = trackFile.join('/') + '.json';
    fs.access(trackFile, (err) => {
      if (err) {
        cb();
      } else {
        const trackData = fs.readFileSync(trackFile);
        ctx.data.tracks = JSON.parse(trackData);
        cb();
      }
    })
  });
};
