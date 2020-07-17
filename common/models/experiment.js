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

  Experiment.findDuplicate = (lightData, cb) => {
    Experiment.find({
      where: {
        copyOfId: 0
      },
      include: {
        relation: "results",
        scope: {
          fields: ['id', 'bpu_api_id', 'runTime'],
          where: {
            bpu_api_id: {
              neq: null
            }
          }
        }
      },
      order: 'date_created DESC'
    }, {
      skipTrackData: true
    }).then((exps) => {
      return Promise.all(exps.map((exp) => {
        return exp.results.count().then((count) => {
          if (count && JSON.stringify(exp.configuration) == JSON.stringify(lightData)) {
            return exp;
          }
          return null
        })
      }))
    }).then((withLive) => {
      let out = withLive.filter((a) => a != null).map((exp) => {
        return {
          configuration: exp.configuration,
          date_created: exp.date_created,
          id: exp.id,
        }
      })
      if (out.length) {
        out = [out[0]];
      }
      cb(null, out);
    })
  }

  Experiment.expsWithResults = (copyOfID, cb) => {
    Experiment.find({
      where: {
        copyOfID: 0
      },
      include: {
        relation: "results",
        scope: {
          fields: ['id', 'bpu_api_id', 'runTime'],
          where: {
            bpu_api_id: {
              neq: null
            }
          }
        }
      }
    }, {
      skipTrackData: true
    }).then((exps) => {
      return Promise.all(exps.map((exp) => {
        return exp.results.count().then((count) => {
          if (count) return exp;
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
            studentId: exp.studentId,
            copyOfID: exp.copyOfID
          }
        })
        cb(null, out);
      })
  }


  Experiment.studentHistory = (studentId, lab, cb) => {
    Experiment.find({
      where: {
        and: [
          { studentId: studentId },
          { demo: false },
          { lab: lab }
        ]
      },
      include: {
        relation: "results",
        scope: {
          fields: ['id', 'bpu_api_id', 'runTime'],
          where: {
            bpu_api_id: {
              neq: null
            }
          }
        }
      }
    }, {
      skipTrackData: true
    }).then((exps) => {
      return Promise.all(exps.map((exp) => {
        return exp.results.count().then((count) => {
          if (count) return exp;
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
    }, {
      arg: 'lab',
      type: 'string'
    }],
    returns: [{
      arg: 'experiments',
      root: true,
      type: 'array'
    }]
  })

  Experiment.remoteMethod('expsWithResults', {
    http: {
      path: '/expsWithResults',
      verb: 'get'
    },
    accepts: [{
      arg: 'copyOfID',
      type: 'number'
    }],
    returns: [{
      arg: 'experiments',
      root: true,
      type: 'array'
    }]
  })

  Experiment.remoteMethod('findDuplicate', {
    http: {
      path: '/findDuplicate',
      verb: 'get'
    },
    accepts: [{
      arg: 'lightData',
      type: 'array'
    }],
    returns: [{
      arg: 'experiments',
      root: true,
      type: 'array'
    }]
  })
};
