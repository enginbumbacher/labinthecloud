'use strict';

module.exports = function(Lab) {
  Lab.beforeRemote('create', (context, instances, next) => {
    let req = context.req;
    context.args.data.labUserId = req.getCurrentContext().get('currentUser').id;
    next();
  });
  Lab.afterRemote('create', (context, instances, next) => {
    let req = context.req;
    req.session.messages.push({
      type: 'success',
      text: 'Lab saved!'
    });
    next();
  });

  Lab.clearTemporaryData = (uuid, cb) => {
    const Experiment = Lab.app.models.Experiment;
    const EuglenaModel = Lab.app.models.EuglenaModel;
    const Student = Lab.app.models.Student;
    //clear out any experiments or models created in the admin lab preview
    Student.findOne({
      where: {
        source_id: '_student'
      }
    }).then((editorStudent) => {
      let expClear = Experiment.find({
        where: {
          lab: uuid,
          studentId: editorStudent.id
        }
      }).then((exps) => {
        return Promise.all(exps.map((exp) => exp.destroy()));
      })

      let modelClear = EuglenaModel.find({
        where: {
          lab: uuid,
          studentId: editorStudent.id
        }
      }).then((mods) => {
        return Promise.all(mods.map((mod) => mod.destroy()))
      })

      Promise.all([expClear, modelClear]).then(() => {
        cb(null, true);
      }, () => {
        cb(null, false);
      })
    })
  }

  Lab.remoteMethod('clearTemporaryData', {
    accepts: {
      arg: 'uuid',
      type: 'string'
    },
    returns: {
      arg: 'success',
      type: 'boolean'
    }
  })
};
