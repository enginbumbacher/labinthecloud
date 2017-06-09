'use strict';

module.exports = function(Experiment) {
  Experiment.observe('before save', function(ctx, cb) {
    ctx.instance.configuration.forEach(function(cfg) {
      ['top', 'bottom', 'left', 'right', 'duration'].forEach(function(key) {
        cfg[key] = parseFloat(cfg[key]);
      });
    })
    cb();
  })
  Experiment.observe('loaded', function(ctx, cb) {
    let numericCfg;
    let baseType = 'string';
    if (typeof ctx.data.configuration == "string") {
      numericCfg = JSON.parse(ctx.data.configuration);
    } else {
      baseType = 'object';
      numericCfg = ctx.data.configuration;
    }
    numericCfg.forEach(function(cfg) {
      ['top', 'bottom', 'left', 'right', 'duration'].forEach(function(key) {
        cfg[key] = parseFloat(cfg[key]);
      });
    });
    if (baseType == 'string') {
      ctx.data.configuration = JSON.stringify(numericCfg);
    } else {
      ctx.data.configuration = numericCfg;
    }
    cb();
  });

  Experiment.studentHistory = (studentId, cb) => {
    Experiment.find({
      where: {
        and: [
          { studentId: studentId },
          { demo: false }
        ]
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
          if (hasLiveResult) return exp;
          return null
        })
      }))
    }).then((withLive) => {
      let out = withLive.filter((a) => a != null).map((exp) => {
        return {
          configuration: exp.configuration,
          date_created: exp.date_created,
          demo: exp.demo,
          id: exp.id,
          studentId: exp.studentId
        }
      })
      cb(null, out);
    })
  }

  Experiment.remoteMethod('studentHistory', {
    http: {
      path: '/studentHistory',
      verb: 'get'
    },
    accepts: [{
      arg: 'studentId',
      type: 'number'
    }],
    returns: [{
      arg: 'experiments',
      root: true,
      type: 'array'
    }]
  })
};
