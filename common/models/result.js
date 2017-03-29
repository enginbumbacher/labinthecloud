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
      let fps = report.exp_metaData.numFrames / (report.exp_metaData.runTime / 1000);
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

      context.args.data.runTime = report.exp_metaData.runTime / 1000;
      context.args.data.numFrames = report.exp_metaData.numFrames;

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
    let trackFile = [process.cwd(), 'client', 'results', context.data.experimentId]
    if (context.data.bpu_api_id) {
      trackFile.push('live', context.data.bpu_api_id);
    } else {
      trackFile.push('model', context.data.model_id);
    }
    trackFile = trackFile.join('/') + '.json';
    fs.access(trackFile, (err) => {
      if (err) {
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
      createBpuResults(context).then(() => {
        next();
      });
    } else {
      createModelResults(context).then(() => {
        next();
      });
    }
  });

  Result.observe('loaded', (ctx, next) => {
    loadMeta(ctx).then(() => {
      next();
    });
  });
};
