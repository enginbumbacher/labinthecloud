'use strict';

module.exports = function(StudentGroup) {
  StudentGroup.observe('before delete', (ctx, next) => {
    // remove any lab relationships
    StudentGroup.find({ where: ctx.where }).then((toGo) => {
      Promise.all(toGo.map((group) => {
        return group.labs.find({}).then((labs) => {
          return Promise.all(labs.map((lab) => group.labs.remove(lab)));
        });
      })).then(() => {
        next();
      }, (err) => {
        next(err);
      })
    })
  })
};
