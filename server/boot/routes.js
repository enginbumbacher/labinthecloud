'use strict';

module.exports = (app) => {
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

    let d = new Date();
    d.setDate(d.getDate() - 30);
    const clearSimulations = app.models.Result.find({
      where: {
        and: [
          { bpu_api_id: null },
          { euglenaModelId: null },
          { date_created: { lt: d } }
        ]
      }
    }).then((sims) => {
      return Promise.all(sims.map((sim) => sim.destroy()));
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
