const fse = require('fs-extra'),
  mkdirp = require('mkdirp');

const demoExperiments = [{
  configuration: [
    { "left": 100, "top": 0,   "bottom": 0,   "right": 0,   "duration": 15 },
    { "left": 0,   "top": 100, "bottom": 0,   "right": 0,   "duration": 15 },
    { "left": 0,   "top": 0,   "bottom": 100, "right": 0,   "duration": 15 },
    { "left": 0,   "top": 0,   "bottom": 0,   "right": 100, "duration": 15 }
  ],
  result: {
    numFrames: 465,
    runTime: 60,
    magnification: 4,
    bpu_api_id: '58f7bfeeadbbed76b6ed31dd'
  },
  source: {
    trackFile: "/demodata/0/tracks.json",
    video: "/demodata/0/movie.mp4"
  },
  configuration: [
    {"left":0,    "top":0,    "bottom":0,   "right":0,  "duration":2},
    {"left":100,  "top":100,  "bottom":100, "right":100,  "duration":16},
    {"left":0,    "top":0,    "bottom":0,   "right":0,  "duration":10},
    {"left":0,    "top":100,  "bottom":0,   "right":100,  "duration":16},
    {"left":100,  "top":0,    "bottom":100, "right":0,    "duration":16}
  ],
  result: {
    numFrames: 465,
    runTime: 60,
    magnification: 4,
    bpu_api_id: '58f7bfeeadbbed76b6ed31dd'
  },
  source: {
    trackFile: "/demodata/1/tracks.json",
    video: "/demodata/1/movie.mp4"
  }
}];

module.exports = (app) => {
  demoExperiments.forEach((exp) => {
    exp.demo = true;
    exp.studentId = 0;

    app.models.Experiment.findOrCreate({
      where: {
        and: [
          { configuration: exp.configuration },
          { demo: true },
          { studentId: 0 }
        ]
      }
    }, exp, (err, inst, created) => {
      if (err) throw err;

      if (created) {
        // create result record
        exp.result.demo = true;
        exp.result.experimentId = inst.id
        exp.result.trackFile = `/results/${inst.id}/live/${exp.result.bpu_api_id}.json`;
        exp.result.video = `/video/${inst.id}/movie.mp4`;

        // copy track file
        fse.copySync(`${process.cwd()}${exp.source.trackFile}`, `${process.cwd()}/client${exp.result.trackFile}`)

        // copy video file
        fse.copySync(`${process.cwd()}${exp.source.video}`, `${process.cwd()}/client${exp.result.video}`)

        app.models.Result.create(exp.result, (err, res) => {
          if (err) throw err;
        })
      }
    })
  })
}
