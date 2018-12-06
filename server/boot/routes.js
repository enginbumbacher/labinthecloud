'use strict';

const AWS = require('aws-sdk'),
  fs = require('fs');

module.exports = (app) => {
  app.get('/', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    res.render('pages/public/index')
  });
  
  app.get('/api/v1/cron', (req, res) => {
    const clearFaultyExps = app.models.Experiment.find({
      where: {
        demo: false
      },
      include: {
        relation: "results"
      }
    }).then((exps) => {
      return Promise.all(exps.map((exp) => {
        let hasLiveResult = false;
        return exp.results({}).then((results) => {
          results.forEach((result) => {
            if (result.bpu_api_id != null) hasLiveResult = true;
          })
        }).then(() => {
          if (!hasLiveResult) {
            return exp.destroy()
          }
        })
      }))
    })

    const s3 = new AWS.S3();

    let d = new Date();
    d.setDate(d.getDate() - 30);
    app.models.EuglenaModel.find({
      where: {
        and: [
          { simulated: true },
          { date_created: { lt: d } }
        ]
      }
    }).then((simModels) => {
      let simIds = simModels.map((sim) => sim.id)
      app.models.Result.find({
        where: {
          euglenaModelId: {
            inq: simIds
          }
        }
      }).then((simResults) => {
        //remove track file
        const trackDeletions = [];
        simResults.forEach((simRes) => {
          let trackDel;
          if (!simRes.trackFile) {
            trackDel = Promise.resolve(true);
          } else if (simRes.trackFile.match(/^http/)) {
            //assume s3
            trackDel = new Promise((resolve, reject) => {
              s3.deleteObject({
                Bucket: process.env.S3_BUCKET,
                Key: simRes.trackFile.split('/').slice(4).join('/') // 4: https, , domain, bucket
              }, (err, data) => {
                if (err) {
                  app.models.Log.create({
                    type: "cron_error",
                    category: "s3_error",
                    data: {
                      action: "delete",
                      file: simRes.trackFile,
                      error: err
                    }
                  })
                }
                resolve(true);
              })
            })
          } else {
            trackDel = new Promise((resolve, reject) => {
              fs.unlink(`${process.cwd()}/client${simRes.trackFile}`, (err) => {
                if (err) {
                  app.models.Log.create({
                    type: "cron_error",
                    category: "fs_error",
                    data: {
                      action: "delete",
                      file: `${process.cwd()}/client${simRes.trackFile}`,
                      error: err
                    }
                  })
                }
                resolve(true);
              })
            })
          }
          trackDeletions.push(trackDel);
        })

        return Promise.all(trackDeletions.concat(simResults.map((simRes) => simRes.destroy())));
      })
      return Promise.all(simModels.map((sim) => sim.destroy()))
    })

    Promise.all([clearFaultyExps]).then(() => {
      res.send('{}')
    }, (err) => {
      console.log('error');
      console.log(err);
      ressend(JSON.stringify(
        {error: err}
      ))
    }
  )
  })
};
