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
};
