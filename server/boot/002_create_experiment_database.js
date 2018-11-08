const fse = require('fs-extra'),
  mkdirp = require('mkdirp');

const baseExperimentConfigs = [{
        baseID: 1,
        result: {
            numFrames: 462,
            runTime: 60,
            magnification: 4,
            bpu_api_id: "5bd9e93fae449a687d45b825"
        },
        source: {
            trackFile: "",
            video: "https://s3.us-east-2.amazonaws.com/euglena-dev/baseExperiments/5bd9e93fae449a687d45b825/movie.mp4"
        },
        expForm: {
            "exp_category": "",
            "exp_procedure": "",
            "exp_holdconstant": "",
            "exp_firstlight": "",
            "exp_secondlight": "",
            "exp_lightduration": ""
        },
        configuration: [
            {
                "duration": 15,
                "left": 10,
                "top": 0,
                "right": 0,
                "bottom": 0
            },
            {
                "duration": 15,
                "left": 0,
                "top": 10,
                "right": 0,
                "bottom": 0
            },
            {
                "duration": 15,
                "left": 0,
                "top": 0,
                "right": 10,
                "bottom": 0
            },
            {
                "duration": 15,
                "left": 0,
                "top": 0,
                "right": 0,
                "bottom": 10
            }
        ]
    }];

module.exports = (app, cb) => {
  Promise.all(baseExperimentConfigs.map((exp) => {
    return new Promise((resolve, reject) => {
      exp.demo = false;
      exp.baseExp = true;
      exp.studentId = 0;
      app.models.Experiment.findOrCreate({
        where: {
          and: [
            { configuration: exp.configuration },
            { demo: true },
            { baseExp: true },
            { studentId: 0 }
          ]
        }
      }, exp, (err, inst, created) => {
        if (err) reject(err);
        if (created) {
          // create result record
          exp.result.demo = false;
          exp.result.experimentId = inst.id
          exp.result.downloadPath = "https://s3.us-east-2.amazonaws.com/euglena-dev/baseExperiments"
          exp.result.override_trackFile = `${exp.result.downloadPath}/${exp.result.bpu_api_id}/tracks.json`;
          exp.result.override_reportFile = `${exp.result.downloadPath}/${exp.result.bpu_api_id}/${exp.result.bpu_api_id}.json`;
          exp.result.override_video = `${exp.result.downloadPath}/${exp.result.bpu_api_id}/movie.mp4`;
          exp.result.trackFile = `${exp.result.downloadPath}/${exp.result.bpu_api_id}/tracks.json`;
          exp.result.video = `${exp.result.downloadPath}/${exp.result.bpu_api_id}/movie.mp4`;
          console.log(exp.result)

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
  });
}
