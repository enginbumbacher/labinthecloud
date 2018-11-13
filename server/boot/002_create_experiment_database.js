const fse = require('fs-extra'),
  mkdirp = require('mkdirp');

var baseExperimentConfigs = require('./auxFiles/baseExperimentConfigs')

function one_by_one(objects_array, iterator, app, callback) {
    var start_promise = objects_array.reduce(function (prom, object) {
        return prom.then(function () {
            return iterator(object,app);
        }).catch((err) => {
          console.log('error in one_by_one')
          console.log(object);
        });
    }, Promise.resolve()); // initial
    if(callback){
        start_promise.then(callback);
    } else{
        return start_promise;
    }
}

function processExpConfig(exp,app) {
  return new Promise((resolve, reject) => {
    exp.demo = false;
    exp.baseExp = exp.baseID;
    exp.studentId = 0;
    app.models.Experiment.findOrCreate({
      where: {
        and: [
          { configuration: exp.configuration },
          { baseExp: exp.baseID },
          { studentId: 0 }
        ]
      }
    }, exp, (err, inst, created) => {
      if (err) reject(err);
      if (created) {
        console.log(inst.id)
        // create result record
        exp.result.demo = false;
        exp.result.baseExp = exp.baseID;
        exp.result.experimentId = inst.id
        exp.result.downloadPath = "https://s3.us-east-2.amazonaws.com/euglena-dev"
        exp.result.override_trackFile = `${exp.result.downloadPath}/baseExperiments/${exp.result.bpu_api_id}/tracks.json`;
        exp.result.override_reportFile = `${exp.result.downloadPath}/baseExperiments/${exp.result.bpu_api_id}/${exp.result.bpu_api_id}.json`;
        exp.result.override_video = `${exp.result.downloadPath}/baseExperiments/${exp.result.bpu_api_id}/movie.mp4`;

        app.models.Result.create(exp.result, (err, res) => {
          if (err) reject(err);
          resolve(true);
        })
      } else {
        resolve(true);
      }
    })

  })
}

const promiseTimeout = function(ms, promise) {

  // Create a promise that rejects in <ms> milliseconds
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject('Timed out in '+ ms + 'ms.')
    }, ms)
  })

  return Promise.race([
    promise, timeout
  ])
}

module.exports = (app, cb) => {
  var sequence_approach = true;
  if (sequence_approach) {

    var i = 22;
    var tmpConfigs = baseExperimentConfigs.slice(308,Math.min(baseExperimentConfigs.length, 500))
    one_by_one(tmpConfigs, processExpConfig, app).then(() => {
      cb();
      console.log('we are here')
    });

  } else {

    var i = 18; // next one is 19
    var tmpConfigs = baseExperimentConfigs.slice(i*9,Math.min(baseExperimentConfigs.length,(i+1)*9))
    //tmpConfigs = [baseExperimentConfigs[59]]



    Promise.all(tmpConfigs.map((exp) => {
      return new Promise((resolve, reject) => {
        exp.demo = false;
        exp.baseExp = exp.baseID;
        exp.studentId = 0;
        app.models.Experiment.findOrCreate({
          where: {
            and: [
              { configuration: exp.configuration },
              { baseExp: exp.baseID },
              { studentId: 0 }
            ]
          }
        }, exp, (err, inst, created) => {
          if (err) reject(err);
          if (created) {
            console.log(inst.id)
            // create result record
            exp.result.demo = false;
            exp.result.baseExp = exp.baseID;
            exp.result.experimentId = inst.id
            exp.result.downloadPath = "https://s3.us-east-2.amazonaws.com/euglena-dev"
            exp.result.override_trackFile = `${exp.result.downloadPath}/baseExperiments/${exp.result.bpu_api_id}/tracks.json`;
            exp.result.override_reportFile = `${exp.result.downloadPath}/baseExperiments/${exp.result.bpu_api_id}/${exp.result.bpu_api_id}.json`;
            exp.result.override_video = `${exp.result.downloadPath}/baseExperiments/${exp.result.bpu_api_id}/movie.mp4`;

            app.models.Result.create(exp.result, (err, res) => {
              if (err) reject(err);
              resolve(true);
            })
          } else {
            resolve(true);
          }
        })

      })
    })).then(() => {
      cb();
      console.log('we are here')
    });
  }

}
