'use strict';
var rp = require('request-promise'),
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  uuidV4 = require('uuid/v4'),
  ffprobe = require('ffprobe'),
  ffprobeStatic = require('ffprobe-static'),
  AWS = require('aws-sdk');

const EuglenaUtils = require('../euglenaModels/utils.js');

const euglenaModels = {
  oneEye: require('../euglenaModels/oneEye.js'),
  twoEye: require('../euglenaModels/twoEye.js'),
  blockly: require('../euglenaModels/blockly.js'),
  mech: require('../euglenaModels/mech.js')
}

const basicParameters = {
  randomSmoothWindow: 5.0, // number of frames over which to distribute the change
  randomnessFactor: 1.0
}

const downloadBiolabPath = `${process.env.BIOLAB_URL}/account/joinlabwithdata/downloadFile`;
const downloadS3Path = 'https://s3.us-east-2.amazonaws.com/euglena-dev/baseExperiments'

// const downloadBasePath = 'http://euglena.stanford.edu/account/joinlabwithdata/downloadFile';

const createBpuResults = (app, context) => {
  let downloadPath = context.args.data.downloadPath || downloadBiolabPath;
  if (process.env.S3_BUCKET) {
    downloadPath = context.args.data.downloadPath || downloadS3Path;
  }
  let reportFileURL = context.args.data.override_reportFile || `${downloadPath}/${context.args.data.bpu_api_id}/${context.args.data.bpu_api_id}.json`;
  let trackFileURL = context.args.data.override_trackFile || `${downloadPath}/${context.args.data.bpu_api_id}/tracks.json`;
  let videoURL = context.args.data.override_video || `${downloadPath}/${context.args.data.bpu_api_id}/movie.mp4`;

  return Promise.all([
      rp(reportFileURL),
      rp(trackFileURL),
      ffprobe(videoURL, { path: ffprobeStatic.path }),
      rp({
        uri: videoURL,
        resolveWithFullResponse: true,
        encoding: null
      })
    ])
    .then((downloads) => {
      let report = JSON.parse(downloads[0]),
        tracks = JSON.parse(downloads[1]),
        exif = downloads[2],
        videoFile = downloads[3];
      exif = exif.streams.filter((a) => a.codec_type == "video")[0];
      let fps = report.exp_metaData.numFrames / (report.exp_metaData.runTime / 1000);
      let magnification = report.exp_metaData.magnification;

      context.args.data.runTime = report.exp_metaData.runTime / 1000;
      context.args.data.numFrames = report.exp_metaData.numFrames;
      context.args.data.magnification = report.exp_metaData.magnification;
      context.args.data.video = videoURL;

      if (process.env.S3_BUCKET) {
        const s3 = new AWS.S3();
        let s3Bucket = process.env.S3_BUCKET;
        let storageDir = `results/${context.args.data.experimentId}/live`;
        let fileName = `${storageDir}/${context.args.data.bpu_api_id}.json`;

        if (context.args.data.baseExp>0) {
          s3Bucket = 'euglena-dev';
          storageDir = `baseExperiments/${context.args.data.bpu_api_id}`;
          fileName = `${storageDir}/${context.args.data.bpu_api_id}_tracks.json`;
        }

        context.args.data.trackFile = `https://s3.us-east-2.amazonaws.com/${s3Bucket}/${fileName}`;

        s3.getObject({
          Bucket: s3Bucket,
          Key: fileName
        }).promise().then((data) => {
          // The modified track file exists. We just have to assign its file path to the results trackFile.
          context.args.data.trackFile = fileName;
        }).catch((err) => {
          // The modified track file does not exist and has to be generated.
          let parsedTracks = [];
          let maxWidth = 0;
          for (let track of tracks) {
            let ptrack = {
              startTime: track.startFrame / fps,
              lastTime: track.lastFrame / fps,
              samples: []
            }
            let lastPos = null;
            let lastSample = null;
            track.samples.forEach((sample, ind) => {
              let psample = {
                time: sample.frame / fps,
                x: sample.rect[0],
                y: sample.rect[1],
                yaw: sample.rect[4]
              }
              maxWidth = Math.max(sample.rect[2] / magnification, sample.rect[3] / magnification, maxWidth);

              // place (0,0) at center, rather than top left of video
              psample.x = psample.x - exif.width / 2;
              psample.y = psample.y - exif.height / 2;

              // adjust position for magnification level
              psample.x = psample.x / magnification;
              psample.y = psample.y / magnification;

              // convert degrees to radians
              psample.yaw = psample.yaw * Math.PI / 180;

              //invert y axis, which also requires inverting yaw
              psample.y = -psample.y;
              psample.yaw = -psample.yaw;

              // ensure positive yaw
              while (psample.yaw < 0) {
                psample.yaw += 2 * Math.PI;
              }

              //validate yaw by velocity
              if (lastSample) {
                if ((psample.x - lastSample.x < 0 && Math.cos(psample.yaw) > 0) || (psample.x - lastSample.x > 0 && Math.cos(psample.yaw) < 0)) {
                  psample.yaw = (psample.yaw + Math.PI) % (2 * Math.PI);
                }
              }
              lastSample = psample;

              ptrack.samples.push(psample);
            })
            parsedTracks.push(ptrack);
          }

          let promises = [];
          // push the track file to S3
          promises.push(new Promise((resolve, reject) => {
            s3.putObject({
              Bucket: s3Bucket,
              Key: fileName,
              Body: JSON.stringify(parsedTracks),
              ACL: 'public-read'
            }, (err, data) => {
              if (err) {
                reject(err);
              } else {
                //console.log('Track file uploaded:', data);
                resolve(true);
              }
            })
          }));
          // push the video file to S3
          if (!context.args.data.baseExp) {
            context.args.data.video = `https://s3.us-east-2.amazonaws.com/${s3Bucket}/experiments/${context.args.data.bpu_api_id}/movie.mp4`
            promises.push(new Promise((resolve, reject) => {
              s3.putObject({
                Bucket: s3Bucket,
                Key: `experiments/${context.args.data.bpu_api_id}/movie.mp4`,
                Body: videoFile.body,
                ContentType: videoFile.headers['content-type'],
                ContentLength: videoFile.headers['content-length'],
                ACL: 'public-read'
              }, (err, data) => {
                if (err) {
                  err.message = 'experiment track file has to be generated'
                  reject(err);
                } else {
                  // console.log('Video file uploaded:', data);
                  resolve(true);
                }
              })
            }));
          }
          return Promise.all(promises);
        });

      } else { // IF NO S3 BUCKET IS USED
        let parsedTracks = [];
        let maxWidth = 0;
        for (let track of tracks) {
          let ptrack = {
            startTime: track.startFrame / fps,
            lastTime: track.lastFrame / fps,
            samples: []
          }
          let lastPos = null;
          let lastSample = null;
          track.samples.forEach((sample, ind) => {
            let psample = {
              time: sample.frame / fps,
              x: sample.rect[0],
              y: sample.rect[1],
              yaw: sample.rect[4]
            }
            maxWidth = Math.max(sample.rect[2] / magnification, sample.rect[3] / magnification, maxWidth);

            // place (0,0) at center, rather than top left of video
            psample.x = psample.x - exif.width / 2;
            psample.y = psample.y - exif.height / 2;

            // adjust position for magnification level
            psample.x = psample.x / magnification;
            psample.y = psample.y / magnification;

            // convert degrees to radians
            psample.yaw = psample.yaw * Math.PI / 180;

            //invert y axis, which also requires inverting yaw
            psample.y = -psample.y;
            psample.yaw = -psample.yaw;

            // ensure positive yaw
            while (psample.yaw < 0) {
              psample.yaw += 2 * Math.PI;
            }

            //validate yaw by velocity
            if (lastSample) {
              if ((psample.x - lastSample.x < 0 && Math.cos(psample.yaw) > 0) || (psample.x - lastSample.x > 0 && Math.cos(psample.yaw) < 0)) {
                psample.yaw = (psample.yaw + Math.PI) % (2 * Math.PI);
              }
            }
            lastSample = psample;

            ptrack.samples.push(psample);
          })
          parsedTracks.push(ptrack);
        }

        const storageDir = `results/${context.args.data.experimentId}/live`
        const fileName = `${storageDir}/${context.args.data.bpu_api_id}.json`

        context.args.data.trackFile = `/${fileName}`
        return new Promise((resolve, reject) => {
          mkdirp(`${process.cwd()}/client/${storageDir}`, (err) => {
            if (err) {
              reject(err)
            } else {
              fs.writeFile(`${process.cwd()}/client/${fileName}`, JSON.stringify(parsedTracks), (err) => {
                if (err) reject(err)
                else resolve(true);
              })
            }
          });
        });
      } // ELSE END OF S3 BUCKET IF ELSE

    }).catch((err) => {
      console.log(err);
    });
}

const createModelResults = (app, context) => {
  return new Promise((resolve, reject) => {
    app.models.EuglenaModel.findById(context.args.data.euglenaModelId, (err, eugModel) => {
      if (err) {
        reject(err);
      } else {
        resolve(eugModel);
      }
    })
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
    return new Promise((resolve, reject) => {
      app.models.Result.find({
        where: {
          experimentId: experiment.id,
          bpu_api_id: {
            neq: null
          }
        }
      }, (err, result) => {
        if (err) { reject(err); return; }
        resolve({
          experiment: experiment,
          liveResult: result[0]
        })
      })
    })
  }).then((meta) => {
    const experiment = meta.experiment;
    const liveResult = meta.liveResult;
    const duration = experiment.configuration.reduce((acc, conf) => {
      return acc + conf.duration
    }, 0);
    result.runTime = duration;
    result.numFrames = duration * result.fps;
    const tracks = [];
    for (let euglenaId = 0; euglenaId < model.configuration.count; euglenaId++) {
      if (model.configuration.initialization === '1') // 1 is random
        var initialization = {
          x: (Math.random() * 2 - 1) * 640 / (2 * liveResult.magnification),
          y: (Math.random() * 2 - 1) * 480 / (2 * liveResult.magnification),
          z: 0,
          yaw: Math.random() * 2 * Math.PI,
          roll: 0,
          pitch: Math.random() * 2 * Math.PI
        };
      else if (model.configuration.initialization === '2') { // right
        var initialization = {
          x: (Math.random() * 2 - 1) * 640 / (2 * liveResult.magnification),
          y: (Math.random() * 2 - 1) * 480 / (2 * liveResult.magnification),
          z: 0,
          yaw: 0,
          roll: 0.1,
          pitch: Math.PI / 2
        };
      } else if (model.configuration.initialization === '3') { //down
        var initialization = {
          x: (Math.random() * 2 - 1) * 640 / (2 * liveResult.magnification),
          y: (Math.random() * 2 - 1) * 480 / (2 * liveResult.magnification),
          z: 0,
          yaw: -Math.PI / 2,
          roll: Math.PI / 2 - 0.1,
          pitch: 0.05
        };
      } else if (model.configuration.initialization == '4') { //left
        var initialization = {
          x: (Math.random() * 2 - 1) * 640 / (2 * liveResult.magnification),
          y: (Math.random() * 2 - 1) * 480 / (2 * liveResult.magnification),
          z: 0,
          yaw: 0,
          roll: Math.PI - 0.1,
          pitch: 3 * Math.PI / 2
        };
      } else if (model.configuration.initialization == '5') { //up
        var initialization = {
          x: (Math.random() * 2 - 1) * 640 / (2 * liveResult.magnification),
          y: (Math.random() * 2 - 1) * 480 / (2 * liveResult.magnification),
          z: 0,
          yaw: -Math.PI / 2,
          roll: Math.PI / 2 + 0.1,
          pitch: Math.PI + 0.05
        };
      }
      if (result.initialization && result.initialization.length > euglenaId) {
        initialization = result.initialization[euglenaId]
      }
      let track = {
        startTime: 0,
        lastTime: duration,
        samples: [{
          time: 0,
          x: initialization.x,
          y: initialization.y,
          z: initialization.z,
          yaw: initialization.yaw,
          roll: initialization.roll,
          pitch: initialization.pitch,
        }]
      };
      euglenaModels[model.modelType].initialize({ track: track, model: model, result: result })
      tracks.push(track);
    }

    // Parameters for "memory" i.e. for values of light detected and of parameter changes

    // Parameters for smooth randomization
    var resetMin = basicParameters.randomSmoothWindow; //Math.floor(0.25 * result.fps);
    var resetMax = Math.ceil(1.5 * result.fps);
    var resetRandom = Array.from({length: model.configuration.count}, () => resetMin + Math.floor(Math.random() * resetMax));

    var resetAngleMin = 2;
    var resetAngleMax = 15;
    var randomnessFactor = model.modelType.match('blockly|mech') ? basicParameters.randomnessFactor : model.configuration.randomness;
    var resetRandomAngle = EuglenaUtils.setRandomAngleMatrix(model.configuration.count, basicParameters.randomSmoothWindow, resetAngleMax, resetAngleMin, randomnessFactor);

    for (let frame = 1; frame <= duration * result.fps; frame++) {
      for (let euglenaId = 0; euglenaId < model.configuration.count; euglenaId++) {
        // Calculate the a randomized delta_t for each Euglena after each update.
        // For every Euglena, every time resetRandom equals zero, update the randomization angle.
        var resetRandomNow = 0;
        if (!resetRandom[euglenaId]) {
          //create new duration of a random angle
          resetRandom[euglenaId] = resetMin + Math.floor(Math.random() * resetMax);

          // recalculate new random angle if all zero
          if (resetRandomAngle[euglenaId].every( a => a == 0)) {
            var newAngle = [-1,1][Math.random()*2|0]* (resetAngleMax * Math.random() - resetAngleMin) * randomnessFactor * Math.PI;
            resetRandomAngle[euglenaId] = resetRandomAngle[euglenaId].map( function(a) {
              return newAngle / basicParameters.randomSmoothWindow;
            });
          }
        } else { // decrease countdown by one
          resetRandom[euglenaId] -= 1;
        }

        //Get the next angle to be passed on
        var resetAngleInd = resetRandomAngle[euglenaId].findIndex((v) => { return v != 0})
        if (resetAngleInd != -1) {
          resetRandomNow = resetRandomAngle[euglenaId][resetAngleInd];
          resetRandomAngle[euglenaId][resetAngleInd] = 0;
        }

        // Get the lights
        let lights = EuglenaUtils.lightsFromTime(experiment, frame / result.fps);

        // Calculate the tracks.
        tracks[euglenaId].samples.push(euglenaModels[model.modelType].update({
          lights: lights,
          track: tracks[euglenaId],
          last: tracks[euglenaId].samples[frame - 1],
          model: model,
          result: result,
          frame: frame,
          resetRandom: resetRandomNow, // CURRENTLY NOT BEING USED
          wiggleRandom: 0.3
        }))
      }
    }

    // REMOVE BLOCKLY OBJECT BUT ADD THE VARIABLES
    if (model.modelType.match('blockly|mech')) {
      tracks.forEach((euglena,ind) => { euglena[model.modelType].euglenaBody.removeBody()});
    }

    const storageDir = `results/${result.experimentId}/simulation`;
    const fileName = `${storageDir}/${uuidV4()}.json`;
    result.magnification = liveResult.magnification;
    delete result.model;
    delete result.fps;

    if (process.env.S3_BUCKET) {
      const s3 = new AWS.S3()
      result.trackFile = `https://s3.us-east-2.amazonaws.com/${process.env.S3_BUCKET}/${fileName}`
      return new Promise((resolve, reject) => {
        s3.putObject({
          Bucket: process.env.S3_BUCKET,
          Key: fileName,
          Body: JSON.stringify(tracks),
          ACL: 'public-read'
        }, (err, data) => {
          if (err) {
            console.log(err); reject(err);
          } else {
            resolve(true);
          }
        })
      })
    } else {
      result.trackFile = `/${fileName}`
      return new Promise((resolve, reject) => {
        mkdirp(`${process.cwd()}/client/${storageDir}`, (err) => {
          if (err) {
            reject(err)
          } else {
            fs.writeFile(`${process.cwd()}/client/${fileName}`, JSON.stringify(tracks), (err) => {
              if (err) reject(err)
              else resolve(true);
            })
          }
        });
      });
    }
  })
}

const loadMeta = (context) => {
//  console.log("loading meta");
//  console.log(context.data);

  // console.log(context.data.bpu_api_id, context.data.runTime);
  let downloadBasePath = downloadBiolabPath;
  if(!context.data.euglenaModelId) {
    if (context.data.trackFile && context.data.trackFile.match(/^http/)) {
      let tmpPath = context.data.trackFile.match(context.data.bpu_api_id)
      downloadBasePath = context.data.trackFile.substring(0,tmpPath.index-1);
    }
  }
  const backFill = (context.data.bpu_api_id && !context.data.runTime
    ? rp(`${downloadBasePath}/${context.data.bpu_api_id}/${context.data.bpu_api_id}.json`)
      .then((data) => {
        const report = JSON.parse(data);
        context.data.runTime = report.exp_metaData.runTime / 1000;
        context.data.numFrames = report.exp_metaData.numFrames;
        return true;
      })
    : Promise.resolve(true));
  let trackLoad;
  if (!context.data.trackFile) {
    trackLoad = Promise.resolve(true);
  } else if (context.data.trackFile && context.data.trackFile.match(/^http/)) {
    if (context.data.trackFile.match(/^https:\/\/s3/)) {
      const s3 = new AWS.S3()
      let s3Path = context.data.trackFile.split('/');
      let bucket = s3Path[3];
      let filePath = s3Path.slice(4).join('/');
      trackLoad = new Promise((resolve, reject) => {
        s3.getObject({
          Bucket: bucket,
          Key: filePath
        }, (err, data) => {
          if (err) {
            reject(err);
          } else {
            context.data.tracks = JSON.parse(data.Body);
            resolve(true);
          }
        })
      })
    } else {
      trackLoad = rp(context.data.trackFile).then((fileData) => {
        context.data.tracks = JSON.parse(fileData);
        return true;
      });
    }
  } else {
    trackLoad = new Promise((resolve, reject) => {
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
  }
  return Promise.all([backFill, trackLoad]).then(() => {
    if (context.data.bpu_api_id && !context.data.video) {
      context.data.video = `${downloadBiolabPath}/${context.data.bpu_api_id}/movie.mp4`;
    }
    return context;
  }).catch((err) => {
    console.log(err);
  })
}

module.exports = (Result) => {
  Result.beforeRemote('create', (context, instances, next) => {

    if (context.args.data.demo) {
      return next();
    }
    if (context.args.data.bpu_api_id && !context.args.data.trackFile) {
      createBpuResults(Result.app, context).then(() => {
        next();
      }).catch((err) => {
        console.error(err);
        console.error(err.stack);
        next();
      })
    } else if (context.args.data.euglenaModelId) {
      createModelResults(Result.app, context).then(() => {
        next();
      }).catch((err) => {
        console.error(err);
        console.error(err.stack);
        next();
      })
    } else if (context.args.data.bpu_api_id && context.args.data.trackFile) {
      next();
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

  Result.observe('before save', (context, next) => {

    if (!context.instance.euglenaModelId && context.isNewInstance && !context.instance.trackFile) {
      context['args'] = {'data': context.instance}

      createBpuResults(Result.app, context).then(() => {
        next();
      }).catch((err) => {
        console.error(err);
        console.error(err.stack);
        next();
      })
    } else {
      next()
    }
  })

  Result.observe('loaded', (ctx, next) => {
    if (ctx.options && ctx.options.skipTrackData) {
      next();
    } else {
      loadMeta(ctx).then(() => {
        next();
      });
    }
  });
};
